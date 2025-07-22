---
title: 2 cmake嵌套
createTime: 2025/04/05 12:12:26
permalink: /cpp/cmake/2/
---
如果项目很大，或者项目中有很多的源码目录，在通过CMake管理项目的时候如果只使用一个`CMakeLists.txt`，那么这个文件相对会比较复杂，有一种化繁为简的方式就是给每个源码目录都添加一个`CMakeLists.txt`文件（头文件目录不需要），这样每个文件都不会太复杂，而且更灵活，更容易维护。

## 节点关系

Linux的目录是树状结构，所以嵌套的 CMake 也是一个树状结构，最顶层的 CMakeLists.txt 是根节点，其次都是子节点。因此，我们需要了解一些关于 CMakeLists.txt 文件变量作用域的一些信息：

根节点CMakeLists.txt中的变量全局有效
父节点CMakeLists.txt中的变量可以在子节点中使用
子节点CMakeLists.txt中的变量只能在当前节点中使用

### 添加子目录
在父节点中使用这个命令添加子节点
```cmake
add_subdirectory(source_dir [binary_dir] [EXCLUDE_FROM_ALL])
```
- source_dir：指定了CMakeLists.txt源文件和代码文件的位置，其实就是指定子目录
- binary_dir：指定了输出文件的路径，一般不需要指定，忽略即可。
- EXCLUDE_FROM_ALL：在子路径下的目标默认不会被包含到父路径的ALL目标里，并且也会被排除在IDE工程文件之外。用户必须显式构建在子路径下的目标。

# 流程控制
在 CMake 的 CMakeLists.txt 中也可以进行流程控制，也就是说可以像写 shell 脚本那样进行条件判断和循环。

## 条件判断
```cmake
if(<condition>)
  <commands>
elseif(<condition>) # 可选快, 可以重复
  <commands>
else()              # 可选快
  <commands>
endif()
```
在进行条件判断的时候，如果有多个条件，那么可以写多个elseif，最后一个条件可以使用else，但是开始和结束是必须要成对出现的，分别为：if和endif。

### 基本表达式
```cmake
if(<expression>)
```
如果是基本表达式，expression 有以下三种情况：常量、变量、字符串。

如果是1, ON, YES, TRUE, Y, 非零值，非空字符串时，条件判断返回True
如果是 0, OFF, NO, FALSE, N, IGNORE, NOTFOUND，空字符串时，条件判断返回False

### 逻辑判断
#### 非
```cmake
if(NOT <condition>)
```
其实这就是一个取反操作，如果条件condition为True将返回False，如果条件condition为False将返回True。

#### 与
```cmake
if(<cond1> AND <cond2>)
```
如果cond1和cond2同时为True，返回True否则返回False。

#### 非
```cmake
if(<cond1> OR <cond2>)
```
如果cond1和cond2两个条件中至少有一个为True，返回True，如果两个条件都为False则返回False。

### 比较
#### 基于数值的比较
```cmake
if(<variable|string> LESS <variable|string>)
if(<variable|string> GREATER <variable|string>)
if(<variable|string> EQUAL <variable|string>)
if(<variable|string> LESS_EQUAL <variable|string>)
if(<variable|string> GREATER_EQUAL <variable|string>)
```
- LESS：如果左侧数值小于右侧，返回True
- GREATER：如果左侧数值大于右侧，返回True
- EQUAL：如果左侧数值等于右侧，返回True
- LESS_EQUAL：如果左侧数值小于等于右侧，返回True
- GREATER_EQUAL：如果左侧数值大于等于右侧，返回True

#### 基于字符串的比较
```cmake
if(<variable|string> STRLESS <variable|string>)
if(<variable|string> STRGREATER <variable|string>)
if(<variable|string> STREQUAL <variable|string>)
if(<variable|string> STRLESS_EQUAL <variable|string>)
if(<variable|string> STRGREATER_EQUAL <variable|string>)
```
- STRLESS：如果左侧字符串小于右侧，返回True
- STRGREATER：如果左侧字符串大于右侧，返回True
- STREQUAL：如果左侧字符串等于右侧，返回True
- STRLESS_EQUAL：如果左侧字符串小于等于右侧，返回True
- STRGREATER_EQUAL：如果左侧字符串大于等于右侧，返回True

### 文件操作
1. 判断文件或者目录是否存在
```cmake
if(EXISTS path-to-file-or-directory)
```
如果文件或者目录存在返回True，否则返回False。

2. 判断是不是目录
```cmake
if(IS_DIRECTORY path)
```
此处目录的 path 必须是绝对路径
如果目录存在返回True，目录不存在返回False。

3. 判断是不是软连接
```cmake
if(IS_SYMLINK file-name)
```
此处的 file-name 对应的路径必须是绝对路径
如果软链接存在返回True，软链接不存在返回False。
软链接相当于 Windows 里的快捷方式

4. 判断是不是绝对路径
```cmake
if(IS_ABSOLUTE path)
```
关于绝对路径:
如果是Linux，该路径需要从根目录开始描述
如果是Windows，该路径需要从盘符开始描述
如果是绝对路径返回True，如果不是绝对路径返回False。

### 其他
1. 判断某个元素是否在列表中
```cmake
if(<variable|string> IN_LIST <variable>)
```
CMake 版本要求：大于等于3.3
如果这个元素在列表中返回True，否则返回False。

2. 比较两个路径是否相等
```cmake
if(<variable|string> PATH_EQUAL <variable|string>)
```
CMake 版本要求：大于等于3.24
如果这个元素在列表中返回True，否则返回False。
关于路径的比较其实就是另个字符串的比较，如果路径格式书写没有问题也可以通过下面这种方式进行比较：
```cmake
if(<variable|string> STREQUAL <variable|string>)
```
我们在书写某个路径的时候，可能由于误操作会多写几个分隔符，比如把/a/b/c写成/a//b///c，此时通过STREQUAL对这两个字符串进行比较肯定是不相等的，但是通过PATH_EQUAL去比较两个路径，得到的结果确实相等的

## 循环

### foreach
```cmake
foreach(<loop_var> <items>)
    <commands>
endforeach()
```
通过foreach我们就可以对items中的数据进行遍历，然后通过loop_var将遍历到的当前的值取出，在取值的时候有以下几种用法：

#### 方法1
```cmake
foreach(<loop_var> RANGE <stop>)
```
- RANGE：关键字，表示要遍历范围
- stop：这是一个正整数，表示范围的结束值，在遍历的时候从 0 开始，最大值为 stop。
- loop_var：存储每次循环取出的值
在对一个整数区间进行遍历的时候，得到的范围是【0，stop】，右侧是闭区间包含 stop 这个值。

#### 方法2
```cmake
foreach(<loop_var> RANGE <start> <stop> [<step>])
```
我们在遍历一个整数区间的时候，除了可以指定起始范围，还可以指定步长。

RANGE：关键字，表示要遍历范围
start：这是一个正整数，表示范围的起始值，也就是说最小值为 start
stop：这是一个正整数，表示范围的结束值，也就是说最大值为 stop
step：控制每次遍历的时候以怎样的步长增长，默认为1，可以不设置
loop_var：存储每次循环取出的值

在使用上面的方式对一个整数区间进行遍历的时候，得到的范围是这样的 【start，stop】，左右两侧都是闭区间，包含 start 和 stop 这两个值，步长 step 默认为1，可以不设置。

#### 方法3
```cmake
foreach(<loop_var> IN [LISTS [<lists>]] [ITEMS [<items>]])
```
这是foreach的另一个变体，通过这种方式我们可以对更加复杂的数据进行遍历，前两种方式只适用于对某个正整数范围内的遍历。

IN：关键字，表示在 xxx 里边
LISTS：关键字，对应的是列表list，通过set、list可以获得
ITEMS：关键字，对应的也是列表
loop_var：存储每次循环取出的值

#### 方法4
```cmake
foreach(<loop_var>... IN ZIP_LISTS <lists>)
```
通过这种方式，遍历的还是一个或多个列表，可以理解为是方式3的加强版。因为通过上面的方式遍历多个列表，但是又想把指定列表中的元素取出来使用是做不到的，在这个加强版中就可以轻松实现。

loop_var：存储每次循环取出的值，可以根据要遍历的列表的数量指定多个变量，用于存储对应的列表当前取出的那个值。
如果指定了多个变量名，它们的数量应该和列表的数量相等
如果只给出了一个 loop_var，那么它将一系列的 loop_var_N 变量来存储对应列表中的当前项，也就是说 loop_var_0 对应第一个列表，loop_var_1 对应第二个列表，以此类推......
如果遍历的多个列表中一个列表较短，当它遍历完成之后将不会再参与后续的遍历（因为其它列表还没有遍历完）。
IN：关键字，表示在 xxx 里边
ZIP_LISTS：关键字，对应的是列表list，通过set 、list可以获得

### while
除了使用foreach也可以使用 while 进行循环，关于循环结束对应的条件判断的书写格式和if/elseif 是一样的。while的语法格式如下：
```cmake
while(<condition>)
    <commands>
endwhile()
```
while循环比较简单，只需要指定出循环结束的条件即可