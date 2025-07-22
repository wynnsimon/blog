---
title: 1、内存分区
createTime: 2025/06/22 11:11:38
permalink: /cpp/cpp/
---
## 内存分区的意义
不在任何函数里声明的变量就是全局变量，全局变量可被任何函数共享使用

## 程序运行前

在程序编译后，生成了exe可执行程序，未执行该程序前分为两个区域
内存分区模型

### 代码区：
存放函数体的二进制代码，由操作系统进行管理的
代码区是共享的，共享的目的是对于频繁被执行的程序，只需要在内存中有一份代码即可
代码区是只读的，使其只读的原因是防止程序意外地修改了它的指令

### 全局区：
全局变量和静态变量及常量存放在此
全局区还包含了常量区,字符串常量和其他常量也存放在此
该区域的数据在程序结束后由操作系统释放

## 程序运行后

### 栈区:
由编译器自动分配释放,存放函数的参数值,局部变量等
注意事项：不要返回局部变量的地址，栈区开辟的数据由编译器自动释放
第一次可以正确返回局部变量这是因为编译器做了保留，第二次就无法正确返回了

### 堆区:
由程序员分配释放若程序员不释放,程序结束时由操作系统回收
new关键字开辟的空间是在堆区

#### new和delete
new申请一个空间
delete删除new的空间

```cpp
//new
new int;
new Stash;
new int[10]

//delete
delete p;
delete[] p;
```

```cpp
int * psome = new int [10];
delete[] psome;
```

new一个数组的时候delete时也要加方括号，不带方括号的话只会删除第一个
new执行的是第一个元素的地址，加方括号是告诉程序它应该释放整个数组而不仅仅是一个元素

不要用delete释放不是new分配出来的空间
不要用delete多次释放同一块空间

如果new之后不用delete释放空间会造成内存泄露

# 引用和赋值
引用的本质的内部实现就是一个指针常量

```cpp
//赋值
int a;
a=10:

//引用
int a=10;
int &b=a;
int c=20;
int &b=c;//error
```

引用必须初始化，一旦初始化后就不能更改

## 引用传递

```cpp
//1、值传递
void swap1(int a,int b){
	int temp=a;
	a=b;
	b=temp;
}

//2、地址传递
void swap2(int *a,int *b){
	int temp=*a;
	*a=*b;
	*b=temp;
}

//3、引用传递
void swap3(int &a,int &b){
	int temp=a;
	a=b;
	b=temp;
}

int main(){
	int a=10;
	int b=20;

	swap1(a,b);//a=10,b=20
	swap2(&a,&b);//a=20,b=10
	swap3(a,b);//a=20,b=10

	return 0;
}
```

值传递形参不会修饰实参
地址传递和引用传递形参会修饰实参

## 引用做函数返回值

```cpp
int& test() {
    int a = 10;
    return a;
}

int main() {
    int& ref = test();
    cout << ref << endl;//10
    cout << ref << endl;//其他数字
    cout << ref << endl;
  
	//函数调用的左值
	int &ref2=test();
	cout<<ref2<<endl;//10
	cout<<ref2<<endl;//10
	test()=1000;
	cout<<ref2<<endl;//1000
	cout<<ref2<<endl;//1000

    return 0;
}
```

不要返回局部变量的引用
因为函数内的变量会放在栈区，程序运行完就清除，第一次返回正确结果是因为编译器保留了变量，后续几个返回都是错误，在vs2022依旧会返回正常结果但代码本身就有错误。

如果函数的返回值是一个引用那么这个函数的调用可以作为左值

# 指针

指针常量和常量指针
指针常量：指向的值不变
const int * p1=&a;
常量指针：指针时固定的不可改变指向，但可修改值
int * const p2=&b;

# 作用域
# default arguments默认参数缺省参数值

default argument写在.h文件里不能写在.cpp文件中

# 内联函数  
在声明函数前加inline关键字  

调用函数的时候把函数代码嵌入到调用它的地方去，保持函数的独立性(有自己的空间)  
每次调用都要把inline函数的body插入到需要调用的地方，程序有很多处需要调用的地方的话程序就会变长，会牺牲代码的空间，降低调用函数时的overhead额外的开销(减少时间)  
宏也可以做类似的事情，但宏不能做类型检查，inline作为函数来说是可以由编译器做类型检查，比宏更安全

```cpp
//1
#define f(a) (a)+(a)

main()
{
	double a=4;
	printf("%d",f(a));
}

//2
inline int f(int i)
{
	return i*2;
}

main()
{
	double a=4;
	printf("%d",f(a));
}
```
inline的函数只会存在于编译器中，生成的可执行文件是不存在的  
如果函数很小可能会被编译器自动inline  
如果inline函数过于巨大，编译器就可能就会拒绝inline函数如:函数中具有复杂的循环和递归(递归不能inline)递归需要不断地进栈出栈

```cpp
inline int plusOne(int x);
inline int plusOne(int x) { return ++x; };
```
在.h文件和.cpp文件都要写inline  
声明类时就给出成员函数的函数体(把函数体写到class声明里面)，就会默认是内联函数

```cpp
class Cup
{
	int color;
public:
	int getColor() { return color; }
	void setColor(int color)
	{
		this->color =color;
	}
};	
```
这里调用getcolor和setcolor时是和直接访问color的运行效率是没区别的，这样做了函数的隔绝

```cpp
class Rectangle
{
	int width, height;
public:
	Rectangle(int w = 0,int h = 0);
	int getWidth() const;
	void setWidth(int w);
	int getHeight() const;
	void setHeight(int h);
};
inline Rectangle::Rectangle(int w, int h)
: width(w)，height(h){}
	inline int Rectangle::getWidth() const
	{
		return width;
	}
```
这样写与直接把函数体写在class里面没区别，但是保持了class简洁

inline  
小函数，2或3行  
经常调用的函数 如:循环内部  
not inline  
非常大的函数，超过20行  
递归函数

# 命名空间
C++通过引用命名空间来解决命名冲突的问题
简单来说命名空间就是定义了一个范围

# 创建命名空间

使用namespace关键字定义命名空间

```cpp
namespace a{
	int num1=10;
}

cout<<a::num1<<endl;
```

命名空间可以嵌套
```cpp
namespace a{
	int num1=10;
	
	namespace a1{
		char c='a';
	}
}

cout<<a::a1::c<<endl;
```

命名空间时开放的，可以随时随地向命名空间中添加成员
```cpp
namespace a{
	int num1=10;
}

//追加
namespace a{
	int num2=20;
}
```

# using关键字

```cpp
using namespace a;
```
将a内的所有内容引用到目前的命名空间中

好处：调用该命名空间内的函数时不需要重复声明命名空间
坏处：可能导致命名空间被污染

```cpp
using a::num1;
```
using指定命名空间中的指定成员

如果引用命名空间中存在和当前命名空间中同名字的成员，默认使用当前命名空间中的成员
```cpp
namespace a{  
    int n=10;  
}  
  
int main(){  
    int n=20;  
    using namespace a;  
    cout<<n<<endl;  //20
    cout<<a::n<<endl;//10
    return 0;  
}
```
这种情况如果想要使用命名空间a中的n就只能用前缀声明命名空间了

如果引用多个命名空间中存在相同名字的成员，且当前命名空间内没有这个成员，就会出现二义性，这种情况只能用前缀声明命名空间了
```cpp
namespace a{  
    int n=10;  
}  
  
namespace b{  
    int n=11;  
}  
  
int main(){  
    using namespace a;  
    using namespace b;  
    cout<<n<<endl;  //error
    return 0;  
}
```

# 异常处理
C++ 异常处理涉及到三个关键字：**try、catch、throw、noexcept**。
*  `try`：识别异常
*  `catch`：捕获异常。
*  `throw`：抛出异常
* `noexcept`：用于声明函数不抛出异常，如果函数抛了异常，则直接中断，不能被捕获

try……catch语法：
```cpp
try
{
   // 保护代码
}catch( ExceptionName e1 )
{
   // catch 块
}catch( ExceptionName e2 )
{
   // catch 块
}catch( ExceptionName eN )
{
   // catch 块
}
```

throw 语法：
```cpp
throw 表达式;
```

执行过程
- 执行 try 块中的语句，如果执行的过程中没有异常拋出，那么执行完后就跳出语句，所有 catch 块中的语句都不会被执行；
- 如果 try 块执行的过程中拋出了异常，那么拋出异常后立即跳转到第一个“异常类型”和拋出的异常类型匹配的 catch 块中执行（称作异常被该 catch 块“捕获”），执行完后再跳转到最后一个 catch 块后面继续执行。
- 如果抛出的异常一直没有函数捕获(catch)，则会一直上传到c++运行系统那里，导致整个程序的终止。

**捕获异常时的注意事项：**
1. catch的匹配过程是找**最先匹配**的，不是最佳匹配。
2. catch的匹配过程中，对类型的要求比较**严格**。**不**允许**标准算术转换**和**类类型的转换**。（类类型的转化包括**两**种：通过构造函数的**隐式类型转化**和通过**转化操作符**的类型转化）。

异常被抛出后，从进入try块起，到异常被抛掷前，这期间在栈上构造的所有对象，都会被自动析构。
析构的顺序与构造的顺序相反，这一过程称为栈的解旋(unwinding).
```cpp
struct Maker {  
    Maker() {cout << "Maker() 构造函数" << endl;}  
    Maker(const Maker &other) {cout << "Maker(Maker&) 拷贝构造函数" << endl;}  
    ~Maker() {cout << "~Maker() 析构函数" << endl;}  
};  
  
void fun() {  
    Maker m;  
    cout << "--------" << endl;  
    throw m;  
    cout << "fun__end" << endl;  
}  
  
int main() {  
    try {  
        fun();  
    }  
    catch (Maker &m) {  
        cout << "收到Maker异常" << endl;  
    }  
}
```

### throw用在函数头和函数体之间
throw 关键字除了可以用在函数体中抛出异常，还可以用在函数头和函数体之间，指明当前函数能够抛出的异常类型，这称为异常规范（Exception specification）也称为异常指示符或异常列表

使用函数异常声明列表来查看函数可能抛出的异常

```cpp
void func() throw (int,double);
```
该声明指出 func 可能抛出int和 double 类型的异常。

```cpp
void func() throw();
```
表示函数 func 不抛出任何异常，而这种写法在 c++11 中被新的关键字 noexcept 异常声明所取代。