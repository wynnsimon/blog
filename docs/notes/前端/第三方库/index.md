# rrweb
record and replay the web，利用现代浏览器所提供的强大 API 录制并回放任意 web 界面中的用户操作。

rrweb 主要由 3 部分组成：

1. rrweb-snapshot：包含 snapshot 和 rebuild 两个功能。snapshot 用于将 DOM 及其状态转化为可序列化的数据结构并添加唯一标识；rebuild 是将 snapshot 记录的数据结构重建为对应的 DOM。
2. rrweb：包含 record 和 replay 两个功能。record 用于记录 DOM 中的所有变更（mutation）；replay 则是将记录的变更按照对应的时间一一重放。
3. rrweb-player：为 rrweb 提供一套 UI 控件，提供基于 GUI 的暂停、快进、拖拽至任意时间点播放等功能。

## 序列化
普通的录制和回放可以通过深拷贝dom实现，但dom对象并不是可序列化的，如果需要保存还要对其进行序列化。
序列化时特殊的处理：
1. 去脚本化：被录制页面中的所有 JavaScript 都不应该被执行，例如会在重建快照时将 `script` 标签改为 `noscript` 标签，此时 script 内部的内容就不再重要，录制时可以简单记录一个标记值而不需要将可能存在的大量脚本内容全部记录。
2. 记录没有反映在 HTML 中的视图状态：例如 `<input type="text" />` 输入后的值不会反映在其 HTML 中，而是通过 `value` 属性记录，在序列化时就需要读出该值并且以属性的形式回放成 `<input type="text" value="recordValue" />`。
3. 相对路径转换为绝对路径：回放时会将被录制的页面放置在一个 `<iframe>` 中，此时的页面 URL 为重放页面的地址，如果被录制页面中有一些相对路径就会产生错误，所以在录制时就要将相对路径进行转换，同样的 CSS 样式表中的相对路径也需要转换。
4. 尽量记录 CSS 样式表的内容：如果被录制页面加载了一些同源的样式表，则可以获取到解析好的 CSS rules，录制时将能获取到的样式都 inline 化，这样可以让一些内网环境（如 localhost）的录制也有比较好的效果。

同时，序列化还包含**全量**和**增量**两种类型，全量序列化可以将一个 DOM 树转化为对应的树状数据结构。
以下的dom
```html
<html>
  <body>
    <header></header>
  </body>
</html>
```
会被转化为以下的对象
```json
{
  "type": "Document",
  "childNodes": [
    {
      "type": "Element",
      "tagName": "html",
      "attributes": {},
      "childNodes": [
        {
          "type": "Element",
          "tagName": "head",
          "attributes": {},
          "childNodes": [],
          "id": 3
        },
        {
          "type": "Element",
          "tagName": "body",
          "attributes": {},
          "childNodes": [
            {
              "type": "Text",
              "textContent": "\n    ",
              "id": 5
            },
            {
              "type": "Element",
              "tagName": "header",
              "attributes": {},
              "childNodes": [
                {
                  "type": "Text",
                  "textContent": "\n    ",
                  "id": 7
                }
              ],
              "id": 6
            }
          ],
          "id": 4
        }
      ],
      "id": 2
    }
  ],
  "id": 1
}
```
为每个node都添加id是为增量快照做准备。
这样记录到的操作就是以下格式
```ts
type clickSnapshot = {
  source: 'MouseInteraction';
  type: 'Click';
  id: Number;
};
```
再通过 `snapshot.node.click()` 就能将操作播放出来。

## 增量快照
在完成一次全量快照之后，就可以基于当前视图状态观察所有可能对视图造成改动的事件

由于rrweb的记录是不包含脚本的，倘若页面的操作中有通过js控制dom变化的操作，会导致这个操作将不会被播放出来的问题。对此rrweb通过MutationObserver来解决
 MutationObserver 的触发方式为**批量异步**回调，会在一系列 DOM 变化发生之后将这些变化一次性回调，传出的是一个 mutation 记录数组。
 这一机制在常规使用时不会有问题，因为从 mutation 记录中可以获取到变更节点的 JS 对象，可以做很多等值比较以及访问父子、兄弟节点等操作来保证可以精准回放一条 mutation 记录。但是在 rrweb 中由于有序列化的过程，就需要更多精细的判断来应对各种场景。

### 新增节点
例如以下两种操作会生成相同的 DOM 结构，但是产生不同的 mutation 记录：
```
body
	n1
	  n2
```
1. 创建节点 n1 并 append 在 body 中，再创建节点 n2 并 append 在 n1 中。
2. 创建节点 n1、n2，将 n2 append 在 n1 中，再将 n1 append 在 body 中。
第 1 种情况将产生两条 mutation 记录，分别为增加节点 n1 和增加节点 n2；第 2 种情况则只会产生一条 mutation 记录，即增加节点 n1。（在第一种情况下虽然 n1 append 时还没有子节点，但由于批量异步回调机制，当处理 mutation 记录时获取到的 n1 是已经有子节点 n2 的状态。）
受第二种情况的限制，在处理新增节点时必须遍历其所有子孙节点，才能保证所有新增节点都被记录，但是这一策略应用在第一种情况中就会导致 n2 被作为新增节点记录两次，回放时就会产生与原页面不一致的 DOM 结构。
因此，在处理一次回调中的多个 mutation 记录时需要“惰性”处理新增节点，即在遍历每条 mutation 记录遇到新增节点时先收集，再在全部 mutation 遍历完毕之后对收集的新增节点进行去重操作，保证不遗漏节点的同时每个节点只被记录一次。

在==序列化==中已经介绍了需要维护一个 `id -> Node` 的映射，因此当出现新增节点时，需要将新节点序列化并加入映射中。但由于为了去重新增节点，选择在所有 mutation 记录遍历完毕之后才进行序列化，在以下示例中就会出现问题
1. mutation 记录 1，新增节点 n1。暂不处理，等待最终去重后序列化。
2. mutation 记录 2，n1 新增属性 a1。试图将它记录成一次增量快照，但会发现无法从映射中找到 n1 对应的 id，因为此时它还未被序列化。
由于对新增节点进行了延迟序列化的处理，所有 mutation 记录也都需要先收集，再新增节点去重并序列化之后再做处理。

### 移除节点
在处理移除节点时，需要做以下处理：
1. 移除的节点还未被序列化，则说明是在本次 callback 中新增的节点，无需记录，并且从新增节点池中将其移除。
2. 上步中在一次 callback 中被新增又移除的节点将其称为 dropped node，用于最终处理新增节点时判断节点的父节点是否已经 drop。

### 属性变化覆盖写
尽管 MutationObserver 是异步批量回调，但是仍然可以认为在一次回调中发生的 mutations 之间时间间隔极短，因此在记录 DOM 属性变化时可以通过覆写的方式优化增量快照的体积。

例如：对一个 `<textarea>` 进行 resize 操作，会触发大量的 width 和 height 属性变化的 mutation 记录。虽然完整记录会让回放更加真实，但是也可能导致增量快照数量大大增加。进行取舍之后，在同一次 mutation callback 中只记录同一个节点某一属性的最终值即可，也就是后续的 mutation 记录会覆盖写之前已有的 mutation 记录中的属性变化部分。

### 鼠标移动
通过记录鼠标移动位置，可以在回放时模拟鼠标移动轨迹。

尽量保证回放时鼠标移动流畅的同时也要尽量减少对应增量快照的数量，所以我们需要在监听 mousemove 的同时进行两层节流处理。第一层是每 20 ms 最多记录一次鼠标坐标，第二层是每 500 ms 最多发送一次鼠标坐标集合，第二层的主要目的是避免一次请求内容过多而做的分段。

#### 时间逆推
我们在每个增量快照生成时会记录一个时间戳，用于在回放时按正确的时间差回放。但是由于节流处理的影响，鼠标移动对应增量快照的时间戳会比实际记录时间要更晚，因此需要记录一个用于校正的负时间差，在回放时将时间校准。

## 输入

我们需要观察 `<input>`, `<textarea>`, `<select>` 三种元素的输入，包含人为交互和程序设置两种途径的输入。

#### 人为交互
对于人为交互的操作主要靠监听 input 和 change 两个事件观察，需要注意的是对不同事件但值相同的情况进行去重。此外 `<input type="radio" />` 也是一类特殊的控件，如果多个 radio 元素的组件 name 属性相同，那么当一个被选择时其他都会被反选，但是不会触发任何事件，因此需要单独处理。

#### 程序设置

通过代码直接设置这些元素的属性也不会触发事件，可以通过劫持对应属性的 setter 来达到监听的目的，示例代码如下：
```ts
function hookSetter<T>(
  target: T,
  key: string | number | symbol,
  d: PropertyDescriptor,
): hookResetter {
  const original = Object.getOwnPropertyDescriptor(target, key);
  Object.defineProperty(target, key, {
    set(value) {
      // put hooked setter into event loop to avoid of set latency
      setTimeout(() => {
        d.set!.call(this, value);
      }, 0);
      if (original && original.set) {
        original.set.call(this, value);
      }
    },
  });
  return () => hookSetter(target, key, original || {});
}
```
为了避免在 setter 中的逻辑阻塞被录制页面的正常交互，应该把逻辑放入 event loop 中异步执行。

## 回放
rrweb 的设计原则是尽量少的在录制端进行处理，最大程度减少对被录制页面的影响，因此在回放端需要做一些特殊的处理。

### 高精度计时器

在回放时会一次性拿到完整的快照链，如果将所有快照依次同步执行我们可以直接获取被录制页面最后的状态，但是需要的是同步初始化第一个全量快照，再异步地按照正确的时间间隔依次重放每一个增量快照，这就需要一个**高精度**的计时器。通过 `requestAnimationFrame` 来实现一个不断校准的计时器，因为原生的 `setTimeout` 并不能保证在设置的延迟时间之后准确执行，例如主线程阻塞时就会被推迟。
对于回放功能而言，这种不确定的推迟是不可接受的，可能会导致各种怪异现象的发生，因此一个不断校准的定时器，确保绝大部分情况下增量快照的重放延迟不超过一帧。

同时自定义的计时器也是实现“快进”功能的基础。

### 补全缺失节点
rrweb 使用 MutationObserver 时的延迟序列化策略，这一策略可能导致以下场景中不能记录完整的增量快照：
```
parent
	child2
	child1
```

1. parent 节点插入子节点 child1
2. parent 节点在 child1 之前插入子节点 child2

按照实际执行顺序 child1 会被 rrweb 先序列化，但是在序列化新增节点时除了记录父节点之外还需要记录相邻节点，从而保证回放时可以把新增节点放置在正确的位置。但是此时 child 1 相邻节点 child2 已经存在但是还未被序列化，会将其记录为 `id: -1`（不存在相邻节点时 id 为 null）。
重放时当处理到新增 child1 的增量快照时，可以通过其相邻节点 id 为 -1 这一特征知道帮助它定位的节点还未生成，然后将它临时放入”缺失节点池“中暂不插入 DOM 树中。
之后在处理到新增 child2 的增量快照时，正常处理并插入 child2，完成重放之后检查 child2 的相邻节点 id 是否指向缺失节点池中的某个待添加节点，如果吻合则将其从池中取出插入对应位置。

### 模拟 Hover
在许多前端页面中都会存在 `:hover` 选择器对应的 CSS 样式，但是我们并不能通过 JavaScript 触发 hover 事件。因此回放时需要模拟 hover 事件让样式正确显示。

具体方式包括两部分：
1. 遍历 CSS 样式表，对于 `:hover` 选择器相关 CSS 规则增加一条完全一致的规则，但是选择器为一个特殊的 class，例如 `.:hover`。
2. 当回放 mouse up 鼠标交互事件时，为事件目标及其所有祖先节点都添加 `.:hover` 类名，mouse down 时再对应移除。

### 从任意时间点开始播放

除了基础的回放功能之外， `rrweb-player` 这样的播放器可以提供和视频播放器类似的功能，如拖拽到进度条至任意时间点播放。
实际实现时通过给定的起始时间点将快照链分为两部分，分别是时间点之前和之后的部分。然后同步执行之前的快照链，再正常异步执行之后的快照链就可以做到从任意时间点开始播放的效果。

## 沙盒
去脚本化的处理在重建快照的过程中将所有 `script` 标签改写为 `noscript` 标签解决了部分问题。但仍有一些脚本化的行为是不包含在 `script` 标签中的，例如 HTML 中的 inline script、表单提交等。

脚本化的行为多种多样，如果仅过滤已知场景难免有所疏漏，而一旦有脚本被执行就可能造成不可逆的非预期结果。因此通过 HTML 提供的 iframe 沙盒功能进行浏览器层面的限制。

### iframe sandbox
在重建快照时将被录制的 DOM 重建在一个 `iframe` 元素中，通过设置它的 `sandbox` 属性，我们可以禁止以下行为：
- 表单提交
- `window.open` 等弹出窗
- JS 脚本（包含 inline event handler 和 `<URL>` ）
这与预期是相符的，尤其是对 JS 脚本的处理相比自行实现会更加安全、可靠。

### 避免链接跳转

当点击 a 元素链接时默认事件为跳转至它的 href 属性对应的 URL。在重放时会通过重建跳转后页面 DOM 的方式保证视觉上的正确重放，而原本的跳转则应该被禁止执行。
通常我们会通过事件代理捕获所有的 a 元素点击事件，再通过 `event.preventDefault()` 禁用默认事件。但当我们将回放页面放在沙盒内时，所有的 event handler 都将不被执行，我们也就无法实现事件代理。
重新查看回放交互事件增量快照的实现，会发现其实 `click` 事件是可以不被重放的。因为在禁用 JS 的情况下点击行为并不会产生视觉上的影响，也无需被感知。
不过为了优化回放的效果，可以在点击时给模拟的鼠标元素添加特殊的动画效果，用来提示观看者此处发生了一次点击。

## iframe 样式设置

由于将 DOM 重建在 iframe 中，所以无法通过父页面的 CSS 样式表影响 iframe 中的元素。但是在不允许 JS 脚本执行的情况下 `noscript` 标签会被显示，而我们希望将其隐藏，就需要动态的向 iframe 中添加样式，示例代码如下：
```ts
const injectStyleRules: string[] = [
  'iframe { background: #f1f3f5 }',
  'noscript { display: none !important; }',
];

const styleEl = document.createElement('style');
const { documentElement, head } = this.iframe.contentDocument!;
documentElement!.insertBefore(styleEl, head);
for (let idx = 0; idx < injectStyleRules.length; idx++) {
  (styleEl.sheet! as CSSStyleSheet).insertRule(injectStyleRules[idx], idx);
}
```
这个插入的 style 元素在被录制页面中并不存在，所以我们不能将其序列化，否则 `id -> Node` 的映射将出现错误。















