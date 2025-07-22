---
title: 1 TypeScript概述
createTime: 2025/06/18 21:06:48
permalink: /front/ts/
---
相比于js,ts将一些运行时错误前置到静态错误检查了

ts的组件需要先通过npm下载

下载ts相关包
```shell
npm i typescript -g
```

### 命令

将ts文件编译成js文件
文件名可带后缀也可不带
```shell
tsc 文件名
```

#### 自动化编译

tsconfig.json常见属性

| 属性                     | 作用                                       |
| ---------------------- | ---------------------------------------- |
| noEmitOnError          | 当出现静态错误是是否提交,如果提交当发生静态错误是对应编译的js文件也会延续错误 |
| target                 | 编译目标js文件的标准                              |
| experimentalDecorators | 实验性装饰器是否打开                               |



1. 创建初始化文件
生成tsconfig.json文件
该文件用于指定要自动化编译的内容,如es标准等
```shell
tsc --init
```

2. 监视需要编译的文件
将要自动编译的文件设为监视,当被监视的文件发生更改就自动编译
可以不指定文件名,不指定文件名表示监视当前目录所有文件
```shell
tsc --watch 文件名
```

# 类型定义

被类型定义的变量无法接收定义类型的其他类型
```ts
let a: string;

a=1; // error
a='hello'; // ok
```

类型定义函数参数和返回值
```ts
function add(x:number,y:number):number{
  return x+y;
}

let res=add(1,2);
```

### 字面量类型
限定一个变量的字面量类型后该变量只能接收对应的字面量
```ts
let b='hello'

b='world'; // error
b='hello'; // ok
```

# 新增数据类型

除了js基本的类型之外,ts还新增了一些数据类型
- any
- unknown
- never
- void
- tuple
- enum
两个用于自定义类型的方式
- type
- interface

### ts提供的基础类型

1. 原始类型VS包装对象
- 原始类型：如number、string、boolean，在JavaScript 中是简单数据类型，它们在内存中占用空间少，处理速度快。
- 包装对象：如Number对象、String对象、Boolean 对象，是复杂类型，在内存中占用更多空间，在日常开发时很少由开发人员自己创建包装对象。

1. 自动装箱：JavaScript在必要时会自动将原始类型包装成对象，以便调用方法或访问属性

在js中基础数据类型都是大写开头的,如:String
ts中推荐使用基础数据类型小写开头的,如:string
他们的不同点是string是基元,而String是string的包装类

```ts
let str1: string//TS官方推荐的写法
str1 = 'hello'
str1 = new String('hello')

let str2: String
str2 = 'hello'
str2 = new String('hello')
```
对于限定类型为string的变量,它不可接收String类型
对于类型限定为String的变量,它既可以接收String类型,也可以接收string类型

## 常用数据类型

### any
any表示任何数据类型
一个变量被限定为any后表示放弃了类型检查

加了any限定的变量可以存储任意的数据类型,这样的类型限定是any的显示类型限定
不对一个变量进行类型限定而直接使用let或var声明的变量它们默认也是使用any限定的,这种事any的隐式类型限定
```ts
let a: any

let b
```

any也可以赋值给任意一个变量
如果一个被限定类型的变量被any变量赋值,那么这个变量就会被破坏

```ts
let a:any
a=false

let b: string
x=a
```
不建议这样做

### unknown
unknown和any用法类似,但不同的是它不会破坏其他变量的类型限定
可以强制开发者在进行赋值时对类型进行检查

```ts
let a:unknown
a=99
a='hello'

let b=string
b=a // error
```
即使是到最后一步被unknown限定的变量转换成了对应的类型也不可以被赋值给限定类型相同的变量

**解决方法**

1. 使用if判断
加上一个类型判断后再进行赋值可以成功
```ts
if(typeof a==='string'){
	b=a
}
```

2. 断言
使用断言的两种写法都可以赋值成功
```ts
b=a as string

b=<string>a
```

对于unknow类型也不可以调用一个对象中的方法,除非使用断言
```ts
let a:unknown
a='hello';
a.toUpperCase(); // error
(a as string).toUpperCase(); // ok
```
因为未知类型不能确定变量是什么类型,也不知道它是否能调用到正确的函数,因此需要手动做类型检查

### never
never的含义是：任何值都不是，简言之就是不能有值undefined、null、""、0都不行
几乎不用never去直接限制变量，因为没有意义
never用在限定函数的返回类型

当never限定了函数的返回类型后,该函数没有返回值也就不能正常结束
即使一个函数不用return设定返回值当它执行结束后也会返回一个undefined

在js中正常的函数调用完成都至少会返回一个undefined,但对于一个出现异常或者进入死循环的函数来说,它永远无法执行到函数的末尾,也就不会有返回值
常用于必然抛出异常的函数,当一个函数抛出异常后后面的代码也就不会执行了也就没有了返回值

never一般是ts自动推断出来的,当一个变量用于达不到一个范围中的代码时,在这个范围中该变量就会被推断为never,如:在无法进入的if判断中

### void
void用于限定函数的返回值,==调用者不该使用返回值做任何操作==

被void限定返回值的函数只能返回undefiined,不能返回其他值
可以显示或隐式返回undefined

但void和undefined又不完全相同,当一个函数的返回值被限定为void后对这个函数的返回值做任何操作都是错误的
而默认的undefined是可以使用的

### object
关于object与Object实际开发中用的相对较少因为范围太大了。

object能接收的类型是非原始类型
如: 字符串,数字类型,布尔型不可以存
但数组,对象,函数可以存

对于Object可以存任何能调用到Object方法的值,包括原始类型中的
但null和undefined不可以存

### 声明对象类型
可以在定义的类型中限定成员属性类型,但限定的成员属性在实例化时必须要传入,
可以加?来可选可不选
```ts
let person{name:string,age?:number};
person={name:'tom'}
```

### 声明函数类型
相当于函数指针
```ts
let count:(a:number,b:string)=>number
```
限定了count变量只能存储第一个形参为number类型的,第二个形参为string类型的,返回值为number的函数

### 声明数组类型
限定一个变量只能存什么类型的数组
```ts
let arr1:string[];
ler arr2:Array<number>
```
arr1只能存字符串数组,arr2只能存数字类型数

### tuple
元组（Tuple）是一种特殊的数组类型，可以存储固定数量的元素，并且每个元素的类型是已知的且可以不同。元组用于精确描述一组值的类型，？表示可选元素。

### enum
枚举（enum）可以定义一组命名常量它能增强代码的可读性，也让代码更好维护

使用enum关键字声明枚举类型

```ts
enum Diection{
	up,
	down,
	left,
	right
}
```

数字枚举一种最常见的枚举类型，其成员的值会自动递增，且数字枚举还具备反向映射的特点，在下面代码的打印中，可以通过值来获取对应的枚举成员名称。

**字符串枚举**
```ts
enum Direction{
	up="shang",
	down="xia",
	left="zuo",
	right="you"
}
```
字符串枚举丢失了反向映射

**常量枚举**
官方描述：常量枚举是一种特殊枚举类型，它使用const关键字定义，在编译时会被内联，避免生
成一些额外的代码。
```ts
const enum Diection{
	up,
	down,
	left,
	right
}
```
所谓“内联”其实就是TypeScript在编译时，会将枚举成员引用替换为它们的实际值，而不是生成
额外的枚举对象。这可以减少生成的JavaScript代码量，并提高运行时性能。

### type

#### 定义别名
定义别名,相当于typedef
```ts
type shuzi=number
```

#### 联合类型
联合类型是一种高级类型，它表示一个值可以是几种不同类型之一
```ts
type status=number | string
type gender='男' | '女'
```

#### 交叉类型
类似继承
交叉类型（lntersectionTypes）允许将多个类型合并为一个类型。合并后的类型将拥有所有被合并
类型的成员。交叉类型通常用于对象类型。
```ts
//面积
type Area ={
	height:number; //高
	width:number; //宽
}

//地址
type Address = {
	num:number //楼号
	cell:number //单元号
	room:string //房间号
}

type House = Area & Address

const house:House={
	height:100，//高
	width:100，//宽
	num:3，//楼号
	cel1:4，//单元号
	room：'702’//房间号
}
```

使用type定义的限定函数返回类型的变量如果是void不要求返回值必须为undefined
```ts
type LogFunc = () => void
const f1:LogFunc = function () {
	return 66
}    //ok
```

这是为了让简写的箭头 函数能够生效
```ts
const src = [1, 2, 3];
const dst = [0];
src.forEach((el) => dst.push(el) );
```
对于forEach函数来说传入的回调函数返回值要是void类型,如果回调函数不设置返回值,返回的是undefined符合要求
但当函数体只有一行的时候可以省略大括号将这一行代码作为返回值,此时就不符合void的定义了

# 继承
在ts中类之间可以使用extends关键字继承,和java中一样
当子类中有父类的同名函数时需要在前面显式加上override关键字表示重写函数,不加override也会有隐式加上

### 属性的简写形式

而且在ts中类的成员属性也可以使用权限修饰符
权限修饰符的设置和C++一样,但用法和java一样
也多了一个修饰符
readonly只读属性属性无法修改。

当一个类中的属性有构造器提供初始化时可以简写
```ts
class Person{
	constructor(public name: string,public age:number){}
}

//相当于
class Person{
	public name,
	public age,
	constructor(name: string,age:number){}
}
```

## 抽象类
可以使用abstract关键字声明抽象类,在抽象类中也是是使用abscract关键字声明抽象函数
和java一样

## 接口
使用interface声明接口,使用implements实现接口
和java一样

interface和type的区别
- 相同点：interface 和type都可以用于定义对象结构，两者在许多场景中是可以互换的。
- 不同点：
	interface：更专注于定义对象和类的结构，支持继承、合并。
	type：可以定义类型别名、联合类型、交叉类型，但不支持继承和自动合并。

# 泛型
泛型允许我们在定义函数、类或接口时，使用类型参数来表示天未指定的类型这些参数在具体使用时，才被指定具体的类型，泛型能让同一段代码适用于多种类型，同时仍然保持类型的安全性。

```ts
function logData<T>(data:T){
	console.log(data)
}
logData<number>(100)
```

# 类型声明文件
类型声明文件是TypeScript 中的一种特殊文件，通常以.d.ts作为扩展名。它的主要作用是为现有的JavaScript代码提供类型信息，使得TypeScript能够在使用这些JavaScript库或模块时进行类型检查和提示。
