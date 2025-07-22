---
title: 1 类型
createTime: 2025/06/22 12:03:38
permalink: /cpp/modern-cpp/
---
# 新类型
# long long类型

long long是一个至少为64位的整数类型。也就说long long的实际长度可能大于64位。
字面量后缀并不是没有意义的，在某些场合下我们必须用到它才能让代码的逻辑正确
```cpp
long long a=65536<<16;  
long long b=65536LL<<16;  
cout<<a<<endl;//0  
cout<<b<<endl;//4294967296
```
以上代码的目的是将65536左移16位，以获得一个更大的数值。但a计算出来的值是 0原因是在没有字面量后缀的情况下，65536被当作32位整型操 作，在左移16位以后，事实是将0赋值给了a，于是a 输出的结果为0。而在计算b的过程中，代码给65536添加了字面量后缀LL，这使编译器将其编译为 一个64位整型，左移16位后仍然可以获得正确的结果

## 查看类型的最大值和最小值
以C形式的宏查看
```cpp
cout<<LLONG_MAX<<endl;  
cout<<LLONG_MIN<<endl;  
cout<<LONG_LONG_MAX<<endl;  
cout<<LONG_LONG_MIN<<endl;
```

以C++形式的类模板查看
需要包含< limits >头文件
```cpp
cout<<numeric_limits<long long>::max()<<endl;  
cout<<numeric_limits<long long>::min()<<endl;
```

# 新字符类型char8_t 、char16_t和char32_t
它们分别用来对应Unicode字符集的UTF-16和UTF-32两种编码方法
C++11标准还为3种编码提供了新前缀用于声明3种编码字符和字符串的字面量，分别是 UTF-8的前缀u8、UTF-16的前缀u和UTF-32的前缀U
```cpp
char utf8c=u8'a';  //C++17之前智能做字符串前缀，17标准才允许做字符前缀
char16_t utf16c=u'a';  
char32_t utf32c=U'a';
```

使用char类型来处理UTF-8字符虽然可以，但是当库函数需要同时处理多种字符时必须采用不同的函数名称以区分普通字符和UTF-8字符。
C++20标准新引入的类型char8_t可以解决以上问题，它可以代替char作为UTF-8的字符类型。char8_t具有和unsigned char相同的符号属性、存储大小、对齐方式以及整数转换等级。

引入char8_t类型后，在C++17环 境下可以编译的UTF-8字符相关的代码会出现问题
```cpp
char str[] = u8"text"; // C++17编译成功；C++20编译失败，需要char8_t
char c = u8'c';
//反过来也不行
char8_t c8a[] = "text"; // C++20编译失败，需要char 
char8_t c8 = 'c';
```
为了匹配新的char8_t字符类型，库函数也有相应的增加
```cpp
size_t mbrtoc8(char8_t* pc8, const char* s, size_t n, mbstate_t* ps);
size_t c8rtomb(char* s, char8_t c8, mbstate_t* ps);
using u8string = basic_string;
```

# wchar_t宽字符类型
在C++98的标准中提供了一个wchar_t字符类型，并且还提供了前缀L，用它表示一个宽字 符。

字符串连接的规则：如果两个字符串字面量具 有相同的前缀，则生成的连接字符串字面量也具有该前缀,如果其中一个字符串字面量没有前缀，则将其视为与另一个字符串字面量具有相同前缀的字符串字面量.
```cpp
u"a"u"b"=u"ab"
u"a""b"=u"ab"
"a"u"b"=u"ab"
```

# 库对新字符类型的支持
C11在中增加了4个字符的转换函数，包括：
```cpp
size_t mbrtoc16(char16_t* pc16, const char* s,size_t n,mbstate_t* ps );
size_t c16rtomb(char* s, char16_t c16,mbstate_t* ps );
size_t mbrtoc32(char32_t* pc32,const char* s,size_t n,mbstate_t* ps );
size_t c32rtomb(char* s,char32_t c32,mbstate_t* ps );
```
功能分别是多字节字符和UTF-16编码字符互转，以及多字节字符和UTF-32编码字符互转。
需要包含头文件< cuchar >

C++标准库的字符串也加入了对新字符类型的支持
```cpp
using u16string = basic_string;
using u32string = basic_string;
using wstring = basic_string;
```

# POD类型
POD是英文中 ==Plain Old Data== 的缩写，翻译过来就是==普通的旧数据== 。POD在C++中是非常重要的一个概念，`通常用于说明一个类型的属性，尤其是用户自定义类型的属性。`

POD属性在C++11中往往又是构建其他C++概念的基础，事实上，在C++11标准中，POD出现的概率相当高。因此学习C++，尤其是在 C++11中，了解 POD的概念是非常必要的。


> [!NOTE] Title
> ==Plain== ：表示是个普通的类型
> 
> ==Old== ：体现了其与C的兼容性，支持标准C函数

在C++11中将 POD划分为两个基本概念的合集，即∶==平凡的（trivial）== 和==标准布局的（standard layout ）== 。

## 平凡类型
一个平凡的类或者结构体应该符合以下几点要求：
1. **拥有平凡的默认构造函数（trivial constructor）和析构函数（trivial destructor）。**
	平凡的默认构造函数就是说构造函数什么都不干。
	通常情况下，不定义类的构造函数，编译器就会为我们生成一个平凡的默认构造（析构）函数。
	一旦定义了构造（析构）函数，即使构造函数不包含参数，函数体里也没有任何的代码，那么该构造（析构）函数也不再是"平凡"的。
	使用` =default关键字 `可以显式地声明默认的构造函数，从而使得类型恢复 “平凡化”。
2. **拥有平凡的拷贝构造函数（trivial copy constructor）和移动构造函数（trivial move constructor）。**
    - 平凡的拷贝构造函数基本上等同于使用memcpy 进行类型的构造。
    - 同平凡的默认构造函数一样，不声明拷贝构造函数的话，编译器会帮程序员自动地生成。
    - 可以显式地使用=default 声明默认拷贝构造函数。 
    - 而平凡移动构造函数跟平凡的拷贝构造函数类似，只不过是用于移动语义。
3. **拥有平凡的拷贝赋值运算符（trivial assignment operator）和移动赋值运算符（trivial move operator）。**
    这基本上与平凡的拷贝构造函数和平凡的移动构造运算符类似。
4. **不包含虚函数以及虚基类。**
    - 类中使用==virtual 关键字修饰的函数== 叫做虚函数
    - 虚基类是在==创建子类的时候在继承的基类前加virtual 关键字== 修饰
```cpp
语法: class 派生类名：virtual  继承方式  基类名
```

## 标准布局类型
标准布局类型主要主要指的是类（结构体）的结构或者组合方式。
标准布局类型的类应该符合以下五点定义，最重要的为前两条：
1. **所有非静态成员有==相同== 的访问权限（public，private，protected）。**
2. **在类或者结构体继承时，满足以下两种情况之一∶** 
- **派生类中有非静态成员，基类中包含静态成员（或基类没有变量）。**
- **基类有非静态成员，而派生类没有非静态成员。**
```cpp
struct Base { static int a;};  
struct Child: public Base{ int b;};          // ok  
struct Base1 { int a;};  
struct Child1: public Base1{ static int c;}; // ok  
struct Child2:public Base, public Base1 { static int d;); // ok  
struct Child3:public Base1{ int d;};         // error  
struct Child4:public Base1, public Child { static int num;};     // error  
```

> [!NOTE] Title
>- 非静态成员只要同时出现在派生类和基类间，即不属于标准布局。
>- 对于多重继承，一旦非静态成员出现在多个基类中，即使派生类中没有非静态成员变量，派生类也不属于标准布局。

3. **子类中第一个非静态成员的类型与其基类不同。**
```cpp
struct Parent{};  
struct Child : public Parent  {  
    Parent p;	// 子类的第一个非静态成员  
    int foo;  
};
```
改成下面这样子类就变成了一个标准布局类型：
```cpp
struct Parent{};
struct Child1 : public Parent{
	int foo;   // 子类的第一个非静态成员
	Parent p;
};
```
在msvc中可能显示这两个都不是POD类型，这是因为msvc进行了优化
这样规定的目的主要是是节约内存，提高数据的读取效率。对于上面的两个子类`Child`和`Child1`来说它们的内存结构是不一样的，==在基类没有成员的情况下：==
- C++标准允许`标准布局类型（Child1）`派生类的第一个`成员foo与基类共享地址`，此时基类并没有占据任何的实际空间（可以节省一点数据）
- 对于子类`Child`而言，如果子类的第一个成员仍然是基类类型，C++标准要求类型相同的对象它们的地址必须不同（`基类地址不能和子类中的变量 p 类型相同`），此时需要分配额外的地址空间将二者的地址错开。
4. **没有虚函数和虚基类。** 
5. **所有非静态数据成员均符合标准布局类型，其基类也符合标准布局，这是一个递归的定义。**

## 对POD类型的判断

### 对平凡类型的判断
可以使用C++11提供的类模板叫做 `is_trivial`
在头文件<type_traits>中
```cpp
template <class T> struct std::is_trivial;
```
`std::is_trivial` 的成员`value` 可以用于判断T的类型是否是一个平凡的类型（`value 函数返回值为布尔类型`）。除了类和结构体外，`is_trivial`还可以对内置的标准类型数据（比如int、float都属于平凡类型）及数组类型（元素是平凡类型的数组总是平凡的）进行判断。

### 对标准布局类型的判断
也可以使用模板类来判断
在头文件<type_traits>中
```cpp
template <typename T> struct std::is_standard_layout;
```
通过 `is_standard_layout`模板类的成员 `value（is_standard_layout<T>∶∶value）`，我们可以在代码中打印出类型的标准布局属性，函数返回值为布尔类型。

## 总结
我们使用的很多内置类型默认都是 POD的。POD 最为复杂的地方还是在类或者结构体的判断。

POD类型的作用：
1. 字节赋值，代码中我们可以安全地使用memset 和 memcpy 对 POD类型进行初始化和拷贝等操作。 （如果不是POD类型使用这些标准c库的这些函数就可能出现一些问题）
2. 提供对C内存布局兼容。C++程序可以与C 函数进行相互操作，因为POD类型的数据在C与C++ 间的操作总是安全的。 
3. 保证了静态初始化的安全有效。静态初始化在很多时候能够提高程序的性能，而POD类型的对象初始化往往更加简单。

# 右值引用
# 右值引用

左值lvalue(loactor value)是存储在内存中，有明确存储地址（可寻址的变量）的数据，有持久性是非将亡值的泛左值
右值rvalue(read value)一般是不可寻址的常量，或在表达式求值过程中创建的无名临时对象，短暂性的
右值分为两种
纯右值:非引用返回的临时变量、运算表达式产生的临时变量、原始字面量和 lambda 表达式等
将亡值：与右值引用相关的表达式，比如T&& 型函数的返回值，std::move的返回值等

语法：&&
右值引用只能用右值去初始化

右值引用用于延长数据的生命周期

```cpp
int x=1;  
int ret(){return x;}  
  
int main(){  
    cout<<&x++<<endl;  //error
    cout<<&++x<<endl;  
    cout<<&ret()<<endl;  //error
    return 0;  
}
```
x++和++x虽然都是自增操作，但是却分为不同的左右值。其中x++是右值， 因为在后置++操作中编译器首先会生成一份x值的临时复制，然后才对x递增，最后返回临时复制 内容。而++x则不同，它是直接对x递增后马上返回其自身，所以++x是一个左值。如果对它们实施取地址操作，就会发现++x的取地址操作可以编译成功，而对x++取地址则会报错。但是从直觉上来说，&x++看起来更像是会编译成功的一方
ret函数返回了一个全局变量x，虽然变量x是一个左值，但是它经过函数返回以后变成了一个右值。原因和x++类似，在函数返回的时候编译器并不会返回x本身，而是返回x的临时复制，所以也会编译失败

通常除字符串字面量以外字面量都是一个右值
```cpp
cout<<&6<<endl;  //error
cout<<&"hello world"<<endl;
```
编译器会将字符 串字面量存储到程序的数据段中，程序加载的时候也会为其开辟内存空间，所以我们可以使用取 地址符&来获取字符串字面量的内存地址

## 移动语义
### 移动构造函数
使用右值引用的构造函数就是移动构造函数
目的在于复用其他对象中的资源（堆内存）
移动构造函数转移完资源后原来的对象就不具有这个资源了
在进行同类型对象赋值时编程器会查看返回的是否是临时的对象，如果是临时的对象有限调用移动构造函数，如果没有定义移动构造函数则调用拷贝构造函数
```cpp
class Test{  
public:  
    int *num;  
    Test():num(new int(100)){cout<<"构造函数"<<&num<<endl;}  
    Test(const Test& a):num(new int(*a.num)){cout<<"拷贝构造函数"<<endl;}  
    //移动构造函数，复用其他对象中的资源（堆内存），浅拷贝  
    Test(Test&& a):num(a.num){  
        a.num= nullptr;  
        cout<<"移动构造函数"<<endl;  
    }  
    ~Test(){  
        cout<<"析构函数"<<endl;  
        delete num;  
    }  
};  
  
Test get(){  
    Test t;  
    return t;  
}  
  
Test get1(){  
    return Test();  
}  
  
//直接返回右值引用  
Test&& get2(){  
    return Test();  
}  
  
Test t=get();  
cout<<endl;  
Test&& t1=get();  
cout<<&t1.num<<endl;  
cout<<endl;  
  
//如果没有移动构造函数，使用右值引用初始化要求高一些，要求右侧是一个临时的不能取地址的对象  
Test&& t2=get1();  
cout<<t2.num<<endl;
```

### 移动赋值运算符函数
除移动构造函数能实现移动语义以外，移动赋值运算符函数也能完成移动操作
```cpp
Test& operator=(Test&& other){  
    cout<<"移动赋值函数"<<endl;  
    if(num!= nullptr){delete num;}  
    num=other.num;  
    other.num= nullptr;  
    return *this;  
}
```
移动赋值运算符函数的规则和构造函数一样，即编译器对于赋值源对象是右值的情况会优先调用移动赋值运算符函数，如果该函数不存 在，则调用复制赋值运算符函数。

1. 同复制构造函数一样，编译器在一些条件下会生成一份移动构造函数，这些条件包括：没 有任何的复制函数，包括复制构造函数和复制赋值函数；没有任何的移动函数，包括移动构造函 数和移动赋值函数；也没有析构函数。虽然这些条件严苛得让人有些不太愉快，但是我们也不必 对生成的移动构造函数有太多期待，因为编译器生成的移动构造函数和复制构造函数并没有什么区别。

2. 虽然使用移动语义在性能上有很大收益，但是却也有一些风险，这些风险来自异常。试想 一下，在一个移动构造函数中，如果当一个对象的资源移动到另一个对象时发生了异常，也就是 说对象的一部分发生了转移而另一部分没有，这就会造成源对象和目标对象都不完整的情况发 生，这种情况的后果是无法预测的。所以在编写移动语义的函数时建议确保函数不会抛出异常， 与此同时，如果无法保证移动构造函数不会抛出异常，可以使用noexcept说明符限制该函数。这样 当函数抛出异常的时候，程序不会再继续执行而是调用std::terminate中止执行以免造成其他不良 影响。

## 将左值转换为右值
右值引用只能绑定一个右值，如果尝试绑定左值会导致编译错误
```cpp
int i = 0;
int &&k = i; // 编译失败
```
在C++11标准中可以 在不创建临时值的情况下显式地将左值通过static_cast转换为将亡值，通过值类别的内容我们知 道将亡值属于右值，所以可以被右值引用绑定。但是，由于转换的并不是右值，因此它 依然有着和转换之前相同的生命周期和内存地址
```cpp
int i = 0;
int &&k = static_cast(i); // 编译成功
```
这个转换的最大作用是让左值使用移动语义



## 未定引用类型的推导
如果模板参数需要指定为T&& 或自动类型推导需要指定为auto&&时，就被称为未定引用类型，const T&&表示一个右值引用，不是未定引用类型

规则
	通过右值推导T&&或者auto&&得到的是一个右值引用类型
	通过非右值推导T&&或者auto&&得到的是一个左值引用类型

# 转移和完美转发

## 万能引用和引用折叠
常量左值引用既可以引用左值又可以引用右值,是一个几乎万能的引用
```cpp
const int &x = 11;
```
但由于其常量性，导致它的使用范围受到一些限制。其实在C++11中确实存在着一个被称为 “万能”的引用
```cpp
void func(int &&i) {} // i为右值引用
template<typename T>
void bar(T &&t) {} // t为万能引用

int get() { return 5; }
int &&x = get(); // x为右值引用 
auto &&y = get(); // y为万能引用
```
右值引用只能绑定一个右值，但是万能引用既可以绑定左值也可以绑定右值，甚 至const和volatile的值都可以绑定

所谓的万能引用是因为发生了类型推导，在T&&和 auto&&的初始化过程中都会发生类型的推导，如果已经有一个确定的类型，比如int &&，则是右值 引用。在这个推导过程中，初始化的源对象如果是一个左值，则目标对象会推导出左值引用；反 之如果源对象是一个右值，则会推导出右值引用，不过无论如何都会是一个引用类型。
万能引用能如此灵活地引用对象，实际上是因为在C++11中添加了一套引用叠加推导的规 则——引用折叠。在这套规则中规定了在不同的引用类型互相作用的情况下应该如何推导出最终类型

上面的表格显示了引用折叠的推导规则，可以看出在整个推导过程中，只要有左值引用参与 进来，最后推导的结果就是一个左值引用。只有实际类型是一个非引用类型或者右值引用类型 时，最后推导出来的才是一个右值引用。

万能引用的形式必须是T&&或者auto&&，也就是说它们必须在初始化的时候被 直接推导出来，如果在推导中出现中间过程，则不是一个万能引用
```cpp
template<class T>  
void foo(std::vector<T> &&t) {}  
  
int main(){  
    std::vector<int> v{ 1,2,3 };  
    foo(v); // 编译错误  
    return 0;  
}
```
foo(v)无法编译通过，因为foo的形参t并不是一个万能引用，而是一个右值 引用。因为foo的形参类型是std::vector&&而不是T&&，所以编译器无法将其看作一个万能引用处理。

## move()转移
使用std: :move方法可以将左值转换为右值，内部也是用static_cast做类型转换，只不过由于它是使用模板实现的函数，因此会根据传参类型 自动推导返回类型，省去了指定转换类型的代码。。使用这个函数并不能移动任何东西，而是和移动构造函数一样都具有移动语义，将对象的状态或者所有权从一个对象转移到另一个对象，只是转移，没有内存拷贝。
```cpp
Test&& t3= move(t2);  
list<int> ls1{1,45,2,8,3,8,4,6};  
list<int> ls2=move(ls1);
```

## 常规的转发函数模板
```cpp
template<class T>  
void show_type(T t) {  
    cout << typeid(t).name() << endl;  
}  
  
template<class T>  
void normal_forwarding(T t) {  
    show_type(t);  
}  
  
int main() {  
    string s = "hello world";  
    normal_forwarding(s);  
    return 0;  
}
```
它可以完成字符串的转 发任务。但是它的效率却令人堪忧。因为normal_forwarding按值转发，也就是说std::string在转发 过程中会额外发生一次临时对象的复制。其中一个解决办法是将void normal_forwarding(T t)替换 为void normal_ forwarding(T &t)，这样就能避免临时对象的复制。不过这样会带来另外一个问 题，如果传递过来的是一个右值，则该代码无法通过编译
```cpp
string get_string() { return "hi world"; }
normal_forwarding(get_string()); // 编译失败
```
可以将void normal_forwarding(T &t)替换为void normal_forwarding (const T &t) 来解决这个问题，因为常量左值引用是可以引用右值的。
但因为是加了const限定符，参数就是只读的了，后续无法修改

对于万能引用的形参来说，如果实参是左值，则形参被推导为左值引用；反之如果实参是一个右值，则形参被推导为右值引用，所以下面的代码无论传递的是左值还是右值都可以被转发，而且不会发生多余的临时复制
```cpp
template<class T>  
void show_type(T t) {  
    cout << typeid(t).name() << endl;  
}  
  
template<class T>  
void perfect_forwarding(T &&t) {  
    show_type(static_cast<T &&>(t));  
}  
  
string get_string() {  
    return "hi world";  
}  
  
int main() {  
    string s = "hello world";  
    perfect_forwarding(s);  
    perfect_forwarding(get_string());  
    return 0;  
}
```
show_type(static_cast(t));中的类型转换，之所以这里需要用到类型转换，是因为作为形参 的t是左值。为了让转发将左右值的属性也带到目标函数中，这里需要进行类型转换。当实参是一 个左值时，T被推导为std::string&，于是static_cast被推导为static_cast，传 递到show_type函数时继续保持着左值引用的属性；当实参是一个右值时，T被推导为std::string，于是static_cast 被推导为static_cast，所以传递到show_type函数时保持了右 值引用的属性。

## forward完美转发
保证右值引用传递过程中类型不发生变化（右值引用传递可能会变成左值引用）
语法
```cpp
std::forward<T>(t);
```
当T为左值引用类型时，t将被转换为T类型的左值
当T不是左值引用类型时，t将被转换为T类型的右值

## 针对局部变量和右值引用的隐式移动操作
在对旧程序代码升级新编译环境之后，程序运行的效率可能提高了，这是因为新标准的编译器在某些情况下将隐式复制修改为隐式移动。这些是编译器“偷偷”完成的
```cpp
struct X {  
    X() {cout<<"默认构造"<<endl;};  
    X(const X&) {cout<<"拷贝构造"<<endl;}  
    X(X&&) {cout << "移动构造"<<endl;}  
};  
X f(X x) {  
    return x;  
}  
  
int main() {  
    X r = f(X{});  
    return 0;  
}
```
表面上将x赋值给r应该是一次复制，但是对于支持移动语义的新标准，这个地方会隐式地采用移动构造函数来完成数据的交换。

# 类数据成员初始化

# 默认初始化
C++11标准之后可以在类成员声明时同时初始化该成员
```cpp
class A{
private:
	int a=1;
	double b=3.14;
}
```

# 位域默认初始化
在C++20中我们可以对数据成员的位域进行默认初始化
```cpp
struct S{  
    int a:8=11;  
    int b:4{7};  
};  
  
int main() {  
     cout<< sizeof(S)<<endl;  //4
    return 0;  
}
```
int数据的低8位被初始化为11，紧跟它的高4位被初始化为7。
但要注意位域的常量表达式是一个条件表达式
```cpp
int a;
struct S2 { 
	int y : true ? 8 : a = 42;
	int z : 1 || new int { 0 }; 
};
```
这段代码中并不存在默认初始化，因为最大化识别标识符的解析规则让=42和{0}不
可能存在于解析的顶层。
一样代码在编译器中被认为：
```cpp
int a;
struct S2 {  
    int y : (true ? 8 : a = 42);  
    int z : (1 || new int { 0 });  
};
```
可以使用括号表明优先级
```cpp
int a;  
struct S2 {  
    int y : (true ? 8 : a) = 42;  
    int z : (1 || new int){ 0 };  
};
```

# 初始化列表
一般来说，我们称使用括号初始化的方式叫作直接初始化，而使用等号初始化的方式叫作拷 贝初始化（复制初始化）。
这里使用等号对变量初始化并不是调用等号运算符的赋值操 作。实际情况是，等号是拷贝初始化，调用的依然是直接初始化对应的构造函数，只不过这里是隐式调用而已。
C++11标准引入了列表初始化，它使用大括号{}对变量进行初始化，和传统变量初始化的规 则一样，它也区分为直接初始化和拷贝初始化
```cpp
struct C {  
    C(string a, int b) {}  
  
    C(int a) {}  
};  
  
void foo(C) {}  
  
C bar() {  
    return {"world", 5};  
}  
  
int main() {  
    int x = {5}; // 拷贝初始化  
    int x1{8}; // 直接初始化  
    C x2 = {4}; // 拷贝初始化  
    C x3{2}; // 直接初始化  
    foo({8}); // 拷贝初始化  
    foo({"hello", 8}); // 拷贝初始化  
    C x4 = bar(); // 拷贝初始化  
    C *x5 = new C{"hi", 42}; // 直接初始化  
}
```
列表初始化和传统的变量初始化几乎相同，除了foo({"hello", 8}) 和return {"world", 5}这两处不同
它支持隐式调用多参数的构造函数，于是{"hello", 8}和{"world", 5}通过隐式调用构造函数C::C(string a, int b)成功构造了类C的对象。
如果我们不希望编译器进行隐式构造，只需要在特定构造函数上声明explicit即可。

## 聚合体类型初始化列表
普通数组（或满足以下聚合体类型的类的数组）
及满足以下条件的类（class、struct、union）属于聚合体
	无用户自定义的构造函数
	无私有或保护的非静态数据成员 
	无基类
	无虚函数
	类中不能有使用()和=直接初始化的非静态数据成员（C++14就支持了）

类中有私有成员无法使用初始化列表
```cpp
struct A{  
    int a;  
    int b;  
private:  //protected也不行
    int c;  
}t{1,2,3};//error
```

类中有静态成员可以使用初始化列表，但无法初始化静态成员变量
```cpp
struct A{  
    int a;  
    int b;  
    static int c;  
}t{1,2,3};//error
```

列表初始化也支持数组及STL的容器等初始化
```cpp
int x[] = { 1,2,3,4,5 };  
int x1[]{ 1,2,3,4,5 };  
vector<int> x2{ 1,2,3,4,5 };  
vector<int> x3 = { 1,2,3,4,5 };  
list<int> x4{ 1,2,3,4,5 };  
list<int> x5 = { 1,2,3,4,5 };  
set<int> x6{ 1,2,3,4,5 };  
set<int> x7 = { 1,2,3,4,5 };  
map<string, int> x8{ {"bear",4}, {"cassowary",2}, {"tiger",7} };  
map<string, int> x9 = { {"bear",4}, {"cassowary",2}, {"tiger",7} };
```
x8和x9内层{"bear",4}、{"cassowary",2}和{"tiger",7}都隐式调用了std::pair 的构造函数pair(const T1& x, const T2& y)，而外层的{…}隐式调用的则是std::map的构造函数 map(std::initializer_listinit, const Allocator&)。

# std::initializer_list模板类
是一个轻量级的容器类型，一个支持begin、end以及size成员函数的类模板
内部定义了迭代器，迭代器在遍历时是只读的
内部有三个迭代器接口：size()、begin()、end()
它可以接收任意长度的初始化列表，但要求元素必须是相同类型
```cpp
void func(initializer_list<int> l){  
    for (auto it=l.begin(); it != l.end(); it++) {  
        cout<<*it<<endl;  
    }  
}  

func({1,2,3,4,5,6});
```

标准容器之所以能够支持列表初始化，离不开编译器支持的同时，它们自己也必须满足一个 条件：支持std::initializer_list为形参的构造函数。
编译器负责将列表里的元素（大括号包含的内容）构造为一个 std::initializer_list的对象，然后寻找标准容器中支持std:: initializer_list为形参的构造函数 并调用它。而标准容器的构造函数的处理就更加简单了，它们只需要调用std::initializer_list对 象的begin和end函数，在循环中对本对象进行初始化。

同理通过添加一个以std::initializer_list为形参的构造函数，我们也可以写出支持列表初始化的类
```cpp
struct C {  
    C(initializer_list<string> a) {  
        for (const string *item = a.begin(); item != a.end(); ++item) {  
            cout << *item << " ";  
        }  
        cout << endl;  
    }  
};  
  
int main() {  
    C c{"hello", "c++", "world"};  
}
```
std:: initializer_list的begin和end函数并不是返回的迭代器对象，而是一个常量对象指针const T * 。

# 隐式缩窄转换问题
隐式缩窄转换是在编写代码中稍不留意就会出现的，而且它的出现并不一定会引发错误，甚 至有可能连警告都没有，所以有时候容易被人们忽略
```cpp
int x = 12345;  
char y = x;
```

变量y的初始化明显是一个隐式缩窄转换，这在传统变量初始化中是没有问题的， 代码能顺利通过编译。但是如果采用列表初始化，比如char z{ x }，根据标准编译器通常会给出一个错误
以下情况属于隐式缩窄转换
1. 从浮点类型转换整数类型。
2. 从long double转换到double或float，或从double转换到float，除非转换源是常量表达式以 及转换后的实际值在目标可以表示的值范围内。
3. 从整数类型或非强枚举类型转换到浮点类型，除非转换源是常量表达式，转换后的实际值 适合目标类型并且能够将生成目标类型的目标值转换回原始类型的原始值。 
4. 从整数类型或非强枚举类型转换到不能代表所有原始类型值的整数类型，除非源是一个常 量表达式，其值在转换之后能够适合目标类型。 
以下是例子
```cpp
int i = 999;  
const int ci1 = 999;  
const int ci2 = 99;  
const double cd = 99.9;  
double d = 99.9;  
char c1 = i; // 编译成功，传统变量初始化支持隐式缩窄转换  
char c2{ i }; // 编译失败，可能是隐式缩窄转换，对应规则4  
char c3{  ci1 }; // 编译失败，确定是隐式缩窄转换，999超出char能够适应的范围，对应规则4  
char c4{ ci2 }; // 编译成功，99在char能够适应的范围内，对应规则4  
unsigned char uc1 = { 5 }; // 编译成功，5在unsigned char能够适应的范围内，  
// 对应规则4  
unsigned char uc2 = { -1 }; // 编译失败，unsigned char不能够适应负数，对应规则4  
unsigned int ui1 = { -1 }; //编译失败，unsigned int不能够适应负数，对应规则4  
signed int si1 = { (unsigned int)-1 }; //编译失败，signed int不能够适应-1所对应的  
//unsigned int，通常是4294967295，对应规则4  
int ii = { 2.0 }; // 编译失败，int不能适应浮点范围，对应规则1  
float f1{ i }; // 编译失败，float可能无法适应整数或者互相转换，对应规则3  
float f2{ 7 }; // 编译成功，7能够适应float，且float也能转换回整数7，对应规则3  
float f3{ cd }; // 编译成功，99.9能适应float，对应规则2  
float f4{ d }; // 编译失败，可能是隐式缩窄转无法表达double，对应规则2
```

# 列表初始化的优先级问题

列表初始化既可以支持普通的构造函数，也能够支持以 std::initializer_list为形参的构造函数。如果这两种构造函数同时出现在同一个类里，那么编译器会如何选择构造函数呢？
```cpp
vector x1(5, 5);
vector x2{ 5, 5 };
```
以上两种方法都可以对std::vector进行初始化，但是初始化的结果却是不同的。变量x1 的初始化结果是包含5个元素，且5个元素的值都为5，调用了vector(size_type count, const T& value, const Allocator& alloc = Allocator())这个构造函数。
而变量x2的初始化结果是包含两个元 素，且两个元素的值为5，也就是调用了构造函数vector( std::initializer_list init, const Allocator& alloc = Allocator() )。
如果有一个类同时拥有满足列表初 始化的构造函数，且其中一个是以std::initializer_list为参数，那么编译器将优先以 std::initializer_ list为参数构造函数。

# 指定初始化
允许指定初始化数据成员的名称
```cpp
struct Point {
	int x; 
	int y; 
}; 
Point p{ .x = 4, .y = 2 };
```
并不是什么对象都能够指定初始化的。
1. 它要求对象必须是一个聚合类型，例如下面的结构体就无法使用指定初始化：
```cpp
struct Point3D {
	Point3D() {} 
	int x; 
	int y; 
	int z; 
}; 
Point3D p{ .z = 3 }; // 编译失败，Point3D不是一个聚合类型
```
2. 指定的数据成员必须是非静态数据成员。这一点很好理解，静态数据成员不属于某个对 象。
3. 每个非静态数据成员最多只能初始化一次：
```
Point p{ .y = 4, .y = 2 }; // 编译失败，y不能初始化多次
```
4. 非静态数据成员的初始化必须按照声明的顺序进行。
这一点和C语言中指定初始 化的要求不同，在C语言中，乱序的指定初始化是合法的，但C++不行。 因为C++中的数据成员会按照声明的顺序构造，按照顺序指定初始化会让代码更容易阅读
```cpp
Point p{ .y = 4, .x = 2 }; // C++编译失败，C编译没问题
```
5. 针对联合体中的数据成员只能初始化一次，不能同时指定
```cpp
union u { 
	int a; 
	const char* b;
}; 
u f = { .a = 1 }; // 编译成功 
u g = { .b = "asdf" }; // 编译成功
u h = { .a = 1, .b = "asdf" }; // 编译失败，同时指定初始化联合体中的多个数据成员
```
6. 不能嵌套指定初始化数据成员。虽然这一点在C语言中也是允许的，但是C++标准认为这 个特性很少有用，所以直接禁止了
```cpp
struct Line {
	Point a; 
	Point b;
};
Line l{ .a.y = 5 }; // 编译失败, .a.y = 5访问了嵌套成员，不符合C++标准
```
如果确实想嵌套指定初始化，我们可以换一种形式来达到目的：
```cpp
Line l{ .a {.y = 5} };
```
7. 在C++20中，一旦使用指定初始化，就不能混用其他方法对数据成员初始化了，而这一 点在C语言中是允许的
```cpp
Point p{ .x = 2, 3 }; // 编译失败，混用数据成员的初始化
```
8.指定初始化在C语言中处理数组的能力，当然在C++中这同样是被禁止的因为它的语法和lambda表达式冲突了：
```cpp
int arr[3] = { [1] = 5 }; // 编译失败
```

# 委托构造函数和继承构造函数
一个类有多个不同的构造函数在C++中很常见，构造函数包含了太多重复代码，使代码的维护变得困难。
可以写一个共用的初始化函数commoninit来减少重复代码：
```cpp
class X2  
{  
public:  
    X2() { CommonInit(0, 0.); }  
    X2(int a) { CommonInit(a, 0.); }  
    X2(double b) { CommonInit(0, b); }  
    X2(int a, double b) { CommonInit(a, b); }  
private:  
    void CommonInit(int a, double b){  
        a_ = a;  
        b_ = b;  
        c_ = "hello world";  
    }  
    int a_;  
    double b_;  
    string c_;  
};
```
在上面的代码中，std::string类型的对象c_看似是在CommonInit函数中初始化为hello world， 但是实际上它并不是一个初始化过程，而是一个赋值过程。因为对象的初始化过程早在构造函数 主体执行之前，也就是初始化列表阶段就已经执行了。所以这里的c_对象进行了两次操作，一次 为初始化，另一次才是赋值为hello world，很明显这样对程序造成了不必要的性能损失。另外， 有些情况是不能使用函数主体对成员对象进行赋值的，比如禁用了赋值运算符的数据成员。

## 委托构造函数
C++11允许使用同一个类中的一个构造函数调用其他的构造函数，从而简化相关变量的初始化
某个类型的一个 构造函数可以委托同类型的另一个构造函数对对象进行初始化。为了描述方便我们称前者为委托 构造函数，后者为代理构造函数（英文直译为目标构造函数）。
使用方法：在参数列表后加:委托的构造函数名(参数名列表)
参数名列表中没有参数类型

```cpp
class A{  
private:  
    int a;  
    int b;  
    int c;  
public:  
    A(int n1){a=n1;}  
    A(int n1,int n2):A(n1){b=n2;}  
    A(int n1,int n2,int n3): A(n1,n2){c=n3;}  
};
```
这种链式的调用不能构成闭环，会报错

如果一个构造函数为委托构造函数，那么其初始化列表里就不能对数据成员和基类进行初始化：
```cpp
class X  
{  
public:  
    X() : a_(0), b_(0) { CommonInit(); }  
    X(int a) : X(), a_(a) {} // 编译错误，委托构造函数不能在初始化列表初始化成员变量  
    X(double b) : X(), b_(b) {}// 编译错误，委托构造函数不能在初始化列表初始化成员变量  
private:  
    void CommonInit() {}  
    int a_;  
    double b_;  
};
```
委托构造函数的执行顺序是先执行代理构造函数的初始化列表，然后执行代理构造函数的主体，最后执行委托构造函数的主体

如果在代理构造函数执行完成后，委托构造函数主体抛出了异常，则自动调用该类型的析 构函数。
这一条规则看起来有些奇怪，因为通常在没有完成构造函数的情况下，也就是说构造函数发生异常，对象类型的析构函数是不会被调用的。而这里的情况正好是一种中间状态，是否应 该调用析构函数看似存在争议，其实不然，因为C++标准规定，一旦类型有一 个构造函数完成执行，那么就会认为其构造的对象已经构造完成，所以发生异常后需要调用析构函数
```cpp
class X{  
public:  
    X() : X(0, 0.) { throw 1; }  
    X(int a) : X(a, 0.) {}  
    X(double b) : X(0, b) {}  
    X(int a, double b) : a_(a), b_(b) { CommonInit(); }  
    ~X() { cout << "~X()" << endl; }  
private:  
    void CommonInit() {}  
    int a_;  
    double b_;  
};  
  
int main(){  
    try {  
        X x;  
    }  
    catch () {  
    }
}
```
上面的代码中，构造函数X()委托构造函数X(int a, double b)对对象进行初始化，在代理构造函数初始化完成后，在X()主体内抛出了一个异常。这个异常会被main函数的try cache捕获，并且 调用X的析构函数析构对象。

### 委托模板构造函数
一个构造函数将控制权委托到同类型的一个模板构造函数即代理构造函数是一个函数模板。这样做的意义在于泛化了构造函数，减少冗余的代码的产生。
```cpp
class X {  
    template<class T>  
    X(T first, T last) : l_(first, last) {}  
    list<int> l_;  
public:  
    X(vector<short> &);  
    X(deque<int> &);  
};  
  
X::X(vector<short> &v) : X(v.begin(), v.end()) {}  
  
X::X(deque<int> &v) : X(v.begin(), v.end()) {}  
  
int main() {  
    vector<short> a{1, 2, 3, 4, 5};  
    deque<int> b{1, 2, 3, 4, 5};  
    X x1(a);  
    X x2(b);  
}
```
上面的代码中template X(T first, T last)是一个代理模板构造函 数，X(std::vector&)和X(std::deque&)将控制权委托给了它。这样一来，我们就无须编 写std::vector和std::deque 版本的代理构造函数。后续增加委托构造函数也不需要修 改代理构造函数，只需要保证参数类型支持迭代器就行了。

### 捕获委托构造函数的异常
如果一个异常在代理构造函数的初始化列表或者主体中被抛出，那么委托构造函数的主体将 不再被执行，与之相对的，控制权会交到异常捕获的catch代码块中
```cpp
class X {  
private:  
    int a_;  
    double b_;  
public:  
    X() try: X(0) {}  
    catch (int e) {  
        cout<< e << endl;  
        throw 3;  
    }  
    X(int a) try: X(a, 0.) {}  
    catch (int e) {  
        cout<<"int"<< e <<endl;  
        throw 2;  
    }  
    X(double b) : X(0, b) {}  
    X(int a, double b) : a_(a), b_(b) { throw 1; }  
};  
  
int main() {  
    try {  
        X x;  
    }  
    catch (int e) {  
        cout <<"main"<< e << endl;  
    }  
}
```

## 继承构造函数
子类中能够调用父类的构造函数
和委托构造函数相似

委托构造函数有两种语法：
一种是和委托构造函数一样的语法
```cpp
class A{  
private:  
    int a;  
    int b;  
    int c;  
public:  
    A(int n1){a=n1;}  
    A(int n1,int n2):A(n1){b=n2;}  
    A(int n1,int n2,int n3): A(n1,n2){c=n3;}  
};  
  
class B:public A{  
public:  
    B(int i): A(i){};  
    B(int i,int j): A(i,j){};  
};
```

一种是使用using关键字
```cpp
class Base {  
public:  
    Base() : x_(0), y_(0.) {};  
    Base(int x, double y) : x_(x), y_(y) {}  
    Base(int x) : x_(x), y_(0.) {}  
    Base(double y) : x_(0), y_(y) {}  
private:  
    int x_;  
    double y_;  
};  
class Derived : public Base {  
public:  
    using Base::Base;  
};
```
派生类Derived使用using Base::Base让编译器为自己生成转发到基类的构造函数，从结果上看这种实现方式和人工编写代码转发构造函数没有什么区别，但是在过程上代码变得更加简洁易于维护了。
使用继承构造函数虽然很方便，但是还有6条规则需要注意。 
1. 派生类是隐式继承基类的构造函数，所以只有在程序中使用了这些构造函数，编译器才会 为派生类生成继承构造函数的代码。 
2. 派生类不会继承基类的默认构造函数和复制构造函数。这一点乍看有些奇怪，但仔细想想 也是顺理成章的。因为在C++语法规则中，执行派生类默认构造函数之前一定会先执行基类的构 造函数。同样的，在执行复制构造函数之前也一定会先执行基类的复制构造函数。所以继承基类 的默认构造函数和默认复制构造函数的做法是多余的，这里不会这么做。 
3. 继承构造函数不会影响派生类默认构造函数的隐式声明，也就是说对于继承基类构造函数 的派生类，编译器依然会为其自动生成默认构造函数的代码。
4. 在派生类中声明签名相同的构造函数会禁止继承相应的构造函数。
```cpp
class Base {  
private:  
    int x_;  
    double y_;  
public:  
    Base() : x_(0), y_(0.) {};  
    Base(int x, double y) : x_(x), y_(y) {}  
    Base(int x) : x_(x), y_(0.) { cout << "Base(int x)" << endl; }  
    Base(double y) : x_(0), y_(y) { cout << "Base(double y)" << endl; }  
};  
  
class Derived : public Base {  
public:  
    using Base::Base;  
    Derived(int x) { cout << "Derived(int x)" << endl; }  
};  
  
int main(){  
    Derived d(5);  
    Derived d1(5.5);  
}
```
派生类Derived使用using Base::Base继承了基类的构造函数，但是由于 Derived定义了构造函数Derived(int x)，该函数的签名与基类的构造函数Base(int x)相同，因此这 个构造函数的继承被禁止了，Derived d(5)会调用派生类的构造函数并且输出"Derived(int x)"。另 外，这个禁止动作并不会影响到其他签名的构造函数，Derived d1(5.5)依然可以成功地使用基类 的构造函数进行构造初始化。
5. 派生类继承多个签名相同的构造函数会导致编译失败
```cpp
class Base1 {  
public:  
    Base1(int) { cout << "Base1(int x)" << endl; };  
};  
class Base2 {  
public:  
    Base2(int) { cout << "Base2(int x)" << endl; };  
};  
class Derived : public Base1, Base2 {  
public:  
    using Base1::Base1;  
    using Base2::Base2;  
};  
  
int main(){  
    Derived d(5);  
}
```
Derived继承了两个类Base1和Base2，并且继承了它们的构造函数。但是由于 这两个类的构造函数Base1(int)和Base2(int)拥有相同的签名，导致编译器在构造对象的时候不知 道应该使用哪一个基类的构造函数，因此在编译时给出一个二义性错误。
6. 继承构造函数的基类构造函数不能为私有
```cpp
class Base {  
    Base(int) {}  
public:  
    Base(double) {}  
};  
class Derived : public Base {  
public:  
    using Base::Base;  
};  
int main(){  
    Derived d(5.5);  
    Derived d1(5);  
}
```
Derived d1(5)无法通过编译，因为它对应的基类构造函数Base(int)是一个 私有函数，Derived d(5.5)则没有这个问题。

# 默认和删除函数
# 类的特殊成员函数
C++标准规定，在没有自定义构 造函数的情况下，编译器会为类添加默认的构造函数。像这样有特殊待遇的成员函数一共有6个 （C++11以前是4个），具体如下。
1. 默认构造函数。 
2. 析构函数。 
3. 复制构造函数。 
4. 复制赋值运算符函数。 
5. 移动构造函数（C++11新增）。 
6. 移动赋值运算符函数（C++11新增）。

但是这些特性的存在也带来了一些麻烦
1. 声明任何构造函数都会抑制默认构造函数的添加。 
2. 一旦用自定义构造函数代替默认构造函数，类就将转变为非平凡类型。 
3. 没有明确的办法彻底禁止特殊成员函数的生成（C++11之前）。

有时候我们需要编写一个禁止复制操作的类，但是过去C++标准并没有提供这样的能力。可以通过将复制构造函数和复制赋值运算符函数声明为private并且不提供函数实现的方式间接地达成目的。
虽然能间接地完成禁止复制的需求，但是这样的实现方法并不完 美。比如，友元就能够在编译阶段破坏类对复制的禁止：
友元能够访问私有的复制构造函数但并没有这个函数的实现也就是说程序最后会在链接阶段报错，原因是找不到复制构造函数的实现。

为了使用方便，boost库也提供了noncopyable类辅助我们完成禁止复制的需求。

现在 需要继承Base类，并且实现子类的foo函数；另外，还想沿用基类Base的foo函数，于是这里使 用using说明符将Base的foo成员函数引入子类
```cpp
class Base {  
    void foo(long &);  
public:  
    void foo(int) {}  
};  
  
class Derived : public Base {  
public:  
    using Base::foo;  
    void foo(const char *) {}  
};  
  
int main() {  
    Derived d;  
    d.foo("hello");  
    d.foo(5);  
}
```
无法通过编译。因为using说明符无法将基类的私 有成员函数引入子类当中，即使这里我们将代码d.foo(5)删除，即不再调用基类的函数，编译器也不会让这段代码编译成功

# 显式默认和显式删除
C++11标准提供了一种方法能够简单有效又精确地控制默认特殊成 员函数的添加和删除，我们将这种方法叫作显式默认和显式删除。显式默认和显式删除的语法非 常简单，只需要在声明函数的尾部添加=default和=delete，它们分别指示编译器添加特殊函数的 默认版本以及删除指定的函数
```cpp
struct A {  
    A() = default;  
    virtual ~A() = delete;  
    A(const A &);  
};  
  
A::A(const A &) = default;
```
以上代码显式地添加了默认构造和复制构造函数，同时也删除了析构函数。
=default 可以添加到类内部函数声明，也可以添加到类外部。

它可以让我们在不 修改头文件里函数声明的情况下，改变函数内部的行为
```cpp
struct A {  
    A();  
    int x;  
};  
// A1.cpp  
A::A() = default;  
// A2.cpp  
A::A() { x = 3; }
```

=delete与=default不同，它必须添加在类内部的函数声明中

通过使用=default，我们可以很容易地解决之前提到的前两个问题
```cpp
class NonTrivial {  
    int i;  
public:  
    NonTrivial(int n) : i(n), j(n) {}  
    NonTrivial() {}  
    int j;  
};  
  
class Trivial {  
    int i;  
public:  
    Trivial(int n) : i(n), j(n) {}  
    Trivial() = default;  
    int j;  
};  
  
int main() {  
    Trivial a(5);  
    Trivial b;  
    b = a;  
    cout << is_trivial_v<Trivial> << endl;  
    cout << is_trivial_v<NonTrivial> << endl;  
}
```
只是将构造函数NonTrivial() {}替换为显式默认构造函数Trivial() = default，类 就从非平凡类型恢复到平凡类型了。这样一来，既让编译器为类提供了默认构造函数，又保持了 类本身的性质，完美解决了之前的问题。

针对禁止调用某些函数的问题，可以使用=delete来删除特定函数，相对于使用 private限制函数访问，使用= delete更加彻底，它从编译层面上抑制了函数的生成，所以无论调用者是什么身份（包括类的成员函数），都无法调用被删除的函数。
由于必须在函数声明中使用= delete来删除函数，因此编译器可以在第一时间发现有代码错误地调用被删除的函数并且显示错误报告
```cpp
class NonCopyable{  
public:  
    NonCopyable() = default; // 显式添加默认构造函数  
    NonCopyable(const NonCopyable&)=delete; // 显式删除复制构造函数  
    NonCopyable& operator=(const NonCopyable&)=delete; // 显式删除复制赋值运算符函数  
};  
int main(){  
    NonCopyable a, b;  
    a = b; //编译失败，复制赋值运算符已被删除  
}
```
以上代码删除了类NonCopyable的复制构造函数和复制赋值运算符函数，这样就禁止了该类对 象相互之间的复制操作。请注意，由于显式地删除了复制构造函数，导致默认情况下编译器也不 再自动添加默认构造函数，因此我们必须显式地让编译器添加默认构造函数，否则会导致编译失 败。

用=delete来解决禁止重载函数的继承问题，这里只需要对基类Base稍作修改即可
```cpp
class Base {  
// void foo(long &);  
public:  
    void foo(long &) = delete; // 删除foo(long &)函数  
    void foo(int) {}  
};  
  
class Derived : public Base {  
public:  
    using Base::foo;  
    void foo(const char *) {}  
};  
  
int main(){  
    Derived d;  
    d.foo("hello");  
    d.foo(5);  
}
```
上面对代码做了两处修改。第一是将foo(long &)函数从private移动到public，第二是显式删除该函数。如果只是显式删除了函数，却没有将函数移动到public编译还是会出错。

## 显式删除的其他用法
显式删除不仅适用于类的成员函数，对于普通函数同样有效。只不过相对于应用于成员函 数，应用于普通函数的意义就不大了
```cpp
void foo() = delete;  
static void bar() = delete;  
  
int main(){  
    bar(); // 编译失败，函数已经被显式删除  
    foo(); // 编译失败，函数已经被显式删除  
}
```

显式删除还可以用于类的new运算符和类析构函数。显式删除特定类的new运算符可以 阻止该类在堆上动态创建对象，换句话说它可以限制类的使用者只能通过自动变量、静态变量或者全局变量的方式创建对象
```cpp
struct type {  
    void *operator new(size_t) = delete;  
};  
  
type global_var;  
  
int main() {  
    static type static_var;  
    type auto_var;  
    type *var_ptr = new type; // 编译失败，该类的new已被删除  
}
```

显式删除类的析构函数在某种程度上和删除new运算符的目的正好相反，它阻止类通过自动变量、静态变量或者全局变量的方式创建对象，但是却可以通过new运算符创建对象。原因是删除析 构函数后，类无法进行析构。所以像自动变量、静态变量或者全局变量这种会隐式调用析构函数 的对象就无法创建了，当然，通过new运算符创建的对象也无法通过delete销毁
```cpp
struct type{  
    ~type() = delete;  
};  
type global_var; // 编译失败，析构函数被删除无法隐式调用  
int main(){  
    static type static_var; // 编译失败，析构函数被删除无法隐式调用  
    type auto_var; // 编译失败，析构函数被删除无法隐式调用  
    type *var_ptr = new type;  
    delete var_ptr; // 编译失败，析构函数被删除无法显式调用  
}
```
只有new创建对象会成功，其他创建和销毁操作都会失败，所以这 样的用法并不多见，大部分情况可能在单例模式中出现。

## explicit和=delete

### explicit
explicit 指定符可以与常量表达式一同使用. 函数当且仅当该常量表达式求值为 true 才为显式. (C++20起)
隐式调用有时可以带来便利, 而有时却会带来意想不到的后果.
`explicit`关键字用来避免这样的情况发生
声明为explicit的构造函数不能在隐式转换中使用。
```cpp
class Test1 {  
public :  
    Test1(int num) : n(num) {}  
private:  
    int n;  
};  
  
class Test2 {  
public :  
    explicit Test2(int num) : n(num) {}  
private:  
    int n;  
};  
  
int main() {  
    Test1 t1 = 12;  
    Test2 t2(13);  
    Test2 t3 = 14;//error  
    return 0;  
}
```
当类的声明和定义分别在两个文件中时，explicit只能写在在声明中，不能写在定义中。

类的构造函数上同时使用explicit和=delete是一个不明智的做法，它常常会造成代码行为 混乱难以理解，应尽量避免这样做。
```cpp
struct type{  
    type(long long) {}  
    explicit type(long) = delete;  
};  
  
void foo(type) {}  
  
int main(){  
    foo(type(58));  
    foo(58);  
}
```
foo(type(58))会造成编译失 败，原因是type(58)显式调用了构造函数，但是explicit type(long)却被删除了。foo(58)可以通过 编译，因为编译器会选择type(long long)来构造对象。
