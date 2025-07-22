---
title: electron
createTime: 2025/04/06 15:26:32
permalink: /front/electron/
---
在electron中分为主进程和渲染进程

- 主进程：主进程运行在node.js上，可以执行node.js中的库等以及可以调用electron api
- 渲染进程：渲染进程相当于运行在浏览器中，不能执行node.js中的库，可以执行vue，es6等
- 预加载脚本：主进程和渲染进程之间沟通的桥梁，可以执行一部分node和electron的api，也可以操控dom

所以在electron中很多功能都需要进程与进程间的通信

主进程的控制台输出是在系统的控制台上
渲染进程的控制台输出是electron中的

##  各进程的职责
**主进程：**
- Electron运行package.json的main脚本的进程被称为主进程
- 每个应用只有一个主进程
- 管理原生GUl，典型的窗口（BrowserWindcw、Tray、Dock、Menu）
- 创建渲染进程
- 控制应用生命周期（app）

**渲染进程：**
- 展示Web页面的进程称为渲染进程
- 通过Node.js、Electron提供的API可以跟系统底层打交道
- 个Electron应用可以有多个渲染进程

## 各进程所能使用的模块
![](attachments/Pasted image 20250406111822.png)

# 主进程
每个 Electron 应用都有一个单一的主进程，作为应用程序的入口点。 主进程在 Node.js 环境中运行，这意味着它具有 `require` 模块和使用所有 Node.js API 的能力。

# 渲染进程
每个 Electron 应用都会为每个打开的 `BrowserWindow` ( 与每个网页嵌入 ) 生成一个单独的渲染器进程。渲染器负责 _渲染_ 网页内容。 所以实际上，运行于渲染器进程中的代码是须遵照网页标准的

渲染器无权直接访问 `require` 或其他 Node.js API。

因为预加载脚本与浏览器共享同一个全局 [`Window`](https://developer.mozilla.org/en-US/docs/Web/API/Window) 接口，并且可以访问 Node.js API，所以它通过在全局 `window` 中暴露任意 API 来增强渲染器，以便网页内容使用。

# 预加载脚本
在创建窗口应用之前可以预先加载js脚本，这个脚本可以使用部分的node和electron模块的功能

预加载（preload）脚本包含了那些执行于渲染器进程中，且先于网页内容开始加载的代码 。 这些脚本虽运行于渲染器的环境中，却因能访问 Node.js API 而拥有了更多的权限。

BrowserWindow 的预加载脚本运行在具有 HTML DOM 和 Node.js、Electron API 的有限子集访问权限的环境中。
从 Electron 20 开始，预加载脚本默认 **沙盒化** ，不再拥有完整 Node.js 环境的访问权。 实际上，这意味着你只拥有一个 polyfilled 的 `require` 函数，这个函数只能访问一组有限的 API。

| api        | 可用模块                                                                                                                                                                                                                                                                                               |
| ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| electron   | 渲染进程模块                                                                                                                                                                                                                                                                                             |
| node       | [`events`](https://nodejs.org/api/events.html)、[`timers`](https://nodejs.org/api/timers.html)、[`url`](https://nodejs.org/api/url.html)                                                                                                                                                             |
| ployfilled | [`Buffer`](https://nodejs.org/api/buffer.html), [`process`](https://www.electronjs.org/zh/docs/latest/api/process), [`clearImmediate`](https://nodejs.org/api/timers.html#timers_clearimmediate_immediate), [`setImmediate`](https://nodejs.org/api/timers.html#timers_setimmediate_callback_args) |

## 使用node模块
在创建窗口时添加以下配置指明预加载文件的路径
有些模块默认不能使用，不过也可以更改配置让其能够使用
```js
  const mainWindow = new BrowserWindow({
    webPreferences:{
      preload: path.join(__dirname, '/src/preload.js'),
      nodeIntegration: true,
    }
  });
```

在预加载脚本中的环境和渲染进程类似，使用控制台输出是在electron中的控制台上
但是在预加载脚本中bom对象和渲染进程中的不同

预加载脚本是主进程和渲染进程之间沟通的桥梁

取消node模块限制后渲染进程中也可以使用node模块

## 沙盒模式
开启使用node模块功能等同于把沙河模式关闭
```js
webPreferences:{
	sandbox:false
}
```

## 进程隔离设置
默认情况下预加载脚本（渲染进程）和主进程是隔离的，通过webPreferences属性设置不隔离
```js
    webPreferences:{
		contextIsolation:false
    }
```
设置不隔离后就可以直接控制全局window对象了，无需使用api操作
```js
// contextBridge.exposeInMainWorld('api', {
// 	toMain:()=>{
// 		ipcRenderer.send('a')
// 	}
// });

window.api={
	toMain:()=>{
		ipcRenderer.send('a')
	}
}
```

## 远程调用模块
即使关闭了进程隔离在渲染进程中也是无法进行底层api或部分electron api的调用的
远程调用模块即在渲染进程中映射了一个具有electron api的对象，在渲染进程中可以使用它来调用本身不可访问的api，如创建窗口等
```js
enableRemoteModule: true
```

# 生命周期事件
- ready:app初始化完成
- dom-ready:一个窗口中的文本加载完成
- did-finsh-load:导航完成时触发
- window-all-closed:所有窗口都被关闭时触发
- before-quit:在关闭窗口之前触发
- will-quit:在窗口关闭并且应用退出时触发
- quit:当所有窗口被关闭时触发
- closed:当窗口关闭时触发，此时应删除窗口引用

beafore-quit、will-quit、quit只有在窗口调用`app.quit()`函数时才会触发
当监听window-all-closed事件后就不会调用这个函数了也就不会触发以上三个事件，要让以上三个事件正常执行需要在window-all-closed中手动调用quit函数
```js
app.on('window-all-closed',()=>{
	console.log('a')
	app.quit()
})
```

# 进程通信
在electron中有两个进程对象：
- ipcMain：主进程
- ipcRenderer：渲染进程

**进程通信的目的：**
1. 通知事件
2. 数据传输
3. 数据共享

### 数据共享

1. web技术（localStorage、sessionStorage、indexedDB）
2. 使用remote模块

## ipc模块通信

Electron提供了IPC通信模块，主进程的ipcMain和渲染进程的ipcRenderer
ipcMain、ipcRenderer都是EventEmitter对象

### 单工通信

#### 主进程和渲染进程事件监听
1. 在主进程设置监听事件
```js
ipcMain.on('a', () => {
  console.log('a..................')
})
```
2. 在渲染进程发送事件
```js
ipcRenderer.send('a');
```

**主进程向渲染进程发送消息**
因为主进程是唯一的，但渲染进程不唯一，因此在主进程发送消息时就不能使用`ipcRenderer`了
需要使用`webContents.send()`函数，用法和ipc模块发送消息是一样的
渲染进程需要先设置监听事件
```js
mainWindow.webContents.send('aaa')
```

#### 渲染进程之间通信
1. 通过主进程转发
2. electron5之后可以使用`ipcRenderer.sendTo`

#### 创建和使用全局对象
1. 创建全局
全局对象是创建在widow对象中的
```js
contextBridge.exposeInMainWorld('api', {
  name: 'tom'
});
```
2. 使用全局对象
```js
console.log(window.api)
```

### 双工通信

在双工通信的实现中既可以使用事件监听也可以使用全局对象

#### 获取到发送者对象并向其发送消息
1. 主进程设置监听事件
在主进程中设置监听事件a，并在回调函数中获取到事件对象，从中取出事件发送者并向其发送消息
```js
ipcMain.on('a', (event) => {
  BrowserWindow.fromWebContents(event.sender).send('msg','已收到消息a的通知')
})
```
2. 渲染进程
```js
ipcRenderer.send('a');

ipcRemderer.on('msg',(event,message)=>{
	console.log(message)
})
```

#### 使用invoke调用

1. 预加载脚本设置全局对象
在全局对象中添加全局函数，其中执行调用主进程中定义的事件
```js
contexBridge.exposeInMainWorld('api',{
	upload:()=>{
		ipcRender.invoke('selectFile')
	}
})
```
2. 主进程定义事件
主进程中定义被调用的事件
使用invoke调用的事件必须是handle定义的
```js
ipcMain.handle('selectFile',async (event)=>{
	const obj=await dialog.showOpenDialog({})
	console.log(obj)
})
```

==handle定义的事件返回的是一个promise对象，可以对其进行任何的promise操作==

3. 渲染进程在合适的时机发送事件
```js
window.api.upload()
```
