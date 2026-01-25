# JS Bridge

js无法直接调用native API，需要特定的格式才能调用，这些格式就是js bridge

JSBridge 简单来讲，主要是给JavaScript提供调用 Native 功能的接口，让混合开发中的前端部分可以方便地使用地址位置、摄像头甚至支付等 Native 功能。

JSBridge 就像其名称中的 rBridge 的意义一样，是 Native 和非 Native 之间的桥梁，它的核心是构建Native 和非 Native 间消息通信的通道，而且是双向通信的通道。

双向通信的通道：
1. JS 向 Native 发送消息：调用相关功能、通知 Native 当前 JS 的相关状态等。
2. Native 向JS 发送消息：回溯调用结果、消息推送、通知 JS 当前 Native 的状态等。

js bridge的实现主要有两种方式：注入api和拦截url schema
这两种方式都是单向通信，要实现双向通信还需要在参数中给出js回调
在一端调用的时候在参数中加一个**callbackId**标记对应的回调，对端接收到调用请求后，进行实际操作，如果带有callbackId，对端再进行一次调用，将结果、callbackId回传回来，这端根据callbackId匹配相应的回调，将结果传入执行以此来实现双向通信。

## 注入api
js是运行在webview中的，而webview是由宿主环境（通常是app）构造的，这样宿主环境在构造webview时就可以在js的全局对象window上面挂载api，js通过访问全局对象window上面提供的这些api来调用原生api

这个过程会简单直观，不过有兼容性问题
## URL Schema
自定义协议
Native加载WebView之后，Web发送的所有请求都会经过WebView组件，所以Native可以重写WebView里的方法，来拦截Web发起的请求，我们对请求的格式进行判断：
- 如果符合我们自定义的URL Schema，对URL进行解析，拿到相关操作、操作，进而调用原生Native的方法
- 如果不符合我们自定义的URL Schema，我们直接转发，请求真正的服务

兼容性很好，但是由于是基于URL的方式，长度受到限制而且不太直观，数据格式有限制，而且建立请求有时间耗时。

如：微信sdk
```js
weixin://dl/scan
```
