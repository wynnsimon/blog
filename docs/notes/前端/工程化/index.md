---
title: 1 Webpack
createTime: 2025/06/22 09:59:48
permalink: /front/engineering/
---
Webpack是一个静态资源打包工具。
它会以一个或多个文件作为打包的入口，将我们整个项目所有文件编译组合成一个或多个文件输出出去。
输出的文件就是编译好的文件，就可以在浏览器段运行了。
我们将Webpack输出的文件叫做bundle。

`webpack`命令用于打包项目

webpack是基于nodejs平台的，因此规范是CommonJS规范
## 模式

- 开发模式：仅能编译JS中的ESModule语法
- 生产模式：能编译JS中的ESModule语法，还能压缩JS代码

# 配置

**五大基础配置**
1. entry (入口)
指示Webpack从哪个文件开始打包
2. output （输出）
指示Webpack打包完的文件输出到哪里去，如何命名等
3. loader（加载器）
webpack本身只能处理js、json等资源，其他资源需要借助loader，Webpack才能解析
4. plugins (插件)
扩展Webpack的功能
5. mode (模式）
主要由两种模式：
- 开发模式：development
- 生产模式：production

## output

| 属性                  | 作用                       |
| ------------------- | ------------------------ |
| path                | 输出目录（从磁盘根目录开始）           |
| filename            | 入口文件输出文件名，也可以包含目录        |
| clean               | 是否清除输出目录中原有的文件           |
| chunkFilename       | 除入口文件的打包输出的其他文件命名        |
| assetModuleFilename | 图片，字体等通过asset处理的资源统一命名方式 |

## loader

| 属性     | 作用                                   |
| ------ | ------------------------------------ |
| test   | 设定正则的方式匹配要处理的文件                      |
| loader | 指定处理器（只能使用一个）                        |
| use    | 指定处理器（可以使用多个，以数组的方式），多个处理器按从后往前的顺序执行 |

### 图片处理

过去在Webpack4时，我们处理图片资源通过file-loader和url-loader进行处理
现在Webpack5已经将两个Loader功能内置到Webpack里了，我们只需要简单配置即可处理图片资源

在处理图片时通常将图片转换成base64格式传输（字符串形式）
优势就是就是减少请求数量减轻服务器压力
缺点是转换后体积会变大。图片体积越大增加的也越大，因此通常将小尺寸图片处理成base64

- asset：webpack自带的文件和url处理器，会根据dataUrlCondition转base64
- paser：解析配置
	- dataUrlCondition：该配置生效条件
	- maxSize：文件最大大小
	- genertaor：配置生成结果
		- filename：指定文件名，也可以同时在里面指定生成目录
```js
{
	test: /\.(jpe?g|png|gif|webp|svg)$/i,
	type:'asset',
    parser: {
        dataUrlCondition: {
	         maxSize: 10 * 1024, //10kb
        },
    },
},
```

#### 文字处理
文字处理不需要转base64因此使用asset下的resource
```js
{
	 test: /\.(ttf|woff2?|mp3|mp4)$/,
     type: "asset/resource",
     generator: {
        filename: "static/font/[hash:8][query][name].[ext]",
    },
},
```

音视频等不需要额外处理的资源也是通过asset下的resource处理

## plugins
插件需要先导入后再注册的，配置需要在注册时传入到注册的对象中

eslint需要使用插件引入eslint-webpack-plugin

处理html需要插件引入html-webpack-plugin


# 开发服务器
使用开发服务器可以实现自动化打包
**开发服务器是在内存中编译打包的，因此在磁盘中看不到打包的文件**

使用webpack-dev-server的npm库可以实现监视项目自动打包
需要在plugin中配置

```js
devServer：{
	host:'localhost', //启动服务器域名
	port:'3000', //启动服务器端口号
	open:true, //是否自动打开浏览器
	hot:true, //热替换
	devMiddleware: {
	    writeToDisk: true,
    }
}
```
接着执行`npx webpack server`就可以实现监听了

普通的打包重新打包是把所有内容都打包
开启热替换只重新打包更改部分的代码

热替换只对html和css生效
要js实现热替换需要配置
```js
if(module.hot){//判断是否支持热替换功能
	module.hot.accept('文件路径+文件名')//对指定js文件开启热替换
}
```

## 生产模式

### 打包单独的css文件
正常的打包会把css文件打包到js中，这样打包的结构就是浏览器解析js文件后会把里面的css代码插入到html中
如果在网速慢的情况下会出现闪屏的现象，即html加载完成后要等待浏览器解析完js后再插入css代码

可以使用mini-css-extract-plugin插件
这个插件是替代style-loader的
虽然是个插件，但是提供的是loader，需要在loader中配置，同时也需要在插件中注册
此插件中的loader与其他loader不同，它引入时不需要使用字符串的方式
```js
{
	test:/\.css$/,
	use:[MiniCssExtratPlugin.loader,"css-loader"]
}
```

### 兼容性处理
css中也是存在兼容性问题的
需要使用postcss-loader处理
postcss-loader在使用时需要放在less，sass等loader的后面，css-loader的前面
同时还需要进行配置
如果只在webpack的配置文件中配置也不会其效果，它是根据package.json中关于浏览器兼容配置来决定程度的

```js
{
	test:/\.less$/,
	use:[
		MiniCssExtractPlugin.loader,
		"css-loader",
		{
			loader:"postcss-loader",
			options:{
				postcssOptions:{
					plugins:[
						"postcss-preset-env",//能解决大多数样式兼容性问题
					]
				}
			}	
		},
		sass-loader",//将sass编译成css文件
	]
}

```

### css压缩
在生产环境中html和js代码都可以自动被压缩
但css压缩需要使用插件CssMinimizerPlugin

## SourceMap
源代码映射是一个用来生成源代码与构建后代码一一映射的文件的方案。

浏览器上运行的代码是构建后的代码，报错的位置是编译后的位置
使用源码映射可以将报错的地方显示在源代码中

它会生成一个xxx.ma文件，里面包含源代码和构建后代码每一行、每一列的映射关系。当构建后代码出错了，会通过xxx.map文件，从构建后代码出错位置找到映射后源代码出错位置，从而让浏览器提示源代码文件出错位置，帮助我们更快的找到错误根源。

源码映射有多种模式
通常
- 开发模式：cheap-module-source-map
	打包编译速度快，只包含行映射，没有列映射
- 生产模式：source-map
	包含行/列映射，打包速度更慢

在额外的devtool配置中

## loader优化

### oneOf
loader配置原理类似只有if，判断是否符合第一个loader后不管是否执行都会再判断后面的loader
将所有loader添加到oneof中，
每个文件只会执行oneof中的一个loader，处理后oneof后面的loader就不会再执行了

### include/exclude
排除或包含某文件/文件夹
这两个配置只能写一个

### 缓存
占时间的处理通常是js文件

**对bable开启缓存**
```js
options:{
	cacheDirectory:true, //开启缓存
	cacheCompression: false, //关闭缓存文件压缩
}
```

**对eslint开启缓存**
```js
cache:true, //开启缓存
cacheLocation:path.resolvbe(__dirname,'node_modules/') //缓存路径
```

## 多线程打包
当项目越来越庞大时，打包速度越来越慢，甚至于需要一个下午才能打包出来代码。这个速度是比较慢的。
我们想要继续提升打包速度，其实就是要提升js的打包速度，因为其他文件都比较少。
而对js文件处理主要就是eslint、babel、lerser三个工具，所以我们要提升它们的运行速度。
我们可以开启多进程同时处理js文件，这样速度就比之前的单进程打包更快了。

多线程loader处理需要在对应的loader后面添加thread-loader
```js
{
    test: /\.js$/ ,
    exclude: "/node_modules/",
    include: path.resolve(__dirname,"../src"),//只处理src下的文件,其他文件不处理
	use:[
		{
			loader："thread-loader"，//开启多进程
			options:{
				works:threads，// 进程数量
			}
		},
		{
			loader:"babel-loader",
			options:{
				// presets:["@babel/preset-env"],
				cacheDirectory：true，//开启babel缓存
				cacheCompression：false，//关闭缓存文件压缩
			}
		}
	]
}
```

## 图片压缩

image-minimizer-webpack-plugin插件进行压缩。压缩静态图片
此外还需要下载对应的无损压缩和有损压缩插件

## 代码分割
将打包生成的文件进行代码分割，生成多个js文件，谊染哪个页面就只加载某个js文件，这样加载的资源就少，速度就更快。
代码分割（CodeSplit）主要做了两件事：
1. 分割文件：将打包生成的文件进行分割，生成多个js文件。
2. 按需加载：需要哪个文件就加载哪个文件。

设置多个入口，打包时只会打包与入口有关的代码，也就实现了代码分割

多个分割块如果复用了公共代码，那么公共代码也会打包多份
可以配置公共代码只打包一份
## 按需加载

将页面暂时用不到的代码进行懒加载，将资源优先给页面当前用得上的资源加载

按需加载不是webpack中的，是在js中使用动态导入
如：按钮点击时动态加载
```js
btn.onClick+=()=>{
	import('./test')
	console.log('加载test模块')
}
```

### preload/prefetch
按需加载如果资源体积很大，那么用户会感觉到明显卡顿效果。

- Preload：告诉浏览器立即加载资源。
- Prefetch：告诉浏览器在空闲时才开始加载资源。

它们共同点：
都只会加载资源，并不执行。
都有缓存。

当前页面优先级高的资源用Preload加载
下一个页面需要使用的资源使用Prefetch加载

但兼容性比较差

但大多数实现都停止了维护，所以使用vue官方开发的（并不需要vue全部项目）

## NetworkCache
一个文件引入了另一个文件，在打包后它们命名会有所改变也就是哈希值命名变化哈希值变化，这样一个文件改变后他的哈希值命名也改变，引入它的文件中也要发生改变，这样会导致多个相互引用的文件都会发生改变，这些都要重新编译

使用runtimeChunk将文件名和文件哈希值名映射在一个文件中，当文件发生更改时它所映射的文件中的名字依旧不会更改

# core-js
bable也有一些内容无法处理，如：async，await，promise等
这样依旧会有兼容性问题

core-js是专门用来做ES6以及以上API的polyfill。

**手动引入**
core-js就是一个库，在需要的js文件中引入需要的模块即可

**自动引入**
在babel中有core-js的插件，可以在babel中配置core-js的自动引入

# pwa

渐进式网络应用程序(progressivewebapplication-PWA)：是一种可以提供类似于nativeapp(原生应用程序)体验的WebApp的技术。
其中最重要的是，在离线（offline)时应用程序能够继续运行功能。
内部通过ServiceWorkers技术实现的。

下载后需要在js文件中注册后才能使用
一般在main.js中注册，只注册一次即可

# loader
帮助webpack将不同类型的文件转换为webpack可识别的模块。

按执行顺序分类：
- pre:前置loader
- normal:普通loader
- inline：内联loader
- post:后置loader

执行顺序为pre>normal>inline>post
相同优先级的loader的执行顺序为从右到左，从下到上

定义loader的优先级使用enforce指定是哪个类型，如果不指定默认是normal

### 使用方式
1. 配置方式：在webpack.config.js文件中指定loader。（pre、normal、post loader)
2. 内联方式：在每个import语句中显式指定loader。（inlineloader)

**inline loader**
使用css-loader和style-loader处理styles.css文件
通过！将资源中的loader分开
```js
import Styles from'style-loader!css-loader?modules!./styles.css';
```

- ！跳过normal loader
- -！跳过pre和normal loader
- ！！ 跳过pre，normal，post loader


loader就是一个函数
当webpack解析资源时，会调用相应的loader去处理
loader接受到文件内容作为参数，返回内容出去
- content： 文件内容
- map： SourceMap
- meta： 给下一个loader传递的数据
```js
module.exports=function(content,map,meta){
	console.log(content)
	return content
}
```

#### 同步loader
普通声明的函数就是一个同步loader
```js
module.exports=function(content,map,meta){
	console.log(content)
	return context
}
```
使用callback调用的也是同步loader
比普通的在调用callback时多传入的第一个参数是err表示是否有错误
```js
module.exports=function(context,map,meta){
	this.callback(null,content,map,meta)
}
```
同步loader中不能执行异步操作
```js
module.exports=function(context,map,meta){
	console.log("test1")
	setTimeout(()=>{
		console.log("test1")
		this.callback(null,content,map,meta)
	},1000)
}
```
会报错

#### 异步loader
使用async调用的loader是异步loader
```js
module.exports=function(context,map,meta){
	const callback=this.async()
	setTimeout(()=>{
		console.log("test1")
		this.callback(null,content,map,meta)
	},1000)
}
```

#### raw loader
raw loader接收到的是buffer数据（二进制）
要使用raw loader只需要将函数的raw指定出来即可
```js
module.exports=function(content){
	console.log(content) //二进制数据
	return content
}
module.exports.raw=true
```
raw loader用于处理文件如图片等

#### pitch loader
pitch loader会抢占执行，多个pitch loader如果不返回结果会先将pitch loader执行完才会执行其他loader
但pitch loader有熔断机制，如果一个pitch loader有返回值那么它后面的pitch loader都不会执行了，直接开始执行其他loader（其他类型的loader不受熔断影响）
```js
module.exports.pitch=function(){
	console.log("test1")
}
```

### api

| 函数                      | 作用                            | 用法                                             |
| ----------------------- | ----------------------------- | ---------------------------------------------- |
| this.async              | 异步回调loader。返回this.callback    | const callback = this.async0                   |
| this.callback           | 可以同步或者异步调用的并返回多个结果的函数         | this.callback(err, content, sourceMap?, meta?) |
| this.getOptions(schema) | 获取loader的options，需要对schema写规则 | this.getOptions(schema)                        |
| this.emitFile           | 产生一个文件                        | this.emitFile(name, content, sourceMap)        |
| this.utils.contextify   | 返回一个相对路径                      | this.utils.contextify(context, request)        |
| this.utils.absolutify   | 返回一个绝对路径                      | this.utils.absolutify(context, request)        |

# plugin
通过插件我们可以扩展webpack，加入自定义的构建行为，使webpack可以执行更广泛的任务，拥有更强的构建能力。

站在代码逻辑的角度就是：webpack在编译代码过程中，会触发一系列Tapable钩子事件，插件所做的，就是找到相应的钩子，往上面挂上自己的任务，也就是注册事件，这样，当webpack构建的时候，插件注册的事件就会随着钩子的触发而执行了。

Tapable为webpack提供了统一的插件接口（钩子）类型定义，它是webpack的核心功能库。webpack中目前有十种hooks，在Tapable源码中可以看到

Tapable还统一暴露了三个方法给插件，用于注入不同类型的自定义构建行为：
- tap：可以注册同步钩子和异步钩子。
- tapAsync：回调方式注册异步钩子。
- tapPromise：Promise方式注册异步钩子。

## 构建对象
### Compiler
compiler对象中保存着完整的Webpack环境配置，每次启动webpack构建时它都是一个独一无二，仅仅会创建一次的对象。
这个对象会在首次启动Webpack时创建，我们可以通过compiler对象上访问到Webapck的主环境配置，比如loader、plugin等等配置信息。

它有以下主要属性：
- compiler.optiors可以访问本次启动webpack时候所有的配置文件，包括但不限于loaders、entry、output、plugin等等完整配置信息。
- compiler.inputFileSystem和compiler.outputFilesystem可以进行文件操作，相当于Nodejs中fs。
- compiler.hooks可以注册tapable的不同种类Hook，从而可以在compiler生命周期中植入不同的逻辑。

Compilation
compilation对象代表一次资源的构建，compilation实例能够访问所有的模块和它们的依赖。
一个compilation对象会对构建依赖图中所有模块，进行编译。在编译阶段，模块会被加载（load）、封存（seal)、优化（optimize)、分块(chunk)、哈希(hash）和重新创建(restore)。

它有以下主要属性：
- compilation.modules可以访问所有模块，打包的每一个文件都是一个模块。
- compilation.chunkschunk即是多个modules组成而来的一个代码块。入口文件引l入的资源组成一个chunk，通过代码分割的模块又是另外的chunk。
- compilation.assets可以访问本次打包生成所有文件的结果。
- compilation.hooks可以注册tapable的不同种类Hook，用于在compilation编译模块阶段进行逻辑添加以及修改。

# commonjs和esmodel规范
- commonjs模块输出的是值的拷贝，es6模块输出的是值的引用
- commonjs模块是运行时加载，es6模块是编译时输出
- commonjs是单个值导出，es6可以导出多个
- CommonJS模块为同步加载，ES6Module支持异步加载
- CommonJS的 this 是当前模块，ES6 Module的 this 是undefined

# webpack原理


