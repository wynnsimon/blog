---
title: 7 ajax
createTime: 2025/06/22 10:01:26
permalink: /front/js/7/
---
Asynchronous JavaScript And XML，异步的JavaScript和XML

**AJAX的优点**
1. 可以无需刷新页面而与服务器端进行通信。
2. 允许根据用户事件来更新部分页面内容。

**AJAX的缺点**
1. 没有浏览历史，不能回退
2. 存在跨域问题(同源) 本域名中无法获取其他域名中的数据
3. SEO 不友好 页面源代码中没有ajax中的内容,也无法使用爬虫爬取


# XMLHttpRequest
XMLHttpRequest（XHR）对象用于与服务器交互。通过XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。XMLHttpRequest 在AJAX编程中被大量使用。

### 使用
1. 创建XMLHttpRequest对象
```js
const xhr=new XMLHttpRequest();
```

2. 配置请求方法和请求url地址
```js
xhr.open("请求方法","请求url网址");
```

3. 监听loadend事件,接收响应结果
```js
xhr.addEventListener("loadend",()=>{
	//处理响应结果
	console.log(xhr,response);
});
```

4. 发起请求
```js
xhr.send();
```

**传递参数**
在xhr中要传递参数需要使用原始的方法,在url后面使用&连接参数

也可以使用参数创建一个json对象,使用toString函数转换成连接参数的形式
使用URLSearchParams对象
```js
//1.创建URLSearchParams 对象
const paramsobj =new URLSearchParams({
参数名1:值1,
参数名2:值2
});

//2.生成指定格式查询参数字符串
const querystring =paramsobj.tostring()
//结果：参数名1=值1&参数名2=值2
```

**携带数据**
如果使用xhr请求时携带有数据,需要进行相应的设置
1. 声明该请求会携带数据
```js
//声明该请求携带数据为json类型
xhr.setRequestHeader("Content-Type","application/json");
```

2. 将携带的数据传入请求中一起发送
```js
const user={name:"itheima",pwd:"123456"};
xhr.send(JSON.stringify(user));
```

**超时设置**
可以对xhr的请求设置超时时间,如果超过指定的时间请求就取消
```js
xhr.timeout=2000;
```

超时回调
可以设置超时回调,当请求超过指定时间后就会调用函数中的代码
```js
xhr.ontimeout = function(){
	alert("请求超时");
}
```

**网络异常回调**
```js
xhr.onerror= function(){
}
```

### 取消请求
```js
xhr.abort()
```
可以取消ajax发出的指定xhr请求
# promise

Promise对象用于表示一个异步操作的最终完成（或失败）及其结果值。

一个Promise对象，必然处于以下几种状态之一
1. 待定(pending)：初始状态，既没有被兑现，也没有被拒绝
2. 已兑现（fulfilled）：意味着，操作成功完成
3. 已拒绝(rejected)：意味着，操作失败

当一个promise对象创建后为待定状态.调用时,如果调用成功会调用resolve函数并将标记为已兑现状态,当promise发现状态更改为已兑现时会将resolve中的值传递给then函数并调用.如果调用失败会调用reject函数并将 状态标记为已拒绝状态,当状态更改为已拒绝时会将reject中的值传递给catch函数并调用

创建Promise对象
```js
const p = new Promise((resolve,reject)=>{
	//成功调用：resolve（值）触发then()执行
	//失败调用：reject（值）触发catch()执行
});
```
在创建的promise中传入给resolve的值会被返回到它的then函数中,传入给reject的值会被返回给它的catch函数中

```js
const p = new Promise((resolve, reject) =>{
	setTimeout(() =>{
		//resolve("模拟AJAx请求-成功结果")
		reject(new Error(模拟AJAx请求-失败结果"))
	},2000)
});

//3．获取结果
p.then(result =>{
	console.log(result)
}).catch(error =>{
	console.log(error)
)
```

# 回调函数地狱
当有多个数据需要使用异步的方法获取数据时,其promise会在then函数内部循环嵌套回调函数,这样不方便进行异常捕获,且代码可读性也较低.
可以让promise中的then函数返回axios的请求对象,在外部接收这个对象后进行then函数调用,这样使用promise的链式调用解决回调函数地狱对问题

## async和await
async函数是使用async关键字声明的函数。async函数是AsyncFunction构造函数的实例，并且其中允许使用await 关键字。async 和 await 关键字让我们可以用一种更简洁的方式写出基于 Promise 的异步行为，而无需刻意地链式调用promise。
```js
async function getData(){
//2．await等待Promise对象成功的结果
	const pobj = await axios({url: 'http://hmajax.itheima.net/api/province'})
	const pname = pobj.data.list[0]
	const cobj = await axios({url: 'http://hmajax.itheima.net/api/city', params: { pname }})
	const cname = cobj.data.list[0]
	const aobj = await axios({url: 'http://hmajax.itheima.net/api/area', params: { pname, cname }})
	const areaName = aObj.data.list[0]
	
	document.querySelector('.province').innerHTML = pname
	document.querySelector('.city').innerHTML = cname
	document.querySelector(' .area').innerHTML = areaName
}
```
await可以取代then函数直接返回promise对象

这样就无法使用promise中的catch函数了,如果需要进行错误处理需要使用try catch语法 

## 事件循环
js是单线程的,当它执行时
从头到尾开始遍历代码,如果是同步任务则放入到函数调用栈中,然后再取出来执行,如果遇到的是异步任务会将该任务交给宿主环境(浏览器)执行,浏览器是异步的,浏览器执行完后会将执行完的异步任务放入到任务队列中,等js的函数调用栈空了之后会一直检查任务队列,如果任务队列中有任务就执行


## 宏任务与微任务
ES6之后引入了Promise对象，让JS引擎也可以发起异步任务
异步任务分为：
宏任务：由浏览器环境执行的异步代码
微任务：由JS引擎环境执行的异步代码

宏任务

| 任务（代码）                 | 执行所在环境 |
| ---------------------- | ------ |
| JS脚本执行事件（script）       | 浏览器    |
| setTimeout/setlnterval | 浏览器    |
| AJAX请求完成事件             | 浏览器    |
| 用户交互事件等                | 浏览器    |

微任务

| 任务（代码）           | 执行所在环境 |
| ---------------- | ------ |
| Promise对象.then() | JS 引擎  |
Promise本身是同步的，而then和catch回调函数是异步的

区分了宏任务和微任务后其事件循环中的任务队列也分为了宏任务队列和微任务队列,当js执行完函数调用栈后会优先查看微任务队列,因为微任务队列更接近js引擎

## promise.all静态方法
合并多个Promise对象，等待所有同时成功完成（或某一个失败），做后续逻辑

合并的新的promise对象中只有所有的promise都执行成功才调用then函数,当有一个执行失败合成的大的promise就会执行catch
传入参数是一个promise对象数组
```js
const p = Promise.all([promise对象,promise对象...])

p.then(result => {
	//result结果：[promise对象成功结果，Promise对象成功结果，...]
}).catch(error => {
	//第一个失败的Promise对象，抛出的异常
})
```

# 跨域问题

## 同源策略

同源策略(Same-OriginPolicy)最早由Netscape公司提出，是浏览器的一种安全策略。
同源：协议、域名、端口号必须完全相同。
违背同源策略就是跨域。

## 解决方案

### 插入script标签
js中的script标签是跨域的,当需要跨域请求时可以创建一个script标签并插入到当前文档中即可实现跨域需求

### CORS
CORS（Cross-Origin Resource Sharing），跨域资源共享。CORS 是官方的跨域解决方案，它的特点是不需要在客户端做任何特殊的操作，完全在服务器中进行处理，支持get和post 请求。跨域资源共享标准新增了一组HTTP首部字段，允许服务器声明哪些源站通过浏览器有权限访问哪些资源

CORS是通过设置一个响应头来告诉浏览器，该请求允许跨域，浏览器收到该响应以后就会对响应放行。

要设置cors需要在服务端设置请求头中的`Access-Control-Allow-Origin`的选项,并指定出允许跨域的范围,可以使用`*`允许所有也可以允许指定域名或端口等

Promise是一门新的技术(ES6规范)
Promise是JS中进行异步编程的新解决方案
备注：旧方案是单纯使用回调函数

**常见的异步编程**
 - fs文件操作
 - 数据库操作
 - ajax
 - 定时器

相比于旧的回调函数的方法
它支持链式调用，可以解决回调地狱问题

**对比**
1. 回调函数：必须在启动异步任务前指定
2. promise：启动异步任务=>返回promie对象=>给promise对象绑定回调函数(甚至可以在异步任务结束后指定/多个)

### promise对象实例化

promise对象实例化要传入一个被调用的函数，函数有两个参数：
- resolve解决：成功函数，告诉promise该任务执行成功，并将promise对象的状态设置为成功
- reject拒绝：失败函数，告诉promise该任务执行失败，并将promise对象的状态设置为失败
promise对象在执行完成后会调用其中的then函数，then函数接收两个参数：
- 参数一onResolve：成功的回调函数，接收的参数为promise对象中的结果
- 参数二onReject：失败的回调函数，接收的参数为promise对象中的结果
```js
const p =new Promise((resolve,reject)=>{
	if(条件){
		resolve()
	}else{
		reject()
	}
}).then(()=>{
	// 成功的回调
},()=>{
	// 失败的回调
})
```
then函数返回的对象也是一个promise对象

**catch函数**
promise中的catch函数是失败时调用，内部的实现原理是then的第二个回调

### promise类中的函数
以下函数是promise类中的静态函数，不是实例对象中的

| 函数              | 作用                                                                                                                                                      |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| resolve(value)  | 创建一个成功或失败的promise对象。用于快速获取一个promise对象。如果传入的参数是非promise的对象，则把该对象的内容设置在promise的结果中并返回一个成功的promise对象。如果传入的是一个promise对象，那么返回的promise对象成功或失败根据传入的promise参数决定 |
| reject(value)   | 创建一个失败的promise对象，将传入的参数设置在promise结果中，不会成功。即使传入的是一个成功的promise对象也是失败的                                                                                     |
| all(promises)   | promises：包含多个promise对象的数组，如果其中的所有promise对象都成功了则返回一个成功的promise对象，结果是数组中所有的（成功的）promise的结果。如果数组中有一个promise对象失败了则返回一个失败的promise，失败的结果是数组中失败的promise的结果     |
| race(promises)  | 传入一个包含多个promise对象的数组，返回的prmose由数组中第一个完成的promise决定（无论成功还是失败）                                                                                             |
| allSettled(Arr) | 参数：接受一个Promise的数组，返回一个新的Promise，当Promise.allSettled全部处理完成后返回一个数组我们可以拿到每个Promise的状态，而不管其是否处理成功                                                           |

### promise的状态
默认是pending状态
- 调用promise对象中的resolve函数后变为resolved状态
- 调用reject函数或抛出异常后变为rejected状态

指定then或catch回调是同步任务，如果promise中的函数是同步的那么先执行promise中的任务再==指定==回调（不执行），如果promise中的函数是异步的，那么先==指定==回调（不执行）后执行其中的异步任务

### then函数的返回结果
then函数返回的结果是一个promise对象，返回的promise对象的结果默认是由then的两个回调决定，但也有特殊清空
1. onResolve中抛出异常：返回的promise对象是失败的对象，结果是抛出的内容
2. onResolve中返回非promise对象：是成功的对象，结果为返回值
3. onReesolve中返回promise对象：成功，失败和结果都由返回的promise对象决定
4. onResolve中没有返回值：成功的对象，但结果为undefined

#### 错误穿透
当链式调用promise时，前面出了错误如果不做处理会一直传递到后面
如果中间有新的错误出现那么会覆盖前面的错误
```js
p.then(value =>{
	// console.log(111);
	throw '失败啦！';
}).then(value =>{
	console.1og(222);
}).then(value =>{
	console.1og(333);
}).catch(reason =>{
	console.warn(reason);
});
```

#### 中断promise链
在要中断的地方返回一个pending对象
```js
p.then(value =>{
	console.log(111);
}).then(value =>{
	console.1og(222);
	return new Promise(()=>{})
}).then(value =>{
	console.1og(333);
}).catch(reason =>{
	console.warn(reason);
});
```

# Axios

**使用包管理工具引入**
```js
npm install axios
```

**直接在网页代码中引入**
可以去[bootcdn](https://www.bootcdn.cn/)网站找国内的镜像

# 使用

```js
axios({
//请求选项
}).then(result => {
//处理数据
}).catch(error =>{
//处理错误
})
```
使用axios构建请求对象,then表示对请求结果的处理函数,catch是对错误的处理
如果请求成功会调用then中的函数执行,如果请求失败会调用catch中的函数执行


1. 直接配置axios
在一个按钮上添加事件监听
其中传入到axios中的参数method表示请求所用的方法,url是请求的目标地址,data是请求体,如果是get请求可以不加,then函数是一个回调函数参数表示返回的数据,在这个函数中定义对返回的数据进行的操作
```js
    btns[1].addEventListener('click', () => {
      axios({
        method: 'post',
        url: 'http://localhost:3000/posts',
        data:{
          title:"宽带铺满理塘县,人人抽上电子烟",
          author:"丁ay Chou"
        }
      }).then(res => {
        console.log(res);
      });
    });
```

2. 使用request函数
```js
    const btns = document.querySelectorAll('button');
    btns[0].addEventListener('click', () => {
      axios.request({
        method: 'get',
        url: 'http://localhost:3000/comments'
      }).then(res => {
        console.log(res);
      });
    });
```

3. 使用请求函数
如post
```js
    btns[1].onclick = function () {
      // axios()
      axios.post(
        'http://localhost:3000/comments',
        {
          "body": "喜大普奔",
          "postId": 2
        }).then(response => {
          console.log(response);
        });
```

## 使用
建议使用时先实例化一个对象,然后在其中做配置,配置好后在不同场景调用
interceptors是拦截器
- interceptors.request是请求拦截器,任何请求都要经过它
- interceptors.response是响应拦截器,任何响应都要经过它
使用use函数传入成功或失败时处理函数
```js
const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000
})

instance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

instance.interceptors.response.use(
  (response) => {
    return res
  },
  (error) => {
    return Promise.reject(error)
  }
)
```
axios在使用时会自动的将baseURL和url拼接

# json-server
json-server可以构建一个简单的服务器,用来返回要测试的数据

下载:
```shell
 npm install -g json-server
```

启动:
将当前目录中指定的json文件推送到服务器上
```shell
json-server --watch db.json
```

其中有多少条json数据就创建对应的路径,通过对应的路径可以访问这条数据

测试数据:
```json
{
  "posis": [
    {
      "id": 1,
      "title": "json-server",
      "author": "typicode"
    }
  ],
  "comments": [
    {
      "id": 1,
      "body": "some comment",
      "postId": 1
    }
  ],
  "profile": {
    "name": "typicode"
  }
}
```

接口路径:
```
http://localhost:3000/posis
http://localhost:3000/comments
http://localhost:3000/profile
```
