---
title: Nuxt
createTime: 2025/06/10 18:17:50
permalink: /front/nuxt/
---
Nuxt框架提供了一种基于Node.js的服务端渲染方案SSR（Server Side Rendering），可以让Vue应用在服务器端进行染，从而提高页面的加载速度和SEO。I

**SPA和SSR是什么**
- SPA（SinglePageApplication）单页面应用，在客户端通过JS动态地构建页面。
- SSR（Server-SideRendering）服务器端渲染，在服务器端生成HTML页面并发送给客户端。

**Nuxt框架优势**
- Nuxt采用了混合的架构模式，同时支持SSR和SPA。
- SSR服务端渲染：首次访问页面，Nuxt.js在服务器端执行Vue组件的渲染过程，并生成初始HTML
- SPA客户端激活：一旦初始HTML被发送到浏览器，Vue.js会接管页面，后续的页面切换则使用SPA的方式进行。
- Nuxt框架优势：兼顾了SSR和SPA的优点。

# 配置
- 开发工具
```js
  devtools: { enabled: true },
```
- 开发服务器配置
```js
  devServer: {
    port: 3000,
  },
```
- 源码映射
```js
  sourcemap: {
    server: true,
    client: true,
  },
```
- 导入的模块
```js
  modules: ["@element-plus/nuxt"],
```
- 运行时配置
```js
  runtimeConfig: {
    isServer: true,
    public: {
      apiBase: process.env.NUXT_API_BASE,
    },
  },
```
- head
就和html中的head配置一样，这个head作用是在全局的
如果要每个页面单独的head配置可以在对应的页面中使用head函数配置，如果页面中没有head配置就会使用nuxt配置中的head
- css
全局的css文件，引入后的css文件全局生效
- loading
加载进度条，nuxt内置了loading进度条，如果需要使用外部的进度条需要将默认的禁用

public属性下的是客户端和服务端都可以获取的，isServer或者isClient是只有服务端或只有客户端才可以获取。如果获取的不是自己有权访问的得到的结构是undefined
在获取时从全局对象`config`中获取
# 路由
在nuxt中不需要使用vue-router，它是基于文件的路由系统

跳转时使用`NuxtLink`组件，显示路由页面使用`NuxtPage`组件
`nuxt-child`组件会显示当前页面中指定的子路由中的内容

nuxt会检查当前项目根目录中的**pages**文件夹，根据其中的文件夹设置路由，并且路由名是pages文件夹下的子文件夹名字，跳转页面是子目录中的index.vue文件
```
├── pages/                     //页面目录
|    ├── index/
│    |   └── index.vue         //主页
|    └── video/
         └── video.vue         //视频页
```
默认生效条件如下：页面名必须是pages、子目录中必须包含index文件、pages文件夹必须在根目录中等。
如果有不同的需求也可以更改配置

路由守卫可以在生命周期中做，懒加载nuxt用不到它是直接在服务端加载出来的

路由也是可以使用vue自己配置的路由，需要安装插件：@nuxt/router
如果是现有的项目使用nuxt重构还使用原本的路由配置需要做以下修改：
1. 路由文件放在同一个文件中，且命名为router.ts放在项目根目录
2. 去除路由懒加载
3. 路由导出也不是VueRouter对象，而是一个函数createRouter
路由守卫还是可以使用原本的配置

但是像localstorage或者cookie等是不能正常使用的，需要其他的模块
## 路由传参
文件命名时将页面命名为带`[]`的文件，其中的变量就是路由传参的变量名
如：`pages/posts/[id].vue`
```vue
<script setup lang="ts">
const route = useRoute()

// 当访问 /posts/1 时，route.params.id 将为 1
console.log(route.params.id)
</script>
```
如果动态路由页面同级目录下有其他的页面文件则先精准匹配其他的页面路由，最后再匹配动态路由
# SEO优化
使用Nuxt最主要的是实现SEO优化，可以被搜索引擎搜索到

## useHead
在页面中使用useHead函数修改的内容仅生效于此页面，在此页面中会覆盖nuxt配置文件中的head属性

- title：在搜索引擎中显示的标题
- description：标题下的描述
- keywords：搜索关键字
```vue
<script setup lang="ts">
useSeoMeta({
  title: "哔哩哔哩 (゜-゜)つロ 干杯~-bilibili",
  description:
    "哔哩哔哩（bilibili.com)是国内知名的视频弹幕网站。",
  keywords:
    "B站,哔哩哔哩,bilibili,弹幕网,弹幕视频,弹幕网站,动漫,电影"
});
</script>
```

## useSeoMeta
以对象形式定义站点的 SEO 元数据标签，并提供完整的类型安全。

## 模板组件
除了函数，nuxt也提供了组件用于设置页面的头部标签
如：
- `<Title>`
- `<Base>`
- `<NoScript>`
- `<Style>`
- `<Meta>`
- `<Link>`
- `<Body>`
- `<Html>` 
- `<Head>`
这些组件的首字母是大写的，不是原生 HTML 标签。
```vue
<script setup lang="ts">
const title = ref('Hello World')
</script>

<template>
  <div>
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="description" :content="title" />
      <Style>
      body { background-color: green; }
      </Style>
    </Head>

    <h1>{{ title }}</h1>
  </div>
</template>

```
# 接口请求
在nuxt项目中可以设置后端接口
需要在特定文件夹下

接口文件需要放在根目录的server文件夹中，请求路径就是`nuxt服务器地址+端口号+/server文件夹中的文件夹+/文件名`
`server/api/user.ts`文件请求的接口就是`localhost:3000/api/user`，默认是所有请求都可以识别的，但也可以更改文件名设置只接收某种请求，如：`user.get.ts`文件只能被get请求识别

返回后端数据需要使用defineEventHandler函数，为这个函数传入一个函数，返回值就是要返回的数据
```js
export default defineEventHandler(()=>{
	return data
})
```

## 发送请求
nuxt有封装好的请求函数

- `$fetch`：数据被获取两次：一次在服务器（用于渲染 HTML），另一次在客户端（当 HTML 被激活时）。这可能会导致激活问题、增加交互时间等问题。适合仅从浏览器发起请求的情况
- `useFetch` 是 `$fetch` 的封装，会确保请求在服务器上发生，并正确转发到浏览器。只获取一次数据。
- `useAsyncData` 与 `useFetch` 类似，但提供更精细的控制。

# 状态共享
对于服务端渲染的代码，需要辨别当前运行环境是服务端还是客户端，
判断当前文件是客户端还是服务端使用`import.meta`
如果在服务端渲染的代码中设置了修改了变量，而这段代码在服务端和客户端都会运行通常会运行两次，默认的情况下客户端和服务端是属性隔离的

如果以下代码在服务端和客户端都有执行
```js
const a=ref(0)
a.value++
console.log(a.value) //服务端和客户端输出的都是1，这是因为属性是隔离的
```
如果要服务端和客户端共享数据可以使用useState函数获取共享的状态
```js
const a= useState("number",()=>{
	return 0
)
a.value++
console.log(a.value) //服务端输出是1，客户端输出是2
```

# 生命周期

nuxt中有三种生命周期钩子，
首先是服务端的生命周期，这些函数都运行在服务端，但输出可能在服务端也可能在客户端
服务端的生命周期执行完毕后就是vue本身的生命周期了，在vue自身的生命周期中beforeCreated和created这两个生命周期函数可能运行在服务端也可能运行在客户端（因为是服务端渲染）
在nuxt中不存在keep-alive和dekeep-alive生命周期，因为是服务端渲染的所以不存在组件的缓存

### 服务端生命周期

1. nuxtServerInit
服务初始化时执行，也是第一个执行的声明周期，是在store状态仓库的
需要在store文件夹中声明状态仓库，并且在需要的状态仓库的action中调用这个声明周期
服务初始化的时候也会初始化状态仓库
- store：状态仓库上下文
- context：nuxt执行上下文
```js
export const action={
	nuxtServerInit(store,context){}
}
```

2. middleware
中间件调用生命周期。服务初始化后紧跟着的就是调用中间件
这个生命周期并不是寻常意义的生命周期，它有两种调用方式：自动调用、手动调用。

**自动调用**
在middleware文件夹中声明的中间件就是在这个时机被自动调用的。相应的逻辑写在中间件中使其在这个时机被调用

要执行的中间件需要在nuxt.config.ts中的middleware字段中需要注册要调用的中间件，如果没有注册就不会调用

**只在某个页面中调用**
这种方式调用就是传统意义的生命周期了
如果将中间件注册到nuxt配置文件中那么这个中间件在每个页面都会被调用
如果想要只在某个页面调用中间件需要在对应的页面声明，不能在nuxt配置文件中注册
如：index.vue
```vue
<script>
	export default{
		middleware({store,router,redirect,params,query,req,res}){}
	}
</script>
```

3. validate
判断进入页面路径的url参数是否符合标准
也是在页面上调用的
需要返回值，返回true正常跳转对应的页面，返回false跳转404页面
两个参数都是页面路由的参数
```vue
<script>
	validate({params,query}){
		return true
	}
</script>
```

4. asyncData
这个生命周期限制于页面组件，只有页面（pages文件夹中的组件）才可以使用，普通的组件不行。
在组件加载之前被调用。它可以在服务端或路由更新
通常在这个时机发送请求获取数据

```vue
<script>
	asyncData({store,params}){}
</script>
```

5. fetch
用于在渲染页面前填充应用的状态树（store）数据
和asyncData方法类似，不同的是它不会设置组件的数据，会将请求返回的数据放在状态仓库中。
可以在所有组件中使用。
```vue
<script>
	fetch({app,store,params}){}
</script>
```

### 服务端可客户端共有的生命周期
后面的生命周期就是vue原本的生命周期
1. beforeCreated
2. created
### 客户端的生命周期
1. beforeMount
2. mounted
3. beforeUpdate
4. updated
5. beforeUnMounted
6. unMounted

# nuxt3生命周期

## 服务端
1. Nitro初始化
执行`/server/plugins`目录下的插件
2. Nitro中间件
执行`server/middleware/`目录下的中间件
3. Nuxt初始化
执行内置插件，如 Vue Router 和 `unhead`。
执行`plugins/`目录中的自定义插件，包括无后缀的插件（如 `myPlugin.ts`）和带 `.server` 后缀的插件（如 `myServerPlugin.server.ts`）。
4. 调用app:created钩子
nuxt初始化完成后执行
在nuxt配置中的hook字段中调用
5. 路由验证
执行页面组件中definePageMeta函数中定义了 `validate` 方法
6. Nuxt应用中间件
执行`middleware/`目录中的自定义中间件
7. 渲染页面和组件
执行要加载的组件中的代码
渲染页面及其组件，并使用 `useFetch` 和 `useAsyncData` 获取任何所需的数据。
8. app:rendered
生成html
获取所有所需数据并渲染组件后，Nuxt 将渲染的组件与 `unhead` 的设置相结合，生成完整的 HTML 文档。
生成html文档后会调用钩子，在nuxt配置中的hook属性
9. render::html
发送html
将html及其关联数据发送回客户端，完成 SSR 过程。

## 客户端
1. 初始化Nuxt并执行Nuxt应用插件
`plugins/` 目录中的自定义插件，如无后缀的插件（如 `myPlugin.ts`）和带 `.client` 后缀的插件（如 `myClientPlugin.client.ts`），会在客户端执行。
2. app:created
初始化nuxt及其客户端应用插件完成后调用，可用于执行额外的逻辑。
3. 路由验证
此步骤与服务器端执行相同，如果 `definePageMeta` 函数中定义了 `validate` 方法，则会执行该方法。
4. 执行Nuxt应用中间件
Nuxt 中间件在服务器和客户端都运行。如果希望某些代码在特定环境中运行，可以考虑使用 `import.meta.client`（客户端）和 `import.meta.server`（服务器）进行拆分。
5. 挂载vue应用前
调用appbeforeMount钩子
6. 挂载vue应用后
调用app:mounted钩子
7. 执行vue的生命周期
# 服务端不能使用localStorage和cookie的解决方案
在服务端可以使用状态管理仓库，因此许多存储可以使用store代替

## cookie-universal-nuxt
使用模块提供的api就可以向正常使用cookie一样使用

# 中间件
中间件分为三种类型：
1. 匿名（或内联）路由中间件，没有放置在 `middleware/` 目录中而是直接定义在使用它们的页面中。
2. 命名中间件，放置在 `middleware/` 目录中，当在页面上使用时，会通过异步导入自动加载。（路由中间件的名称会规范化为短横线命名法，如： `someMiddleware` 会变为 `some-middleware`。）
3. 全局中间件，放置在 `middleware/` 目录中（带有 `.global` 后缀），会在每次路由变化时自动运行。
对于命名中间件和全局中间件它们调用的先后顺序是按照文件命名的排序调用的，如果要控制它们的调用顺序需要按编号命名

# 预渲染
nuxt使用的是Nitro服务端引擎
配置预渲染需要两处配置

1. Nitro服务器配置
在 `nuxt.config` 文件中手动指定nitro在构建期间获取和预渲染的路由，或者忽略不希望预渲染的路由
- crawLinks：是否开启预渲染爬虫无法发现的路由，如`/sitemap.xml`、`/robots.txt`
- routes：预渲染的路由
- ignore：忽略预渲染的路由
```ts
export default defineNuxtConfig({
  nitro: {
    prerender: {
	    crawlLinks: true,
      routes: ["/user/1", "/user/2","/sitemap.xml", "/robots.txt"],
      ignore: ["/dynamic"],
    },
  },
});
```
nitro.prerender属性也可以传入一个布尔值表示的意思是nitro.prerender.crawlLinks设置为true

2. 路由规则配置
```ts
export default defineNuxtConfig({
  routeRules: {
    // 设置 prerender 为 true，配置其被预渲染
    "/rss.xml": { prerender: true },
    // 设置为 false，配置其跳过预渲染
    "/this-DOES-NOT-get-prerendered": { prerender: false },
    // /blog 下的所有内容都会被预渲染，只要它
    // 从另一个页面链接过来
    "/blog/**": { prerender: true },
  },
});

```
也可以在页面组件中使用`defineRouteRules`函数配置其所在页面的预渲染

## 预渲染钩子

### prerender:routes
在预渲染之前调用此钩子，用于注册额外的路由。
```ts
export default defineNuxtConfig({
  hooks: {
    async "prerender:routes"(ctx) {
      const { pages } = await fetch("https://api.some-cms.com/pages").then(
        (res) => res.json(),
      );
      for (const page of pages) {
        ctx.routes.add(`/${page.name}`);
      }
    },
  },
});
```

### prerender:generate
预渲染期间为每个路由调用此钩子。可以对每个要预渲染的路由进行处理。
```ts
export default defineNuxtConfig({
  nitro: {
    hooks: {
      "prerender:generate"(route) {
        if (route.route?.includes("private")) {
          route.skip = true;
        }
      },
    },
  },
});

```

# 自动导入
Nuxt会自动导入 `components\`、`composables/`、`utils/`目录中的内容。自动提供类型支持、IDE 自动补全和提示，并且**仅在生产代码中包含实际使用的内容**。
建议禁用
```ts
export default defineNuxtConfig({
  imports: {
    autoImport: false
  }
})
```
