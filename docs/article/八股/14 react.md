# 生命周期

## react15
render生命周期并不会操作真实dom，它会把要渲染的内容返回出来，经过ReactDOM.render()统一更新
![](attachments/Pasted%20image%2020251103110114.png)


## react16.8之后
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

# fiber
react渲染是同步渲染的，一次更新较大的渲染就会长时间阻塞主线程，带来用户体验的大幅度下降

fiber架构的引入就是为了解决这个问题

## 原理
1. 时间切片：fiber会将一个大的更新任务拆解成许多小任务，每次执行完小人物都会先是否主线程，去处理优先级更高的任务

fiber的实现原理是postMessage+requestAnimationFrame

- 为什么不用requestIdleCallback：经过调研发现requestIdleCallback还是有可能超过20ms执行的，而requestAnimationFrame是在可以一直保持16.6ms执行的
- 为什么不用setTimeout：因为setTimeout的0也依旧需要4ms时间，其次因为事件循环也会有其他的优先级更高的任务执行导致setTimeout更晚执行

## 思想

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








