---
title: 6 WebWorker
createTime: 2025/06/18 21:11:40
permalink: /front/js/6/
---

![](attachments/Pasted%20image%2020250927164017.png)
允许在浏览器中运行**后台线程**（即“工作线程”），用于执行**耗时的 JavaScript 任务**，而不会阻塞主线程（也就是 UI 线程）
它提供给了js伪多线程的能力，除此之外，它还具有自己的上下文（`DedicatedWorkerGlobalScope` 或 `SharedWorkerGlobalScope`），与主线程隔离。通过 `postMessage()` 和 `onmessage` 事件进行**消息传递**（结构化克隆算法）来与主线程或其他 Workers 通信。

适合cpu密集型，非ui相关的任务
通常用于以下场景：
- 大量计算
- 长时间运行的任务
- 轮询或定时任务
- 游戏逻辑
- 离线数据处理

**局限性：**
- 无法访问dom：DOM 操作不是线程安全的。如果多个线程同时修改 DOM，会导致不可预测的状态和渲染错误。
- 不能访问主线程中的变量和函数：Worker 运行在完全独立的 JavaScript 执行环境中，有自己的全局作用域
- 通信开销
- 调试困难
- 同源限制
- 不支持一些webapi

# WebWorker
专用工作线程

在浏览器中创建一个线程执行指定的js代码逻辑
```js
new Worker(path)
```
传入的js文件路径需要是线上的地址，线下的地址无法执行
通常是放在静态资源目录中

**缺点**
1. webworker不能使用本地文件，必须是网上的**同源文件**（其他源的不行）
2. webworker不能使用window上的dom操作，也不能获取dom对象，dom相关的东西只有主线程有。只能做一些计算相关的操作
3. 有的东西是无法通过主线程传递个子线程的，比如方法，dom节点，一些对象里的特殊设置（freeze，getter，setter这些，所以 vue的响应式对象是不能传递的)
4. 模块的引入问题

当前创建worker对象的线程为主线程，worker执行的任务为子线程，子线程和主线程执行是可以通信的

在子线程中有一个self对象，它和this类似，但它的指向永远不会改变，指向的都是本子线程

1. 主线程创建Worker并监听消息
```js
let worker=new Worker('http://localhost:3000/assets/worker')
worker.addEventListener('message',(e)=>{
	console.log(e)
})
```

2. 子线程发送消息
```js
self.postMessage(2)
```


> [!NOTE] Title
> 1. 子线程和主线程都可以监听和发送消息
> 2. 发送消息只能发送基本数据类型
> 3. 要引入模块需要使用impoertScripts()函数，传入的地址是线上的js文件地址，这个文件可以不是同源文件（为了能够使用其他的库）
> 4. 如果要执行的子线程文件使用了es6的默认导出，需要在创建worker时添加额外的type参数知名module

### 应用

因为webworker的限制，就别想着多线程渲染dom了。因为他根本无法创建dom，所以vue和
react框架没有考虑webworker，webworker的常见主要就是耗时的计算
1. 随着webgl，canvas等能力的加入，web前端有越来越多的可视化操作。比如在线滤镜，在线绘图，web游戏等等。这些东西都是非常消耗计算的
2. 一些后台管理系统也会涉及到一些，最常见的就是一些电子表单。大量的数据大量的计算，比如10万条数据导出为excel表格

# SharedWorker
共享工作线程
和webworker很像用法也相似，但有些许不同
创建的多个sharedworker指向的是同一个脚本，那么它们就会复用同一个worker，也同一个线程，区分它们使用的port（不是端口，翻译为句柄比较合适）
port用于区分同一个SharedWorker中的任务，同一个sharedworker中的port任务是串行执行的
指向同一个脚本的SharedWorker创建几次这个SharedWorker就会有几个port，每个port对应着执行一次指向脚本的任务
在不同的标签页中创建SharedWorker只要指向的脚本文件相同，用的也都是同一个worker（线程）


sharedworker监听和发送事件都是基于port
```js
let worker=new SharedWorker('./share.js')
worker.port.ppostMessage(40)
worker.port.onmessage=(event)=>{}
```

share.js中
```js
self.onconnect=(event)=>{
	let port=event.port[0]
	port.onmessage=(e)=>{
		port.posetMessage(res)
	}
}
```

# ServiceWorker
服务工作线程
与其他两个worker不同，ServiceWorker在页面创建之后它的生命周期就和当前页面没有关系了
serviceworker会作为浏览器的一个常驻线程一直运行，即使创建它的页面关闭了也不会停止

注册不是使用new class注册
监听声明周期使用addEventListener函数监听
```js
const registration=await navigation.serviceWorker.register('./service-worker.js')
self.addEventListener('install',(e)=>{})
```

### 生命周期

1. install
ServiceWorker在第一次注册的时候会触发
此后会作为浏览器的常驻后台线程

2. activate
新打开一个页面时会触发
相同的js文件在相同域，之后注册不会再install而是只触发activate

3. fetch
发送ajax的fetch请求时会触发
可以做fetch的拦截

4. message
和之前的worker一样是和主线程通信的

# 结构化克隆
在WebWorker与主线程通信时发送的数据是结构化克隆，深拷贝的效果，但是C++底层实现的。所以发送数据应避免发送过大的数据

### 可转移对象（Transferable Objects）

如果必须传递大数据，推荐使用 Transferable Objects（可转移对象，如 `ArrayBuffer`、`MessagePort`、`ImageBitmap`），它可以在 `postMessage` 时通过 `转移（transfer）`而非复制来传输。这样可以 **零拷贝**，避免大的开销。

常见的可转移对象有：
- ArrayBuffer
- MessagePort
- ImageBitmap

特点：
- 零拷贝：数据的所有权直接转移到 Worker
- 避免 GC 压力：主线程的 buffer 立即失效，不再占内存
- 高效：非常适合传输二进制数据（例如音视频流、图片、typed array）


但是，如果要传输给 **Web Worker** 的数据本身不是 **可转移对象**，这个时候我们就需要将这些数据编码为 `ArrayBuffer`，然后在**Web Worker** 对 `ArrayBuffer` 的数据进行解码。
而在某些场景下编码和解码的成本比结构化克隆的成本更高

