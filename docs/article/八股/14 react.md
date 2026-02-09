## react15

## 架构

React15的架构分为两层：
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

### Reconciler
当组件的props、state变化时，调用forceUpdate时，父组件更新时都会触发组件的更新

每当有更新发生时，**Reconciler**会做如下工作：
- 调用函数组件、或 class 组件的`render`方法，将返回的 JSX 转化为虚拟 DOM
- 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
- 通过对比找出本次更新中变化的虚拟 DOM
- 通知**Renderer**将变化的虚拟 DOM 渲染到页面上
- 没有优先级和中断机制，递归对比时会锁定页面

### Renderer
react支持跨平台，在不同的平台拥有不同的renderer：
- [ReactNative](https://www.npmjs.com/package/react-native)渲染器，渲染 App 原生组件
- [ReactTest](https://www.npmjs.com/package/react-test-renderer)渲染器，渲染出纯 Js 对象用于测试
- [ReactArt](https://www.npmjs.com/package/react-art)渲染器，渲染到 Canvas, SVG 或 VML (IE8)
在每次更新发生时，**Renderer**接到**Reconciler**通知，将变化的组件渲染在当前宿主环境。

![](attachments/Pasted%20image%2020251125201629.png)

Reconciler和Renderer是交替工作的，当第一个li在页面上已经变化后，第二个li再进入Reconciler。
由于整个过程都是同步的，所以在用户看来所有DOM是同时更新的，但更新过程中，用户继续输入2，就不会马上响应，需要等到更完成后输入框中才能出现2。

### 当前架构的缺点
mount的组件会调用mountComponent，update的组件会调用updateComponent。这两个方法都会==递归更新子组件。==
由于递归执行，所以更新一旦开始，中途就无法中断。当层级很深时，递归更新时间超过了 16ms，用户交互就会卡顿。

除此之外，react15并不会终端进行中的更新，但因为特殊情况中断更新就会出现意外的效果：只渲染出了一部分的更新
而我们期望的通常是：停止后续的更新的任务，完成当前正在执行的更新

## 生命周期
render生命周期并不会操作真实dom，它会把要渲染的内容返回出来，经过ReactDOM.render()统一更新
![](attachments/Pasted%20image%2020251103110114.png)

# react16.8

## 生命周期
![](attachments/Pasted%20image%2020251103110220.png)


> [!NOTE] Title
> 生命周期的改变主要是为了给fiber架构铺路

### getDerivedStateFromProps
用于废弃componentWillMount，并一定程度替代componentReceivePropps

用途：基于props来派生和更新state（有且仅有这一个用途，react团队也从命名层面来约束这个用途）
是一个静态函数，也就是无法访问到this。也因此限制了修改状态等副作用操作

有两个参数props和state，分别表示父组件传入的props和组件自身的state
必须要有一个object类型的返回值，作为组件的state
状态的更新并不是覆盖的，而是将新增的状态直接添加到组件的state中，和之前的state是共存的

### getSnapshotBeforeUpdate
getSnapshotBeforeUpdate 的返回值会作为第三个参数给到 componentDidUpdate
它的执行时机是在render方法之后，真实DOM更新之前

替代componentWillUpdate

## fiber架构

主流浏览器刷新频率为 60Hz，即每（1000ms / 60Hz）16.6ms 浏览器刷新一次。
每16.6ms时间内需要完成如下工作：js脚本执行-样式布局-样式绘制
`GUI渲染线程`与`JS线程`是互斥的。所以**JS 脚本执行**和**浏览器布局、绘制**不能同时执行。
当 JS 执行时间过长，超出了 16.6ms，这次刷新就没有时间执行**样式布局**和**样式绘制**了，也就造成了肉眼看到的掉帧和卡顿

fiber架构的引入就是为了解决这个问题
react15架构不能支持异步更新以至于需要重构

React16 架构可以分为三层：
- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入Reconciler
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

![](attachments/Pasted%20image%2020251123145105.png)

### Scheduler
设计出发点是：以浏览器是否有剩余时间作为任务中断的标准
那么我们需要一种机制，当浏览器有剩余时间时通知我们。

与之非常契合的api是：requestIdleCallback，但由于一下因素react官方放弃使用：
- 浏览器兼容性
- 触发频率不稳定，受很多因素影响。比如当我们的浏览器切换 tab 后，之前 tab 注册的`requestIdleCallback`触发的频率会变得很低
- 经过调研发现requestIdleCallback还是有可能超过16.6ms执行的
- 调试困难：更新会在浏览器空闲时才触发，无法预测更新的时间点
- 需要自行实现优先级处理：requestIdleCallback不支持任务优先级

基于以上原因，react官方实现了功能更加完备的polyfill，核心原理是：MesssageChannel的postMessage+requestAnimationFrame
除了在空闲时触发回调的功能外，**Scheduler**还提供了多种调度优先级供任务设置。
raf是在浏览器==重绘==之前执行，MessageChannel的postMessage是宏任务

### Reconciler
在 React15 中**Reconciler**是递归处理虚拟 DOM 的。
而在React16中更新工作从递归变成了可以中断的循环过程。每次循环都会调用`shouldYield`判断当前是否有剩余时间。

在 React16 中，**Reconciler**与**Renderer**不再是交替工作。当**Scheduler**将任务交给**Reconciler**后，**Reconciler**会为变化的虚拟 DOM 打上代表增/删/更新的标记，类似这样：
```js
export const Placement = /*             */ 0b0000000000010;
export const Update = /*                */ 0b0000000000100;
export const PlacementAndUpdate = /*    */ 0b0000000000110;
export const Deletion = /*              */ 0b0000000001000;
```
==整个**Scheduler**与**Reconciler**的工作都在内存中进行==。只有当所有组件都完成**Reconciler**的工作，才会统一交给**Renderer**

![](attachments/Pasted%20image%2020251125201945.png)

scheduler和reconciler的工作随时可能因为以下原因被中断：
- 有其他更高优任务需要先更新
- 当前帧没有剩余时间

由于它们中的工作都在内存中进行，不会更新页面上的 DOM，所以即使反复中断，用户也不会看见更新不完全的 DOM。

### Renderer
**Renderer**根据**Reconciler**为虚拟 DOM 打的标记，同步执行对应的 DOM 操作。

### 心智模型

**代数效应（Algebraic Effects）**

### 思想

也因此react16.8的生命周期分为三个阶段：render、precommit、commit
render阶段允许被打断（被fiber时间分片执行）
commit阶段总是同步执行

因为render允许被打断，也就导致了render的生命周期都是有可能被重复执行的
而被废弃的生命周期：componentWillMount、componentWillUpdate、componentWillReceiveProps
他们都处于render阶段，且常年被滥用存在很高的风险，如：
1. 在WilMount时发送网络请求：有些人认为在将要挂载时发送网络请求比挂载后发送网络请求更快，实际上网络请求依旧是异步任务，只能在同步任务执行完后才执行。而在fiber架构下的render阶段可能会重复调用也就会导致多次发送网络请求。
2. 在WillMount时调用setState：导致死循环重新渲染

而在getDerivedStateFromProps生命周期中静态的无法获取到this也就避免了这些问题
也确保了fiber机制下数据和视图的安全性，和生命周期行为的纯粹、可控、可预测

# hooks

## 类组件和函数组件
1. 类组件需要继承class，函数组件不需要
2. 类组件可以访问生命周期方法，函数组件不能
3. 类组件中可以获取到实例化后的this，并基于这个this做各种各样的事情，而函数组件不可以
4. 类组件中可以定义并维护state（状态），而函数组件不可以

在 React-Hooks 出现之前类组件的能力边界明显强于函数组件

hook本质：一套能够使函数组件更强大、更灵活的“钩子”

使用原则：只在react函数中调用hooks，不能再循环、条件或嵌套函数中调用hooks

hooks调用顺序必须是确定的
### 以useState为例介绍hooks调用流程：
挂载时
1. 调用useState
2. 通过resolveDispatcher获取dispatcher
3. dispatcher.useState()
4. 调用mountState：将数据挂载到单向链表上
5. 返回目标数组（[state,useState]）

更新时
1. 调用useState
2. 通过resolveDispatcher获取dispatcher
3. dispatcher.useState()
4. 调用updateState：按顺序去遍历之前构建好的链表，去除对应的数据信息进行渲染
5. 调用updateReducer
6. 返回目标数组（[state,useState]）

# setState
setState更新是异步更新的，reduce中的setState是同步更新的

![](attachments/Pasted%20image%2020251103143313.png)
setState更新后就会调用组件更新的生命周期，而render中dom更新会有很大的性能开销，如果每次调用setState都进行更新性能开销较大。因此setState是批量更新的（类似于vue中的nextTick），每进行一次setState就将其放入队列，等时机成熟就将他们合并然后一起更新

在React钩子函数及合成事件中，它表现为异步
在setTimeout、setlnterval等函数中，包括在DOM原生事件中，它都表现为同步

**为什么setTimeout中的setState是同步的**：
setTimeout帮助setState逃脱了react的掌控，在react管控下的setState是异步的
伪代码如下所示
```js
// 在组件中使用setState
const App = ()=>{
	const [state,setState] = useState(0)
	const fn = () => {
		setTimeout(() => {
			setState(++state)
		},0)
	}
}

// react执行函数
// 执行前先上锁
isBatchingUpdates = false
fn()
isBatchingUpdates = true
```
在正常的react管理的setState中，应该是先上锁，执行完setState后再解锁
但在使用setTimeout后导致先上锁，接着把setState放入到异步队列中，再解锁，把setState的任务取出来时已经是解锁状态了，所以呈现出setTimeout中执行的setState是同步的

# ReacDOM.render是如何串联渲染链路的

## 渲染模式

legacy 模式: 
普通模式
没有采用fiber架构
```jsx
ReactDOM.render(<App />, rootNode)
```
blocking 模式:
过渡模式
用于普通模式过渡到最新的模式
```jsx
ReactDOM.createBlockingRoot(rootNode).render(<App />)
```
concurrent 模式:
最新模式
采用最新的技术
```jsx
ReactDOM.createRoot(rootNode).render(<App />)
```

# 性能优化

# memo
接受一个组件，返回一个被包装后的组件：当组件的props没有发生变化时就会拦截渲染
这里的比较是一个浅比较

## PureComponent
是React的类组件，相当于自带memo的Component类，它的内部自带了一个shouldComponentUpdate生命周期钩子，在这个生命周期中会做和memo一样的操作：浅比较props和state，如果没有改变则跳过渲染

# 受控组件和非受控组件

- 受控组件：表单数据是由react控制的是受控组件
- 非受控组件：表单数据不由react控制，由dom自己管理的组件是非受控组件

**受控组件**
```jsx
const App=()=>{
	const [value,setValue]=useState('')
	return <form>
		<input value={value}/>
	</form>
}
```
为表单绑定上state后就无法通过dom本身修改state的值了，只能使用react的setState函数来修改
```jsx
<input value={value} onChange={(val)=>setValue(val)}/>
```

受控组件的优点：
1. 集中化的状态管理
2. 更好的表单验证
3. 一致的ui改变

# Redux和Zustand

|           | Redux                                                                                   | Zustand                                                                              |
| --------- | --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| 数据变化时更新原理 | Redux 依赖 React Context 传递 Store。虽然有大量优化，但在大型应用中，Context Provider 的更新依然容易引发“瀑布式”的无效渲染检查。 | Store 存在于 React 组件树之外。通过发布订阅模式精确通知组件。只有当组件 `useStore(selector)` 返回的值发生浅比较变化时，组件才会重绘。 |
| api使用     | 复杂                                                                                      | 简单                                                                                   |
| 包体积       | 大                                                                                       | 小                                                                                    |
| 性能        | 差                                                                                       | 快                                                                                    |






