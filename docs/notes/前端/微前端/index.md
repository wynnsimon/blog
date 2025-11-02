---
title: 微前端
createTime: 2025/07/19 18:53:50
permalink: /front/micro-frontend/
---
把要复用的代码放在线上，在其他项目里远程引入，并且使用。
微前端就是将不同的功能按照不同的维度拆分成多个子应用。通过主应用来加载这些子应
用。
微前端的核心在于拆，拆完后在合，实现分而治之

**微前端解决的问题**
- 不同团队（技术栈不同），同时开发一个应用
- 每个团队开发的模块都可以独立开发，独立部署
- 实现增量迁移
**如何实现微前端**
将一个应用划分成若干个子应用，将子应用打包成一个个的模块。当路径切换时加载不同的子应用。这样每个子应用都是独立的，技术栈也不用受限制了。从而解决了前端协同开发问题。

# iframe
iframe技术本质上允许在一个页面内嵌入另一个独立的网页，从而实现多个独立的应用的展示。

通信可以通过postMessage进行通信。

**优点**
- 独立性：每个子应用都有自己的生命周期和上下文，彼此之间不会互相影响。
- 简单实现：实现简单，基本的HTML页面即可使用iframe嵌入。

**缺点**
- 性能问题：iframe 本身会产生较大的性能开销，尤其是在存在多个嵌套应用时，容易导致页面加载变慢。
- 隔离性太强：由于嵌入的页面是完全独立的，无法轻松实现应用间的通信和共享状态。
- 跨域问题：iframe中的内容和主页面通常会存在跨域问题，这增加了开发和运维的复杂性。
- 弹框只能在iframe中、在内部切换刷新就会丢失状态

```html
<iframe src='index.html'/>
<iframe src='www.baidu.com'/>
```

# Web Components

将前端应用程序分解为自定义HTML元素。
基于customEvent实现通信

**优点**
- ShadowDOM天生的作用域隔离

**缺点**
浏览器支持问题、学习成本、调试困难、修改样式困难等问题。

# single-spa

随着前端技术的发展，单页面应用（SPA）的流行促进了 micro frontends 的出现。single-spa 是一个开源框架，基于systemjs。旨在帮助开发者将多个独立的前端应用（微前端）集成到同一个页面中。

single-spa 提供了一个加载和管理多个子应用的机制，这些子应用可以是独立的前端框架（如React、Vue、Angular)，并且每个子应用都可以独立开发、部署和更新。

基于props主子应用间通信

**优点**
- 框架无关性：single-spa 支持多种前端框架，包括 React、Vue、Angular 等，可以灵活选择适合的框架进行开发。
- 高效加载：通过路由和生命周期管理，single-spa 只在需要时加载和卸载子应用，从而提升性能。
- 应用间隔离：子应用之间不会相互干扰，确保了不同团队之间的开发独立性。

**缺点**
- 复杂性高：single-spa 的使用相对较为复杂，需要配置合适的路由、生命周期等。
- 性能问题：由于框架是独立的，它可能导致应用间的资源重复加载，增加内存和网络请求开销。
- 无沙箱机制，需要实现自己实现JS沙箱以及CSS沙箱

## 生命周期
- bootstrap：应用创建完成后
- mount：挂载后
- unmount：卸载后

## 使用
在使用时需要创建一个对象并且在这个对象中设置要在对应生命周期执行的逻辑，如果有多个函数在同一个生命周期，生命周期传入一个函数数组
- registerApplication：创建一个应用，参数一：应用名，参数二：回调函数，返回值是一个要创建的应用对象，参数三：触发条件，如路径为#/b时触发，参数四：传递给其他组件的值
生命周期函数都有一个接受的参数时传递的值
- start函数开启应用
```js
      let app2 = {
        bootstrap: async (props) => {
          console.log("app2 bootstrap1",props);
        },
        mount: async () => {
          console.log("app2 mount1");
        },
        unmount: async () => {
          console.log("app2 unmount1");
        },
      };

      // 注册
      // 当路径为#/b时，加载app2
      registerApplication(
        "b",
        async () => app2,
        (location) => location.hash.startWith("#/b"),
        {a:1}
      );

      // 开启路径监控
      start()
```

# Module federation
通过模块联邦将组件进行打包导出使用

共享模块的方式进行通信

**优点**
- 无CSS沙箱和JS沙箱

**缺点**
- 需要webpack5。

### 配置
一下展示使用rspack
1. 远程组件配置
```js
import { defineConfig } from "@rsbuild/core";
import { rspack } from "@rsbuild/core";

export default defineConfig({
  server: {
    port: 3000,
    cors: true,
  },
  source: {
    entry: {
      index: "./index.js",
    },
  },
  tools: {
    rspack: {
      output: {
        publicPath: "http://localhost:3000/", //指定导出的路径
      },
      plugins: [
        new rspack.container.ModuleFederationPlugin({
          name: "nav", // 服务名
          filename: "remoteEntry.js",
          remotes: {},
          exposes: {
            "./header": "./header.js", // 导出的组件名
          },
          shared: {},
        }),
      ],
    },
  },
});
```
在导出的组件文件中其内部需要有默认导出的组件

2. 主应用导入配置
```js
import { defineConfig } from "@rsbuild/core";
import { rspack } from "@rsbuild/core";

export default defineConfig({
  server: {
    port: 3001,
  },
  source: {
    entry: {
      index: "./index.js",
    },
  },
  tools: {
    rspack: {
      plugins: [
        new rspack.container.ModuleFederationPlugin({
          name: "home",
          remotes: {
            nav: "nav@http://localhost:3000/remoteEntry.js", //远程导入组件的路径
          },
          exposes: {},
          shared: {},
        }),
      ],
    },
  },
});
```

3. 在文件中导入
```js
import("nav/header").then((mod) => { //需要与配置的组件名一致
  const headerEl = mod.default();
  document.body.appendChild(headerEl);
});
```
导入是异步导入返回的promise，调用其上面的default函数获取默认导出的组件

# qiankun
基于single-spa 构建，但提供了更多功能来简化微前端的开发过成。它的设计目标是提供一个更简便、更稳定的微前端解决方案，能够支持更多的应用场景和更高的性能

支持多种技术栈，能够轻松实现子应用的注册、加载、卸载等操作，同页面应用之间的通信和状态共享。

**优点**
- 强大的生命周期管理：qiankun 提供了完善的生命周期管理机制，可以在应用加载、渲染、卸载等过程中自定义逻辑。
- 动态加载子应用：支持动态加载和按需加载子应用，提升了性能。
- 内置的跨框架支持：qiankun 本身就支持 React、Vue 等框架，可以无缝接入不同的技术栈。

**缺点**
- 学习曲线：虽然 qiankun 提供了很多便捷的功能，但其配置和使用仍然需要一定的学习成本。
- 应用间隔离问题：子应用的隔离仍然需要一定的技术支持，比如避免CSS 和JavaScript的冲突

## 生命周期
- beforeLoad：加载前
- beforeMount：挂载前
- afterMount：挂载后
- beforeUnmount：卸载前
- afterUnmount：卸载后

## 使用
- registerMicroApps：创建应用，第一个参数是子应用的配置，第二个参数是包含生命周期的对象
```html
<div id="container"></div>
<script>
	import {registerMicroAps,start} from 'qiankun'
	registerMicroApps([
		{
			name:'reactApp', //应用名
			entry:'///localhost:10000', //启动的入口
			activeRule:'/react', //生效的规则：当前路径为/react时生效
			container:'#container', //挂载的容器
			loader:(loading)=>{ //loader函数
				console.log('加载状态',loading)
			}
		},{ //生命周期配置
			beforeLoad(){
				console.log('before load')
			}
		}
	])
	start()
</script>
```

# wujie
背景
Wujie是由中国的美团技术团队开发的一个微前端框架，旨在提供轻量级的微前端解决方案，具有高性能、易用性和灵活性。它能够处理多种类型的微前端场景，支持沙箱隔离、跨应用共享状态等。
**优点**
- 性能优越：通过优化应用加载和渲染的过程，Wujie提供了较好的性能表现。
- 易于集成：提供了简单的API，能够快速集成到现有项目中。
- 沙箱隔离：保证了不同应用之间的沙箱隔离，避免了冲突和影响。

# macro-app
是一种基于微前端概念的框架，主打“宏”应用和“微”模块的集成。它将微前端的理念与模块化、组件化进行了更深入的融合，目标是通过统一的应用构建来简化开发。

# garfish
是字节开源的一个轻量级微前端框架，侧重于简化微前端的集成和管理。它在性能和隔离方面做了优化，旨在提升微前端的开发体验和性能。








