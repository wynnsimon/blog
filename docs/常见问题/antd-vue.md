---
title: antd-vue
createTime: 2025/07/01 21:10:42
tags:
  - 问题
  - 组件库
  - vue
permalink: /article/question/2/
---

# 修改a-modal的样式

直接对其通过style、background、:deep等方式修改样式，都无法选中，这是因为modal是挂载在body标签下的，层级很高（和vue挂载的app同级甚至更高），所以使用:deep方式无法选中

想要选中需要调用a-modal中提供的getContainer接口改变a-modal的挂载点，挂载到当前组件下，这样在当前组件下使用样式穿透就可以选中a-modal了









