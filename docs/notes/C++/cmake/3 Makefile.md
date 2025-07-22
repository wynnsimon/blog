---
title: 3 Makefile
createTime: 2025/06/22 10:20:50
permalink: /cpp/cmake/3/
---
在Windows上想要使用gcc编译器需要下载mingw, mingw中带有makefile,不同的mingw版本使用的命令不同

| W64devkit（模拟Linux） | MingW-W64-builds或其他套件 ( Windows cmd命令 ) |
| ------------------ | --------------------------------------- |
| make               | mingw32-make                            |
| cc                 | gcc                                     |
| rm                 | del                                     |
| touch              |                                         |
| ls                 |                                         |
| dir                |                                         |
| sh                 |                                         |
| mv                 |                                         |
| cp                 | copy/xcopy                              |
| sed                |                                         |
如常用的linux中makefile写法:
```makefile
main:main.cpp
	g++ -o $@ $^
	./$@
	rm -f $@
```
就变为:
```makefile
main:main.cpp
	g++ -o $@.exe $^
	./$@.exe
	del $@.exe
```

文件名`Makefile`

注释是#
通常由以下三部分组成
指令是gcc命令
```makefile
目标文件:前置依赖
	\t需要执行的命令
#生成可执行文件
main:hello.o main.o
	gcc hello.o main.o -o main

#生成main.o
main.o:main.c hello.h
	gcc -c main.c -o main.o    #makefile可以自动推导出要生成的目标文件，也可以直接写gcc -c main.c

#生成hello.o
hello.o:hello.c hello.h
	gcc-c hello.c
```
makefile是区分空格和制表符的，执行的命令前必须是制表符\\t

**clean清除指定的目标文件**
没有前置依赖
可以删除不需要的中间文件，指令是Linux下的rm删除指令
```makefile
clean:
	rm main main.o hello.o
```

**定义变量**
定义一个变量其中存储文件名，这样生成文件命令就比较简洁，定义的变量使用时需要使用$取出
换行可以使用\\，其中文件名之间有多少个空格都是允许的
```makefile
objects := hello.o\
main.o

main: $(objects)
	gcc $(objects) -o main
```

**伪目标**
```makefile
.PHONY:伪目标名称

.PHONY:clean

clean:
	rm main $(objects)
```
如果当前目录下有一个与命令重名的文件（如：clean）
这时就不会执行makefile中的clean命令了，makefile会把它当作是一个生成文件命令，这时就需要把clean声明成伪目标才可以执行

**忽略错误**
当执行的命令出现错误时整个makefile就会被终止，如：rm删除了不存在的文件。有时候不需要那么精确的指令该命令，此时就可以使用忽略错误
在命令前加上-就可以忽略错误了
这对所有命令都适用
```makefile
clean:
	-rm main main.c
```
忽略错误后makefile就会忽略该错误继续执行，同时在控制台中打印出信息：出现x个错误（已忽略）

**特殊字符**
$：取变量值
@：当前目标文件的名称（变量形式）
^：当前目标文件依赖的所有文件（变量形式）
<：第一个依赖文件名（变量形式）
```makefile
CC:=gcc

main:main.c hello.c
	-$(CC) -o $@ $^    #-gcc -o main main.c hello.c
	-./$@    #-./main执行
	-rm ./$@    # -rm ./main
```

| 变 量 | 含 义                                              |
| --- | ------------------------------------------------ |
| $*  | 表示目标文件的名称，不包含目标文件的扩展名                            |
| $+  | 表示所有的依赖文件，这些依赖文件之间以空格分开，按照出现的先后为顺序，其中可能包含重复的依赖文件 |
| $<  | 表示依赖项中第一个依赖文件的名称                                 |
| $?  | 依赖项中，所有比目标文件时间戳晚的依赖文件，依赖文件之间以空格分开                |
| $@  | 表示目标文件的名称，包含文件扩展名                                |
| $^  | 依赖项中，所有不重复的依赖文件，这些文件之间以空格分开                      |

## 函数

makefile中有很多函数并且所有的函数都是有返回值的。makefile中函数的格式和C/C++中函数也不同
写法:
```makefile
$(函数名 参数1, 参数2, 参数3, ...)
```
使用频率比较高的函数：wildcard和patsubst。

#### wildcard
获取指定目录下指定类型的文件名，其返回值是以空格分割的、指定目录下的所有符合条件的文件名列表。

- PATTERN 指的是某个或多个目录下的对应的某种类型的文件, 比如当前目录下的.c文件可以写成\*.c
可以指定多个目录，每个路径之间使用空格间隔
- 返回值：得到的若干个文件的文件列表， 文件名之间使用空格间隔
示例：`$(wildcard *.c ./sub/*.c)`
返回值格式: `a.c b.c c.c d.c e.c f.c ./sub/aa.c ./sub/bb.c`

```makefile
$(wildcard PATTERN...)
```

**示例**
```makefile
# 使用举例: 分别搜索三个不同目录下的 .c 格式的源文件
src = $(wildcard /home/robin/a/*.c /home/robin/b/*.c *.c)  # *.c == ./*.c
# 返回值: 得到一个大的字符串, 里边有若干个满足条件的文件名, 文件名之间使用空格间隔
/home/robin/a/a.c /home/robin/a/b.c /home/robin/b/c.c /home/robin/b/d.c e.c f.c
```

#### patsubst
按照指定的模式替换指定的文件名的后缀,

- pattern: 这是一个模式字符串, 需要指定出要被替换的文件名中的后缀是什么
	文件名和路径不需要关心, 因此使用 % 表示即可 [通配符是 %]
	在通配符后边指定出要被替换的后缀, 比如: %.c, 意味着 .c的后缀要被替换掉
- replacement: 这是一个模式字符串, 指定参数pattern中的后缀最终要被替换为什么
	还是使用 % 来表示参数pattern 中文件的路径和名字
	在通配符 % 后边指定出新的后缀名, 比如: %.o 这表示原来的后缀被替换为 .o
- text: 该参数中存储这要被替换的原始数据
- 返回值:函数返回被替换过后的字符串。

```makefile
# 有三个参数, 参数之间使用 逗号间隔
$(patsubst <pattern>,<replacement>,<text>)
```

**示例**
```makefile
src = a.cpp b.cpp c.cpp e.cpp
# 把变量 src 中的所有文件名的后缀从 .cpp 替换为 .o
obj = $(patsubst %.cpp, %.o, $(src)) 
# obj 的值为: a.o b.o c.o e.o
```

### clean

在clean中指定要删除的文件后使用`make clean`执行删除
