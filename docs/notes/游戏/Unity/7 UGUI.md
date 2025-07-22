---
title: 7 UGUI
createTime: 2025/06/22 11:07:34
permalink: /game/unity/7/
---

# UGUI
**六大基础组件**
- Canvas:i画布组件，主要用于渲染UI控件
- CanvasScaler：画布分辨率自适应组件，主要用于分辨率自适应
- GraphicRaycaster：射线事件交互组件，主要用于控制射线响应相关
- RectTransform：Ui对象位置锚点控制组件，主要用于控制位置和对其方式
- EventSystem和StandaloneInputModule:玩家输入事件响应系统和独立输入模块组件，主要用于监听玩家操作

**三大基础控件**
- Image图片
- Text文本控件
- Rawimage大图控件

## Canvas
它是UGUI中所有UI元素能够被显示的根本
它主要负责渲染自己的所有**UI子对象**
如果Ul控件对象不是Canvas的子对象，尹那么控件将不能被渲染
我们可以通过修改Canvas组件上的参数修改渲染方式

**渲染方式**
1. ScreenSpace－Overlay：屏幕空间，覆盖模式，UI始终在前
	PixelPerfect：是否开启无锯齿精确渲染（性能换效果）
	SortOrder：排序层编号（用于控制多个Canvas时的渲染先后顺序）
	TargetDisplay：目标设备（在哪个显示设备上显示）
	AdditionalShaderChannels：其他着色器通道，决定着色器可以读取哪些数据
2. Screen Space - Camera:屏幕空间，摄像机模式，3D物体可以显示在UI之前
	RenderCamera：用于渲染Ul的摄像机（如果不设置将类似于覆盖模式）
	PlaneDistance：Ui平面在摄像机前方的距离，类似整体Z轴的感觉
	SortingLayer：所在排序层
	OrderinLayer：排序层的序号
3. WorldSpace：世界空间，，3D模式

### CanvasScaler
CanvasScaler意思是画布缩放控制器
它是用于分辨率自适应的组件

它主要负责在不同分辨率下UI控件大小自适应
它并不负责位置，位置由之后的RectTransform组件负责

它主要提供了三种用于分辨率自适应的模式
我们可以选择符合我们项目需求的方式进行分辨率自适应

**画布大小和缩放系数**
选中Canvas对象后在RectTransform组件中看到的宽高和缩放
宽高\*缩放系数=屏幕分辨率

**ReferenceResolution参考分辨率**
在缩放模式的宽高模式中出现的参数，参与分辨率自适应的计算

**三种适配模式**
ConstantPixelSize（恒定像素模式）：无论屏幕大小如何，Ul始终保持相同像素大小
ScaleWithScreenSize（缩放模式）：根据屏幕尺寸进行缩放，随着屏幕尺寸放大缩小
ConstantPhysicalSize（恒定物理模式）：无论屏幕大小和分辨率如何，Ui元素始终保持相
同物理大小

**恒定像素模式**
ScaleFactor：缩放系数，按此系数缩放画布中的所有Ul元素
ReferencePixelsPerUnit：单位参考像素，多少像素对应Unity中的一个单位（默认一个单位为100像素）图片设置中的PixelsPerUnit设置，会和该参数一起参与计算

**3D模式**
只有在3D渲染模式下才会启用的模式
主要用于控制该模式下的像素密度

**GraphicRaycaster图形射线投射器**
它是用于检测UI输入事件的射线发射器

Ignore Reversed Graphics:s是否忽略反转图形：控件水平或竖直反转后会无法响应射线投射事件，勾选后反转也可以响应事件
Blocking Objects：射线被哪些类型的碰撞器（3d,2d）阻挡当（在覆盖渲染模式下无效）
Blocking Mask： 射线被哪些层级的碰撞器阻挡（在覆盖渲染模式下无效）

## EventSystem

EventSystem意思是事件系统Event System

它是用于管理玩家的输入事件并分发给各UI控件
它是事件逻辑处理模块
所有的UI事件都通过EventSystem组件中轮询检测并做相应的执行
它类似一个中转站，和许多模块一起共同协作

First Selected:首先选择的游戏对象，可以设置游戏一开始的默认选择
Send Navigation Events:是否允许导航事件 (移动/按下/取消）
	选中一个控件后按方向键或wasd键能切换到其他控件
Drag Threshold: J拖拽操作的值（移动多少像素算拖拽）

### Standalone Input Module
独立输入模块
它主要针对
处理鼠标/键盘/控制器/触屏（新版Unity）TE的输入
输入的事件通过EventSystem进行分发
它依赖于EventSystem组件，他们两缺一不可

HorizontalAxis：水平轴按钮对应的热键名（该名字对应lnput管理器）
Vertical Axis:垂直轴按钮对应的热键名（该名字对应lnput管理器）
SubmitButton:提交（确定）按钮对应的热建名（该名字对应lnput管理器）
Cancel Button:取消按钮对应的热建名（该名字对应lnput管理器）
InputActions PerSecond:每秒充许键盘/控制器输入的数量（长按时每秒最多触发次数）
RepeatDelay:每秒输入操作重复率生效前的延迟时间
ForceModuleActive:是否强制模块处于激活状态

### RectTransform

矩形变换
它继承于Transform
是专门用于处理UI元素位置大小相关的组件

Transform组件只处理位置、角度、缩放
RectTransform在此基础上加入了矩形相关，将Ul元素当做一个矩形来处理
加入了中心点、锚点、长宽等属性
其目的是更加方便的控制其大小以及分辨率自适应中的位置适应

Pivot：轴心(中心)点，取值范围0~1
Anchors(相对父矩形锚点)：
	Min是矩形锚点范围X和Y的最小值
	Max是矩形锚点范围X和Y的最大值
	取值范围都是0~1
Pos(X,Y,Z) : 轴心点(中心点)相对锚点的位置
Width/Height :矩形的宽高
Left/Top/Right/Bottom: 矩形边缘相对于锚点的位置；当锚点分离时会出现这些内容
Rotation: 围绕轴心点旋转的角度
Scale：缩放大小
BlueprintMode（蓝图模式），启用后，编辑旋转和缩放不会影响矩形，只会影响显示内容
RawEditMode（原始编辑模式），启用后，改变轴心和锚点值不会改变矩形位置

**程序中获取RectTransform**
获取到`this.transform`将其类型转换为RectTransform

## Image
渲染层级是在父对象中的顺序

SourceImage：图片来源（图片类型必须是”精灵“类型）
Color:图像的颜色
Material：图像的材质（一般不修改，会使用ui的默认材质）
RaycastTarget：是否作为射线检测的目标（如果不勾选将不会响应射线检测）
Maskable：是否能被遮罩（之后结合遮罩相关知识点进行讲解）
ImageType:图片类型
	Simple-普通模式，均匀缩放整个图片
	Sliced-切片模式，9宫格拉伸，只拉伸中央区域
	Tiled-平铺模式，重复平铺中央部分
	Filled-填充模式
UseSpriteMesh：使用精灵网格，勾选的话Unity会帮我们生成图片网格
PreserveAspect：确保图像保持其现有尺寸
SetNativeSize：设置为图片资源的原始大小

## Text
Text：文本显示内容
Text：文本显示内容
Font:字体
FontStyle：字体样式
FontSize：字体大小
LineSpacing：行之间的垂直间距
RichText：是否开启富文本
Alignment:对其方式
Align By Geometry：使用字形集合形状范围进行水平对其，而不是字形指标
HorizontalOverflow：处理文本太宽无法放入矩形范围内时的处理方式
	Wrap：包裹模式-字体始终在矩形范围内，会自动换行
	Overflow：溢出模式-字体可以溢出矩形框
VerticalOverflow：处理文本太高无法放入矩形范围内时的处理方式
	Truncate:截断模式-字体始终在矩形范围内，超出部分裁剪
	Overflow:溢出模式-字体可以溢出矩形框
BestFit：忽略字体大小，始终把内容完全显示在矩形框中，会自动调整字体大小
	MinSize:最小多小
	MaxSize：最大多大

**描边和阴影不能直接调整，需要使用组件Outline和Shadow**

## RawImage
原始图像组件
是UGUI中用于显示任何纹理图片的关键组件
它和Image的区别是一般RawImage用于显示大图（背景图，不需要打入图集的图片，网络下载的图等等）

Texture：图像纹理
UVRect：图像在UI矩形内的偏移和大小
	位置偏移X和Y (取值0~1)
	大小偏移W和H(取值0~1)
	改变他们图像边缘将进行拉伸来填充UV矩形周围的空间

## Button
Interactable：是否接受输入
Transition：响应用户输入的过渡效果
	None：没有状态变化效果
	ColorTint：用颜色表示不同状态的变化
		TargetGraphic：控制的目标图形
		NormalColor:正常状态颜色
		HighlightedColor：鼠标进入时显示高亮颜色
		PressedColor:按下颜色
		SelectedColor:选中的颜色
		DisabledColor：禁用时的颜色
		ColorMultiplier：颜色倍增器，过渡颜色乘以该值
		FadeDuration：衰减持续时间，从一个状态进入另一个状态时需要的时间
	SpriteSwap：用图片表示不同状态的变化
		HighlightedSprite：选中时图片
		PressedSprite：按下时图片
		DisabledSprite：禁用时显示的图片
	Animation：用动画表示不同状态的变化
		NormalTrigger：正常动画触发器
		HighlightedTrigger：鼠标进入状态时触发器
		PressedTrigger：按下时触发器
		SelectedTrigger：选中时触发器
		DisabledTrigger：禁用时触发器
Navigation：导航模式，可以设置Ui元素如何在播放模式中控制导航
	None：无键盘导航
	Horizontal：水平导航
	Verticval：垂直导航
	utomatic：自动导航
	Explicit：指定周边控件进行导航
OnClick：单击（按下再抬起）执行的函数列表

## Toggle
复选框
自带label组件，如果不需要可以将label删除

IsOn：当前是否处于打开状态
ToggleTransition：在开关值变化时的过渡方式
None：无任何过渡，直接显示隐藏
Fade:淡入淡出
Graphic：用于表示选中状态的图片
AllowSwitchOff：是否允许不选中任何一个单选框
Group:单选框分组，单选框分组组件可以挂载在任何对象上，只需要将其和一组的单选框关联即可
OnValueChanged：开关状态变化时执行的函数列表

## InputField
InputField是输入字段组件
是UGUI中用于处理玩家文本输入相关交互的关键组件

默认创建的InputField由3个对象组成
- 父对象
	InputField组件依附对象以及同时在其上挂载了一个Image作为背景图
- 子对象
	文本显示组件（必备）、默认显示文本组件（必备）

TextComponent：用于关联显示输入内容的文本组件
Text：输入框的起始默认值
CharacterLimit：可以输入字符长度的最大值
ContentType：输入的字符类型限制
LineType：行类型，定义文本格式
Placeholder：关联用于显示初始内容文本控件
CaretBlinkRate：光标闪烁速率
CaretWidth：光标宽
CustomCaretColor:自定义光标颜色
SelectionColor：批量选中的背景颜色
HideMobileInput：隐藏移动设备屏幕上键盘，仅适用于iOS
ReadOnly:只读，不能改
CharacterLimit：可以输入字符长度的最大值

**事件监听**

| 事件             | 作用              |
| -------------- | --------------- |
| OnValueChanged | 值改变时            |
| OnEndEdit      | 结束编辑时。按回车或者失去焦点 |

## Silder
slider是滑动条组件
是UGUI中用于处理滑动条相关交互的关组件

默认创建的slider由4组对象组成
- 父对象
	slider组件依附的对象
- 子对象
	背县图、进度图、滑动块三组对象

FillRect：用于填充的进度条图形
HandleRect：用于滑动的滑动块图形
Direction：滑动涤值增加的方向
MinValue和MaxValue：最小值和最大值，滑动溶动条时值从最小到最大之间变化（左右、上下极值）
WholeNumbers：是否约束为整数值变化
Value：当前滑动条代表的数值
OnValueChanged：滑动条值改变时执行的函数列表

## Scrollbar
Scrollbar是滚动条组件
是UGUI中用于处理滚动条相关交互的关键组件

默认创建的scrollbar由2组对象组成
- 父对象
	Scrollbar组件依附的对象
- 子对象
	滚动块对象

一般情况下我们不会单独使用滚动条
都是配合scrollView滚动视图来使用

HandleRect：关联滚动块图形对象
Direction：滑动条值增加的方向
value：滚动条初始位置值（0~1)
size：滚动块在条中的比例大小（0~1)
NumberOfSteps：允许可以滚动多少次（不同滚动位置的数量）
OnValueChanged：滚动条值改变时执行的函数列表

## ScrollView
ScrollView上挂的组件是ScrollRect
### ScrollRect
ScrollRect是滚动视图组件
是UGUI中用于处理滚动视图相关交互的关键组件

默认创建的scrollRect由4组对象组成
- 父对象
	ScrollRect组件依附的对象 还有一个Image组件 最为背景图
- 子对象
	Viewport控制滚动视图可视范围和内容显示
	Scrollbar Horizontal 水平滚动条
	Scrollbar Vertical 垂直滚动条

Content：控制滚动视图显示内容的父对象，它的尺寸有多大滚动视图就能拖多远
Horizontal：启用水平滚动
Vertical：启用垂直滚动
MovementType：滚动视图元素的运动类型。主要控制拖动时的反馈效果
Inertia：移动惯性，如果开启，松开鼠标后会有一定的移动惯性
DecelerationRate：减速率（0~1），0没有惯性，1不会停止
ScrollSensitivity：滚轮（鼠标中间）和触摸板（笔记本）的滚动事件敏感度
Viewport：关联滚动视图内容视口对象
HorizontalScrollbar：关联水平滚动条
Visibility：是否在不需要时自动隐藏等模式
Spacing：滚动条和视口之间的间隔空间
OnValueChanged：滚动视图位置改变时执行的函数列表

常用属性

| 属性                 | 作用                         |
| ------------------ | -------------------------- |
| content            | 显示的内容                      |
| normalizedPosition | 显示的位置（百分比）<br>             |
| OnValueChanged     | 滚动时触发，参数是vector2类型，表示显示的位置 |

## DropDown
下拉列表

DropDown是下拉列表（下拉选单）组件
是UGUI中用于处理下拉列表相关交互的关键组件

默认创建的DropDown由4组对象组成
- 父对象
	DropDown组件依附的对象还有一个Image组件作为背景图
- 子对象
	Labe1是当前选项描述
	Arrow右侧小箭头
	Template下拉列表选单

Template：关联下拉列表对象
CaptionText：关联显示当前选择内容的文本组件
CaptionImage：关联显示当前选择内容的图片组件
ItemText：关联下拉列表项用的文本控件
ItemImage：关联下拉列表选项用的图片控件
Value：当前所选选项的索引|值
AlphaFadaSpeed：下拉列表窗口淡入淡出的速度
Options：存在的选项列表


| 属性             | 作用      |
| -------------- | ------- |
| value          | 选中的选项   |
| options        | 列表中所有选项 |
| Add            | 添加列表选项  |
| OnValueChanged | 值改变时触发  |

# 图集制作
组件和图集重合时也会打断图集检测

# 事件
## 事件接口

目前所有的控件都只提供了常用的事件监听列表
如果想做一些类似长按，双击，拖拽等功能是无法制作的
或者想让Image和Text，RawImage三大基础控件能够响应玩家输入也是无法制作的

而事件接口就是用来处理类似问题
让所有控件都能够添加更多的事件监听来处理对应的逻辑

**好处：**
需要监听自定义事件的控件挂载继承实现了接口的脚本就可以监听到一些特殊事件可以通过它实现一些长按，双击拖拽等功能
**坏处：**
不方便管理，需要自己写脚本继承接口挂载到对应控件上，比较麻烦

**常用事件接口**

| 继承接口                 | 事件             | 作用                             |
| -------------------- | -------------- | ------------------------------ |
| IPointerEnterHandler | OnPointerEnter | - -当指针进入对象时调用（鼠标进入）            |
| IPointerExitHandler  | OnPointerExit  | - -当指针退出对象时调用 （鼠标离开）           |
| IPointerDownHandler  | OnPointerDown  | - -在对象上按下指针时调用 （按下）            |
| IPointerupHaodler    | OoPointerup    | --松开指针时调用（在指针正在点击的游戏对象上调用）（抬起） |
| IPoibterClickHandler | OnPointerClick | --在同一对象上安下再松开指针时调用（点击）         |
| IBeginDragHandler    | OnBeginDrag    | --即将开始拖动时在拖动对象上调用（开始拖拽）        |
| IpragHandler         | OnDrag         | --发生施动时在拖动对象上调用（拖拽中）           |
| IEndDragHandIer      | OnEndDrag      | --拖动完成时在拖动对象上调用（结束拖拽）          |


**PoniterEventData**
是鼠标相关事件的参数类型

| 属性               | 作用                           |
| ---------------- | ---------------------------- |
| pointerId        | 鼠标左右中键点击鼠标的ID通过它可以判断右键点击     |
| position         | 当前指针位置（屏幕坐标系）                |
| pressPosition    | 按下的时候指针的位置                   |
| delta            | 指针移动增量                       |
| clickCount       | 连击次数                         |
| clickTime        | 点击时间                         |
| pressEventCamera | 最后一个onPointerPress按下事件关联的摄像机 |
| enterEvetnCamera | 最后一个onPointerEnter进入事件关联的摄像机 |

## 事件触发器
事件触发器是EventTrigger组件
它是一个集成了**事件接口**中所有事件接口的脚本
它可以让我们更方便的为控件添加事件监听

可以通过正常的拖拽脚本的方式进行关联

### 使用代码进行添加
使用代码进行添加比较复杂

每次添加事件时都需要创建一个事件类型 对象，一个事件类型只能被一个事件使用
1. 声明一个希望监听的事件对象
Entry是EventTrigger的一个内部类
```cs
EventTrigger.Entry entry=new EventTrigger.Entry();
```

2. 声明事件类型
```cs
entry.eventID=EventTriggerType.PointerUp;
```

3. 关联监听函数 
```cs
entry.callback.AddListener((data)=>{
});
```

4. 把配置好的事件对象添加到EventTrigger中
```cs
eventTrigger.triggers.Add(entry);
```

# 屏幕坐标转ui本地坐标
参数一：相对父对象
参数二：屏幕点
参数三：摄像机
参数四：最终得到的点
一般配合拖拽事件使用
```cs
RectTransformutility.ScreenPointToLocalPointInRectangle
```

# 遮罩
在不改变图片的情遇下
让图片在游戏中只显示其中的一部分

实现遮罩效果的关键组件时Mask组！
通过在父对象上添加Mask组件即可遮罩其子对象
注意：
1. 想要被遮罩的Image需要勾选Maskable
2. 只要父对象添加了Mask组件，那么所有的uI子对象都会被遮罩
3. 遮罩父对象图片的制作，不透明的地方显示，透明的地方被遮罩

# 模型和粒子显示在ui之前

## 模型

### 直接用摄像机渲染3d物体
Canvas的渲染模式要不是覆盖模式
摄像机模式和世界（3D）模式都可以让模型显示在UI之前（Z轴在UI元素之前即可）

注意：
1. 摄像机模式时建议用专门的摄像机渲染UI相关
2. 面板上的3D物体建议也用UI摄像机进行染

### 将3d物体渲染在图片上，通过图片显示
专门使用一个摄像机染3D模型，将其染内容输出到RenderTextue上再将渲染的图显示在UI上
类似小地图的制作方式

该方式不管canvas的染模式是哪种都可以使用

## 粒子特效
粒子特效的显示和3D物体类似
注意点：
在摄像机模式下时可以在粒子组件的Renderer相关参数中改变排序层让粒子特效始终显示在其之前不受z轴影响

# 异形按钮
传统的按钮更换图片后虽然显示是异形的，但是事件还是根据矩形范围判断的

## 1. 添加子对象的方式
按钮之所以能够响应点击，主要是根据图片矩形范围进行判断的
它的范围判断是自下而上的，意思是如果有子对象图片，子对象图片的范围也会算为可点击范围那么我们就可以用多个透明图拼凑不规则图形作为按钮子网象用于进行射线检测

## 2. 改变图片透明度响应阈值
1. 第一步：修改图片参数开启Read/WriteEnabled开关
2. 第二步：通过代码修改图片的响应值
```cs
img.alphaHitTestMinimumThreshold=0.1f
```
该参数含义：指定一个像素必须具有的最小alpha值，以变能够认为射线命中了图片
当像素点alpha值小于了 该值 就不会被射线检测了

但比较浪费性能

# 自动布局组件
虽然uGUI的RectTransform已经非常方便的可以帮助我们快速布局
但UGUI中还提供了很多可以帮助我们对UI控件进行自动布局的组件
他们可以帮助我们自动的设置UI控件的位置和大小等

自动布局的工作方式一般是
自动布局控制组件+布局元素=自动布局

自动布局控制组件：Unity提供了很多用于自动布局的管理性质的组件用于布局
布局元素：具备布局属性的对象们，这里主要是指具备RectTransform的uI组件

### 布局属性
要参与自动布局的布局元素必须包含布局属性

Minmumwidth：该布局元素应具有的最小宽度
Minmum height：该布局元素应具有的最小高度
Preferred width：在分配额外可用宽度之前，此布局元素应具有的宽度
Preferred height：在分配额外可用高度之前，此布局元素应具有的高度。
Flexiblewidth：此布局元素应相对于其同级而填充的额外可用宽度的相对量
Flexibleheight：此布局元素应相对于其同级而填充的额外可用高度的相对量

在进行自动布局时都会通过计算布局元素中的这6个属性得到控件的大小位置
在布局时，布局元素大小设置的基本规则是

1. 首先分配最小大小Minmum width和Minmum height
2. 如果父类容器中有足够的可用空间，则分配Preferred width和Preferred height
3. 如果上面两条分配完成后还有额外空间，则分配Flexible width和Flexible height

一般情况下布局元素的这些属性都是
但是特定的ui组件依附的对象布局属性会被改变，比如Image和Text

一般情况下我们不会去手动修改他们，但是如果你有这些需求
可以手动添加一个LayoutElement组件 可以修改这些布局属性

### 水平垂直布局组件
将子对象并排或者竖直的放在一起
组件： Horizontal Layout Group 和 Vertical Layout Group

参数相关：
Padding：左右上下边缘偏移位置
Spacing：子对象之间的间距
childAlignment：九宫格对其方式
Control child size：是否控制子对象的宽高
Use child Scale：在设置子对象大小和布局时，是否考虑子对象的缩放
child Force Expand：是否强制子对象拓展以填充额外可用空间

### 网格布局组件

将子对象当成一个个的格子设置他们的大小和位置
组件名：Grid Layout Group

参数相关：
Padding：左右上下边缘偏移位置
Cell Size：每个格子的大小
Spacing：格子间隔
StartCorner：第一个元素所在位置（4个角）
Start Axis：沿哪个轴放置元素；Horizontal水平放置满换行，Vertical竖直放置满换列
child Alignment：格子对其方式（9宫格）
Constraint：行列约束
Flexible：灵活模式，根据容器大小自动适应
Fixed Column Count:固定列数
Fixed Row Count：固定行数

## 内容大小适配器
它可以自动的调整RectTransform的长宽来让组件自动设置大小
般在Text上使用或者配合其它布局组件一起使用
组件名：Content Size Fitter

参数相关
Horizontal Fit：如何控制宽度
Mentical Fit:如何控制高度
Unconstrained：不根据布局元素伸展
Min Size：根据布局元素的最小宽高度来伸展
Preferred Size：根据布局元素的偏好宽度来伸展宽度。

### 宽高比适配器
1. 让布局元素按照定比例来调整自己的大小
2. 使布局元素在父对象内部根据父对象大小进行适配
组件名：Aspect Ratio Fitter

参数相关：
Aspect Mode：适配模式，如果调整矩形大小来实施宽高比
	None：不让矩形适应宽高比
	Width Controls Height：根据宽度自动调整高度
	Height Controls Width：根据高度自动调整宽度
	FitInParent：自动调整宽度、高度、位置和锚点，使矩形适应父项的矩形，同时保持宽高比，会出现“黑边”
	Envelope Parent：自动调整宽度、高度、位置和锚点，使矩形覆盖父项的整个区域，同时保持宽高比，会出现“裁剪”
Aspect Ratio：宽高比；宽除以高的比值

# CanvasGroup
如果我们想要整体控制一个面板的淡入淡出 或者整体禁用
使用目前学习的识点是无法方便快捷的设置的

为面板父对象添加 CanvasGroup组件 即可整体控制

参数相关：
Alpha：整体透明度控制
Interactable：整体启用禁用设置
Blocks Raycasts：整体射线检测设置
Ignore Parent Groups：是否忽略父级canvasGroup的作用