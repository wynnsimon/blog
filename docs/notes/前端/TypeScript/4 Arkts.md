---
title: 4 Arkts
createTime: 2025/04/13 19:23:06
permalink: /front/ts/4/
---
# 文件结构
Appscope>app.json5：应用的全局配置信息。
entry：HarmonyOS工程模块，编译构建生成一个HAP包。
	src>main>ets：用于存放ArkTS源码。
	src>main>ets>entryability：应用/服务的入口。
	src>main>ets>pages：应用/服务包含的页面。
	src>main>resources：用于存放应用/服务所用到的资源文件。
	src>main>module.json5：模块应用配置文件。
	build-profile.json5：当前的模块信息、编译信息配置项，包括buildOption、targets配置等。
	hvigorfile.ts：模块级编译构建任务脚本，开发者可以自定义相关任务和代码实现。
	obfuscation-rules.txt：混淆规则文件。。
oh_modules：用于存放三方库依赖信息。
build-profile.json5：应用级配置信息，包括签名signingConfigs、产品配置products等。。
hvigorfile.ts：应用级编译构建任务脚本。

# 布局

## flex弹性布局
Row和Column等线性布局使用和flex类似本质上都是使用的flex布局
但线性布局做了性能优化

## stack层叠布局
在层叠布局中的元素会按照从先往后的顺序包裹后面的元素，对于层叠的位置可以单独设置
可以使用zIndex调节元素显示层级

# 状态管理
对于普通声明的变量只会在初始化时渲染，后续不会刷新
要进行管理需要使用==状态变量==

## 状态变量
状态变量需要装饰器`@State`修饰来声明
状态变量的更改会引起ui的渲染刷新

```arkts
@State
myMsg:string='hello'
```

**定义在组件内的普通变量 或 状态变量，都需要 通过 this 访问**

# 条件语句

## for of
基于范围的for循环
```arkts
for(let item of arr)
```

## ForEach
可以基于数组的个数，渲染组件的个数。
相当于vue中的v-for
```arkts
ForEach(arr,(item,index)=>{})
```

# 样式，结构重用
`@Extend`：扩展组件（样式、事件）
`@Styles`:抽取通用属性、事件
`@Builder`：自定义构建函数（（结构、样式、事件）

## Extend
- Extend参数表示要扩展的组件
当定义好扩展函数后就可以在该组件中调用这个函数了，
```arkts
@Extend(Text)
function textExtend(color:ResourceColor){
	.backgroundColor(color)
	.fontsize(30)
}

Text('1'){
	.textExtend(Color.Red)
}
```

## Style
Style抽取的是通用属性和事件，无需传参，任何组件都可以使用style装饰的函数
在组件内定义的任何变量和函数都可以省略变量/函数声明关键字，定义的变量或函数只能在该组件内部使用
```arkts
//1.全局定义
@Styles
function commonStyles() {
	.width(100)
	.height(100)
	.onclick(()=>{})
}

@Component
struct FancyDemo 
	//2.在组件内定义
	@Styles setBg(){
		.backgroundColor(Color.Red)
	}
	builder(){
		Text()
			.commonstyles()
			.setBg()
	}
}
```

## Builder
在Builder装饰的函数中可以定义组件
```arkts
//全局Builder
@Builder
function navItem(icon: Resource5tr,text: string)
	Column({ space:10 }){
		Image(icon)
			.width('80%');
		Text(text);
	}
	.width('25%)
	.onclick(()=>{
		AlertDialog.show({
			message:'点了'+text
		})
	})
}

Row(){
	navItem($r('app.media.ic_reuse_01'),'阿里拍卖')
	navItem($r('app.media.ic_reuse_02'),'菜鸟')
}
```
# 容器

## scroll滚动容器
scroll中只能有一个子组件，要显示的内容需要放到这个子组件中，子组件设置高度后就无法滚动了

### 常见属性

| 名称             | 参数类型                     | 描述                                                                                |
| -------------- | ------------------------ | --------------------------------------------------------------------------------- |
| scrollable     | ScrollDirection          | 设置滚动方向。<br>ScrollDirection.Vertical 纵向<br>ScrollDirection.Horizontal 横向           |
| scrollBar      | BarState                 | 设置滚动条状态。                                                                          |
| scrollBarColor | string \| number 丨 Color | 设置滚动条的颜色。                                                                         |
| scrollBarWidth | string \| number         | 设置滚动条的宽度                                                                          |
| edgeEffect     | value:Edge               | 设置边缘滑动效果。<br>EdgeEffect.None 无<br>EffectEdgeEffect.Spring 弹簧<br>EdgeEffect.Fade阴影 |

## 绑定容器
以Scroll容器为例
绑定好容器后就可以在组件内使用组件名操控容器了
```arkts
@Component
struct FancyDemo 
	scroller:Scroller=new Scroller()	
	Scroll(scroller){}
}
```
## Tabs
Tab栏组件，其中的组件元素为TabContent组件
TabContent组件内部只允许有一个组件

### 常见属性
- barPosition：调整位置开头或结尾（参数）
- vertical：调整导航水平或垂直
- scrollable：调整是否手势滑动切换
- animationDuration：点击滑动动画时间
- BarMode：设置TabContent组件溢出屏幕时的模式

- onChange(event: (index: number) => void)
Tab页签切换后触发的事件。
-index：当前显示的index索引，索引从0开始计算。
滑动切换、点击切换 均会触发
- onTabBarClick(event: (index: number) => void)10+
Tab页签点击后触发的事件。
-index：被点击的index索引，索引从0开始计算。

# 类
创建类需要使用class关键字
类的成员属性要有初始值，如果不设置初始值需要使用?:符号表示属性可选

在类中定义属性和函数不需要关键字声明
### 构造函数
```arkts
constructor(参数...){}
```
### 静态函数和属性
静态属性和函数声明在前面加上static关键字

### 继承
继承使用extends关键字
在子类中可以使用super关键字来获取父类

### instanceof
instanceof运算符可以用来检测某个对象是否是某个类的实例
```arkts
实例对象 instanceof 类名
```


### 权限修饰符
类的方法和属性可以通过修饰符来 限制访问
修饰符包括：readonly、private、protected 和 public。省略不写默认为 public
readonly只可以取值，无法修改
其他权限修饰符的作用和c++一样

### 剩余参数和展开运算符
和js/ts不同，ets的展开运算符无法展开对象，只能用于展开数组

## 接口
接口使用interface关键字声明，接口也是可以继承接口的

# 自定义组件

使用`@Component`注解的struct即自定义组件

`@Entry`注解是==页面的入口==，一个页面只有一个entry

### @Preview
预览器只能预览`@Entry`注解的页面，在自定义页面中加上`@Preview`注解可以预览当前自定义组件

### 插槽
利用 @BuilderParam 构建函数，可以让自定义组件允许外部传递 UI。
```arkts
@Component
struct SonCom {
	// 1.定义 BuilderParam 接受外部传入的 ui，并设置默认值
	@BuilderParam ContentBuilder:()=> void = this.defaultBuilder
	//默认的Builder
	@Builder
	defaultBuilder(){
		Text("默认的内容")
	}
	build(){
		Column(){
			// 2。使用 @BuilderParam 装饰的成员变量
			this.ContentBuilder()
		}
	}
}


@Entry
@Component
struct Index{
	build(){
		Column({ space: 15 }){
			SonCom(){
				//直接传递进来（尾随闭包）
				Button(‘待付款")
			}
		}
	}
}
```

#### 具名插槽
如果一个组件中有多个插槽，那么就无法使用默认的传递ui的方法了
在插入ui时需要使用插槽名指定接收哪个ui
```arkts
SonCom({
	tBuilder: this.fTBuilder,
	cBuilder:this.fCBuilder
})
```

# 状态管理
使用`@State`装饰的状态变量也有不足之处
当变量是简单类型时`@State`可以监听到状态的更新
但当变量是复杂数据类型时，变量更改时能监测到更新，变量内部成员变量更改时也能检测到更新，但如果变量内部也嵌套复杂数据类型，那么变量内的复杂数据内部的成员数据变化时无法监测到更新

## @Prop父子单向同步
@Prop装饰的变量可以和父组件建立单向的同步关系。
@Prop装饰的变量是可变的，但是变化不会同步回其父组件

要想子组件内接收到父组件中的信息能够监听状态变化需要在子组件中对该数据使用`@Prop`装饰器装饰
```arkts
@Component
struct SonCom{
  @Prop sCar:string=''
  build(){
    Column(){
      Text(`子组件${this.sCar}`)
    }
  }
}

@Entry
@Component
struct Index {
  @State fCar:string='RollsRoyce'
  build() {
    Column(){
      Text(`父组件${this.fCar}`)
        .fontSize(30)
        .onClick(()=>{
          this.fCar='MayBach'
        })
        .backgroundColor(Color.Blue)
      SonCom({
        sCar:this.fCar
      })
        .backgroundColor(Color.Pink)
    }
    .backgroundColor(Color.Orange)
  }
}
```
但子组件中数据更改无法传递到父组件中
可以在父组件中定义修改数据的函数，由子组件调用来修改
```arkts
@Component
struct SonCom{
  @Prop sCar:string=''
  change=()=>{}
  build(){
    Column(){
      Text(`子组件${this.sCar}`)
        .onClick(()=>{
          this.change()
        })
    }
  }
}

@Entry
@Component
struct Index {
  @State fCar:string='RollsRoyce'
  build() {
    Column(){
      Text(`父组件${this.fCar}`)
        .fontSize(30)
        .backgroundColor(Color.Blue)
      SonCom({
        sCar:this.fCar,
        change:()=>{
          this.fCar='MayBach'
        }
      })
        .backgroundColor(Color.Pink)
    }
    .backgroundColor(Color.Orange)
  }
}
```
本质上还是修改父组件的数据由`@Prop`将修改的数据传递给子组件
且传递函数时必须使用箭头函数，因为箭头函数中不会更改this的指向，这是js中的遗留问题

## @Link双向同步
使用`@Link`双向同步那么子组件接收到的父组件中的数据就是引用传递，在父子任何一方修改数据都会进行同步
且多层嵌套的复杂数据结构里面数据的修改也能被监测到

## @Provide和@Consume
`@Prop`和 `@Link`只能用作父子间数据的传递，如果由多层子孙结构层层传递就会很麻烦

`@Provide`和 `@Consume`是用于多层级组件中数据的传递，在使用时传递数据的组件使用`@Provide`声明数据，接受数据的一方使用`@Consume`声明数据，且声明数据的变量名必须一致，声明好后二者就进行绑定了，这种绑定是双向的，在任何一方修改都会进行同步
同样的也适用于复杂数据类型

## @observed&@objectLink嵌套对象数组属性变化
装饰器仅能观察到第一层的变化。对于多层嵌套的情况，比如对象数组等。他们的第二层的属性变化是无法观察到的。这就引l出了@Observed/@ObjectLink装饰器。

@observed和@objectLink用于在涉及嵌套对象或数组的场景中进行双向数据同步
==ObjectLink修饰符不能用在Entry修饰的组件中==

# 页面路由

## 页面创建
直接在pages文件夹中创建ets文件即可，然后将文件名注册到main_pages.json的src选项中可以配置主要的页面

## 路由
路由跳转使用router对象，pushUrl是保存历史记录跳转，replaceUrl是无痕跳转

## 页面栈
栈结构
页面栈最多存储35个页面


获取页面栈长度
router.getLength()
清空页面栈
router.clear()

### 路由模式
路由提供了两种不同的跳转模式
1. Standard：无论之前是否添加过，一直添加到页面栈【默认常用】
2. Single：如果目标页面已存在，会将该页面移到栈顶【看情况使用】

在第二个参数设置【路由模式】
router.pushurl(options，mode)

## 路由传参
```arkts
router.pushurl({
	url:'地址',
	params:{
		//以对象的形式传递参数
	}
})

//---页面B接收并解析参数-
aboutToAppear():void{
	// 1.确认内容
	console.log(JsoN.stringify(router.getParams()))
	// 2.通过as类型断言 转为具体的类型
	const params = router.getParams(） as 类型
	// 3.通过点语法即可取值
	params.xxx
}
```

# 生命周期
组件和页面在创建、显示、销毁的这一整个过程中，会自动执行一系列的【生命周期钩子】
区分页面和组件：@Entry
@Entry装饰的是页面性质的组件，页面的生命周期钩子也会更多
1. aboutToAppear：创建组件实例后执行，可以修改状态变量
2. aboutToDisappear：组件实例销毁前执行，不允许修改状态变量
以下仅@Entry修饰的页面组件生效
3. onPageShow：页面每次显示触发（路由过程、应用进入前后台）
4. onPageHide：页面每次隐藏触发（路由过程、应用进入前后台）
5. onBackPress：点击返回触发（returntrue阻止返回键默认返回效果）

# Stage模型

## UIAbility组件

每一个UIAbility实例，都对应于一个最近任务列表中的任务。
UIAbility是一种包含用户界面的应用组件，主要用于和用户进行交互。

一个应用可以有一个UIAbility也可以有多个UIAbility
- 单UIAbility：任务列表只有一个任务。
- 多UlAbility：在任务列表中会有多个任务

一个ability是一个单独的进程
一个应用中有多个模块，一个模块中有多个ability，一个ability中有多个页面
### ability生命周期

- onCreate：Ability创建时回调，执行初始化业务逻辑操作。
- onDestory:Ability销毁时回调，执行资源清理等操作。
- onForeground：当应用从后台转到前台时触发。
- onBackground：当应用从前台转到后台时触发
