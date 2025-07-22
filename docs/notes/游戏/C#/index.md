---
title: 1 C Sharp
createTime: 2025/06/18 21:13:44
permalink: /game/cs/
---
using相当于import

文档注释///

### 浮点型
系统默认double类型
float赋值时必须要带f后缀
decimal十进制类型,其底层是字符串存储的浮点型,表示范围和double一样,负赋值时必须要带m后缀
decimal也是有精度丢失的
否则都会被默认为double类型

浮点型转换只有float转为double,否则就只能强制转换

### 字符串
字符串必须写在双引号里面
字符类型必须写在单引号里面
string

#### 原始字面量
在字符串前加一个@符号这样它里面的转义字符就会失效
```cs
Console.WriteLine("a:\\b\tc\n");    //a:\b    c
Console.WriteLine(@"a:\\b\tc\n");    //a:\\b\tc\n
```
此外使用原始字面量后字符串之间是可以换行的
### 空类型
是null

### 动态类型

和c++的auto一样自动推导类型
在c# 中每种类型都有一个GetType()的成员函数用来判断它的类型
`x.GetType().Name`获取出x的类型

#### var关键字
和js一样是可变类型

#### dynamic关键字

### 运算符
`x is T`如果x是类型T就返回true否则返回false
`x as T`返回转换为类型T的x，如果x不是T则返回null
`x??y`如果x不为空返回x,如果x为空返回y
`<<=`左移且赋值运算符`C <<= 2 `等同于` C = C << 2`
`>>=` 右移且赋值运算符   `C >>= 2` 等同于 `C = C >> 2` 
`&=`   按位与且赋值运算符  `C &= 2` 等同于 `C = C & 2`
`^=`  按位异或且赋值运算符 `C ^= 2` 等同于 `C = C ^ 2`
`\= ` 按位或且赋值运算符  `C \= 2` 等同于 `C = C \ 2 `

`sizeof()` 返回数据类型的大小。`sizeof(int)`，将返回 4.
`typeof()` 返回 class 的类型。`typeof(StreamReader);`
`&` 返回变量的地址。`&a;` 将得到变量的实际地址。
`*` 变量的指针`*a;` 将指向一个变量。
`? :` 条件表达式如果条件为`真 ? 则为 X : 否则为 Y`
`is` 判断对象是否为某一类型。`If( Ford is Car)`检查 `Ford` 是否是 `Car` 类的一个对象。
`as` 强制转换，即使转换失败也不会抛出异常。
```cs
Object obj = new StringReader("Hello");
StringReader r = obj as StringReader;
```
### 数组
数组声明和java一样也需要new关键字
```cs
int[] arr=new int[]{1,2,3};
```

所有的基本类型不指定值得话默认值都是0
所有引用类型默认值都是null

遍历数组
可以使用普通得for和while循环也可以使用foreach,这是专门用于遍历数组的
```cs
int[] arr=new int[3]{1,2,3};

foreach(int temp int arr){
}
```
和C++基于范围的for循环一样,语法简洁,但需要把数组中的数据复制给temp所以在性能上比不过普通的for循环

数组都是有一个`Length`属性的表示此数组中元素的个数

二维数组
int[行，列]

交错数组
int[][]交错数组声明是要制定行的长度，但不能指定列的长度

### 高级参数

**参数数组**
```cs
int func(int[] array){}

// 方法1
func(new int[] {1,2,3});

// 方法2
int[] array2={1,2,3};
func(array2);
```
使用以上方法需要先创建数组再传入,比较繁琐,可以使用`params`关键字修饰参数数组,这样修饰的参数数组可以是不固定的,可以传入多个参数,编译器会自动拼装成一个数组
它前面可以有多个参数,但它前面不能有参数,必须位于形参列表的最后一位
```cs
int func2(params int[] array){}
func2(1,2,3);

int func3(string str,params int[] array){}
func3("hello",1,2,3);
```

**引用**
- 值参数
这种方式复制参数的实际值给函数的形式参数，实参和形参使用的是两个不同内存中的值。在这种情况下，当形参的值发生改变时，不会影响实参的值，从而保证了实参数据的安全。
- 引用参数
这种方式复制参数的内存位置的引用给形式参数。这意味着，当形参的值发生改变时，同时也改变实参的值。
`ref` 关键字声明引用参数
```cs
public void swap(ref int x, ref int y){}
```
- 输出参数
这种方式可以返回多个值。

**传出参数**
在形参声明时在前面使用out关键字声明的参数就是传出参数,传出参数在函数内必须要赋值
在使用函数时传出参数也要用out关键字修饰
```cs
int test(int a,out int b){}

int x;
int y;
test(x,out y);
```

ref参数传入前必须初始化
out参数传入后必须赋值

#### 字符串
字符串虽然是字符数组但是还是有一些不一样的,
字符串无法对其中的字符进行更改

字符串分割
`Split()`传入要分割的符号,它会根据这个符号将字符串分割并返回一个存储结果的字符串数组

### 输入输出
`Console.WriteLine(BaseType input)`输出到控制台
`Console.ReadLine()`从控制台输入,返回的是一个字符串
若要将一个类型的变量转换为另一个类型,可以使用C#提供的工具类`Convert`中的方法,如`ToInt32`等方法,返回值是转换好的数据

#### 格式化输出
有两种方式
```cs
Console.WriteLine("{0}+{1}={2}",a,b,a+b);
```

```cs
Console.WriteLine($"{a}+{b}={a+b}");
```

错误示范:
要像下标索引一样取值,不能取不存在的值
```cs
(“{0}+{0}={2}",34,123,4);    //34+34=4
(“{0}+{0}={3}",34,123,4);    //error
```

### 枚举值
枚举值里面的元素默认整形从0开始自增,也可以自己指定值
```cs
enum Week{
	Sun,    //0
	Mon,    //1
	Tue=10,    //10
	Wed,    //11
	Thu,    //12
	Fri=100,    //100
	Sat    //101
}
```

### 结构体
```cs
struct Student{
	public string name;
	private int age;
}
```

### 委托
关键字`delegate`
和定义函数类似
相当于函数指针,只能指向与自己返回值和形参列表相同的函数
将其实例化就可以指向对应的函数,就可以把这个委托当作此函数使用
```cs
static double Multiply(double param1,double param2){
	return param1 * param2;
}
static double Divide(double param1,double param2){
	return param1/param2;
}

delegate double MyDelegate(double param1,double param2);
MyDelegate delegate1;
delegate1=Myltiply;
```


```cs
delegate void MyDelegate();
void test(){}
MyDelegate md=new MyDelegate(test);
md();
```

委托也就是指针

### 泛型委托
官方定义了无返回值的泛型委托Action和有返回值的委托Func
在Func中最后一个泛型表示的是返回值类型,前面的泛型都是形参类型

### 多播委托
在一个委托中可以存储多个函数,使用+=和-=操作符添加或减去
```cs
void t1(){}
void t2(){}
void t3(){}

Action a=t1;
a+=t2;
a+=t3;

a();

a-=t2;
a();
```
在多播委托中,所有委托的函数都会按顺序执行

# 事件

事件是通过委托实现的
委托只能使用+=和-=来添加或减少,不能使用=赋值

事件需要使用委托来声明
```cs
delegate void MyDelegate();
event MyDelegate myEvent;
```
事件声明后就已经是一个实例了,而委托声明完没有实例
事件只能在类的内部被调用
事件声明为public是提供给外部观测的,在外部依旧无法调用

```cs
class Demo{
	int value;
	public event Action ValueChanged;
	public int Value{
		get{return value;}
		set{
			Value=value;
			ValueChanged?.Invoke();
		}
	}
}
var demo=new Demo();
demo.ValueChanged+=()=>"value改变".Dump();
demo.MyValue=10; 
```

### 异常处理
```cs
try{
	//要捕捉异常的代码块
}catch(异常类型1){
	//出现此异常时的处理
}catch(异常类型2){
	//出现此异常时的处理
}catch(异常类型n){
	//...
}finally{
	//不管有没有异常都会执行的代码
}
```
catch可以有多个
要捕获所有异常可以使用`Exception`

# 类型转换

## 隐式类型转换
自动执行

## 显式类型转换

### 强转

### 使用 Convert 类

Convert 类提供了一组静态方法，可以在各种基本数据类型之间进行转换。

```cs
string str = "123";  
int num = Convert.ToInt32(str);  
```

### 使用 Parse 方法

Parse 方法用于将字符串转换为对应的数值类型，如果转换失败会抛出异常。
```cs
string str = "123.45";  
double d = double.Parse(str);  
```

### 使用 TryParse 方法

TryParse 方法类似于 Parse，但它不会抛出异常，而是返回一个布尔值指示转换是否成功。
```cs
string str = "123.45";  
double d;  
bool success = double.TryParse(str, out d);  
  
if (success) {  
    Console.WriteLine("转换成功: " + d);  
} else {  
    Console.WriteLine("转换失败");  
}
```

# 可空类型

**nullable** 类型（可空类型），可空类型可以表示其基础值类型正常范围内的值，再加上一个 null 值。

例如，`Nullable< Int32 >`，读作"可空的 Int32"，可以被赋值为 -2,147,483,648 到 2,147,483,647 之间的任意值，也可以被赋值为 null 值。类似的，`Nullable< bool >` 变量可以被赋值为 true 或 false 或 null。

声明可空类型需要用到?
? 单问号对 **int、double、bool** 等无法直接赋值为 null 的数据类型进行 null 的赋值，意思是这个数据类型是 Nullable 类型的。
```cs
int? i = 3;
```

## Null 合并运算符（ ?? ）
?? 可以理解为三元运算符的简化形式
```cs
a = b ?? c
```
如果 b 为 null，则 a = c，如果 b 不为 null，则 a = b。

# 值类型和引用数据类型
基础数据类型中除了string和数组其他的都是值类型,struct定义的结构体是值类型,枚举是值类型
string,数组和使用class定义的自定义类型是引用数据类型,接口也是引用数据类型
关于值类型和引用数据类型的应用和java的一样

object是所有类的父类，是引用类型。根据里氏替换原则，父对象容器存储子类对象
装箱：用引用类型存储值类型
拆箱：将引用类型中的值取出来
因为值类型存储在栈上，引用类型存储在堆上，在进行装箱和拆箱的过程中就会引发内存的迁移带来性能消耗
object是引用类型也是基础数据类型（值类型）的父对象，因此object可以和值类型进行装箱拆箱操作
好处：不确定类型是可以方便数据的存储和传递
坏处：存在内存迁移，增加性能消耗
应尽量避免装箱和拆箱

# 序列化与反序列化
序列化的目的是将程序转化成二进制的方式,只有二进制才可以在网络上传输

序列化之前需要将要序列化的目标标记为可序列化的
在C#中标记的语法是在对象前面加上方括号,方括号里面是标记的内容
```cs
[Serializable]
class Person{}

class Program{

	// 序列化
	void t1(){
		Person p=new Person();
		using(FileStream fsWrite=new FileStream (@"test.txt" , FileMode.OpenOrCreate , FileAccess.Write)) {
		BinaryFormatter bf=new BinaryFormatter();
		bf.Serialize(fsWrite,p);
	}

	void t2(){
		using(FileStream fsRead=new FileStream (@"test.txt" , FileMode.OpenOrCreate , FileAccess.Read)) {
		BinaryFormatter bf=new BinaryFormatter();
		Person p=bf.Deserialize(fsRead);
	}

	static void Mani(string[] args){
		t1();
		t2();
	}
}
```

# 弱引用
当一个对象不再被引用后可能还没有被垃圾回收,这段时间还是可以被使用的
但没有引用还是无法找到这个对象

使用WeakReference类来弱引用对象,成员属性Target返回弱引用对象的地址
```cs
Person p=new Person();
WeakReference wr=new WeakReference(p);
p=null

// 重新使用p对象
Person p2=wr.Target;
if(p2 != null){
	// 使用逻辑
}
```
推荐以上示例的使用
```cs
// 不推荐的做法
if(wr.IsAlive){
	Person p2=wr.Target;
	// 使用逻辑
}
```
使用这种方法使用可能会出现在判断到wr还存活进入到函数内部时被释放的情况

# foreach

```cs
foreach(var item int items){}
```
要调用foreach函数的类必须要实现IEnumerable接口中的GetEnumerator()函数,返回的是一个枚举器类型
枚举器类型要继承自IEnumberator类型并实现其中的Current,MoveNext,Reset三个函数
```cs
public class PersonEnumerator:IEnumerator{
	#region IEnumberator成员
	public object Current{
		get{
			if(index>=0 && index<length){
				return index;
			}else{
				throw new IndexOutOfRangeException();
			}
		}
	}
	
	public bool MoveNext(){
		if(index+1<length){
			index++;
			return true;
		}
		return false;
	}

	public void Reset(){
		index = -1;
	}
	
	#endregion
}
```

# 垃圾回收
GC.Collect()手动触发gc，gc性能消耗过大一般不手动调用，一般在游戏加载进度条是手动调用
