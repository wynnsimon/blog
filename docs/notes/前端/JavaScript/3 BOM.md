---
title: 3 BOM
createTime: 2025/04/17 09:01:26
permalink: /front/js/3/
---
# BOM
Browser Object Model浏览器对象模型，允许JavaScript与浏览器对话，JavaScript将浏览器的各个组成部分封装为对象。

### 组成
- Window：浏览器窗口对象
所有html作用的区域就是浏览器窗口对象
- Navigator:浏览器对象
整个浏览器中的所有内容
- Screen:屏幕对象
- History：历史记录对象
前进或后退刷新历史记录等属于
- Location：地址栏对象
输入地址的框

#### Window
使用window类名调用

其中window对象是默认加载进去的,所以在调用window对象时可以省略window类名
如alert直接使用

函数:
- alert()：显示带有一段消息和一个确认按钮的警告框。
- confirm():：显示带有一段消息以及确认按钮和取消按钮的对话框。
- setlnterval():按照指定的周期（以毫秒计）来调用函数或计算表达式。传入的是一个函数
- setTimeout():1在指定的毫秒数后调用函数或计算表达式。传入的是一个函数

#### Location
属于Window对象中
使用window.location获取，其中window.可以省略。

属性:
- href : 设置或返回完整的url

window对象是一个全局对象，也可以说是JavaScript中的顶级对象
所有通过var定义在全局作用域中的变量、函数都会变成window对象的属性和方法
window对象下的属性和方法调用的时候可以省略window

# 定时器-延时函数
仅仅只执行一次，

**设置延时函数**
```js
setTimeout(回调函数,等待的毫秒数)
```


**清除延时函数**
```js
let timer= setTimeout(回调函数,等待的毫秒数)
clearTimeout(timer)
```

延时器需要等待，所以后面的代码先执行
每一次调用延时器都会产生一个新的延时器

# js执行机制

```js
console.log(1111)
setTimeout(function(){
	console.1og(2222)
},1000)
console.log(3333)

console.log(1111)
setTimeout(function(){
	console.1og(2222)
}, 0)
console.1og(3333)
```
以上两段代码执行结果都是一样的,即1111,2222,3333

JavaScript语言的一大特点就是单线程，也就是说，同一个时间只能做一件事。
这是因为Javascript这门脚本语言诞生的使命所致一一JavaScript是为处理页面中用户的交互，以及操作DOM 而诞生的。比如我们对某个DOM元素进行添加和删除操作，不能同时进行。应该先进行添加，之后再删除。
单线程就意味着，所有任务需要排队，前一个任务结束，才会执行后一个任务。这样所导致的问题是：如果JS执行的时间过长，这样就会造成页面的渲染不连贯，导致页面渲染加载阻塞的感觉。

为了解决这个问题，利用多核CPU的计算能力，HTML5提出WebWorker标准，允许JavaScript脚本创建多个线程。于是，JS中出现了同步和异步。

**因此js的执行过程是这样的:**
1. 先执行执行栈中的同步任务。
2. 异步任务放入任务队列中。
3. 一旦执行栈中的所有同步任务执行完毕，系统就会按次序读取任务队列中的异步任务，于是被读取的异步任务结束等待状态，进入执行栈，开始执行。

js本质还是单线程的,只不过遇到了异步任务先把它交给浏览器,由浏览器控制(浏览器是可以异步的),跳过异步任务先执行完同步任务后再执行异步任务

由于主线程不断的重复获得任务、执行任务、再获取任务、再执行，所以这种机制被称为事件循环（eventloop）。

# location
location的数据类型是对象，它拆分并保存了URL地址的各个组成部分

### href
href属性获取完整的URL地址，对其赋值时用于地址的跳转

```js
location.href='http://www.baidu.com'
```
执行到这段代码立即跳转

### hash
hash属性获取地址中的哈希值，符号#后面部分
```js
console.log(location.hash)
```


后期vue路由的铺垫，经常用于不刷新页面，显示不同页面

### 常用属性和方法
reload方法用来刷新当前页面，传入参数true时表示强制刷新

# navigator
navigator的数据类型是对象，该对象下记录了浏览器自身的相关信息

常用属性和方法：
通过userAgent检测浏览器的版本及平台
```js
//检测userAgent（浏览器信息）
!(function (){
	constuserAgent=navigator.userAgent
	
	//验证是否为Android或iPhone
	const android =userAgent.match(/(Android);?[¥s¥/]+([￥d.]+)?/)
	const iphone = userAgent.match(/(iPhone#sOS)¥s([￥d_]+)/)
	
	//如果是Android或iPhone，，则跳转至移动站点
	if (android Il iphone) {
		location.href ='http://m.itcast.cn'
	}
})()
```

### histroy
记录了浏览历史,有多个方法可进行操作
```js
history.back()//后退
history.go(-1)//后退
```

# 本地存储
随着互联网的快速发展，基于网页的应用越来越普遍，同时也变的越来越复杂，为了满足各种各样的需求，会经常性在本地存储大量的数据，HTML5规范提出了相关解决方案。

1. 数据存储在用户浏览器中
2. 设置、读取方便、甚至页面刷新不丢失数据
3. 容量较大，sessionStorage和localStorage约5M左右

## 本地存储分类

### localStorage
可以将数据永久存储在本地（用户的电脑），除非手动删除，否则关闭页面也会存在

可以多窗口（页面）共享（同一浏览器可以共享）
以键值对的形式存储使用

存储后是按域名分类的,不同域名之间无法获取对方的数据

**存储一个键值对的数据**
```js
localStorage.setItem('键','值')
```

**读取数据**
```js
localStorage.getItem('键')
```

**删除数据**
```js
localStorage.removeltem('键')
```

#### 存储复杂数据类型
调用json中的方法将复杂数据类型转换成JSON字符串，再存储到本地
```js
JSON.stringify(复杂数据类型)
```

在取出数据时还需要使用json中的parse函数将json字符串转换为对象

# 数组操作

## map()
map可以遍历数组时处理数据，并且返回处理后的新的数组

使用map时需要传入一个回调函数,回调函数的第一个参数表示当前元素,第二个参数是当前索引,返回值是修改后要存到新数组里当前位置的值
```js
const arr =['red','blue','green']
const newArr = arr.map(function (ele,index) {
	console.log(eLe)//数组元素
	console.log(index)//数组索引号
	return ele+'颜色'
})
console.log(newArr)    //['red颜色','blue颜色','green颜色'］
```

## join()
用于把数组中的所有元素转换一个字符串
参数为一个字符串表示拼接数组中的元素时用什么分隔
```js
const arr =['red颜色','blue颜色','green颜色']
console.log(arr.join(''))    // red颜色bLue颜色green颜色
```

通常使用这两个函数对数据进行渲染为带html标签的字符串然后再添加到页面中

# requestAnimationFrame
请求动画帧，它是一个浏览器的宏任务。是浏览器用于定时循环操作的一个API,通常用于动画和游戏开发。它会把每一帧中的所有DOM操作集中起来,在重绘之前一次性更新,并且关联到浏览器的重绘操作。
是window全局对象上的一个函数

做动画最优的方案是css动画，但是某些特定场景下，css动画无法实现我们所需要的需求。这时，我们就要考虑使用`js`去做动画了，canvas动画的本质是定时器动画，会存在动画抖动的问题

它可以自动获取设备的刷新率，跟随物理帧更新来执行动画

**js动画的缺陷**
对于60hz刷新率的屏幕来说只需要每隔1000毫秒的60分之一（60HZ）即约为17毫秒，进行一次动画操作即可流畅地显示整个动画
但是定时器的回调函数，会受到js的事件队列宏任务、微任务影响，计时器设置的延时并不会被精确地调用，如果动画更新超过屏幕刷新的时间比如17毫秒，就只能等待下一帧屏幕刷新时才会显示出来，这样观感上就是在某一帧丢失了动画造成动画卡顿的现象

**为什么requestAnimationFrame不会卡顿**
1. 它通过系统时间间隔来调用回调函数，无需担心系统负载和阻塞问题，系统会自动调整回调频率。
2. 回调会在一个高优先级的线程中被同步执行
3. 由浏览器内部进行调度和优化，性能更高，消耗的CPU和GPU资源更少。
4. 自动合并多个回调，避免不必要的开销。
5. 与浏览器的刷新同步，不会在浏览器页面不可见时执行回调。

但是也不能在requestAnimationFrame执行耗时过长的计算，如果回调函数中有大量计算，依旧会导致线程被阻塞从而引起页面卡顿。

**使用**
requestAnimationFrame调用一次只会执行一次，要让动画播放需要回调执行
```js
const animation = () => { 
	// 执行动画
	requestAnimationFrame(animation);
}
requestAnimationFrame(animation);
```

# requestIdleCallback
在网页中，有许多耗时但是却又不能那么紧要的任务。它们和紧要的任务，比如对用户的输入作出及时响应的之类的任务，它们共享事件队列。如果两者发生冲突，用户体验会很糟糕。
可以使用setTimout，对这些任务进行延迟处理。但是我们并不知道，setTimeout在执行回调时，是否是浏览器空闲的时候。

而requestIdleCallback会在帧结束时并且有空闲时间。或者用户不与网页交互时，执行回调。
- callback:当callback被调用时，回接受一个参数 deadline，deadline是一个对象，对象上有两个属性
	timeRemaining：函数，函数的返回值表示当前空闲时间还剩下多少时间
	didTimeout：布尔值，如果didTimeout是true，那么表示本次callback的执行是因为超时的原因
- options是一个对象，可以用来配置超时时间
```js
requestIdleCallback((deadline) => {
	// deadline.timeRemaining() 返回当前空闲时间的剩余时间
	if (deadline.timeRemaining() > 0) {
		 task()
	}
}, { timeout: 500 })
```
  如果指定了timeout，但是浏览器没有在timeout指定的时间内，执行callback。在下次空闲时间时，callback会强制执行。并且callback的参数，deadline.didTimeout等于true, deadline.timeRemaining()返回0。

# Proxy

构造函数接受两个参数
- 参数一：要代理的对象
- 参数二：代理的配置，常用的时get和set，get在属性被读取时触发，set在属性修改时触发
		target：操作的数据对象
		property：操作的属性名
		receiver：当前的proxy实例
		value：要更改的值，set函数中才有的参数
	
```js
const obj = {
	name:'tom',
	age:18
}
const p=new Proxy(obj,{
	get(target,property,receiver){
		return obj[property]
	},
	set(target,property,value,receiver){
		obj[property]=value
	}
})
```

# Reflect
Reflect 是一个内置对象，提供了一系列操作对象的方法，这些方法都是静态的（类似 Math），使用 Reflect 的方法可以做一些对象的基本操作。

反射是**在程序运行中获取和动态操作自身内容**的一项技术。其实对于 JavaScript 来说在出现 Reflect 之前就已经有反射的能力了，我们可以使用 `Object.keys` 获取对象属性，可以使用 `Object.defineProperty` 定义属性，这些实际上都是反射的能力。既然已经可以实现反射功能，那为什么还需要有 Reflect 呢？

**为什么要有反射**
1. 将`Object`对象的一些明显属于语言内部的操作（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些操作同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。也就是说，从`Reflect`对象上可以拿到语言内部的方法。

2. 修改某些`Object`函数的返回结果，让其变得更合理。比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。
3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。
4. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

有了`Reflect`对象以后，很多操作会更易读。

在ES6之前, Javascript一直没有统一的namespace来管理对其他object的操作 比如我们可能使用`Object.keys(car)`获取`car`这个对象的所有属性 但我们会用`property in car`这种形式判断某个属性是否存在于`car`。 这导致了代码上的割裂，反射就提供了一套统一的api用于操作对象

**Reflect 上面的方法：**
- Reflect.apply(target, thisArg, args)
- Reflect.construct(target, args)
- Reflect.get(target, name, receiver)
- Reflect.set(target, name, value, receiver)
- Reflect.defineProperty(target, name, desc)
- Reflect.deleteProperty(target, name)
- Reflect.has(target, name)
- Reflect.ownKeys(target)
- Reflect.isExtensible(target)
- Reflect.preventExtensions(target)
- Reflect.getOwnPropertyDescriptor(target, name)
- Reflect.getPrototypeOf(target)
- Reflect.setPrototypeOf(target, prototype)

  
**Reflect其优势在于:**
1. 函数化所有对象操作
2. 更丰富的返回值
3. 更统一的命名
4. 对于`function apply`更可靠的的支持 - `Reflect.apply(f, obj, args)`
5. 更好的控制this-binding
    - `Reflect.set()`
    - `Reflect.get()`
6. 与`Proxy`里的操作一一对应

# 作用域
作用域，就是变量的“可见范围”。在某个作用域内声明的变量，只能在该作用域及其子作用域中访问和修改。作用域的存在，保证了变量不会被随意访问和修改，提升了代码的安全性和可维护性。

### 1. 全局作用域
在任何函数体外声明的变量，属于全局作用域。全局变量可以在任意地方访问和修改。

### 2. 函数作用域
在函数内部用声明的变量，只能在该函数内部访问，外部无法访问。

### 3. 块级作用域
ES6 引入了 `let` 和 `const`，使得 JavaScript 拥有了块级作用域。用 `let` 或 `const` 在 `{}` 内声明的变量，只在该块内有效。

## 作用域的查找规则
JavaScript 采用“词法作用域”，也叫“静态作用域”。变量的作用域在代码编写阶段就已经确定，而不是在运行时动态决定。

查找规则如下：

1. 先在当前作用域查找变量；
2. 如果找不到，就去上一级作用域查找；
3. 一直查找到全局作用域为止；
4. 只能从内到外查找，不能反向查找。

## 作用域的“欺骗”——with 和 eval
JavaScript 中有两个特殊语法可以“欺骗”词法作用域：

### 1. with
`with` 语句可以将一个对象的属性临时添加到作用域链的前端。这样在 `with` 代码块中访问变量时，会优先查找该对象的属性。

```js
var obj = { a: 1 };
with (obj) {
  a = 2;
  b = 3;
}
console.log(obj.a); // 2
console.log(window.b); // 3（b 被添加到全局作用域）
```
当 `with` 修改对象不存在的属性时，会在全局作用域中创建新属性，容易引发 bug，因此不推荐使用。

### 2. eval
`eval` 可以将字符串当作代码执行，并将其中的变量强行添加到当前作用域。
```js
var e = 5;
eval('var e = 6;');
console.log(e); // 6
```

滥用 `eval` 会导致作用域混乱，降低代码安全性和性能，实际开发中应尽量避免。







