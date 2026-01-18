
# useEffect闭包陷阱
当useEffect只在挂载时执行依次时，并在其中设置回调函数获取state的值就又可能导致闭包陷阱

```jsx
const App=()=>{
	const [val,setVal]=useState('0')
	const btnRef=useRef()
	
	useEffect(()=>{
		const handleClick=()=>{
			console.log(val)
		}
		btnRef.current.addEventListener('click',handleClick)
		return ()=>{
			btnRef.current.removeEventListener('click',handleClick)
		}
	},[])
	
	return <>
		<input value={val} onChange={(e)=>setVal(e.target.value)}/>
		<button ref={btnRef}/>
	</>
}
```
当不管如何输入，点击按钮打印出的val都是初始值0

> [!NOTE] React理念
> 应该把每次更新或者渲染当作快照来看，每张快照的里面的数据已经确定了。

这是因为useEffect内引用的是当次渲染时state值的快照，而因为仅在组件挂载时设置依次回调函数，当useEffect执行完后他作用域中的回调函数依旧被dom绑定所使用着














