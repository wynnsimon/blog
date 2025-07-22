---
title: 6 WebWorker
createTime: 2025/06/18 21:11:40
permalink: /front/js/6/
---
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
