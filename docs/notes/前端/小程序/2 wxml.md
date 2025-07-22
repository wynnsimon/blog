---
title: 2 wxml
createTime: 2025/06/22 10:03:22
permalink: /front/mini-program/2/
---
# 常用组件

小程序中的组件也是由宿主环境提供的，开发者可以基于组件快速搭建出漂亮的页面结构。官方把小程序的组件分为了9大类，分别是：
1. 视图容器
2. 基础内容
3. 表单组件
4. 导航组件
5. 媒体组件
6. map 地图组件
7. canvas 画布组件
8. 开放能力
9. 无障碍访问

### view
普通视图区域
类似于 HTML 中的 div，是一个块级元素
常用来实现页面的布局效果

### scroll-view
可滚动的视图区域
常用来实现滚动列表效果

只需要使用这个容器包裹内容,并设置允许滚动的方向即可
设置scroll-y表示允许纵向滚动,设置scroll-x表示允许横向滚动
```html
<scroll-view scroll-y>
	<view><view>
	<view><view>
	<view><view>
</scroll-view>
```

### swiper 和 swiper-item
轮播图容器组件和 轮播图 item 组件

swiper是轮播图容器
swiper-item是轮播图中的显示页

常用属性

| 属性类型                   | 类型      | 默认值               | 说明           |
| ---------------------- | ------- | ----------------- | ------------ |
| indicator-dotsboo      | lean    | false             | 是否显示面板指示点    |
| indicator-color        | color   | rgba(0, 0, 0, .3) | 指示点颜色        |
| indicator-active-color | color   | #000000           | 当前选中的指示点颜色   |
| autoplay               | boolean | false             | 是否自动切换       |
| interval               | number  | 5000              | 自动切换时间间隔     |
| circular               | boolean | false             | 是否采用衔接滑动<br> |

### text
文本组件
类似于HTML中的span标签，是一个行内元素
只有text组件内的内容可以被选中

selectable设置支持选中

#### rich-text
富文本组件
支持把HTML字符串渲染为WXML结构
```wxml
<rich-text nodes ="<h1 style='color:red;'>标题</h1>"></rich-text>
```

### button
按钮组件
功能比 HTML 中的 button 按钮丰富
通过 open-type 属性可以调用微信提供的各种功能（客服、转发、获取用户授权、获取用户信息等）

**type属性设置按钮属性,primary是主色调颜色,warn是警告按钮**
**size设置按钮大小**
**plain镂空按钮**


### image
图片组件,和html中的img相同
image 组件默认宽度约 300px、高度约 240px
image组件的mode属性用来指定图片的裁剪和缩放模式，常用的mode属性值如下：

| mode值       | 说明                                                                 |
| ----------- | ------------------------------------------------------------------ |
| scaleToFill | （默认值）缩放模式，不保持纵横比缩放图片，使图片的宽高完全拉伸至填满image元素                          |
| aspectFit   | 缩放模式，保持纵横比缩放图片，使图片的长边能完全显示出来。也就是说，可以完整地将图片显示出来。                    |
| aspectFill  | 缩放模式，保持纵横比缩放图片，只保证图片的短边能完全显示出来。也就是说，图片通常只在水平或垂直方向是完整的，另一个方向将会发生截取。 |
| widthFix    | 缩放模式，宽度不变，高度自动变化，保持原图宽高比不变                                         |
| heightFix   | 缩放模式，高度不变，宽度自动变化，保持原图宽高比不变                                         |

### navigator
页面导航组件
类似于 HTML 中的 a 链接

# 在页面上显示数据
在页面对应的js文件中定义数据
```js
data:{
	info:"helo world"
}
```
接着在对应的wxml文件中加载数据即可
```wxml
<view>{{info}}</view>
```


# 事件
事件是渲染层到逻辑层的通讯方式。通过事件可以将用户在渲染层产生的行为，反馈到逻辑层进行业务的处理。

| 类型     | 绑定方式                     | 事件描述                        |
| ------ | ------------------------ | --------------------------- |
| tap    | bindtap 或 bind:tap       | 手指触摸后马上离开，类似于HTML 中的click事件 |
| input  | bindinput 或 bind:input   | 文本框的输入事件                    |
| change | bindchange 或 bind:change | 状态改变时触发                     |

### 事件对象
当事件回调触发的时候，会收到一个事件对象event，它的详细属性如下表所示：

| 属性             | 类型      | 说明                     |
| -------------- | ------- | ---------------------- |
| type           | String  | 事件类型                   |
| timeStamp      | Integer | 页面打开到触发事件所经过的毫秒数       |
| target         | Object  | 触发事件的组件的一些属性值集合        |
| currentTarget  | Object  | 当前组件的一些属性值集合           |
| detail         | Object  | 额外的信息                  |
| touches        | Array   | 触摸事件，当前停留在屏幕中的触摸点信息的数组 |
| changedTouches | Array   | 触摸事件，当前变化的触摸点信息的数组     |
target 是触发该事件的源头组件，而 currentTarget 则是当前事件所绑定的组件。举例如下:
点击内部的按钮时，点击事件以冒泡的方式向外扩散，也会触发外层view的tap事件处理函数。

绑定事件
```wxml
<button type="primary" bindtap="CountChange">+1</button>
```

**更改数据**
要更改内部数据需要使用setData函数
```js
Page({
	data:{
		count:0
	},

//修改count的值
	changeCount(){
		this.setData({
			count: this.data.count +1
		})
	}
})
```

**事件传参**
可以为组件提供`data-*`自定义属性传参，其中`*`代表的是参数的名字，示例代码如下：
```wxml
<button bindtap="btnHandler" data-info="{{2}}">事件传参</button>
```
info会被解析为参数的名字
数值2会被解析为参数的值

介绍到传入的参数后要取出参数就要使用
```
event.target.dataset.info
```

# 条件语句

## if
使用`wx:if`,`wx:elif`,`wx:else`语句
如果符合条件就渲染该组件
```wxml
<view wx:if="{{type===1}}">男</view>
<view wx:elif="{{type === 2}}"> 女 </view>
<view wx:else>保密</view>
```

### block标签
如果要一次性控制多个组件的展示与隐藏，可以使用一个<block></block>标签将多个组件包装起来，并在
<\block>标签上使用wx:if控制属性，示例如下：
```wxml
<block wx:if="{{true}}">
	<view>view1</view>
	<view>view2</view>
</block>
```

### hidden属性
在一个标签中hidden属性的值为true时会隐藏该标签,false显示该标签

wx:if以动态创建和移除元素的方式，控制元素的展示与隐藏
hidden以切换样式的方式（display:none/block;），控制元素的显示与隐藏

## for
 默认情况下，当前循环项的索引用index表示；当前循环项用item表示。
```wxml
<view wx:for="{{array}}">
	索引是：{{index}}当前项是：{{item}}
</view>
```

使用wx:for-index可以指定当前循环项的索引的变量名
使用wx:for-item可以指定当前项的变量名

#### wx:key
类似于Vue列表渲染中的：key，小程序在实现列表渲染时，也建议为渲染出来的列表项指定唯一的key值，从而提高渲染的效率，示例代码如下：
```js
//data数据
data:{
	userlist:[
		{id:1，name:'小红'}，
		{id:2，name:‘小黄'}，
		{id：3，name:小白'}
	]
}
//wxml结构
<view wx:for="{{userList}}" wx:key="id">{{item.name}}</view>
```

