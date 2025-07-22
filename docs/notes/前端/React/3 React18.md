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

使用useState绑定一个变量会返回一个对象，这个对象包含对该变量的setter和getter（本身）
```tsx
const [count,setCount]=useState(0)
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
- 高阶组件：只是复用操作逻辑，，运算