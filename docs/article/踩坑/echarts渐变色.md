---
title: echarts渐变色
tags:
  - 踩坑
  - echarts
permalink: /article/question/4/
createTime: 2025/08/27 22:18:20
---

在echarts中使用渐变色的方式只写一个颜色会导致首次切换后端服务器后统计图颜色全黑的问题
```js
color:[colorStep:{offset:0,color:'red'}]
```
如果只有单色应改为单色的配置
```js
color:'red'
```