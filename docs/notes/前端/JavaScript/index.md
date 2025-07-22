---
title: 1 JavaScript概述
createTime: 2025/04/05 12:12:26
permalink: /front/js/
---
JavaScript（简称：JS）是一门跨平台、面向对象的脚本语言。是用来控制网页行为的，它能使网页可交互。

# 引入方式

## 内部脚本
内部脚本：将JS代码定义在HTML页面中JavaScript代码必须位于\<script>\</script>标签之间
在HTML文档中，可以在任意地方，放置任意数量的\<script>
一般会把脚本置于\<body>元素的底部，可改善显示速度

```html
<script>
	alert("Hello JavaScript")
</script>
```

## 外部脚本

外部脚本：将JS代码定义在外部JS文件中，然后引入到HTML页面中
外部JS文件中，只包含JS代码，不包含\<script>标签
\<script>标签不能自闭合(即必须有开始结束两个标签,有的html标签即使没有结束标签也会生效:自闭合,但\<script>标签不行)
```html
<script src="js/demo.js"></script>
```

# 语法

语句末尾的分号可写可不写,建议写上

**注释和java一样**

### 输出语句


##### 将输出内容写入警告框
```js
window.alert(string s)
```

##### 写入HTML输出
```js
document.write(string s)
```

##### 写入浏览器控制台
```js
console.log(string s)
```

# 声明变量
#### var
JavaScript中用var关键字（variable的缩写）来声明变量
JavaScript是一门弱类型语言，变量可以存放不同类型的值

```js
var a=20;
a="张三";
```

特点:
1. 使用var定义的作用域比较大，是全局变量,即使出了作用域符`{}`也还是可以使用
2. 可以重复定义. 可以在定义一个变量后再定义一个同名变量,后定义的会覆盖先定义的

#### let
ECMAScript6新增了let关键字来定义变量。它的用法类似于var，但是所声明的变量，只在let关键字所在的代码块内有效，且不允许重复声明。

#### const
ECMAScript6新增了const关键字，用来声明一个只读的常量。一旦声明，常量的值就不能改变。

**变量在函数内不声明直接赋值则是全局变量**
```js
function fn(){
	num=10
}
fn()
console.log(num)
```

# 数据类型
 - number：数字（整数、小数、NaN(NotaNumber)）
 - string：字符串，单双引皆可
 - boolean:布尔。true，false
 - null：对象为空
 - undefined: 当声明的变量未初始化时，该变量的默认值是undefined

**使用typeof运算符可以获取数据类型**
```js
vara=20;
alert(typeof a);
```

typeof运算符对于null值会返回"Object"。这实际上是JavaScript最初实现中的一个错误，然后被ECMAScript沿用了。现在，null被认为是对象的占位符，从而解释了这一矛盾，但从技术上来说，它仍然是原始值。

### 运算符
大部分运算符和java一样,但多了一个\=\=\=全等运算符

使用\=\=运算符在判断两个值是否相等时会先判断他们的类型是否相同,如果不相同就先进行类型转换然后再比较

使用\=\=\=全等运算符在比较时如果类型不同直接返回false

### 类型转换

#### 将字符类型转换为整形

```js
paseInt(string s)
```
在转换时会从左到右依次进行匹配,如果遇到一个不是数字的字符就会停下不会再转换了
如果开头就是一个非数字的字符就会返回nan

因此
```js
paseInt("12a25");    //12
paseInt("a12");    //nan
```


#### 其他类型转为boolean
- Number：0和NaN为false，其他均转为true。
- String：空字符串为false，其他均转为true。
- Null 和 undefined：均转为false

# 定义函数

在调用函数时传入参数比形参多也是不会报错的,它只会去前几个值作为参数

#### function声明
通过`function`关键字定义函数,函数和python一样形参都不需要指定返回值,返回值也不需要显式声明
```js
function funcName(a,b){}
```

#### var定义
```js
var funcName=function(a,b){}
```

### 匿名函数
匿名函数无法直接调用

#### 函数表达式调用
将匿名函数赋值给一个变量，并且通过变量名称进行调用我们将这个称为函数表达式
```js
let fn=function(){
	//函数体
}
```

#### 立即执行调用
```js
(function(){/函数体})();
```
# 对象

## 数组
有两种定义方式
```js
//var 变量名=new Array(元素列表);
var arr = new Array(1,2,3,4);

//var 变量名=[元素列表];
var arr=[1,2,3,4];
```

#### 属性
- length : 数组的长度

#### 成员函数
- forEach : 遍历整个数组
forEach在遍历时值遍历有值的元素,没值的自动跳过,使用for循环可以都遍历出来
- push : 在末尾添加元素
- splice : 删除,有两个参数,第一个参数是开始删除元素的索引,第二个参数是删除元素的个数

## 匿名函数

```js
(形参列表)=>{函数体}
```

## 字符串
```js
var 变量名=new String("");
var 变量名=""
```
定义字符串有两种方式,在定义的时候使用双引号和单引号没有区别

### 属性
length : 字符串长度

### 成员函数
`charAt(index)`返回指定位置的字符
`indexOf(str)`检索字符串str在字符串中的索引
`trim()`去除字符串两边的空格返回去除空格后的字符串,并不会更改原字符串
`substring()`提取字符串中两个指定的索引号之间的字符。左闭右开

## 自定义类型
```js
var 对象名={
	属性名1:属性值1,
	属性名2:属性值2,
	属性名3：属性值3,
	函数名称:function(形参列表){}
};
```

相比于其他语言,js的语法更自由还可以给对象增加或删除属性

添加数据
```js
对象名.新属性名=新值;
```

删除数据
```js
delete 对象名.属性名;
```

调用成员函数
```js
对象名.函数名();
```

自定义类型获取数据有两种方式
```js
对象名.属性名;
对象名['属性名']
```

使用for in循环获取到的属性字段是使用引号引用的字符串字段,因此可以使用方括号和for循环来遍历对象
```js
for(let i int obj){
	console.log(obj[i])
}
```

# 基本数据类型和引用数据类型

简单类型又叫做基本数据类型或者值类型，复杂类型又叫做引用类型。
- 值类型：简单数据类型/基本数据类型，在存储时变量中存储的是值本身，因此叫做值类型
string，number，boolean，undefined，null
- 引用类型：复杂数据类型，在存储时变量中存储的仅仅是地址（引用），因此叫做引用数据类型.通过 new 关键字创建的对象（系统对象、自定义对象），如Object、Array、Date等

const修饰的基本数据类型无法修改数据,但引用数据类型可以修改数据,这是因为const修饰的是指针指向的地址是不变的
## JSON
js中的json的键必须使用双引号引起来
是使用字符串存储的
```js
var 变量名='{"key1":value1,"key2":value2}'
```

#### json和js对象的转换
将字符串str转换为js对象,返回转换成的对象,原字符串不做更改
```js
JSON.parse(str)
```

将js对象转换为json字符串,返回转换后的字符串,原对象不做更改
```js
JSON.stringify(jsobject)
```
