---
title: 5 CSS3
createTime: 2025/06/18 21:06:16
permalink: /front/css/5/
---

# 选择器

## 属性选择器

| 选择符           | 简介                     |
| ------------- | ---------------------- |
| E[att]        | 选择具有att属性的E元素          |
| E[att="val"]  | 选择具有att属性且属性值等于val的E元素 |
| E[att^="val"] | 匹配具有att属性且值以val开头的E元素  |
| E[att$="val"] | 匹配具有att属性且值以val结尾的E元素  |
| E[att*="val"] | 匹配具有att属性目值中含有val的E元素  |

## 结构伪类选择器
结构伪类选择器主要根据文档结构来选择器元素，常用于根据父级选择器里面的子元素
根据结构选择

| 选择符              | 简介             |
| ---------------- | -------------- |
| E:first-child    | 匹配父元素中的第一个子元素E |
| E:last-child     | 匹配父元素中最后一个E元素  |
| E:nth-child(n)   | 匹配父元素中的第n个子元素E |
| E:first-of-type  | 指定类型E的第一个      |
| E:last-of-type   | 指定类型E的最后一个     |
| E:nth-of-type(n) | 指定类型E的第n个      |

n可以是数字，关键字和公式
n如果是数字，就是选择第n个子元素,元素的索引从1开始
n可以是关键字：even偶数，odd奇数

```css
ul 1i:nth-child(2){
	background-color:skyblue;
}
```

n是公式:常见的公式如下（如果n是公式，则从0开始计算，但是第0个元素或者超出了元素的个数会被忽略）

| 公式   | 取值               |
| ---- | ---------------- |
| 2n   | 偶数               |
| 2n+1 | 奇数               |
| 5n   | 5,10,15......    |
| n+5  | 从第5个开始（包含第五个）到最后 |
| -n+5 | 前5个（包含第5个）       |

```css
        section div:nth-child(1) {
            background-color: red;
        }
        
        section div:nth-of-type(1) {
            background-color: blue;
        }

    <section>
        <p>光头强</p>
        <div>熊大</div>//blue
        <div>熊二</div>
    </section>
```

type和child的不同

nth-of-type会把指定元素的盒子排列序号
执行的时候首先看：nth-chiLd(1)之后回去看前面div

nth-child会把所有的盒子都排列序号
执行的时候直接看:nth-child(1)

## 伪元素选择器
伪元素选择器可以帮助我们利用CSS创建新标签元素，而不需要HTML标签，从而简化HTML结构。

| 选择符      | 简介               |
| -------- | ---------------- |
| ::before | 在元素内部的前面插入内容     |
| ::after  | 在元素内部的后面插入内容<br> |

- before和after创建一个元素，但是属于行内元素
- 新创建的这个元素在文档树中是找不到的，所以称为伪元素
- before和after必须有content属性
- before在父元素内容的前面创建元素，after在父元素内容的后面插入元素
- 伪元素选择器和标签选择器一样，权重为1

**黑色遮罩层**
若想要实现黑色遮罩层可以先做一个与原盒子相同大小的盒子设置其背景颜色和透明度,先设置为不显示,然后设置鼠标经过时间
```css
.tudou:hover .mask{
	display:block;
}
```
这样的写法是当鼠标经过的时候设置mask属性可见

CSS3之后可以使用伪元素选择器创建遮罩
```css
        .tudou::before {
            content: '';
            display: none;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .4) url(images/user.jpg) no-repeat center;
        }

        .tudou:hover::before{
            display: block;
        }
```
这样写法是当鼠标经过时调用该伪元素选择器

**伪元素选择器清除浮动**
后面两种伪元素清除浮动算是第一种额外标签法的一个升级和优化

```css
.clearfix:before,.clearfix:after{
	content:"";
	display:table;
}
.clearfix:after{
	clear:both;
}
```

# 盒子模型
CSS3中可以通过box-sizing来指定盒模型，有2个值：即可指定为content-box、border-box，这样我们计算盒子大小的方式就发生了改变。

传统模式宽度计算：盒子的宽度=CSS中设置的width+border+padding
CSS3盒子模型：盒子的宽度=CSS中设置的宽度width里面包含了border和padding

原本的盒子模型在更改border和padding值时盒子也会跟着变大,若想要盒子保持原尺寸只能再减去border和padding的值
css3新增的盒子模型的border和padding不会向外扩大,而是向内扩大

1. box-sizing:content-box盒子大小为width+padding+border（以前默认的）
2. box-sizing:border-box盒子大小为width
如果盒子模型我们改为了box-sizing:border-box，那padding和border就不会撑大盒子了（前提padding和border不会超过width宽度）

# 滤镜filter
filter CSS属性将模糊或颜色偏移等图形效果应用于元素

语法
```css
filter:函数();
```

例如：
blur模糊处理,数值越大越模糊
```css
filter:blur(5px);
```

# 计算
calc是英文单词colculate（计算）
可以让属性进行一些数值计算

如:让子盒子宽度永远比父盒子小30像素
```css
.son{
	width:calc(100%-30px);
}
```

# 过渡
过渡（transition)是CSS3中具有颠覆性的特征之一，我们可以在不使用Flash动画或JavaScript的情况下，当元素从一种样式变换为另一种样式时为元素添加效果。

过渡动画：是从一个状态渐渐的过渡到另外一个状态
切换状态时会调用

```css
transition: 要过渡的属性 花费时间 运动曲线 开始时间;
```
1. 属性：想要变化的css 属性，宽度高度 背景颜色 内外边距都可以。如果想要所有的属性都变化过渡，写一个all就可以。
2. 花费时间：单位是秒（必须写单位）比如0.5s
3. 运动曲线：默认是ease（可以省略）
4. 何时开始：单位是秒（必须写单位）可以设置延迟触发时间默认是0s（可以省略）

示例:
要想更改的属性都有过度效果需要使用逗号隔开
让所有属性变化都有过度效果写all即可
```css
        div {
            width: 200px;
            height: 100px;
            background-color: pink;
            transition: width .5s,height .5s;
	        /* transition: all .5s; */
        }

        div:hover {
            width: 400px;
            height:200px;
        }
```

# 2D转换

## 移动
根据给定的x,y坐标移动
```css
transform: translate(x,y)
```
若某个坐标不需要移动给参数0即可
也可以单独移动一个坐标:`translateX`和`translateY`

translate最大的优点：
1. 不会影响到其他元素的位置
2. translate中的百分比单位是相对于自身元素的translate:(50%,50%);
3. ==对行内标签没有效果==

## 旋转
rotate里面跟度数，单位是deg比如rotate(45deg)
角度为正时，顺时针，负时，为逆时针
默认旋转的中心点是元素的中心点
```css
transform:rotate(度数)
```

## 转换中心点
设置元素转换的中心点
```css
transform-origin:X Y;
```
后面的参数×和y用空格隔开x y 
默认转换的中心点是元素的中心点 (50%50%)
还可以给xy设置像素或者方位名词J(top bottom left right center)

## 缩放
transform:scale(2,2）：宽和高都放大了2倍
transform:scale(2）：只写一个参数，第二个参数则和第一个参数一样，相当于scale(2,2)
transform:scale(0.5,0.5) : 缩小sacle缩放最大的优势：可以设置转换中心点缩放，默认以中心点缩放的，而且不影响其他盒子
```css
transform:scale(x,y);
```

## 综合写法
```css
transform: translate（50px, 50px) rotate(180deg);
```
其顺序会影转换的效果。（先旋转会改变坐标轴向）
==当我们同时有位移和其他属性的时候，记得要将位移放到最前面==

# 动画

可通过设置多个节点来精确控制一个或一组动画，常用来实现复杂的动画效果。
相比较过渡，动画可以实现更多变化，更多控制，连续自动播放等效果。

```css
//定义动画
        @keyframes 动画名称 {
            0% {
                效果
            }

            100% {
                效果
            }
        }

//调用动画
div{
	animation-name:动画名称;
	//持续时间
	animation-duration:持续时间;
}
```
**动画序列**
0%是动画的开始，100%是动画的完成。这样的规则就是动画序列。
关键词from"和"to”，等同于0%和100%。
可以分割动画序列设定多个状态

| 属性                        | 描述                                       |
| ------------------------- | ---------------------------------------- |
| @keyframes                | 规定动画。                                    |
| animation                 | 所有动画属性的简写属性，除了animation-play-state属性。    |
| animation-name            | 规定@keyframes动画的名称。（必须的）                  |
| animation-duration        | 规定动画完成一个周期所花费的秒或毫秒，默认是0。（必须的）            |
| animation-timing-function | 规定动画的速度曲线，默认是"ease"                      |
| animation-delay           | 规定动画何时开始，默认是0。                           |
| animation-iteration-count | 规定动画被播放的次数，默认是1，还有infinite               |
| animation-direction       | 规定动画是否在下一周期逆向播放，默认是“normal“,alternate逆播放 |
| animation-play-state      | 规定动画是否正在运行或暂停。默认是"running"还有"pause"。     |
| animation-fill-mode       | 规定动画结束后状态，保持forwards回到起始backwards<br>    |

## 动画属性简写
```css
animation：动画名称 持续时间 运动曲线 何时开始 播放次数 是否反方向 动画起始或者结束的状态;
```
简写属性里面不包含animation-play-state

## 动画曲线
animation-timing-function：规定动画的速度曲线，默认是"ease'


| 值           | 描述                      |
| ----------- | ----------------------- |
| linear      | 动画从头到尾的速度是相同的。匀速        |
| ease        | 默认。动画以低速开始，然后加快，在结束前变慢。 |
| ease-in     | 动画以低速开始。                |
| ease-out    | 动画以低速结束。                |
| ease-in-out | 动画以低速开始和结束。             |
| steps()     | 指定了时间函数中的间隔数量（步长）       |

# 3D转换

## translate3d
3D移动在2D移动的基础上多加了一个可以移动的方向，就是z轴方向。

## 透视perspective
在2D平面产生近大远小视觉立体，但是只是效果二维的
如果想要在网页产生3D效果需要透视
设置视距,视距越大看到的图形越小,设置到盒子中
```css
perspective:200px;
```

## 3D旋转rotate3d
3D旋转指可以让元素在三维平面内沿着x轴，y轴，z轴或者自定义轴进行旋转。

```css
transform:rotate3d(x,y,z,deg)
```
沿着自定义轴旋转 deg为角度（了解即可)xyz是表示旋转轴的矢量，是标示你是否希望沿着该轴旋转，最后一个标示旋转的角度。

## 3D呈现transfrom-style

控制子元素是否开启三维立体环境。
transform-style:flat子元素不开启3d立体空间默认的
如果不开启3d空间,当子盒子3d变换后能看到变换的效果,如果再进行3d变换子盒子会丢失3d效果
transform-style:preserve-3d;子元素开启立体空间
代码写给父级，但是影响的是子盒子