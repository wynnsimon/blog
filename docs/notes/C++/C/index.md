---
title: 1 编译过程
createTime: 2025/04/05 12:12:26
permalink: /cpp/c/
---
# 程序框架
大部分程序都需要这个框架
```c
#include <stdio.h>

int main(){
	return 0;
}
```

## 头文件
```c
#include <stdio.h>
#include "Pink.h"
```
程序中有时需要调用标准库或其他库函数，这些库函数编译器是不认识的，程序中调用库函数之前需要包含头文件，在这个头函数中有相应库函数的声明
stdio.h是标准库，包含c语言中的内置函数，需要包含该库，编辑器本身不具有标准库。

导入自己写的文件是要用双引号引用
用尖括号包含头文件，在系统指定的路径下找头文件。
用双引号包含头文件，先在当前目录下找头文件，找不到再到系统指定的路径下找。
故尖括号只能引用标准库，双引号既能引用标准库又能引用自己写的文件

头文件相当于python中的import stdio

一般.c写程序，.h声明函数

## main函数
```c
int main()
```
主函数，程序都是从main开始执行的是程序的入口，在一个程序中有且只有一个main函数
一般返回整形，故前面要有int 对应return 0;

## 语句结尾

c语言中每条语句都要用;结尾

# 注释
//在一行中注释
/* 注释所有中间的内容*/
选中ctrl+/ 一键注释

# 编译过程

### 1: 预编译
将.c 中的头文件展开、宏展开生成的文件是.i 文件

### 2: 编译
将预处理之后的.i 文件生成s 汇编文件
汇编语言

### 3、汇编
将.s 汇编文件生成.o目标文件
二进制文件

### 4、链接
将所有.o文件链接成目标文件

# 静态库

## 1、动态编译
动态编译使用的是动态库文件进行编译
```shell
gcc hello.c -o hello
```
默认使用的是动态编译方法

## 2、静态编译
静态编译使用的静态库文件进行编译
```shell
gcc -static hello.c -o hello
```

## 三:静态编译和动态编译区别

### 1:使用的库文件的格式不一样
动态编译使用动态库，静态编译使用静态库

静态编译要把静态库文件打包编译到可执行程序中。
动态编译不会把动态库文件打包编译到可执行程序中，它只是编译链接关系

## 制作静态库:
```shell
gcc -c mylib.c -o mylib.o
ar rc libtestlib.a mylib.o
```
注意: 静态库起名的时候必须以 lib 开头以a 结尾

## 编译程序:
### 方法1:
```shell
gcc -static mytest.c libtestlib.a -o mytest
```

### 方法 2:
指定头文件及库文件的路径

将 libtestlib.a mylib.h 移动到/home/edu 下
```shell
mv libtestlib.a mylib.h /home/edu
```

编译程序命令:
```shell
gcc -static mytest.c -o mytest -L/home/edu -ltestlib -I/home/edu
```
注意:
-L 是指定库文件的路径
-l指定找哪个库，指定的只要库文件名 lib 后面a 前面的部分
-I指定头文件的路径

## 方法 3:
将库文件及头文件存放到系统默认指定的路径下
库文件默认路径是 /lib 或者是/usr/lib
头文件默认路径是/usr/include
```shell
sudo mv libtestlib.a /usr/lib
sudo mv mylibh /usr/include
```

编译程序的命令
```shell
gcc -static mytest.c -o mytest -ltestlib
```

# 制作动态链接库:
```shell
gcc -shared mylib.c -o libtestlib.so
```
使用 gcc 编译、制作动态链接库

## 动态链接库的使用:
### 方法 1:库函数、头文件均在当前目录下
```shell
gcc mytest.c libtestlib.so -o mytest
export LD_LIBRARY_PATH=/:SLD LIBRARY_PATH
./mytest
```

### 方法2: 库函数、头文件假设在/opt 目录
```shell
gcc mytest.c -o mytest -L/home/teacher-ltestlib -I/home/teacher
```
编译通过，运行时出错，编译时找到了库函数，但链接时找不到库，执行以下操作，把当前目录加入搜索路径
```shell
export LD_LIBRARY_PATH=.:SLD_LIBRARY_PATH
```
#./mytest 可找到动态链接库

### 方法 3:库函数、头文件假设在/home/edu.目录
```shell
gcc mytest.c -o mytest -L/home/edu -ltestlib -I/home/edu
```

编译通过，运行时出错，编译时找到了库函数，但链接时找不到库，执行以下操作，把当前目录加入搜索路径

# 内存分区
## 物理内存、虚拟内存物理内存:实实在在存在的存储设备
虚拟内存:操作系统虚拟出来的内存。
操作系统会在物理内存和虚拟内存之间做映射

## 虚拟内存

### 在运行程序的时候，操作系统会将 虚拟内存进行分区。

##### 1、堆
在动态申请内存的时候，在堆里开辟内存。

##### 2、栈
主要存放局部变量。

##### 3、静态全局区

a、未初始化的静态全局区静态变量(定义变量的时候，前面加 static 修饰)，或全局变量 ，没有初始化的，存在此区
b、初始化的静态全局区全局变量、静态变量，赋过初值的，存放在此区

##### 4、代码区
存放程序代码

##### 5、文字常量区
存放常量。

# 内存动态申请
### 静态分配
1、在程序编译或运行过程中，按事先规定大小分配内存空间的分配方式。int a[10]
2、必须事先知道所需空间的大小。
3、分配在栈区或全局变量区，一般以数组的形式。
4、按计划分配。

### 动态分配
1、在程序运行过程中，根据需要大小自由分配所需空间。
2、按需分配。
3、分配在堆区，一般使用特定的函数进行分配。

## 1、malloc 函数
函数原型: void* malloc(unsigned int size);

#### 功能说明
在内存的动态存储区(堆区)中分配一块长度为 size 字节的连续区域，用来存放类型说明符指定的类型函数原型返回 void* 指针，使用时必须做相应的强制类型转换，分配的内存空间内容不确定，一般使用memset 初始化。

##### 返回值
分配空间的起始地址 (分配成功)
NULL (分配失败)

在调用 malloc之后，一定要判断一下，是否申请内存成功。
如果多次 malloc 申请的内存，第 1 次和第 2 次请的内存不一定是连续的
要导入stdlib.h库

## 2、free 函数(释内存函数)

要导入stdlib.h库

函数定义:void free(void * ptr)
函数说明: free 函数释放 ptr 指向的内存。
注意 ptr指向的内存必须是malloc、calloc、relloc动态申请的内存

```c
char *p=(char *)malloc(100);
free(p);
```
free 后，因为没有给 p 赋值，所以 p 还是指向原先动态申请的内存。但是内存已经不能再用了,p 变成野指针了。
一块动态申请的内存只能 free 一次，不能多次 free

## 3、calloc函数

要导入stdlib.h库

函数定义: void* calloc(size_t nmemb,size t size);

size_t 实际是无符号整型，它是在头文件中，用 typedef 定义出来的。

函数的功能:在内存的堆中，申请nmemb 块，每块的大小为 size 个字节的连续区域函数的返回值:
返回申请的内存的首地址 (申请成功)
返回NULL (申请失败)

##### malloc和 calloc函数都是用来申请内存的。区别:
参数的个数不一样
malloc 申请的内存，内存中存放的内容是随机的，不确定的，而 calloc 函数申请的内存中的内容为0

```c
char *p=(char *)calloc(3100);
```
在堆中申请了3块，每块大小为 100 个字节，即300 个字节连续的区域

## 4、realloc函数(重新申请内存)
调用 malloc和 calloc 函数单次申请的内存是连续的，两次申请的两块内存不一定连续。有些时候有这种需求，即先用 malloc 或者 calloc 申请了一块内存，我还想在原先内存的基础上挨着申请内存。或者开始时候使用 malloc 或 calloc 申请了一块内存，想释放后边的一部分内存。为了解决这个问题，发明了 realloc 这个函数

找一个 newsize 个字节大小的内存申请，将原先内存中的内容拷贝过来，然后释放原先的内存，最后返回新内存的地址。

如果newsize 比原先的内存小，则会释放原先内存的后面的存储空间，只留前面的 newsize个字节
返回值:新申请的内存的首地址

```c
char *p;
p=(char *)malloc(100);
p=(char *)realloc(p,150);//p 指向的内存的新的大小为 150 个字节
```

```c
char*p;
p=(char *)malloc(100);
//们想重新申请内存,新的大小为 50 个字节
5=(char *)realloc(p,50);//p 指向的内存的新的大小为 50 个字节,100 个字节的后50 个字节的存储空间就被释放了
```
malloc、calloc、relloc 动态申请的内存，只有在 free 或程序结束的时候才释放

## 内存泄露
### 概念
申请的内存，首地址丢了，找不了，再也没法使用了，也没法释放了，这块内存就被泄露了。
例：
```c
int main()
{
	char*p;
	p=(char*)malloc(100);
	//接下来，可以用 p 指向的内存了
	p="hello world”;//p 指向别的地方了
	//从此以后，再也找不到你申请的 100 个字节了。则动态申请的 100 个字节就被泄露了
	return 0;
}
```

解决方法1：
```c
void fun()
{
	char*p;
	p=(char*)malloc(100);
	//接下来，可以用 p 指向的内存了
	free(p);
}

int main()
{
	fun0;
	fun0);
	return 0;
}
```
解决方法2
```c
void *fun()
{
	char*p;
	p=(char*)malloc(100);
	//接下来，可以用 p 指向的内存了
	free(p);
	return p;
}

int main()
{
	char *q;
	q=fun();
	//可以通过 q 使用，动态申请的 100 个字节的内存了
	
	//记得释放
	free(q);
	return 0;
}
```
