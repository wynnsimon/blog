---
title: 3 wxss
createTime: 2025/06/22 10:03:26
permalink: /front/mini-program/3/
---
WXSS具有CSS大部分特性，同时，WXSS还对CSS进行了扩充以及修改，以适应微信小程序的开发。

与CSS相比，WXSS扩展的特性有：
1. rpx尺寸单位
2. @import样式导入

# rpx
rpx (responsive pixel)是微信/解决屏适配的尺寸单位

rpx的实现原理非常简单：鉴于不同设备屏幕的大小不同，为了实现屏幕的自动适配，rpx把所有设备的屏幕，在宽度上等分为750份（即：当前屏幕的总宽度为750rpx）
小程序在不同设备上运行的时候，会自动把rpx的样式单位换算成对应的像素单位来渲染，从而实现屏幕适配，

# @import
@import后跟需要导入的外联样式表的相对路径，用；表示语句结束 

# app.json

app.json是当前小程序的全局配置，包括了小程序的所有页面路径、窗口外观、界面表现、底部tab 等。
4个配置项的作用：
1. pages：用来记录当前小程序所有页面的路径
2. window：全局定义小程序所有页面的背景色、文字颜色等
3. style：全局定义小程序组件所使用的样式版本
4. sitemapLocation：用来指明sitemap.json的位置

## window节点配置项

| 属性名                          | 类型       | 默认值     | 说明                         |
| ---------------------------- | -------- | ------- | -------------------------- |
| navigationBarTitleText       | String   | 字符串     | 导航栏标题文字内容                  |
| navigationBarBackgroundColor | HexColor | #000000 | 导航栏背景颜色，如#000000           |
| navigationBarTextStyle       | String   | white   | 导航栏标题颜色，仅支持black／white     |
| backgroundcolor              | HexColor | #fffff  | 窗口的背景色                     |
| backgroundTextStyle          | String   | dark    | 下拉loading的样式，仅支持dark/light |
| enablePullDownRefresh        | Boolean  | false   | 是否全局开启下拉刷新                 |
| onReachBottomDistance        | Number   | 50      | 页面上拉触底事件触发时距页面底部距离，单位为px   |

## tabBar
tabBar是是移动端应用常见的页面效果，用于实现多页面的快速切换。小程序中通常将其分为：
- 底部tabBar
- 顶部tabBar

tabBar中只能配置最少2个、最多5个tab页签
当渲染顶部tabBar时，不显示icon，只显示文本

常用属性
1. pagePath：页面路径，页面必须在 pages 中预先定义
2. text：tab上显示的文字
3. position：tabBar的位置，仅支持bottom/top
4. backgroundcolor：tabBar的背景色
5. selectedlconPath：选中时的图片路径
6. borderStyle：tabBar上边框的颜色
7. iconPath：未选中时的图片路径
8. selectedIconPath：选中时的图片路径
9. selectedcolor：tab上的文字选中时的颜色
10. color：tab上文字的默认（未选中）颜色

# 网络请求
## 配置request合法域名
配置步骤：登录微信小程序管理后台->开发->开发设置->服务器域名->修改request合法域名

域名只支持https协议
域名不能使用IP地址或localhost
域名必须经过 ICP 备案
服务器域名一个月内最多可申请5次修改

为了不耽误开发的进度，我们可以在微信开发者工具中，临时开启「开发环境不校验请求域名、TLS 版本及HTTPS证书」选项，跳过request合法域名的校验。

## 发起请求
调用微信小程序提供的wx.request(）方法，可以发起GET数据请求，示例代码如下：
```js
wx.request({
	url：‘https://www.escook.cn/api/get',    //请求的接口地址，必须基于https 协议
	method: 'GET',    //请求的方式
	data:{    //发送到服务器的数据
		name:zs'
		age: 22
	},
	success：（res）=>{    //请求成功之后的回调函数
		console.log(res)
	}
})
```

### 页面刚开始建在时请求数据
在很多情况下，我们需要在页面刚加载的时候，自动请求一些初始化的数据。此时需要使用页面的onLoad事件
```js
onLoad:function（options）{}
```

### 跨域和ajax
跨域问题只存在于基于浏览器的Web开发中。由于小程序的宿主环境不是浏览器，而是微信客户端，所以小程序中不存在跨域的问题。
Ajax技术的核心是依赖于浏览器中的XMLHttpRequest这个对象，由于小程序的宿主环境是微信客户端，所以小程序中不能叫做“发起Ajax请求”，而是叫做“发起网络数据请求"

# 页面导航

## 声明式导航
在页面上声明一个<\navigator>导航组件通过点击<\navigator>组件实现页面跳转

在使用<\navigator>组件跳转到指定的tabBar页面时，需要指定url属性和open-type 属性
- url表示要跳转的页面的地址，必须以／开头
- open-type表示跳转的方式，switchTab是跳转到tabBar页面,navigate是跳转到非tabBar页面
```wxml
<navigator url="/pages/message/message" open-type="switchTab">导航到消息页面</navigator>
```

## 编程式导航
调用小程序的导航API，实现页面的跳转

**跳转到tabBar页面**
需要指定事件函数,并使用switchTab指定url
```js
gotoMessage() {
	wx.switchTab({
		url:'/pages/message/message'
	})
}
```

**跳转到非tabBar页面**
需要指定事件函数,并使用navigateTo指定url
```js
gotoMessage() {
	wx.navigateTo({
		url:'/pages/message/message'
	})
}
```

## 后退到上一级

调用wx.navigateBack(Object object)方法，可以返回上一页面或多级页面。其中Object参数对象可选的


| 属性       | 类型       | 说明                                   |
| -------- | -------- | ------------------------------------ |
| delta    | number   | 返回的页面数，默认是1, 如果 delta 大于现有页面数，则返回到首页 |
| success  | function | 接口调用成功的回调函数                          |
| fail     | function | 接口调用失败的回调函数                          |
| complete | function | 接口调用结束的回调函数（调用成功、失败都会执行）             |

## 页面传参
在请求的url中携带参数即可

# 下拉刷新

### 监听页面刷新事件
onPullDownRefresh()函数

**停止下拉刷新效果**
在真机上使用是下拉刷新目前还是有bug,在下拉刷新后不会停止下拉刷新的动画,需要手动暂停
wx.stopPullDownRefresh()函数

# 上拉触底

通过onReachBottom()函数监听上拉触底事件

在页面的json文件中可以通过onReachBottomDistance属性更改上拉触底的距离,默认是是50px

# 声明周期
生命周期包含两种,一种是应用生命周期,一种是页面生命周期
应用生命周期是指这个小程序从启动到关闭的生命周期
页面生命周期是指小程序中某个页面从启动到销毁的生命周期
应用生命周期包含页面生命周期

## 应用生命周期

### 应用生命周期函数
小程序的应用生命周期函数需要在app.js中进行声明，示例代码如下：
```js
// app.js 文件
App({
	// 小程序初始化完成时，执行此函数，全局只触发一次。可以做一些初始化的工作。
	onLaunch:function(options){},
	// 小程序启动，或从后台进入前台显示时触发。
	onShow:function(options) {},
	// 小程序从前台进入后台时触发。
	onHide:function() {}
}
```

## 页面生命周期函数
小程序的页面生命周期函数需要在页面的.js文件中进行声明，示例代码如下：
```js
// 页面的.js 文件
Page({
	onLoadd：function（options）{}，    //监听页面加载，一个页面只调用1次
	onShowV：function（）{},    //监听页面显示
	onReady : function(） {},    //监听页面初次渲染完成，一个页面只调用1次
	onHide :function(） {},    //监听页面隐藏
	onUnload:function(） {}    //监听页面销毁，一个页面只调用1次
)
```

# wxs脚本语言
WXS（WeiXinScript）是小程序独有的一套脚本语言，结合WXML，可以构建出页面的结构。

wxml中无法调用在页面的js中定义的函数，但是，Wxml中可以调用wxs中定义的函数。因此，小程序中
WXS的典型应用场景就是“过滤器”。

虽然wxs的语法类似于JavaScript，但是wxs和JavaScript是完全不同的两种语言：
1. WXS有自己的数据类型
	number数值类型、string字符串类型、boolean布尔类型、object对象类型、function函数类型、array数组类型、date 日期类型、regexp 正则
2. WXS不支持类似于ES6及以上的语法形式
	不支持：let、const、解构赋值、展开运算符、箭头函数、对象属性简写、etc..
	支持：var 定义变量、普通function函数等类似于ES5的语法
3. wxs遵循CommonJS规范
	module对象
	require(）函数
	module.exports对象

wxs和js是隔离的,不能调用js中的函数
wxs也不能调用小程序提供的api


**内嵌wxs脚本**
wxs 代码可以编写在wxml 文件中的`<wxs>`标签内，就像Javascript代码可以编写在html文件中的`<script>`标签内一样。
Wxml 文件中的每个`<wxs></wxs>`标签，必须提供 module 属性，用来指定当前 wxs 的模块名称，方便在wxml中访问模块中的成员

**外联wxs脚本**
wxs代码还可以编写在以.wxs为后缀名的文件内，就像javascript代码可以编写在以.js为后缀名的文件中一样。

需要在使用module.exports共享出去
```js
module.exports{
	testFunc:testFunc;
}
```

其他文件要使用wxs文件中的脚本可以用wxs标签设置src属性引入

# 自定义组件
需要在根目录新建components文件夹,并在这个文件夹内新建对应页面的文件夹就会自动生成自定义组件的文件

### 引用自定义组件
在页面得到.json文件中引用组件
```js
在页面的·json文件中，引入组件
{
	"usingComponents": {
		"my-test1": "/components/test1/test1""
	}
}

//在页面的.wxml文件中，使用组件
<my-test1></my-test1>
```
每个页面引用的组件只能在本页面中使用成为局部引用
在app.json文件中引用是全局引用,所有页面都可以使用

### 组件的设置
在组件的json文件中component属性是true表示这是一个组件
在组件的js文件中调用的函数是Component,在页面的js文件中调用的函数是Page
组件的事件处理函数都要放到methods函数中

组件中样式是隔离的,外部的样式无法影响到内部的样式,内部的样式也无法影响到外部的样式

在使用css选择器时只有class选择器会有样式隔离效果,其他的选择器都没有

## styleIsolation

| 可选值          | 默认值 | 描述                                                                            |
| ------------ | --- | ----------------------------------------------------------------------------- |
| isolated     | 是   | 表示启用样式隔离，在自定义组件内外，使用class 指定的样式将不会相互影响                                        |
| apply-shared | 否   | 表示页面WXSS 样式将影响到自定义组件，但自定义组件WXSS中指定的样式不会影响页面                                   |
| shared       | 否   | 表示页面WXSS 样式将影响到自定义组件，自定义组件WXSS中指定的样式也会影响页面和其他设置了 apply-shared 或 shared 的自定义组件 |
在组件的函数中普通函数建议使用_开头命名,用于和事件处理函数区分
### properties属性
在小程序组件中，properties是组件的对外属性，用来接收外界传递到组件中的数据
```js
Component({
	//属性定义
	properties:{
		max:{    //完整定义属性的方式【当需要指定属性默认值时，建议使用此方式】
			type：Number,    //属性值的数据类型
			value:10    //属性默认值
		},
		max:Number    //简化定义属性的方式【不需指定属性默认值时，可以使用简化方式】
	}
})
<my-test1 max="10"></my-test1>
```

properties一般存储外部传入的数据,data一般存储内部数据

由于data数据和properties属性在本质上没有任何区别，因此properties属性的值也可以用于页面渲染或使用setData为properties中的属性重新赋值，示例代码如下：

## 数据监听器

数据监听器用于监听和响应任何属性和数据字段的变化，从而执行特定的操作。它的作用类似于vue中的watch侦听器。在小程序组件中，数据监听器的基本语法格式如下：
```js
Component({
	observers:{
		‘字段A，字段B'：function（字段A的新值，字段B的新值）{
			//do something
		}
	}
})
```

数据监听器也可以监听对象属性的变化,需要将字段换为对象.属性
```js
Component({
	observers:{
		‘对象.属性A，对象.属性B'：function（字段A的新值，字段B的新值）{
			//do something
		}
	}
})
```

### 纯数据字段
纯数据字段指的是那些不用于界面渲染的data字段

应用场景：例如有些情况下，某些data中的字段既不会展示在界面上，也不会传递给其他组件，仅仅在当前组件内部使用。带有这种特性的data字段适合被设置为纯数据字段。

纯数据字段有助于提升页面更新的性能

在Component构造器的options节点中，指定pureDataPattern为一个正则表达式，字段名符合这个正则表达式的字段将成为纯数据字段
```js
Component({
	options:{
		//指定所有_开头的数据字段为纯数据字段
		pureDataPattern:/^_/
	},
	data:{
		a:true，//普通数据字段
		_b:true，//纯数据字段
	}
})
```

### 组件的生命周期
小程序组件可用的全部生命周期

| 生命周期函数   | 参数           | 说明                                                     |
| -------- | ------------ | ------------------------------------------------------ |
| created  | 无            | 在组件实例刚刚被创建时执行.此时还不能调用setData                           |
| attached | 无            | 在组件实例进入页面节点树时执行,此时，this.data已被初始化完毕                    |
| ready    | 无            | 在组件在视图层布局完成后执行                                         |
| moved    | 无            | 在组件实例被移动到节点树另一个位置时执行                                   |
| detached | 无            | 在组件实例被从页面节点树移除时执行,退出一个页面时，会触发页面内每个自定义组件的detached生命周期函数 |
| error    | Object Error | 每当组件方法抛出错误时执行                                          |

#### 使用生命周期函数
**lifetimes**
在小程序组件中，生命周期函数可以直接定义在Component构造器的第一级参数中，可以在lifetimes字段内进行声明（这是推荐的方式，其优先级最高）
```js
Component({
	//推荐用法
	lifetimes:{
		attached（）{}，//在组件实例进入页面节点树时执行
		detached（）{}，//在组件实例被从页面节点树移除时执行
	},
	//以下是旧式的定义方式
	attached（）{}，//在组件实例进入页面节点树时执行
	detached（）{}，//在组件实例被从页面节点树移除时执行
)
```

### 组件所在页面的生命周期
有时，自定义组件的行为依赖于页面状态的变化，此时就需要用到组件所在页面的生命周期

| 生命周期函数 | 参数          | 描述             |
| ------ | ----------- | -------------- |
| show   | 无           | 组件所在的页面被展示时执行  |
| hide   | 无           | 组件所在的页面被隐藏时执行  |
| resize | Object Size | 组件所在的页面尺寸变化时执行 |

#### 使用组件所在页面生命周期函数

**pageLifetimes节点**
```js
Component({
	pagelifetimes:{
	show：function（）{}，//页面被展示
	hide：function（）{}，//页面被隐藏
	resize：function（size）{}//页面尺寸变化
})
```

## 插槽

在自定义组件的wxml结构中，可以提供一个`<slot>`节点（插槽），用于承载组件使用者提供的wxml结构

在小程序中，默认每个自定义组件中只允许使用一个`<slot>`进行占位，这种个数上的限制叫做单个插槽。
```wxml
//组件定义
<view>
	<slot></slot>
</view>

//将组件定义为my-test后
//使用组件
<my-test>
	<view>通过插槽插入的内容</view>
</my-test>
```

**多个插槽**
要启用多个插槽需要在js文件中在Component的options属性中指定
```js
Component({
	options:{
		multipleSlots：true//在组件定义时的选项中启用多slot支持
	}
})
```

设置多个插槽后需要设置插槽的name属性,并在使用时指定这个属性来使用不同的插槽
```wxml
//定义组件
<view>
	<slot name="a"></slot>
	<slot name="b"></slot>
</view>

//声明组件为test标签后使用
<test>
	<view slot="a">a插槽中的内容</view>
	<view slot="b">b插槽中的内容</view>
</test>
```

### 组件间的通信
1. 属性绑定
	用于父组件向子组件的指定属性设置数据，仅能设置JSON兼容的数据
2. 事件绑定
	用于子组件向父组件传递数据，可以传递任意数据
3. 获取组件实例
	父组件还可以通过this.selectComponent）获取子组件实例对象
	这样就可以直接访问子组件的任意数据和方法

## behaviors
behaviors是小程序中，用于实现组件间代码共享的特性，类似于Vue.js中的“mixins"

每个 behavior 可以包含一组属性、数据、生命周期函数和方法。组件引用它时，它的属性、数据和方法会被合并到组件中。

在根目录下创建behaviors文件夹并创建js文件
调用Behavior（Objectobject)方法即可创建一个共享的behavior实例对象，供所有的组件使用：
```js
//调用Behavior（）方法，创建实例对象
//并使用module.exports将behavior实例对象共享出去
module.exports = Behavior({
	//属性节点
	properties:{},
	//私有数据节点
	data:{username:'zs'},
	//事件处理函数和自定义方法节点
	methods:{},
	/其它节点...
})
```

在组件中，使用require(）方法导入需要的behavior，挂挂载后即可访问behavior中的数据或方法
```js
//1.使用require（）导入需要的自定义behavior模块
const myBehavior=require("../../behaviors/my-behavior")
Component({
	//2.将导入的behavior实例对象，挂载到behaviors 数组节点中，即可生效
	behaviors:[myBehavior],
	//组件的其它节点..
})
```

| 可用的节点      | 类型           | 描述             |
| ---------- | ------------ | -------------- |
| properties | Object Map   | 同组件的属性         |
| data       | Object       | 同组件的数据         |
| methods    | Object       | 同自定义组件的方法      |
| behaviors  | String Array | 引入其它的 behavior |
| created    | Function     | 生命周期函数         |
| attached   | Function     | 生命周期函数         |
| ready      | Function     | 生命周期函数         |
| moved      | Function     | 生命周期函数         |
| detached   | Function     | 生命周期函数         |
