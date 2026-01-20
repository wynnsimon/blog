---
title: 9 vue
tags:
  - 原理
  - 前端
  - vue
createTime: 2025/06/18 21:15:10
permalink: /article/essay/9/
---
# 双大括号取值

mustache：vue中的双大括号取值参考了mustache

对于简单的双大括号内的内容替换可以使用正则的方式替换
但对于数组布尔等复杂的内容值操作就难以处理了
mustache借助了tokens做过渡用以下的流程来实现

### token
tokens是一个js的嵌套数组说白了，就是模板字符串的JS表示
它是抽象语法树（AST）、虚拟节点等等的开山鼻祖


模板字符串
```html
<h1>我买了一个{{thing}},好{{mood}}啊</h1>
```

转换成的tokens
tokens数组中的每个数组都是一个token
```json
[
	["text" , "<h1>我买了一个"],
	["name" , "thing"],
	["text" , "好"],
	["name" , "mood"],
	["text" , "啊</h1>"]，
]
```

**当模板字符串中有循环存在时，它将被编译为嵌套更深的tokens**
```html
<div>
	<ul>
		{#arr}}
			<li>{{.}}</li>
		{{/arr}}
	</ul>
</div>
```

```json
["text","<div><ul>"],
	["#", "arr", [
		["text","<li>"],
		["name", "."],
		["text", "</li>"]
	]],
["text","</ul></div>"]
```
如果循环时双重循环，那么tokens会更深一层

# 虚拟DOM和diff算法
虚拟 DOM 在 React 和大多数其他实现中都是纯运行时的：更新算法无法预知新的虚拟 DOM 树会是怎样，因此它总是需要遍历整棵树、比较每个 vnode 上 props 的区别来确保正确性。另外，即使一棵树的某个部分从未改变，还是会在每次重渲染时创建新的 vnode，带来了大量不必要的内存压力。
这也是虚拟 DOM 最受诟病的地方之一：通过牺牲效率来换取声明式的写法和最终的正确性。
在 Vue 中，框架同时控制着编译器和运行时。这使得我们可以为紧密耦合的模板渲染器应用许多编译时优化。编译器可以静态分析模板并在生成的代码中留下标记，使得运行时尽可能地走捷径。与此同时，仍旧保留了边界情况时用户想要使用底层渲染函数的能力。这种混合解决方案被称为**带编译时信息的虚拟 DOM**。

**虚拟dom相比于直接操作dom的优势：**
在插入（或更新）dom时可以先把要插入的dom合并成一个虚拟dom后再更新，这样只需要更新依次，如果直接插入dom，每次插入dom都需要更新。

**编译时和运行时**
为了更好的支持虚拟dom，vue还区分了编译时和运行时
- 我们需要有一个虚拟DOM，调用渲染方法将虚拟DOM渲染成真实DOM（缺点就是虚拟DOM编写麻烦）
- 专门写个编译时可以将模板编译成虚拟DOM（在构建的时候进行编译性能更高，不需要再运行的时候进行编译，而且vue3在编译中做了很多优化）

- diff：最小更新算法
- 虚拟DOM：用JavaScript对象描述DOM的层次结构。DOM中的一切属性都在虚拟DOM中有对应的属性
新虚拟DOM和老虚拟DOM进行diff（精细化比较），算出应该如何最小量更新，最后反映到真正的DOM上。

snabbdom是著名的虚拟DOM库，是diff算法的鼻祖，Vue源码借鉴了snabbdom;

**html解析为虚拟dom对象**
html
```html
<div class="box">
	<h3>我是一个标题</h3>
	<ul>
		<li>牛奶</li>
		<li>咖啡</li>
		<li>可乐</li>
	</ul>
</div>
```
转换成的虚拟dom
```json
{
	"seL":"div"
	"data":{
		"class":{ "box": true }
	},
	"children":[
		{
			"seL":"h3",
			"text"：“我是一个标题"
		},{
			"sel":"ul"
			"data": {},
			"children":[
				{"sel": "li","text":"牛奶"},
				{"seL": "li","text":"咖啡"},
				{"sel"："li","text":"可乐"}
			]
		}
	]	
}
```

### h函数
h函数用于产生虚拟节点，命名无其他含义只是snabbdom作者命名
```js
//真正的dom节点
<a href="http://www.atguigu.com">尚硅谷</a>

//调用h函数
h('a',{ props:{ href:'http://www.atguigu.com' }},'尚硅谷');

//h函数返回的虚拟节点
{
	"sel":"a",
	"data":{
		props:{ href:'http://www.atguigu.com' }
	},
	"text":"尚硅谷",
	"children":undefined,
	"elm":undefined,
	"key":undefined
}
```
虚拟节点中的属性
- sel：选择器
- data：标签的属性，样式等
- text：标签中的内容
- children：标签中的子标签
- elm：该虚拟dom对应的真实dom节点，如果是undefined表示还没有上树
- key：该节点的唯一标识

## diff算法
snabbdom中的patch函数添加dom元素就使用了diff算法
当页面原有dom存在时，使用patch添加新的dom元素会检测，如果部分数据按一样：如开头的顺序，sel，text等就会认为它们是一样的就不会更新，只更新内容不一样的
如果开头的顺序也不一样那么就会全部更新（也就是vue中的v-for的特性）
为虚拟dom添加key属性（也就是vue中的:key操作）就会给diff算法提供了唯一标识，告诉diff算法，在更改前后它们是同一个DOM节点。这样可以不按顺序也能触发diff

- 只有是同一个虚拟节点，才进行精细化比较否则就是暴力删除旧的、插入新的。
	同一个虚拟节点的判定：选择器相同且key相同。
- 只进行同层比较，不会进行跨层比较。即使是同一片虚拟节点，但是跨层了，diff也是暴力删除旧的、然后插入新的

**过程：**
vue对于跨层级的节点不做diff处理，直接使用新的vdom。只做同层比较
以下过程为同层比较过程

1. 预处理前置节点
将新旧vdom从前往后比较，节点相同则直接复用旧dom，否则的话跳出循环，使用一个变量记录下当前前置索引值（i），进入第二步

2. 预处理后置节点
使用两个变量分别存储新旧vdom的后置索引值（e1，e2）。将vdom从后往前比较，节点相同则直接复用旧dom

3. 处理仅有新增节点情况
![](attachments/Pasted%20image%2020250917203506.png)
当`i>e1`且`i<=e2`时为仅有新增节点的情况，此时将新多出来的节点挂载到dom上即可

4. 处理仅有卸载节点
![](attachments/Pasted%20image%2020250917203920.png)
当`i>e2`且`i<e1`时为仅有卸载节点的情况，此时将旧列表上多余的节点卸载即可

5. 处理其他情况（新增、卸载、移动）
![](attachments/Pasted%20image%2020250917204237.png)
先定义s1，s2变量分别用于记录新旧节点要处理部分的起始位置。
再构造一个新节点位置映射表用于映射出新节点与位置的索引关系。
再定义两个变量分别记录当前最远位置和移动标识，当前最远位置记录新节点中当前最远位置，用于判断新旧节点在遍历的过程中是否同时呈现递增趋势，如果不是则证明节点发生了移动，此时需要将移动标识置为true，后续执行移动处理。
最后构建一个新旧节点位置映射表，长度为新节点要处理的个数（后置索引减前置索引），用于记录新旧节点的位置映射关系，初始值都为0，，如果处理过后都还保持0，则判定新节点是新增的，后续需要挂载

从旧节点的要处理的起始位置（s1）开始，遍历旧节点列表，判断当前旧节点是否存在于新节点位置映射表，如果没有则判定该节点是需要卸载的节点，直接执行卸载操作。如果当前旧节点存在于新节点位置映射表中，就将s1+1的值存放在新旧节点位置映射表中，同时对比新节点位置索引值（该节点在新节点位置映射表中对应的索引值）和当前最远位置，如果大于当前最远位置就将当前最远位置更新为该值。接着patch更新。如果移动标识一直为false（仍然呈递增趋势）则循环该操作。
![](attachments/Pasted%20image%2020250917205750.png)
当旧节点在新节点位置映射表中的值小于最远位置时，将s1+1赋值给它在新旧节点位置映射表中对应的位置上，此时对比它新节点位置映射表中的值和当前最远位置，比当前最远位置小表明不是呈递增趋势了，就说明发现了节点需要移动的情况，此时将移动标识置为true，接着patch更新。接着还需要从新旧节点位置映射表中找到最长递增子序列，目的是为了让节点可以做到最小限度的移动操作，找出最长递增子序列并记录下来
![](attachments/Pasted%20image%2020250917211657.png)
![](attachments/Pasted%20image%2020250917211729.png)
接着从后往前编辑处理新旧节点位置映射表和最长递增子序列，定义变量i记录位置，同时定义变量j记录最长递增子序列的位置
当i在新旧节点位置映射表中对应的值为0时表示新节点列表中对应同样的索引值为i的节点是新增节点，需要直接挂载。如果对应的值不为0，则查看j是否处于最长递增子序列的范围，如果不超过则表示当前节点处于最长递增子序列，此时无需移动，直接跳过。接着i和j都需要向前移动（-1）
![](attachments/Pasted%20image%2020250917212418.png)
当j不处于最长递增子序列中时表明此时在新节点列表对应索引的节点不处于最长递增子序列，该节点需要移动，则执行移动操作。

完成以上操作diff算法执行完成

# 数据响应式

响应式：数据改变视图也跟随改变
### defineProperty
在js中一个对象可以进行任意操作而没有限制
使用属性描述符能够限制自定义类属性的权限
**获取属性描述符**
```js
Object.getOwnPropertyDescriptor(对象,属性名字符串)
```
相当于
```js
对象.属性名
```
但是得到的不仅有属性的值，还有属性的权限

**设置属性描述符**
```js
Object.defineProperty(对象,属性名字符串,{
	value:属性值,
	writable:false,      //是否可重写
	enmuerable:false,    //是否可遍历
	configuration:false, //是否可修改
	get:function(){},    //读取器
	set:function(){}     //配置器
})
```
相当于给对象设置属性并赋值，不过可以设置三个权限
读取器和配置器相当于计算属性

**一个属性有了getter和setter函数后就无法使用value赋值了。要正常的获得属性的初始值需要在外部设置一个变量并使用getter和setter函数代理处理，这样通常不安全，通常设置出闭包环境使用**

**冻结对象**
```js
Object.freeze(对象)
```
可以写在类内部冻结类的属性，这样就无法对类的属性进行任何更改了
也可以写在类的外部冻结某个对象，这样就无法对这个对象添加属性了

# AST抽象语法树
Abstract Syntax Tree
ast就是解析html字符串
采用栈的方式，遇到开始标签就添加到标签栈中，并在内容栈中添加一个空数组，当遇到文本内容时将内容放到内容栈顶第一个数组中，当遇到结尾标签就将标签栈和内容栈都出栈

# api

| 类/函数           | 作用                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Function(code) | 接收一个字符串，并将该字符串作为代码执行                                                                                                   |
| with(obj)      | 由于Function中参数的指向不确定，因此需要配合with函数使用。with函数接收一个对象并返回一个字符串，返回的字符串是要以代码执行的内容，接收的对象是给返回值执行时参数指定指向对象，这样返回值执行的函数中的参数都指向了传入的对象 |

# SPA
- SPA（single-page application）单页应用，默认情况下我们编写Vue、React都只有一个html页面，并且提供一个挂载点，最终打包后会再此页面中引入对应的资源。（页面的渲染全部是由JS动态进行渲染的）。切换页面时通过监听路由变化，渲染对应的页面ClientSideRendering，客户端渲染CSR
- MPA（Multi-page application）多页应用，多个html页面。每个页面必须重复加载，js，css等相关资源。（服务端返回完整的html，同时数据也可以再后端进行获取一并返回"模板引擎"）。多页应用跳转需要整页资源刷新。ServerSideRendering，服务器端渲染SSR

**优缺点**

|           | 单页面应用(SPA) | 多页面应用（MPA)       |
| --------- | ---------- | ---------------- |
| 组成        | 一个主页面和页面组件 | 多个完整的页面          |
| 刷新方式      | 局部刷新       | 整页刷新             |
| SEO搜索引擎优化 | 无法实现       | 容易实现             |
| 页面切换      | 速度快，用户体验良好 | 切换加载资源，速度慢，用户体验差 |
| 维护成本      | 相对容易       | 相对复杂             |
- 用户体验好、快，内容的改变不需要重新加载整个页面，服务端压力小。
- SPA应用不利于搜索引|擎的抓取。
- 首次渲染速度相对较慢（第一次返回空的html，需要再次请求首屏数据）白屏时间长。

**解决方法**
- 静态页面预渲染(StaticSiteGeneration)SSG，在构建时生成完整的html页面。（就是在打包的时候）先将页面放到浏览器中运行一下，将HTML保存起来），仅适合静态页面网站。变化率不高的网站
- SSR+CSR的方式，首屏采用服务端渲染的方式，后续交互采用客户端渲染方式。（NuxtJS）

# 虚拟DOM
- VirtualDOM就是用js对象来描述真实DOM，是对真实DOM的抽象，由于直接操作DOM性能低但是js层的操作效率高，可以将DOM操作转化成对象操作，最终通过diff算法比对差异进行更新DOM（减少了对真实DOM的操作）。
- 虚拟DOM不依赖真实平台环境从而也可以实现跨平台。

#### VDOM的生成过程
1. 在vue中我们常常会为组件编写模板-template
2. 这个模板会被编译器编译为渲染函数-render
3. 在接下来的挂载过程中会调用render函数，返回的对象就是虚拟dom
4. 会在后续的patch过程中进一步转化为真实dom。

#### VDOM是如何做diff算法的
1. 挂载过程结束后，会记录第一次生成的VDOM-oldVnode
2. 当响应式数据发生变化时，将会引|起组件重新render，此时就会生成新的VDOM-newVnode
3. 使用oldVnode与newVnode做diff操作，将更改的部分应到真实DOM上，从而转换为最小量的dom操作，高效更新视图。

# 数据响应式

### vue2的缺陷
- 在Vue2的时候使用defineProperty来进行数据的劫持，需要对属性进行重写添加getter及setter性能差。
- 当新增属性和删除属性时无法监控变化。需要通过`$set`、`$delete`实现
- 数组不采用defineProperty来进行劫持（浪费性能，对所有索引进行劫持会造成性能浪费）需要对数组单独进行处理。
- 对于ES6中新产生的Map、Set这些数据结构不支持。

数组因为考虑性能的原因并没有使用defineProperty对数组的每一项进行拦截，而是重写数组中的函数。数组中如果是对象数据类型也会递归劫持

### vue3
vue3中数据响应式是使用proxy实现的，为对象的每个属性都设置一个代理，当获取和修改属性时由代理接管。也就不用重写get和set函数了

# 依赖收集
- 每个属性都拥有自己的dep属性，存放他所依赖的watcher，当属性变化后会通知自己对应的watcher去更新（当组件挂载时$mount函数会添加watcher）
- 默认在初始化时会调用render函数，此时会触发属性依赖收集dep.depend
- 当属性发生修改时会触发watcher更新dep.notify()

#### vue3的依赖收集
- vue3中会通过Map结构将属性和effect映射起来。
- 默认在初始化时会调用render函数，此时会触发属性依赖收集track，
- 当属性发生修改时会找到对应的effect列表依次执行trigger

# v-show的实现
控制dom元素的显示的方法有三种：display、opacity、visvibility
v-show的实现使用的时display，原因如下：
1. opacity：控制dom元素的透明度，即使透明度为0也会响应元素的各种事件
2. visvibility：是占位的，并不能响应元素的事件（即使显示了出来）

v-show判断元素如果显示时会使用元素本身的display属性，当元素不显示时会修改元素的display属性为none

v-if会阻断内部代码的执行，优先级比v-show高

# computed和method的区别
vue对methods的处理比较简单，只需要遍历methods配置中的每个属性，将其对应的函数使用bind绑定当前组件实例后复制其引用到组件实例中即可
而vue对computed的处理会稍微复杂一些。
当组件实例触发生命周期函数beforeCreate后，它会做一系列事情，其中就包括对computed的处理它会遍历computed配置中的所有属性，为每一个属性创建一个Watcher对象，并传入一个函数，该函数的本质其实就是computed配置中的getter，这样一来，getter运行过程中就会收集依赖
但是和渲染函数不同，为计算属性创建的Watcher不会立即执行，因为要考虑到该计算属性是否会被渲染函数使用，如果没有使用，就不会得到执行。因此，在创建Watcher的时候，它使用了lazy配置，lazy配置可以让Watcher不会立即执行。
受到lazy的影响，Watcher内部会保存两个关键属性来实现缓存，一个是value，一个是dirty
value属性用于保存Watcher运行的结果，受lazy的影响，该值在最开始是undefined
dirty属性用于指示当前的value是否已经过时了，即是否为脏值，受lazy的影响，该值在最开始是true
Watcher创建好后，vue会使用代理模式，将计算属性挂载到组件实例中
当读取计算属性时，vue检查其对应的Watcher是否是脏值，如果是，则运行函数，计算依赖，并得到对应的值，保存在Watcher的value中，然后设置dirty为false，然后返回。
在依赖收集时，被依赖的数据不仅会收集到计算属性的Watcher，还会收集到组件的Watcher，当计算属性的依赖变化时，会先触发Watcher的执行，此时，它只需设置dirty为true即可，不做任何处理。
由于依赖同时会收集到组件的Watcher，因此组件会重新渲染，而重新渲染时又读取到了计算属性，由于计算属性目前已为dirty，因此会重新运行getter进行运算
而对于计算属性的setter，则极其简单，当设置计算属性时，直接运行setter即可
# computed和watch的区别
Vue2中有三种watcher（渲染watcher、计算属性watcher、用户watcher）
Vue3中有三种effect（渲染effect、计算属性effect、用户effect）

二者都是基于watcher实现的，computed基于watcher实现了缓存，watch基于watcher实现了api监控数据，数据改变时触发回调

**computed**
- 计算属性仅当用户取值时才会执行对应的方法。
- computed属性是具备缓存的，依赖的值不发生变化，对其取值时计算属性方法不会重新执行。
- 计算属性可以简化模板中复杂表达式。
- 计算属性中不支持异步逻辑。
- computed属性是可以在模板中使用的。
- 必须有返回值

每一个计算属性内部维护一个dirty属性dirty：true
当取值的时候dirty为true就执行用户的方法，拿到值缓存起来this.value并且将dirty=false
再次取值的时候dirty为false，直接返回缓存的this.value
当修改了数据时将dirty的值变为true，并且会触发更新，页面重新渲染，重新获取最新计算属性的值

1. 计算属性会创建一个计算属性watcher，这个watcher（lazy：true）不会立刻执行
2. 通过object.defineProperty将计算属性定义到实例上
3. 当用户取值时会触发getter，拿到计算属性对应的watcher，看dirty是否为true，如果为true则求值
4. 并且让计算属性watcher中依赖的属性收集最外层的渲染watcher，可以做到依赖的属性变化了，触发计算属性更新dirty并且可以触发页面更新
5. 如果依赖的值没有发生变化，则采用缓存

**watch**
watch则是监控值的变化，当值发生变化时调用对应的回调函数。经常用于监控某个值的变化，进行一些操作。（异步要注意竞态问题）

# watch和watchEffect的区别
- watchEffect立即运行一个函数，然后被动地追踪它的依赖，当这些依赖改变时重新执行该函数。
- watch侦测一个或多个响应式数据源并在数据源变化时调用一个回调函数。

二者本质上都是基于ReactiveEffect实现的，差异并不大。watch在于数据变了允许用户对新旧数据进行处理，watchEffect在于数据改变时重新执行函数中的逻辑
# ref和reactive的区别
- reactive用于处理对象类型的数据响应式。底层采用的是Proxy
- ref通常用于处理单值的响应式，ref主要解决原始值的响应式问题。底层采用的是Object.defineProperty实现的。

由于reactive是基于proxy实现的，因此它无法处理基础数据类型，这时就只能使用ref了

# new Vue的过程
1. 在newVue的时候内部会进行初始化操作。
2. 内部会初始化组件绑定的事件，初始化组件的父子关系`$parent`、`$children`、`root`
3. 初始化响应式数据data、computed、props、watch、method。同时也初始化了provide和inject方法。内部会对数据进行劫持对象采用defineProperty数组采用方法重写。
4. 再看一下用户是否传入了el属性和template或者render。render的优先级更高，如果用户写的是template，会做模板编译（三部曲）。最终就拿到了render函数
5. 内部挂载的时候会产生一个watcher，会调用render函数会触发依赖收集。内部还会给所有的响应式数据增加dep属性，让属性记录当前的watcher（用户后续修改的时候可以触发watcher重新渲染）
6. vue更新的时候采用虚拟DOM的方式进行diff算法更新。

# v-if和v-for优先级
在vue2中v-for和v-if避免在同一个标签中使用，如果遇到需要同时使用时可以考虑写成计算属性的方式。
如果直接将v-if和v-for写在一起会报错，但是将v-if中的判断条件替换成计算属性后就不会报错了

- 在Vue2中解析时，先解析v-for在解析v-if。会导致先循环后在对每一项进行判断，浪费性能。
- 在Vue3中v-if的优先级高于v-for。（会将v-if提到外层多加一个template标签）

# 生命周期

| 生命周期v2        | 生命周期v3                  | 描述                       |
| ------------- | ----------------------- | ------------------------ |
| beforeCreate  | beforeCreate            | 组件实例被创建之初                |
| created       | created                 | 组件实例已经完全创建               |
| beforeMount   | beforeMount             | 组件挂载之前                   |
| mounted       | mounted                 | 组件挂载到实例上去之后              |
| beforeUpdate  | beforeUpdate            | 组件数据发生变化，更新之前            |
| updated       | updated                 | 数据数据更新之后                 |
| beforeDestroy | **beforeUnmount**       | 组件实例销毁之前                 |
| destroyed     | **unmounted**           | 组件实例销毁之后                 |
| activated     | activated               | keep-alive缓存的组件激活时       |
| deactivated   | deactivated             | keep-alive缓存的组件停用时调用     |
| errorCaptured | errorCaptured           | 捕获一个来自子孙组件的错误时被调用        |
| -             | **renderTracked Dev**   | 调试钩子，响应式依赖被收集时调用         |
| -             | **renderTriggered Dev** | 调试钩子，响应式依赖被触发时调用         |
| -             | **serverPrefetch**      | ssr only，组件实例在服务器上被渲染前调用 |
Vue3中新增了：组合式APl：生命周期钩子，但是不存在onBeforeCreate和onCreated钩子

# Vue.use
安装Vuejs 插件。如果插件是一个对象，必须提供install方法。如果插件是一个函数，它会被作为instal方法。install方法调用时，会将Vue作为参数传入，这样插件中就不再需要依赖Vue了。

插件通过use函数可以：
- 添加全局指令、全局过滤器、全局组件等
- 通过全局混入来添加一些组件选项。
- 添加Vue实例方法，通过把它们添加到Vue.prototype上实现。

# 组件的data为什么必须是个函数
- 根实例对象data可以是对象也可以是函数"单例”，不会产生数据污染情况
- 组件实例对象data必须为函数，目的是为了防止多个组件实例对象之间共用一个data，产生数据污染。所以需要通过工厂函数返回全新的data作为组件的数据源
```js
function Vue() {}

Vue.extend = function (options) {
	function Sub() {
		//会将data存起来
		this.data = this.constructor.options.data;
	}
	Sub.options = options;
	return Sub;
}
let child = Vue.extend({
	data: { name:"xxx"f.
})
/／两个组件就是两个实例，希望数据互不干扰
let childl = new child();
let child2 = new Child();

console.log(child1.data.name) ;
childl.data.name = "jw";
console.log(child2.data.name);
```
当data是一个对象时，会将对象挂载到当前组件的实例上
调用函数初始化数据时如果多次初始化，后续的实例将会覆盖旧的数据，但它们的data指向的却是同一个对象，在修改一个实例的数据时其他的实例数据也会被修改（浅拷贝）
如果使用data返回值的方式时，每次初始化实例都会返回新的数据，多个实例间数据就被隔离了

而跟实例是单例的，所以不涉及共享问题也就可以不限于函数或者对象

# 函数式组件
函数式组件的特性：无状态、无生命周期、无this，但是性能高。正常组件是一个类继承了Vue，函数式组件就是普通的函数，没有new的过程。最终就是将返回的虚拟DOM变成真实DOM替换对应的组件。

定义函数式组件：
1. 在vue2中创建组件时将functional设置为true
2. 将vue文件中的template标签后加上functional属性

> [!NOTE] Title
> 函数式组件不会被记录在组件的父子关系中，在Vue3中因为所有的组件都不用new了，所以在性能上没有了优势。

# v-once
v-once是Vue中内置指令，只渲染元素和组件一次。
被v-once指令标记的组件（包括其内部的子组件）只会在创建时渲染依次，随后的重新渲染，元素/组件及其所有的子节点将被视为静态内容并跳过。这可以用于优化更新性能。

实现原理是缓存，第一次创建被v-once标记的组件时会将其放入到缓存中，下次再获取组件时直接从缓存中获取

### v-memo
如果希望v-once中部分属性更新了也渲染可以使用v-memo
```html
<div v-memo='[value1,value2]'
```
使用v-memo指定依赖列表中的数据，列表中的任一数据更改都会引起v-memo标记的组件的重渲染

在vue3.2后新增了一个v-memo指令通过依赖列表的方式控制页面渲染
很像计算属性

# .sync
在vue2中v-model无法绑定多个属性，如果需要绑定多个数据需要使用.sync修饰符
在vue3中v-model可以绑定多个属性

# nextTick
下次DOM更新循环结束后执行延迟的回调，在修改数据后，立即执行该方法获取更新后的DOM
nextTick（）回调函数延迟执行下一次DOM更新后
- Vue中视图更新是异步的，使用nextTick方法可以保证用户定义的逻辑在更新之后执行。
- 可用于获取更新后的DOM，多次调用nextTick会被合并。

# keep-alive

keep-alive是vue中的内置组件，能在组件切换过程会缓存组件的实例，而不是销毁它们。在组件再次重新激活时可以通过缓存的实例拿到之前染的DOM进行渲染，无需重新生成节点。

keep-alive具有include和exclude属性，通过它们可以控制哪些组件进入缓存。另外它还提供了max属性，通过它可以设置最大缓存数，当缓存的实例超过该数时，vue会移除最久没有使用的组件缓存。

受keep-alive的影响，其内部所有嵌套的组件都具有两个生命周期钩子函数，分别是activated和deactivated，它们分别在组件激活和失活时触发。第一次activated触发是在mounted之后

### 实现原理
keep-alive在内部维护了一个key数组和一个缓存对象
key数组记录目前缓存的组件key值，如果组件没有指定key阻，则会为其自动生成
一个唯一的key值
cache对象以key值为键，vnode为值，用于缓存组件对应的虚拟DOM
在keep-alive的渲染函数中，其基本逻辑是判断当前渲染的vnode是否有对应的缓存，如果有，从缓存中读取到对应的组件实例；如果没有则将其缓存。
当缓存数量超过max数值时，keep-alive会移除掉key数组的第一个元素


# 自定义指令
Vue除了内置指令之外，同时Vue也允许用户注册自定义指令来对Vue进行扩展。指令的目的在于可以**将操作DOM的逻辑进行复用**。

- bind：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。
- inserted：被绑定元素插入父节点时调用(仅保证父节点存在，但不一定已被插入文档中)。
- update：所在组件的VNode更新时调用，但是可能发生在其子VNode更新之前。指令的值可能发生了改变，也可能没有。
- componentUpdated：指令所在组件的VNode及其子VNode全部更新后调用。
- unbind：只调用一次，指令与元素解绑时调用。

# 为什么vue2中vue实例是一个函数而不是类
mixins或这其他的公共方法都是vue.prototype上的方法

# vue3的性能优化

## 静态提升
以`<h1>hello world</h1>`静态标签为例

vue2中不会区分静态节点和动态节点，都会把它们放在render（渲染函数）中，这会导致触发重渲染时静态节点也会重现渲染
```js
render(){
	createVNode('h1',null,'hello world')
	//......
}
```
在vue3中进行了静态提升，会将静态节点提升到render（渲染函数）之外，这样触发重渲染时之间引用就不会使静态节点重渲染了，提高了性能

会在解析时创建一次，之后在render函数中直接使用即可
```js
const hoisted=createVNode('h1',null,'hello world')
function render(){
	//直接使用hoisted即可
}
```

## 预字符串化
一个组件中往往有许多静态的节点，在vue2中不会进行特殊处理，都会一个个创建为虚拟节点
而在vue3中除了静态提升外还会对连续多个静态节点编译为一个普通字符串节点
```html
<div class="menu-bar-container">
	<div class="logo">
		<h1>1ogo</h1>
	</div>
	<ul class="nav">
		<li><a href="">menu</a></li>
		<li><a href="">menu</a></li>
	</ul>
	<div class="user">
		<span>{{ user.name }}</span>
	</div>
</div>
```
当编译器遇到大量连续的静态内容，会直接将其编译为一个普通字符串节点，在更新时则会跳过静态子树
```js
const _hoisted_2=_createStaticVNode("<div class=\"logo\"><h1>1ogo</h1></div><ul class=\"nav\"><li><a href=\"\">menu</a></li><li><a href=\"\">menu</a></li></ul>"
```

这一点的性能提升对于服务端渲染ssr来说提升很大

## 缓存事件处理函数
事件处理函数事实上大部分情况下都是与渲染无关的，也就是每次渲染大概率不会引起事件处理函数的变化
在vue2中并没有对事件处理函数做优化
在vue3中发现了这一点于是对事件处理函数做了缓存处理
```js
//vue2
render(ctx){
	return createVNode("button",{
		onclick:function($event){
			ctx.count++;
		}
	})
}
```
在vue3中解析到事件处理函数时会先去缓存中判断是否有该事件处理函数，如果有会直接使用缓存中的函数，没有则会在缓存中添加该函数并赋值给虚拟节点的事件
```js
//vue3
render(ctx,_cache){
	return createVNode("button",{
		onClick:cache[θ] || (cache[θ]=($event)=>(ctx.count++))
	}
)
```

## Block Tree
vue2在对比新旧树的时候（patch过程），并不知道哪些节点是静态的，哪些是动态的，因此只能一层一层比较，这就浪费了大部分时间在比对静态节点上

在vue2中patch时不会做特殊处理，对于所有节点都会对比
而在vue3中生成的虚拟dom树会标记出动态节点和静态节点，并将所有动态节点提取到根节点中，根节点中有一个数组，其中记录了后代节点中哪些时动态的。
根节点和它的后代节点为一个块（Block），在对比两个块时不用将每个节点都对比，只需要在根节点中找到记录后代节点中动态节点的数组，对比数组中的动态节点

这里我们引入一个概念“区块”，内部结构是稳定的一个部分可被称之为一个区块。
划分区块的标志是是否使用结构性指令 (比如 `v-if` 或者 `v-for`)。结构性指令会创建新的区块节点

当这个组件需要重渲染时，只需要遍历这个打平的树而非整棵树。这也就是我们所说的**树结构打平**，这大大减少了我们在虚拟 DOM 协调时需要遍历的节点数量。模板中任何的静态部分都会被高效地略过。
## Patch Flag标记
vue2在对比每一个节点时，并不知道这个节点哪些相关信息会发生变化，因此只能将所有信息依次比对
在vue3中会有一个标志位对节点的各个信息做标记，标记出哪些是动态的信息。如：类名、文本等
运行时渲染器也将会使用[位运算](https://en.wikipedia.org/wiki/Bitwise_operation)（效率比较高）来检查这些标记，确定相应的更新操作
当patch时会根据标记只比对标记的信息（比如只对比类名，或者只对比文本），这样就进一步提高了效率
```js
return(_openBlock(),_createBlock("div",hoisted_1,{
	hoisted_2,
	_createVNode("div",{
		class:["user""_ctx.user.name]
	},[
		_createVNode("span",{
			class:_ctx.user.name
		},toDisplayString(_ctx.user.name),3/*TEXT,CLASS*/)
	],2 /*CLASS*/)
]))
```
Vue 也为 vnode 的子节点标记了类型。包含多个根节点的模板被表示为一个片段 (fragment)，大多数情况下，可以确定其顺序是永远不变的，所以这部分信息就可以提供给运行时作为一个更新类型标记。运行时会完全跳过对这个根片段中子元素顺序的重新协调过程。

## 去掉了Vue构造函数
在vue3中保留有Vue构造函数，那么vue3就可以兼容vue2，然后在vue3中去掉了vue构造函数
在vue3中使用createApp函数来创建vue示例，这样来解决vue2的设计问题

在vue2中使用`new Vue`的方法创建vue对象并挂载到节点上，来控制某个节点
当一个页面中有多个Vue示例时，vue的一些函数作用在Vue类上面的，会导致一些某个vue实例需要使用到某个函数而另一个vue实例不会用到vue函数时会被影响，且mixin做的更改也是作用在整个vue类上的
```js
<div id="app1"></div>
<div id="app2"></div>
<script>
	Vue.use(...);//此代码会影响所有的vue应用
	Vue.mixin(...);//此代码会影响所有的vue应用
	Vue.ccmponent(...);//此代码会影响所有的vue应用
	
	new Vue({
		//配置
	}).$mount("#app1")
	new Vue({
		//配置
	}).$mount("#app2")
</script>
```
vue3中的createApp返回一个vue实例，原本vue2中一些函数所做的更改不会应用到vue类上了，而是作用在实例上
```js
<div id="app1"></div>
<div id="app2"></div>
<script>
	createApp(根组件).use(...).mixin(...).component(...).mount("#app1")
	createApp(根组件).mount("#app2")
</script>
```

# 属性描述符
在js中一个对象可以进行任意操作而没有限制
使用属性描述符能够限制自定义类属性的权限
**获取属性描述符**
```js
Object.getOwnPropertyDescriptor(对象,属性名字符串)
```
相当于
```js
对象.属性名
```
但是得到的不仅有属性的值，还有属性的权限

**设置属性描述符**
```js
Object.defineProperty(对象,属性名字符串,{
	value:属性值,
	writable:false,      //是否可重写
	enmuerable:false,    //是否可遍历
	configuration:false, //是否可修改
	get:function(){},    //读取器
	set:function(){}     //配置器
})
```
相当于给对象设置属性并赋值，不过可以设置三个权限
读取器和配置器相当于计算属性

**冻结对象**
```js
Object.freeze(对象)
```
可以写在类内部冻结类的属性，这样就无法对类的属性进行任何更改了
也可以写在类的外部冻结某个对象，这样就无法对这个对象添加属性了

# vue原理
## 创建vue对象
创建vue对象时有传入的多个配置
- el：被该vue对象控制的元素，需要传入一个选择器来表示选中哪个
- data：页面的数据
```js
new Vue({
	el:'#app',
	data:{
	}
})
```

## 响应式
vue实现数据的响应式就是遍历一个数据内部的所有属性，对这个属性设置属性描述符的set和get（计算属性），在操作数据时调用getter和setter函数发送消息来实现数据的响应

**优化**
由于要遍历一个对象的所有属性，所以这个对象嵌套的对象层次越深消耗的性能也就越高
对于某些数据，如：不修改的数据，像用户看商品信息数据，用户无法对商品信息进行更改所以也就没必要设置响应式数据

**冻结对象不会响应化**
将不需要响应式的对象使用`Object.freeze()`函数来冻结对象，这样vue在遍历数据时发现该对象被冻结了也就不会为其生成响应式了

响应式的数据内部都有`_ob_`属性，其内部为`observe`
在浏览器的控制台中输出的对象，如果默认不显示值显示的时`{...}`的样子证明该属性具有getter和setter函数，在点击`{...}`后显示出值的过程是调用getter函数的过程

**结构响应式变量的后果**
会导致对变量的操作丢失响应式，对结构后的变量进行操作，如果是值类型解构就是值传递无法操作到原本的数据。如果是引用类型就是引用传递，能够操作原本的数据，但操作了也不会触发响应式更新


## 函数式组件
函数式组件只用于渲染页面，相比于普通的组件其内部少了很多属性，因此在性能上比普通组件略高
使用函数式组件时要在组件内部用`function:true`设置为true表示启用

且函数式组件也不会被挂载到vue的组件树上

## v-model
当使用v-modeL绑定一个表单项时，当用户改变表单项的状态时，也会随之改变数据，从而导致vue发生重渲染（rerender），这会带来一些性能的开销。
我们可以通过使用lazy或不使用V-model的方式解决该问题，但要注意，这样可能会导致在某一个时间段内数据和表单项的值是不一致的。

v-model在检测到数据发生变化时就会触发重渲染让页面数据保持一致，如果一直更改那么重渲染一直触发，在密集触发重渲染的这段时间性能损耗较大

`v-model`绑定监听的是`@input`事件
`v-model.lazy`绑定监听的是`@change`事件

## 保持对象引用稳定

在绝大部分情况下，vue触发rerender的时机是其依赖的数据发生变化
若数据没有发生变化，哪怕给数据重新赋值为原来的值，vue也是不会做出任何处理的

下面是Vue判断数据没有变化的源码
```js
funckion hasChanged(x, y){
	if （x===y）{
		return x ===0 && 1/x !== 1/y
	else
		return x === x || y ===y
}
```

因此，如果需要，只要能保证组件的依赖数据不发生变化，组件就不会重新渲染。
对于原始数据类型，保持其值不变即可
对于对象类型，保持其引用不变即可

## v-show和v-if

v-show是创建了组件但根据条件判断是否显示，无论是否满足条件都有创建出组件
v-if是根据条件判断是否创建组件，如果不满足则不会创建出组件

对于频繁切换显示状态的元素，使用v-show可以保证虚拟dom树的稳定，避免频繁的新增和删除元素，特别是对于那些内部包含大量dom元素的节点，这一点极其重要

# vue中使用到的设计模式
- **单例模式**：-单例模式就是整个程序有且仅有一个实例Vuex中的store
- **工厂模式**：-传入参数即可创建实例（createElement）
- **发布订阅模式**：－订阅者把自己想订阅的事件注册到调度中心，当该事件触发时候，发布者发布该事件到调度中心，由调度中心统一调度订阅者注册到调度中心的处理代码。
- **观察者模式**：-watcher&dep的关系
- **代理模式**：－代理模式给某一个对象提供一个代理对象，并由代理对象控制对原对象的引用。
- **装饰器模式**：-Vue2装饰器的用法（对功能进行增强@）
- **中介者模式**：－中介者是一个行为设计模式通过提供一个统一的接口让系统的不同部分进行通信。Vuex
- **策略模式**：－策略模式指对象有某个行为,但是在不同的场景中,该行为有不同的实现方案。mergeOptions
- **外观模式**：－提供了统一的接口，用来访问子系统中的一群接口。

# vuex原理
对于Vuex3核心就是通过newVue(创建了一个Vue实例，进行数据共享。
对于Vuex4核心就是通过创建一个响应式对象进行数据共享reactive）

# vue3的组合式api的优势
1. 在Vue2中采用的是OptionsAPl,用户提供的data,props,methods,computed,watch等属性（用户编写复杂业务逻辑会出现反复横跳问题）
2. Vue2中所有的属性都是通过this访问，this存在指向明确问题，
3. Vue2中很多未使用方法或属性依l旧会被打包，并且所有全局API都在Vue对象上公开。CompositionAPI对tree-shaking更加友好，代码也更容易压缩。
4. 组件逻辑共享问题，Vue2采用mixins实现组件之间的逻辑共享；但是会有数据来源不明确，命名冲突等问题。Vue3采用CompositionAPI提取公共逻辑非常方便
5. 简单的组件仍然可以采用OptionsAPI进行编写，compositionAPI在复杂的逻辑中有着明显的优势~。

# vue2和vue3的区别
- Vue3.0更注重模块上的拆分，在2.0中无法单独使用部分模块。需要引入完整的Vuejs（例如只想使用使用响应式部分，但是需要引入完整的Vuejs)，Vue3中的模块之间耦合度低，模块可以独立使用。拆分模块
- Vue2中很多方法挂载到了实例中导致没有使用也会被打包（还有很多组件也是一样）。通过构建工具Tree-shaking机制实现按需引入，减少用户打包后体积。重写API
- Vue3允许自定义渲染器，扩展能力强。不会发生以前的事情，改写Vue源码改造渲染方式。扩展更方便
- 在Vue2的时候使用defineProperty来进行数据的劫持，需要对属性进行重写添加getter及setter性能差。当新增属性和删除属性时无法监控变化。需要通过`$set`、`$delete`实现
- 数组不采用defineProperty来进行劫持（浪费性能，对所有索引进行劫持会造成性能浪费）需要对数组单独进行处理
- Diff算法也进行了重写。
- Vue3模板编译优化，采用PatchFlags优化动态节点，采用BlockTree进行靶向更新等
- 声明周期：beforecreate更改为setup，destoryed和beforedestory更改为onUnMounted和onBeforeUnMounted
- vue2选项式api，所有属性都需要写在同一个vue实例中，单一状态树，vue3组合式api，所有属性都是使用方法区分，支持多根节点可读性更高
- vue2中需要在data中定义数据，vue3使用ref定义响应式数据

 **API变化**
- Composition API：Vue3引入，替代Vue2的Options API，提高代码组织和复用性。
- 生命周期钩子：Vue3更新生命周期钩子名称，如`beforeCreate`改为`setup`。

 **性能提升**
- Vue3使用`Proxy`代替`Object.defineProperty`，性能更高，支持更多特性。
- v-if和v-for可以写在同一标签中且v-if先执行
- Vue3优化虚拟DOM算法，减少渲染时间。

**其他改进**
- Fragment支持：Vue3允许组件返回多个根节点，提高灵活性。
- TypeScript支持：Vue3对TypeScript提供更好的支持。


# 虚拟DOM的运行机制
- 创建虚拟DOM：根据模板或状态生成虚拟DOM树。
- 对比新旧虚拟DOM：使用Diff算法比较新旧虚拟DOM，找出差异。
- 更新真实DOM：根据差异，最小化操作真实DOM，只更新需要变化的部分。

**优点**
- 提高性能：减少直接操作真实DOM的次数，提升渲染效率。
 - 跨平台：虚拟DOM可以映射到不同平台，实现跨平台开发。

# MVVM
Model-View-ViewModel
- View是视图层，用户界面
- Model是指数据模型，后端进行数据操作和业务逻辑处理
- ViewModel由前端开发人员组织生成和维护的视图数据层

**优点**
- 低耦合、可复用
- 分层开发
- 测试方便

# vue3中为什么去掉了vue构造函数
vue2的全局构造函数带来了诸多问题：
1. 调用构造函数的静态方法会对所有vue应用生效，不利于隔离不同应用
2. ue2的构造函数集成了太多功能，不利于tree shaking，vue3把这些功能使用普通函数导出，能够充分利用tree shaking优化打包体积
3. vue2没有把组件实例和vue应用两个概念区分开，在vue2中，通过newVue创建的对象，既是一个vue应用，同时又是
一个特殊的vue组件。vue3中，把两个概念区别开来，通过createApp创建的对象，是一个vue应用，它内部提供的方法是针对整个应用的，而不再是一个特殊的组件。

# 响应式函数

### useTemplateRef
是vue3.5新推出的语法糖，用于取代vue模板中的ref
相比于普通的ref获取domref，它拥有：可以自定义名称、更符合直觉等优势

原本的模板ref：
```vue
<script>
	const domRef=ref<HTMLDivElement | null>(null)
</script>
<template>
	<div ref='domRef'/>
</template>
```
useTemplateRef：
```vue
<script>
	const divRef=useTemplateRef<HTMLDivElement | null>('domRef')
</script>
<template>
	<div ref='domRef'/>
</template>
```

## ref和reactive的区别
reactive只会接受对象类型
ref和reactive的使用是根据变量赋值的方式决定的
直接赋值用ref，修改数据用reactive
```ts
const a=ref({})
let b=reactive({})

onMounted(()=>{
	a={name:1} // dom会更新
	b={name:2} // 数据有更新但dom不会更新
})
```
ref定义了一个类（`RefImpl`），它在 get/set 这两个操作里做了依赖收集和触发更新。因此数据指向以及内容改变都会被监听到
reactive代理的是原始对象，因此将对象赋值就是将被代理的原始对象替换到，替换后的reactive数据就不是响应式数据了
![](attachments/Pasted%20image%2020250921200155.png)
![](attachments/Pasted%20image%2020250921200416.png)

# nextTick原理

1. 数据变化触发响应式系统：数据变化后对应的Watcher（观察者）会被通知
2. 观察者入队列：vue内部维护一个观察者队列，同一个观察者再一个tick内只会更新一次（去重），多次数据变化会被合并
3. nextTick回调队列：vue内部维护nextTick回调队列多次调用 `nextTick` 会合并回调。
4. 微任务执行：先执行更新dom，再执行nextTick回调

# 样式隔离原理

1. 作用域样式（Scoped Styles）：
在 Vue 单文件组件中，可以使用 scoped 特性将样式限定于当前组件的作用域。使用标签包裹的样式只对当前组件起作用，不会影响其他组件或全局样式。Vue 实现作用域样式的方式是通过给每个选择器添加一个唯一的属性选择器，以确保样式仅适用于当前组件。
自动生成一个唯一的哈希值，并在编译时为该组件的所有html元素添加一个 `data-v-hash` 的属性，同时将组件内的所有 css 选择器末尾加上 `[data-v-hash]` 属性选择器，保证样式仅在当前组件的元素上生效。
```vue
<style scoped></style>
```

2. CSS Modules：
在 Vue 单文件组件中，可以借助 module 特性启用 CSS Modules 功能，在样式文件中使用类似 :local(.className) 的语法来定义局部样式。CSS Modules 会自动生成唯一的类名，并在编译时将类名与元素关联起来，从而实现样式的隔离和局部作用域。
```vue
<style module></style>
```
2. CSS-in-JS 方案：
结合 CSS-in-JS 库（如 styled-components、emotion 等）来实现样式的隔离。直接在组件代码中编写样式，并通过 JavaScript 对象或模板字符串的形式动态生成样式。
```vue
<template>
  <div :style="componentStyle"></div>
</template>

<script setup>
const componentStyle = {
	width:100px
}
</script>
```

# 同时兼容vue2和vue3的组件库
1. 使用vue-demi：要用到的vue的api从vue-demi中导出，vue-demi会在安装完毕后会检查本地vue版本确定导出的api：vue3直接导出vue3，vue2.6以上导出vue2的和@vue/composition-api，vue2.6一下导出vue2的api
2. 使用vue-compart：vue3兼容vue2
3. 基于web component做：mdn推出的规范，虽然功能比不上vue、react强大，但是开发的组件由于是基于原生的所以可以兼容任意框架

# vue3和vue2的静态节点优化

### 编译时优化

vue2：
- 静态节点提升：在编译阶段识别出静态节点，并将它们标记魏静态节点，在运行时会被缓存，避免每次渲染时都重新创建
- 静态内容提取：提取静态内容，减少每次渲染时的字符串拼接操作

vue3
- 静态树提升：在vue2静态节点提升的基础上的升级，编译阶段不仅识别出静态节点，还将整个静态子树提升到组件的外部。这意味着静态子树在组件初始化时只创建一次，后续渲染时直接复用。
- 静态属性提升：Vue 3 会将静态属性（如类名、样式等）提升到组件的外部，避免在每次渲染时重新创建这些属性。

### 运行时优化

vue2
- 静态节点缓存：运行时缓存静态节点，避免在每次渲染时重新创建这些节点。
- 动态节点标记：标记出动态节点，但在运行时仍然需要进行一些额外的检查和处理。

Vue 3
- 静态子树缓存：运行时会缓存整个静态子树，避免在每次渲染时重新创建这些子树。
- 动态态节点标记：更精确地标记出动态节点，运行时可以直接跳过静态节点，只对动态节点进行 Diff 操作。
- 更高效的虚拟 DOM 更新：通过更高效的虚拟 DOM 更新策略，减少了不必要的 DOM 操作。

### 编译器优化

Vue 2
- 编译器优化：编译器在识别静态节点时已经做了很多优化，但仍然有一些限制，特别是在处理复杂模板时。

Vue 3
- 更强大的编译器：编译器进行了重大改进，能够更准确地识别和优化静态节点。编译器会生成更高效的运行时代码，减少运行时的开销。
- 静态提升：编译器会将静态内容提升到更高的层级，减少每次渲染时的计算量。
- 代码生成优化：编译器会生成更优化的代码，减少运行时的开销，提高性能。

# 路由的两种模式


| 特性     | hash                    | history                                   |
| ------ | ----------------------- | ----------------------------------------- |
| URL 表现 | example.com/#/home      | example.com/home                          |
| 实现原理   | 监听window.onhashchange事件 | 调用history.pushState()并监听popstate事件        |
| 服务器要求  | 无特殊要求                   | 必需配置（将所有路由 Fallback 到index.html，否则刷新 404） |
| 兼容性    | 较好                      | 较差                                        |
| 美观度    | 较差（有#）                  | 优美（无#，更像真实URL）                            |



