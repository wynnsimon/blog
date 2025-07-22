---
title: 3 vite
createTime: 2025/04/13 13:38:28
permalink: /front/engineering/3/
---
esmodule导入包时需要是`/`、`./`、`../`开头的，虽然走的流程依旧是查找node_modules文件夹下的模块，但却没有做自动检索node_modules的功能是因为es中导入操作是通过网络请求的，如果做了自动查找功能，那么浏览器在加载时就需要通过网络请求去node_modules检索第三方库，而且第三方库还可能导入了其他库因此会又循环检索依赖的问题，就会发送很多网络请求
而commonjs规范可以做自动检索node_modules功能的原因是nodejs是运行在服务端，它检索时不依靠网络请求，而是在本地磁盘检索

而使用vite打包项目vite是提供了自动检索node_modules的功能，他会自动进行处理

vite在处理的过程中如果看到的了有非相对或绝对路径的引用就会开启路径补全：`/node_modules/.vite/原路径`
找寻路径的过程是从当前目录开始依次向上查找，直到根目录或者找到对应的依赖项

vite是在node中运行的，可以使用es规范是因为vite在读取配置时会检测是es规范还是commonjs规范，如果是es规范会转成commonjs规范

### 开发和生产环境

#### 开发环境
每次依赖预构建所重新构建的相对路径都是正确的

许多依赖使用的规范是不同的，vite无法约束库的作者都使用同一种规范
首先vite会找到对应的依赖，然后调用esbuild（对js语法进行处理的一个库），将其他规范的代码转换成esmodule规范，然后放到当前目录下的`node_modules/.vite/deps`
他解决了3个问题：
1. 不同的第三方包会有不同的导出格式（这个是vite没法约束人家的事情）
2. 对路径的处理上可以直接使用.vite/deps，方便路径重写
3. 叫做网络多包传输的性能问题（也是原生esmodule规范不敢支持node_modules的原因之一）
vite在检测到导入导出包时会把引入的内容植入到当前文件，这样浏览器就检测不到要导包的操作了也就不需要处理了
```js
export default function a(){}
export {default as a} from './a.js'
//vite重写为
function a(){}
```

#### 生产环境
vite会全权交给一个叫做rollup的库去完成生产环境的打包

# 配置

不同环境下配置
将开发环境配置和生产环境配置放在不同的文件中，检测构建的命令来区别加载不同的配置

```js
import {defineConfig} from 'vite'
import viteBaseConfig form './vite.bace.config.js'
import viteDevConfig form './vite.development.config.js'
import viteProConfig form './vite.production.config.js'

const envResolver={
	"build":()=>{
		console.log('生产环境')
		return ({...viteBaseConfig,...viteProConfig})
	},
	"serve":()=>{
		console.log('开发环境')
		return ({...viteBaseConfig,...viteProConfig})
	}
}

export default defineConfig((command:'build'|'server')=>{
	retrun envResolver[command]()
})
```

使用函数接收defineConfig传入的参数，command是根据npm（或yarn、pnpm）等脚本命令获取的

- optimizeDeps：依赖预处理
	- exclude：排除的包，被排除的包将不会被vite进行依赖预处理而是直接使用默认方式

## 环境变量
vite内置了dotenv库，如果根目录有.env时会读取.env文件中的内容并注入到process中

也可以手动调用loadEnv函数加载不同的环境变量
```js
export default defineConfig((command:'build'|'server',mode:string)=>{
	loadEnv(mode,process.cwd,'')
	retrun envResolver[command]()
})
```
mode是defineConfig传入的一个参数，代表当前所处环境
手动调用loadEnv时，会先加载`.env`文件，其次会根据传入的mode的值进行拼接，格式为：`.env.[mode]`并根据第二个参数中提供的路径去查找该文件，如果有关于mode的配置文件那么最后得到的环境变量内容就是两个环境变量配置文件中的内容的并集

**但是在浏览器中直接运行的js代码中却无法获取到环境变量配置文件中的环境变量**
vite做了一个拦截，他为了防止我们将隐私性的变量直接送进`import.meta.env`中，所以他做了一层拦截，如果环境变量不是以`VITE`开头的，他就不会注入到客户端中去

解决方法：
1. 将环境变量命名以`VITE`开头
2. 在`vite.config.js`中配置`envPrefix`。自行设置以什么开头

## 内容解析

### css
1. vite在读取到main.js中引用到了Index.csS
2. 直接去使用fs模块去读取index.Css中文件内容
3. 直接创建一个style标签，将index.css中文件内容直接copy进style标签里
4. 将style标签插入到index.html的head中
5. 将该css文件中的内容直接替换为js脚本（方便热更新或者css模块化），同时设置Content-Type为js从而让浏览器以JS脚本的形式来执行该css后缀的文件

#### 样式冲突
要解决样式冲突需要使用css module，给要用到的css文件命名为`文件名.module.css`，这样在导入css样式后的css属性命名就会是`属性名_哈希值`的形式。且在使用时也不能像以前一样直接以字符串形式设置css属性
因为属性名已经是加上哈希值的形式了，所以只能像操作对象的方法添加css属性
```js
import componentACss from './componentA.module.css'
let div=document.createElement('div')
// div.classList.add('footer')不适用了
div.className=componentACss.footer
```

vite也支持less进行处理，操作方法和css一样，需要安装less预处理器
#### 原理
1. module.css（module是一种约定，表示需要开启css模块化）
2. 他会将你的所有类名进行一定规则的替换（将footer替换成_footer_i22st_1）
3. 同时创建一个映射对象{footer:"_footer_i22st_1"}
4. 将替换过后的内容塞进style标签里然后放入到head标签中（能够读到index.html的文件内容）
5. 将componentA.module.css内容进行全部抹除，替换成JS脚本
6. 将创建的映射对象在脚本中进行默认导出

#### 配置
对于css处理行为也可以在vite配置文件中进行配置
```js
css:{
	modules:{    //对css模块化的默认行为进行配置
		localsConvention:"camelCase",    //对处理生成的css属性类名配置驼峰命名
		scopeBehaviour:"local",    //配置当前模块化行为是局部还是全局（表示的是css属性是作用于全局还是局部，如果是局部则会进行模块化，全局表示css属性应用在全局不开启模块化）
		generateScopedName:"[name]_[local]_[hash:5]",    //生成的css属性名规则，也可以是函数形式，如果是函数形式，那么生成的命名规则根据返回值决定
		generateScopedName:(name,filename,css)=>{
		// name-> 代表此刻css文件中的类名
		// filename-> 当前css文件的绝对路径
		// css-> 当前样式
			return `${name}_${filename}_{css}`
		},
		hashPrefix:"hello",    //配置生成哈希前的字符串，配置的字符串将参与css属性类名哈希值的生成，可以使生成的哈希值出现哈希碰撞的概率更小
		globalModulePath:['./assets/css/component']    //表示不参与模块化生成css的路径
	},
	preprocessorOptions:{    //css（样式）系列的预处理配置（包括less，sass等）
		less:{    //配置less命令将less文件处理成css时的命令行参数
			math:"always",     //表示是否总是启用数学表达式，如果是always那么less中的数学表达式都会被运算，如果不启用less中只有在小括号内的数学表达式才被运算
			globalVars:{    //全局变量
				mainColor:"red",    //配置全局变量mainColor颜色为红色，这样所有的less文件使用时都不需要导入了（导入会有些性能影响）
			}
		},
		devSourcemap:true,    //开启源码映射
		postcss:{    //配置postcss
		
		}
	}
}
```
也可以不配置postcss，如果在项目根目录下有`postcss.config.js`文件的话即使不在vite中配置，vite也会自动找到并读取其中的配置
如果在vite中配置了postcss，那么它的优先级是比`postcss.config.js`文件高的

## 加载静态资源
json配置也是静态资源
在其他的打包工具中json会被当做json字符串的形式存在，而vite是一个json对象

**摇树优化**
在导入库时如果把整个库当作一个对象引入，打包工具就不会启用摇树优化。因为它无法判断一个对象中的属性以后是否会用到。
如果使用按需导入，那么在打包时打包工具会启用摇树优化将不需要的对象或函数祛除。
对于json对象也是，如果有些json中的配置没有用到，那么打包的时候就不会把没用到的内容引入，而是被摇树优化祛除

### 路径别名
在项目中使用`@`代表项目根目录就是在vite中配置的，是借助rollup的alias插件实现的
```js
resolve:{
	alias:{
		"@":path.resolve(_dirname,'./src')
	}
}
```

> [!NOTE] 为什么要有哈希
> 浏览器是由缓存机制的，只要文件名不改那么浏览器就会默认去缓存读取，每次修改都更改文件名后的哈希值这样可以保证数据准确性

## 构建配置
### rollup
vite在构建到线上环境时由于线上环境兼容性的复杂，它是交给rollup处理的
用于配置静态资源

```js
build:{    //构建配置
	rollupOptions:{    //配置rollup
		output:{    //控制输出
			assetFileNames:"[hash]_[name]_[ext]"    //静态资源命名规则
		}
	},
	assetsInlineLimit:4096000    //配置转换成base64编码的最大静态资源体积，如果超过该限制则不会转换成base64
	outDir:"dist",    //构建输出文件夹名
	assetsDir:"assets",    //静态文件输出所在文件夹名，在outDir内，默认是assets
	emptyOutDir:true,    //每次构建时是否清空输出目录
}
```

# 插件

插件的配置是在`plugins`数组属性中针对所安装的插件进行配置
在使用时插件具有默认配置，但不再配置中创建出来插件的对象也是不会生效的
```js
plugins:[
	ViteAliases()
]
```

vite相比于webpack有很多功能不需要配置就可以使用，这是因为vite内置了很多插件

## 常用插件
### vite-aliases
vite-aliases可以帮助我们自动生成别名：检测你当前目录下包括src在内的所有文件夹，并帮助我们去生成别名

### vite-plugin-html
能够动态地改变标签页的title

使用的是ejs语法
ejs在服务端会用的比较频繁因为服务端可能经常会动态的去修改index.html的内容

```js
plugins:[
	createHtmlPlugin({
		inject:{
			data:{
				title:"首页"
			}
		}
	})
]
```
在html中使用时用ejs语法取出data中配置的数据
```html
<%= title %>
```

### vite-plugin-mock
不需要太多配置，直接在vite配置的`plugins`列表中创建出来即可
是依赖于mock.js的，做模拟数据用（类似于json-server但更高级些）
mock.js安装后每次启动项目会默认扫描项目根目录下的src下的mock文件夹中的js文件，其其中的js文件是使用mock.js规范模拟的网络接口形式启动的网络服务

### vite-plugin-checker
错误检查插件，ts在检查到语法不符合ts规范但符合js规范时虽然也会报错但并不会阻止编译，使用`vite-plugin-checker`插件并开启检查后就需要强制解决ts报错才会进行编译

**tsc编译**
- noEmit：当编译ts出错时直接退出编译并报错。如果不使用这个参数，当ts编译出错后并不会停止编译，而是要等vite构建时发现报错才会退出
```json
"scripts":[
	"build":"tsc -noEmit && vite build"
]
```

## 生命周期

vite会在生命周期的不同阶段中去调用不同的插件以达到不同的目的

vite在开发环境下使用的是自己的一套方案，在生产环境下使用的是rollup
rollup有一些自己的生命周期函数，vite对于这些生命周期函数也起了同名的生命周期函数，这样就有了一些双方通用的生命周期
除了rollup的生命周期函数，vite也多了自己所独有的生命周期钩子

vite会在特定的生命周期去读取`vite.config.js`中的`plugins`数组属性，从中读取符合生命周期的插件并执行

也就是说vite配置中的`plugins`数组属性接收的是一个对象类型
但很多插件都是以函数的方式返回的，这是因为对函数传入不同的参数可以定制化自己需要的插件配置

不同的插件可能调用了相同的生命周期，对于这些许多插件的生命周期函数执行顺序也有不同，可以使用`enforce`属性配置执行顺序

### config
config是vite特有的一个生命周期，它在vite读取配置文件前执行

自制的vite插件需要返回的是一个**包含了**vite中的`config`对象

这个对象是部分的`viteConfig`配置，也就是自己的插件需要修改的`viteConfig`的部分

- config：自己在`vite.config.js`中创建的配置对象会原封不动的以该参数的名字传过来
- env：
```js
config(config,env,){
	return {
		envPrefix:"abc"
	}
}
```

### transformIndexHtml
转化为html时调用
- html：读取到的html
- ctx：整个请求的执行器上下文
```js
module.exports=(options)=>{
	return {
		transformIndexHtml(html,ctx){
			return
		}
	}
}
```

### configureServer
服务器相关配置
传入参数是上一个服务器相关信息对象

- req：请求对象：用户发来的请求
- res：响应对象
- next：是否交给下一个中间件处理，是一个函数类型。如果不交给下一个中间件处理不需要管，如果要交给下一个中间件处理就手动调用`next()`
```js
export default (options)=>{
	return {
		configureServer(server){
			server.middlewares.use(req,res,next)=>{
				next();
			}
		}
	}
}
```

### 自制插件

```js
export defalut function{
	return {
	}
}
```

> [!Warning] Title
> 通过`vite.config.js`中配置的对象和插件中返回的对象都不是被vite最终读取的对象
而它们最终会被合并成一个对象供vite读取

# 优化

## 开发时态的构建速度优化

- webpack在这方面下的功夫是很重：cache-loadercacheloader结果（如果两次构建源代码没有产生变化，则直接使用缓存不调用loader），thread-loader，开启多线程去构建....
- vite是按需加载，所以我们不需要太care这方面

## 页面性能指标

### 首屏渲染时
fcp（first content paint），（first content paint->页面中第一个元素的渲染时长）

- 懒加载：需要我们去写代码实现的
- http优化：协商缓存和强缓存
- 强缓存：服务端给响应头追加一些字段（expires），客户端会记住这些字段，在expires（截止失效时间）没有到达之前，无论你怎么刷新页面，浏览器都不会重新请求页面，而是从缓存里取
- 协商缓存：是否使用缓存要跟后端商量一下，当服务端给我们打上协商缓存的标记以后，客户端在下次刷新页面需要重新请求资源时会发送一个协商请求给到服务端，服务端如果说需要变化则会响应具体的内容，如果服务端觉得没变化则会响应304


### 页面中最大元素的一个时长
lcp（largest content paint)

## js逻辑

- 副作用的清除：组件是会频繁的挂载和卸载：如果我们在某一个组件中有计时器（setTimeout），如果我们在卸载的时候不去清除这个计时器，下次再次挂载的时候计时器等于开了两个线程
- 在必要时卡浏览器帧率：requestAnimationFrame、requestIdleCallback对浏览器渲染原理要有一定的认识然后再这方面做优化
	requestIdleCallback：传一个函数进去
	浏览器的帧率：16.6ms去更新一次（执行js逻辑、重排重绘）假设某个js执行逻辑超过了16.6ms就会发生掉顿，因此在必要时可以卡浏览器帧率让它帧率和该js逻辑同步避免掉帧

## CSS
- 关注继承属性：能继承的旧不要重复写
- 尽量避免太过于深的css嵌套

## 构建优化
vite（rollup）webpack
- 优化体积：压缩，treeshaking，图片资源压缩，cdn加载，分包
只有构建优化是使用构建工具要考虑的优化

### 分包
当项目文件导入不经常更改的包（如第三方库等）时，默认打包是将导入的包和当前文件打到一个文件中，这样就导致文件体积变得很大，但如果项目文件的逻辑进行更改而导入的包没有更改那么又要重新生成大体积的文件，浏览器就要重新请求。因为一小部分的更改而请求巨大的包，所付出的性能代价也需要优化

在vite中配置分包策略
```js
"build":{
	"minify":false,
	"rollupOptions":{
		"output":{
			"manualChunks":(id)=>{
				if(id.includes("node_modules")){    //包的路径是否包含node_modules
					return "vendor"    //返回vendor命名，将符合条件的包打入这个命名的文件中
				}
			}
		}
	}
}
```

**当多个文件引入同一个包时**
在旧版的vite中，当多个文件引入同一个包构建时并不会有任何优化，每个文件中都有一份该包的拷贝，需要自己手动配置来解决
vite4版本直接导入内置插件splitVendorChunkPlugin，不需要任何配置了。

### gzip压缩
将资源使用gzip压缩后传输给服务器减少网络传输的体积
浏览器接收到gzip压缩包后解压缩

在vite中`vite-plugin-compression`插件用于gizp打包

### 动态导入
动态导入常用在router中
在router中导入的组件使用动态导入，对应路由的组件会被编译但不会被加载，当跳转该路由时，对应的组件才会加载
动态导入语法使用的`import`语法返回的是一个`promise`对象，在es6才支持的
webpack中的动态导入在es6之前就支持是因为webpack借鉴commonjs规范写的一个导入函数，返回的也是一个`promise`对象

### cdn加速
cdn（content delivery network）内容分发网络

在远距离传输的情况下，如：跨国访问网站。由于物理距离的原因访问速度都比较慢
将依赖的第三方模块全部写成cdn的形式，保证项目逻辑代码的小体积（体积小服务器和客户端的传输压力就没那么大）
使用cdn的方式导入第三方库，用户在访问时会自动去距离最近的cdn库所在服务器请求

在vite中使用`vite-plugin-cdn-import`插件进行cdn导入
- name：导入的包名
- var：在项目中导入包的别名
- path：cdn url
```js
plugins:[
	viteCDNPlugin({
		modules:[
			{
				name:"lodash",
				var:"_",
				path:"https://cdn.jsdelivery.net/npm/lodasH@4.17.21/lodash.min.js"
			}
		]
	})
]
```

在vite中配置后无需改动项目代码使用es6的导入语法，vite会将已配置的cdn导入的包使用cdn导入

在webpack中直接使用script标签cdn导入

### 跨域
同源策略【仅在浏览器发生，是浏览器的规则】：http交互默认情况下只能在同协议同域名同端口的两台终端进行
跨域限制是服务器已经响应了东西，但是浏览器不给你，不是说服务器没响应东西
当网络请求时浏览器不知道是否是跨域访问，但都放行了，如果不是跨域请求的话响应都会正常返回，如果是跨域请求，请求的服务器相应来的数据如果是在白名单上的地址则会给出标记，浏览器看到标记也会放行，但如果不是白名单上的地址就不会给出标记，如果运行访问依旧会给出数据，但这个数据会被浏览器拦截

#### 开发服务器解决跨域问题

**中转服务器**
同源策略是浏览器的，让请求的地址指向本机服务器，再由本机服务器根据接口的映射向获取数据的服务器发送请求，获取到数据后本机服务器直接返回给网页
```js
export default viteConfig({
	server:{    //开发服务器中的配置
		proxy:{    //配置跨域解决方案
			"/api":{    // key + 描述对象 以后在遇到/api开头的请求时 都将其代理到 target属性对应的域中去
				target:"https://www.360.com",
				changeOrigin: true,
				rewrite：(path)=> path.replace（/^\/api/，），//·是否要重写api路径
			}
		}
	}
})
```

#### 生产时态
一般是交给后端去处理跨域的【后端或者运维做的】：
1. ngnix：代理服务本质的原理就是和我们的本地开发vite服务器做跨域是一样
2. 配置身份标记：Access-Control-Allow-Origin：代表哪些域是我的朋友，标记了朋友以后浏览器就不会拦截


> [!Title] Title
> public下的包是不会做任何优化的
