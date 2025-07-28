---
title: 10 Vapor原理
tags:
  - 原理
  - 前端
  - vue
createTime: 2025/07/27 22:06:42
permalink: /article/principle/10/
---

# Vapor
一种基于编译时（Compile-time）优化的全新架构范式。它意味着Vue正在将开销尽可能地转到编译时（vue是一个运行时编译框架）。
VaporMode是一种受Solid.js启发的、基于编译时优化的新性能模式。它彻底改变了Vue的工作方式，将优化的重心从运行时转移到了编译时。
## 虚拟dom的开销

1. 内存开销（Memory Overhead）
在浏览器的内存中，除了维护一个真实的DOM树之外，还需要额外维护一个完整的虚拟dom树。对于复杂的应用，这会带来双倍的内存占用。

2. 运行时开销（Runtime Overhead）
 vnode 创建成本：当组件状态更新时，即使只有一小部分数据变化，默认仍会重新生成该组件的 vnode子树。
Diff 过程成本：新旧 VNode 树的比对过程，即Diff 算法，本身是一个递归遍历的过程。组件越复杂， vnode 树越庞大，Diff 的计算开销就越大。这个过程无论最终有无差异，都必须执行（过度对比）。
3. 启动与JavaScript负载（Initial Load & JS Payload）
包含虚拟DOM、Diff 算法、Patch 逻辑在内的运行时代码，是构成Vue 框架体积的一部分。用户首次进入页面时，需要下载、解析并执行这部分JavaScript，这会影响页面的可交互时间，对于内容展示为主、交互较少的页面，这部分运行时代码就会比较冗余。

虚拟DOM的代价根源在于其运行时的特性——它必须在浏览器运行时，通过比对才能知道变化的地方。

如果我们在代码被执行前，在“编译时”就已经能精确地知道模板中哪些部分是永不改变的（静态），哪些部分是可能改变的（动态），以及动态部分与哪个数据源绑定，那么就可以省略掉这些完整的vnode和运行时diff的过程

## 过程
在Vapor Mode 下，vue文件的模板会在编译阶段更加深度地优化：
1. 静态分析：遍历模板，识别出所有的动态绑定，如：双大括号取值、单向绑定、v-if
2. 生成指令式代码：为每一个动态绑定生成直接操作dom的代码，并将其放在响应式副作用（effect）中

示例：
如：
```vue
<p>{{msg}}<p>
```
会编译成
```js
// 1. 创建并插入静态模板
const p_element=document.createElement('p')
const text_node=document.createTextNode('')
p_element.appendChild(text_node)
document.parent.appendChild(p_element) //插入到parent父节点

// 2. 将响应式数据源（msg）与dom操作直接绑定
const msg=ref('hello')
renderEffect(()=>{
	//当msg变化时只执行这里面的操作
	text_node.textContent=msg.value
})
```

## vapor的优点
1. 极致的性能：消除了VNode 创建和运行时 Diff 的开销，更新性能只与动态绑定的数量有关，与模板的整体大小无关。
2. 更低的内存占用：无需在内存中维护VNode树。
3. 更小的框架体积：由于大部分工作有由编译器完成，最终打包的运行时代码可以更加轻量

| 对比维度  | 传统虚拟DOM模                | Vapor Mode                    |
| ----- | ----------------------- | ----------------------------- |
| 核心思想  | 运行时比对 (Runtime Diffing) | 编译时分析 (Compile-time Analysis) |
| 性能模型  | 更新成本与组件大小相关             | 更新成本仅与动态绑定数量相关                |
| 内存占用  | 较高 （VNode 树+真实 DOM）     | 极低 （仅真实DOM）                   |
| 运行时大小 | 较大 （包含 Diff/Patch 逻辑）   | 极小 （仅包含基础调度器）                 |
| 适用场景  | 高度动态、结构复杂的ui            | 性能敏感板结构相对稳定的场景                |





























