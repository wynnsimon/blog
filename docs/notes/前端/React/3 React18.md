---
title: 3 React18
createTime: 2025/06/01 18:18:18
permalink: /front/react/3/
---

# hook函数

react中hook函数的使用规则：
1. 只能在组件中或者其他自定义Hook函数中调用
2. 只能在组件的顶层调用，不能嵌套在if、for、其他函数中

==hook函数只能在函数式组件中使用==
## useState
useState是一个React Hoot函数，它允许我们返回一个状态变量，状态变量一旦发生变化组件的视图UI也会跟着变化（数据驱动视图）
类似于vue的ref

用于简单的数据类型：数字、字符串、布尔值等

使用useState绑定一个变量会返回一个对象，这个对象包含对该变量的setter和getter（本身）
```tsx
const [count,setCount]=useState(0)
```

## useReducer
和useState一样也是用于管理状态的，但是与useState不同的是它是集中式的管理状态，一般用于复杂的数据类型：对象、数组

- reducer：处理函数，对于状态的处理会走这个函数，初始时不会执行，调用dispatch才会触发reducer的执行
- initialArg：默认值
- init：初始化函数，如果没有写初始化函数那么就会使用默认值，如果写了初始化函数那么就会使用初始化函数返回的值
```jsx
const [state,dispatch]=useReducer(reducer,initialArg,init?) 
```

## useRef
使用useRef创建ref对象并与jsx绑定dom
类似vue的ref
```tsx
const inputRef=useRef(null)
<input type="text ref={inputRef} />
```

## useEffect
用于在React组件中创建不是由事件引起而是由渲染本身引起的操作，比如发送AJAX请求，更改DOM等等

相当于vue的watchEffect，但vue的不会在开始就触发，而useEffect会在开始时触发一次

| 依赖项     | 副作用函数执行时机         |
| ------- | ----------------- |
| 没有依赖项   | 组件初始渲染+组件更新时执行    |
| 空数组     | 依赖只在初始渲染时执行一次     |
| 添加特定依赖项 | 组件初始渲染+特性依赖项变化时执行 |

- 参数1：是一个函数，可以把它叫做副作用函数，在函数内部可以放置要执行的操作
- 参数2：是一个数组（可选参），在数组里放置依赖项，不同依赖项会影响第一个参数函数的执行，当是一个空数组的时候，副作用函数只会在组件染完毕之后执行一次
```tsx
function App (){
	useEffect(()=>{
		const list=await axios.get('localhost:3000/user')
		console.log(list)
	},[])
	return(
		<div>
		</div>
	)
}
```

#### 清除副作用
在useEffect中编写的由渲染本身引起的对接组件外部的操作，社区也经常把它叫做副作用操作，比如在useEffect中开启了一个定时器，我们想在组件卸载时把这个定时器再清理掉，这个过程就是清理副作用

清除副作用的函数最常见的执行时机时在组件卸载时自动执行

在useEffect的第一个函数参数的返回函数中定义清除副作用逻辑
```tsx
useEffect(()=>{
	// 实现副作用操作逻辑
	return ()=>{
		// 清除副作用逻辑
	}
})
```

## useMemo
让一段计算在开始运行一次，后续只有依赖的数据发生变化时才重新运算
作用：
1. 起类似于vue的一个计算属性的效果
2. 缓存一个数据，让其不会重新创建。

## useCallback
缓存一个函数，每次组件刷新时不会重复创建

useEffect、useMemo、useCallback的第二个参数依赖列表作用都是一样的

## useContext
useContext并不能创建context，它只是更简便地使用context，创建context依旧需要createContext

## useImmer
使用原生的useState和useReducer管理状态是比较麻烦的
useImmer是基于immer.js这个库实现的，它可以高效地复制对象，并在在更改新对象是不会修改原对象

它提供两个hooks：useImmer、useImmerReducer
用法和原生的hooks差不多
但原生的要修改状态需要对对象和数组进行解构，并且更新深层属性时需要精准地找到要修改的属性，并且再将不需要修改的属性重新解构

使用useImmer就可以像操作vue的响应式变量一样以直接操作的形式来修改，但是底层并不是直接修改的原对象，而是新拷贝的对象

## useSyncExternalStore
useSyncExternalStore是React18引l入的一个Hook，用于从外部存储（例如状态管理库、浏览器API等）获取状态并在组件中同步显示。这对于需要跟踪外部状态的应用非常有用。

**场景：**
1. 订阅外部store例如（redux，Zustand）
2. 订阅浏览器API例如（online,storage，ocation）等
3. 抽离逻辑，编写自定义hooks
4. 服务端道染支持

- subscribe：用来订阅数据源的变化，接收一个返回值回调函数用于取消订阅。
- getSnapshot：获取当前数据源的快照（当前状态）。
- getServerSnapshot?：在服务器端染时用来获取数据源的快照。
返回值：该res的当前快照，可以在渲染逻辑中使用
```jsx
const res=useSyncExternalStore(subscribe,getSnapshot,getServerSnapshot?)
```

## useTransition
useTransition是React18中引l入的一个Hook，用于管理UI中的过渡状态，特别是在处理长
时间运行的状态更新时。它允许你将某些更新标记为”过渡”状态，这样React可以优先处理更重要的更新，比如用户输入，同时延迟处理过渡更新。

- isPending（boolean）是否存在待处理的transition。
- startTransition（function）使用此函数将状态更新标记为transition。
```jsx
const [isPending,startTransition]=useTransition()
```

## useDeferredValue

用于延迟某些状态的更新，直到主染任务完成。这对于高频更新的内容（如输入框、滚动等）非常有用，可以让UI更加流畅，避免由于频繁更新而导致的性能问题。

**useTransition和useDeferredValue的区别：**
useTransition和useDeferredvalue都涉及延迟更新，但它们关注的重点和用途略有不同：
- useTransition主要关注点是状态的过渡。它允许开发者控制某个更新的延迟更新，还提供了过渡标识，让开发者能够添加过渡反馈。
- useDeferredValue主要关注点是单个值的延迟更新。它允许你把特定状态的更新标记为低优先级。

- value：延迟更新的值（支持任意类型）
- deferredValue：延迟更新的值，在初始渲染期间，返回的延迟值将与您提供的值相同
```jsx
const defferedValue=useDefferedValue()
```

## 自定义hook函数
hook函数就是use开头的一系列函数，用户也可以自己封装重复的逻辑为一个hook函数
类似于vue的自定义指令，但react中更贴近于自己封装函数

原本实现一个按钮点击控制
```tsx
function App(){
	const [value,setValue]=useState(true)
	const toogle=()=> setValue(!value)
	return(
		<button onClick={toggle}>{value && toggle}</button>
	)
}
```
封装自定义的toogle
```tsx
function useToogle(){
	const [value,setValue]=useState(true)
	const toogle=()=> setValue(!value)
	return(
		value,
		toggle
	)
}

function App(){
	const [value,toogle]=useToggle()
	return(
		<button onClick={toggle}>{value && toggle}</button>
	)
}
```

## 高阶组件
类似于vue中的mixin当我们发现某个操作逻辑，或者某个运算经常出现的时候，我们可以提取为高阶组件

- 组件：既包含了ui界面的复用，也包含了逻辑的复用
- 高阶组件：只是复用操作逻辑，运算

