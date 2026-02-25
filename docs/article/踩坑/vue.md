---
title: vue
createTime: 2025/07/15 23:00:04
tags:
  - vue
  - 前端
  - 踩坑
permalink: /article/question/3/
---

#  v-for中使用ref获取dom

在v-for中不能直接使用ref获取dom，因为v-for会生成许多同样ref命名的dom有多义性

1. 数组存储
`refs`是一个数组，并且打印后会发现这个数据里的 item 是没有属性可以去区分这个 ref 是哪一个具体的dom
```vue
<script setup>
	let refs = []
	const setRef = (el) => {
		if (el) {
			refs.push(el);
		}
	}
<scrippt>

<template>
	<div v-for="item in list" :ref="setRef"></div>
</template>
```

3. 对象存储
将dom以对象键值对的形式存储
```vue
<script setup>
	let refs: { [key: string]: typeof Son } = {};
	const setRef = (key: string, el: typeof Son) => {
		if (el) {
			refs[key] = el;
		}
	};
<scrippt>

<template>
	<div v-for="item in list" :ref="(el) => setRef(item, el)"></div>
</template>
```
这样取值的话就可以使用`refs[item]`取值了

# 在setup钩子中解构props
`<script setup>`语法糖不会出现这个问题
在setup钩子中解构props会丢失响应式
`props` 对象本身是一个 Proxy 代理对象，具有响应式特性。当直接解构它时（例如 `const { title } = props`），提取出来的 `title` 只是一个普通的 JavaScript 值（字符串、数字等），它不再与父组件传递下来的 prop 保持连接。





