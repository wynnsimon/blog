---
title: 4 npm包
createTime: 2025/06/22 10:03:36
permalink: /front/mini-program/4/
---
目前，小程序中已经支持使用npm安装第三方包，从而来提高小程序的开发效率。但是，在小程序中使用

npm 包有如下 3 个限制:
1. 不支持依赖于 Node.js 内置库的包
2. 不支持依赖于浏览器内置对象的包
3. 不支持依赖于C++插件的包

使用npm包还要将style:v2新版样式取消,因为新版样式添加了很多样式可能会导致样式混乱

# vant
vant是一个组件库,导入好后可以像正常的组件一样使用

## 自定义属性
声明一个自定义属性，属性名需要以两个减号（--）开始，属性值则可以是任何有效的CSS值。和其他属性一样，自定义属性也是写在规则集之内的
```js
element{
	--main-bg-color:brown;
}
```
规则集所指定的选择器定义了自定义属性的可见作用域。通常的最佳实践是定义在根伪类
在使用局部变量时传入到var函数中即可
```js
element {
	background-color::var（--main-bg-color);
}
```

# api promise化
在小程序中，实现APl Promise 化主要依赖于miniprogram-api-promise这个第三方的npm 包。

# 全局数据共享
```js
import {observable，action} from 'mobx-miniprogram'
export const store=observable（{
	//数据字段
	numA:1,
	numB:2,
	//计算属性
	geksum(){
		return this.numA + this.numB
	}
	//actions方法，用来修改store中的数据
	updateNum1:action（function（step）{
		this.numA += step
	}),
	updateNum2:action（function（step){
		this.numB += step
	}),
})
```

# 分包
分包指的是把一个完整的小程序项目，按照需求划分为不同的子包，在构建时打包成不同的分包，用户在使用时按需进行加载

可以优化小程序首次启动的下载时间
在多团队共同开发时可以更好的解耦协作

分包前，小程序项目中所有的页面和资源都被打包到了一起，导致整个项目体积过大，影响小程序首次启动的下载时间。

分包后，小程序项目由1个主包+多个分包组成：
- 主包：一般只包含项目的启动页面或TabBar页面、以及所有分包都需要用到的一些公共资源
- 分包：只包含和当前分包有关的页面和私有资源

在小程序启动时，默认会下载主包并启动主包内页面
tabBar页面需要放到主包中

当用户进入分包内某个页面时，客户端会把对应分包下载下来，下载完成后再进行展示
非tabBar页面可以按照功能的不同，划分为不同的分包之后，进行按需下载

**分包的限制**
整个小程序所有分包大小不超过16M（主包+所有分包）
单个分包/主包大小不能超过2M

### 分包结构
分包后主包放到pages文件夹中
其他的分包在根目录中和pages结构相同,和pages属于同一级

此外还需要在app.json中声明分包的结构
```json
{
	"pages"：[    //主包的所有页面
		"pages/index",
		"pages/logs"
	],
	“subpackages"：[    //通过subpackages节点，声明分包的结构
		{
			"root"：“packageA"，    //第一个分包的根目录
			"pages"：[    //当前分包下，所有页面的相对存放路径
				"pages/cat",
				"pages/dog"
			]
		},{
			"root"：“packageB"，    //第二个分包的根目录
			"name":“pack2",    //分包的别名
			“pages"：[    //当前分包下，所有页面的相对存放路径
				"pages/apple",
				"pages/banana"
			]
		}
	]
}
```

1. 小程序会按subpackages的配置进行分包，subpackages之外的目录将被打包到主包中
2. 主包也可以有自己的pages（即最外层的pages 字段）
3. tabBar页面必须在主包内
4. 分包之间不能互相嵌套

- 主包无法引用分包内的私有资源
- 分包之间不能相互引用私有资源
- 分包可以引用主包内的公共资源

### 独立分包
开发者可以按需，将某些具有一定功能独立性的页面配置到独立分包中。原因如下：
- 当小程序从普通的分包页面启动时，需要首先下载主包
- 而独立分包不依赖主包即可运行，可以很大程度上提升分包页面的启动速度

一个小程序中可以有多个独立分包

要设置独立分包只需要在app.json中的分包设置中将独立分包的independent设为true即可

独立分包和普通分包以及主包之间，是相互隔绝的，不能相互引用彼此的资源！

## 分包预下载

分包预下载指的是：在进入小程序的某个页面时，由框架自动预下载可能需要的分包，从而提升进入后续分包页面时的启动速度。

分包预下载需要在app.json中设置preloadRule预下载规则
- path指出进入该页面时要预下载
- packages指出要预下载的包名
- network指定网络设置,all表示任何网络都预下载,wifi表示在wifi环境下才预下载
```json
"preloadRule":{
	"path":{
		"packages":[
			p1
		]
		"network":"all"
	}
}
```

同一个分包中的页面享有共同的预下载大小限额2M