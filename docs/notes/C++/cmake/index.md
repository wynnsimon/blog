---
title: 1 CMake概述
createTime: 2025/04/05 12:12:26
permalink: /cpp/cmake/
---
CMake 是一个项目构建工具，并且是跨平台的。关于项目构建我们所熟知的还有Makefile（通过 make 命令进行项目的构建），大多是IDE软件都集成了make，比如：VS 的 nmake、linux 下的 GNU make、Qt 的 qmake等，如果自己动手写 makefile，会发现，makefile 通常依赖于当前的编译平台，而且编写 makefile 的工作量比较大，解决依赖关系时也容易出错。

而 CMake 恰好能解决上述问题， 其允许开发者指定整个工程的编译流程，在根据编译平台，`自动生成本地化的Makefile和工程文件`，最后用户只需`make`编译即可，所以可以把CMake看成一款自动生成 Makefile的工具，其编译流程如下图：

- 蓝色虚线表示使用`makefile`构建项目的过程
- 红色实线表示使用`cmake`构建项目的过程

总结一下CMake的优点：

- 跨平台
- 能够管理大型项目
- 简化编译构建过程和编译过程
- 可扩展：可以为 cmake 编写特定功能的模块，扩充 cmake 功能

# 使用
`CMake`支持大写、小写、混合大小写的命令。如果在编写`CMakeLists.txt`文件时使用的工具有对应的命令提示，那么大小写随缘即可，不要太过在意。
## 2.1 注释

### 2.1.1 注释行
`CMake` 使用 `#` 进行`行注释`，可以放在任何位置。

```cmake
# 这是一个 CMakeLists.txt 文件  
cmake_minimum_required(VERSION 3.0.0)
```

### 2.1.2 注释块
`CMake` 使用 `#[[ ]]` 形式进行`块注释`。
```cmake
#[[这是一个 CMakeLists.txt 文件。
这是一个 CMakeLists.txt 文件。
这是一个 CMakeLists.txt 文件。]]
cmake_minimum_required(VERSION 3.0.0)
```

### 添加 `CMakeLists.txt` 文件
在源文件所在目录下添加一个新文件 CMakeLists.txt，文件内容如下：
```cmake
cmake_minimum_required(VERSION 3.0)  
project(CALC)  
add_executable(app add.c div.c main.c mult.c sub.c)
```
- `cmake_minimum_required`：指定使用的 cmake 的最低版本，必须比本地安装的版本低，**可选，非必须，如果不加可能会有警告**，新的版本会有新的命令，如果使用的命令低版本中不存在则需要把此参数改为支持的版本，本地cmake版本也要在对应版本及以上

- `project`：定义工程名称，并可指定工程的版本、工程描述、web主页地址、支持的语言（默认情况支持所有语言），如果不需要这些都是可以忽略的，只需要指定出工程名字即可。
```cmake
# PROJECT 指令的语法是：  
project(<PROJECT-NAME> [<language-name>...])  
project(<PROJECT-NAME>                       #项目的名字
       [VERSION <major>[.<minor>[.<patch>[.<tweak>]]]]   #当前项目的版本
       [DESCRIPTION <project-description-string>]    #字符串，对当前项目的描述
       [HOMEPAGE_URL <url-string>]         #地址，如果项目有自己的网站可以在这里指出
       [LANGUAGES <language-name>...])   #项目使用的语言，默认支持所有语言
```
- `add_executable`：定义工程会生成一个可执行程序，只需要添加源文件不需要头文件
```cmake
add_executable(可执行程序名 源文件名称)
```
这里的可执行程序名和`project`中的项目名没有任何关系
源文件名可以是一个也可以是多个，如有多个可用空格或`;`间隔
```cmake
# 样式1  
add_executable(app add.c div.c main.c mult.c sub.c)  
# 样式2  
add_executable(app add.c;div.c;main.c;mult.c;sub.c)
```
#### 执行`CMake` 命令
将 CMakeLists.txt 文件编辑好之后，就可以执行 `cmake`命令了。
```cmake
# cmake 命令原型  
$ cmake CMakeLists.txt文件所在路径
```
当执行`cmake`命令之后，CMakeLists.txt 中的命令就会被执行，所以一定要注意给`cmake` 命令指定路径的时候一定不能出错。
执行命令之后，源文件所在目录中多了一些同名的.exe文件
**cmake命令在那个路径运行就在哪个路径生成makefile文件**
且在对应的目录下生成了一个`makefile`文件，此时再执行`make`命令，就可以对项目进行构建得到所需的可执行程序了。
最终可执行程序`app`就被编译出来了（这个名字是在`CMakeLists.txt`中指定的）。

如果在`CMakeLists.txt`文件所在目录执行了`cmake`命令之后就会生成一些目录和文件（`包括 makefile 文件`），如果再基于`makefile文件`执行`make`命令，程序在编译过程中还会生成一些中间文件和一个可执行文件，这样会导致整个项目目录看起来很混乱，不太容易管理和维护，此时我们就可以把生成的这些与项目源码无关的文件统一放到一个对应的目录里边，比如将这个目录命名为`build`:

现在`cmake`命令是在`build`目录中执行的，但是`CMakeLists.txt`文件是`build`目录的上一级目录中，所以`cmake` 命令后指定的路径为`..`，即当前目录的上一级目录。

当命令执行完毕之后，在`build`目录中会生成一个`makefile`文件

这样就可以在`build`目录中执行`make`命令编译项目，生成的相关文件自然也就被存储到`build`目录中了。这样通过`cmake`和`make`生成的所有文件就全部和项目源文件隔离开了

# set的使用
## 定义变量

如果项目的源文件过多全写到add_executable()中也难以维护，可以使用变量接受这些源文件名，在cmake中式可以定义变量的

在set命令中输入变量值的时候变量值都是字符串类型，即使输入整形也还是字符串需要经过转换

语法：  
```cmake
SET(VAR [VALUE] [CACHE TYPE DOCSTRING [FORCE]])
```
[] 中的参数为可选项, 如不需要可以不写 
- `VAR`：变量名
- `VALUE`：变量值

```cmake
# 各个源文件之间使用空格间隔也可以使用分号;间隔 
# set(SRC_LIST add.c div.c main.c mult.c sub.c)  
  
add_executable(app  ${SRC_LIST})
```
对变量取值使用`${变量名}`，否则直接使用变量名只是把变量名变成一个字符串

## 指定使用的C++标准
直接使用指令使用对应标准编译的命令：
```shell
$ g++ *.cpp -std=c++11 -o app
```

在CMake中想要指定C++标准有两种方式：

1. 在 CMakeLists.txt 中通过 set 命令指定，如：
```cmake
# 增加-std=c++11  
set(CMAKE_CXX_STANDARD 11)  
```
2. 在执行 cmake 命令的时候指定出这个宏的值
```cmake
# 增加-std=c++11  
cmake CMakeLists.txt文件路径 -DCMAKE_CXX_STANDARD=11  
```
-D表示指出一个宏

## 指定输出路径
在CMake中指定可执行程序输出的路径，也对应一个宏，叫做`EXECUTABLE_OUTPUT_PATH`，它的值还是通过`set`命令进行设置:
```cmake
set(HOME /home/robin/Linux/Sort)  #定义一个变量用于存储一个绝对路径
set(EXECUTABLE_OUTPUT_PATH ${HOME}/bin)  #将拼接好的路径值设置给EXECUTABLE_OUTPUT_PATH宏
```
如果路径中的子目录不存在，会自动生成
由于可执行程序是基于 cmake 命令生成的 makefile 文件然后再执行 make 命令得到的，所以如果此处指定可执行程序生成路径的时候使用的是相对路径 ./xxx/xxx，那么这个路径中的 ./ 对应的就是 makefile 文件所在的那个目录。

在指定目录的前面的路径中不能存在makefile文件，否则就不会生成文件了

# 搜索

当文件过多时使用set指定变量再传入add_executable中也不好维护，在CMake中为我们提供了搜索文件的命令，可以使用`aux_source_directory`命令或者`file`命令。

1. 使用`aux_source_directory` 命令可以查找某个路径下的所有源文件：
```cmake
aux_source_directory(< dir > < variable >)
```
- `dir`：要搜索的目录
- `variable`：将从`dir`目录下搜索到的源文件列表存储到该变量中

**PROJECT_SOURCE_DIR宏**
在执行cmake命令时所在路径后边携带的路径（通常是CMakeLists.text所在的路径）
查找执行cmake命令的所在路径中的文件
```cmake
aux_source_directory(${PROJECT_SOURCE_DIR} SRC)
```

**CMAKE_CURRENT_SOURCE_DIR宏**
CMakeLists.txt所在的路径
通常是和PROJECT_SOURCE_DIR但如果CMakeLists.txt嵌套就不一样了

1. 如果一个项目里边的源文件很多，在编写`CMakeLists.txt`文件的时候不可能将项目目录的各个文件一一罗列出来，这样太麻烦了。所以，在CMake中为我们提供了搜索文件的命令`file`（除了搜索以外通过 file 还可以做其他事情）。
```cmake
file(GLOB/GLOB_RECURSE 变量名 要搜索的文件路径和文件类型)
```
- `GLOB`: 将指定目录下搜索到的满足条件的所有文件名生成一个列表，并将其存储到变量中。
- `GLOB_RECURSE`：递归搜索指定目录，将搜索到的满足条件的文件名生成一个列表，并将其存储到变量中。
搜索CMakeLists.txt所在目录中所有的.cpp文件
```cmake
file(GLOB SRC ${CMAKE_CURRENT_SOURCE_DIR}/*.cpp)
```

> [!warning] Warning
> aux_source_directory和file指定文件还不一样，aux_source_directory只需要指定出路径就可以自动匹配所有文件包括.c、.cpp、.h，但file不仅需要指定出路径还要指定出文件类型与路径进行拼接，且aux不可以递归文件，file可以递归搜索

# 包含头文件

在编译项目源文件的时候，很多时候都需要将源文件对应的头文件路径指定出来，这样才能保证在编译过程中编译器能够找到这些头文件，并顺利通过编译。
若在源文件中指定出头文件的路径需要的是头文件相对于源文件的路径，而不是相对于生成.exe的路径
如果改变头文件的路径使用到此头文件的文件中也要跟随着更改包含头文件的路径，这样会不方便
可以在cmake中可以使用`include_directories`指定出放置头文件的路径
```cmake
include_directories(headpath)
```
源文件中依旧可以直接include头文件名而不用指定出路径
指定出头文件所在地址是和CMakeLists.txt同级目录下的include文件夹中：
```cmake
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include)
```

# 制作动态库或静态库

1. 制作静态库
在cmake中，如果要制作静态库，需要使用的命令如下：
```cmake
add_library(库名称 STATIC 源文件1 [源文件2] ...)
```
在Linux中，静态库名字分为三部分：`lib`+`库名字`+`.a`，此处只需要指定出库的名字就可以了，另外两部分在生成该文件的时候会自动填充。
在Windows中，动态库名字分为三部分：`lib`+`库名字`+`.lib`

2. 制作动态库
动态库是有可执行权限的，静态库没有
动态库也叫共享库，shared是共享的意思
在cmake中，如果要制作动态库，需要使用的命令如下：
```cmake
add_library(库名称 SHARED 源文件1 [源文件2] ...)
```
在Linux中，动态库名字分为三部分：`lib`+`库名字`+`.so`，此处只需要指定出库的名字就可以了，另外两部分在生成该文件的时候会自动填充。
在Windows中，动态库名字分为三部分：`lib`+`库名字`+`.dll`

在Windows中虽然库名和Linux格式不同，但也只需指定出名字即可。

**指定输出的路径**
如果不指定目录会自动生成到当前的构建目录里面

可以通过`set`命令给`EXECUTABLE_OUTPUT_PATH`宏设置了一个路径，这个路径就是可执行文件生成的路径。只适用于动态库，因为动态库拥有可执行权限
由于在Linux下生成的静态库默认不具有可执行权限，所以在指定静态库生成的路径的时候就不能使用`EXECUTABLE_OUTPUT_PATH`宏了，而应该使用`LIBRARY_OUTPUT_PATH`，这个宏对应静态库文件和动态库文件都适用。
```cmake
set(LIBRARY_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/lib)  
# 生成动态库  
#add_library(calc SHARED ${SRC_LIST})  
# 生成静态库  
add_library(calc STATIC ${SRC_LIST})
```

### 链接库
发布库需要发布两个文件一个是库文件（静态或动态都可），一个是头文件，头文件用来指明库文件中都有哪些API。
制作库就相当于把.cpp文件打包成二进制文件，如果没有头文件是无法得知里面都有哪些方法的

1. 链接静态库
```cmake
link_libraries(<static lib> [<static lib>...])
```
可链接多个静态库
- **参数1**：指定出要链接的静态库的名字
    可以是全名 `libxxx.a`
    也可以是掐头（`lib`）去尾（`.a`）之后的名字 `xxx`
- **参数2-N**：要链接的其它静态库的名字
如果该静态库不是系统提供的（自己制作或者使用第三方提供的静态库）==可能出现静态库找不到的情况==，此时可以将静态库的路径也指定出来：
该宏也用于指定出动态库的路径。要写到链接库名之前
```cmake
link_directories(<lib path>)
```

> [!info] Title
> 如果使用的是静态库，静态库中的数据会被打包到生成的可执行程序中去，如果是动态库就不会打包到里面。动态库是在程序执行的时候调用了动态库中的内容，该动态库才会被加载到内存中

2. 链接动态库
在`cmake`中链接动态库的命令如下:
```cmake
target_link_libraries(  
    <target>   
    <PRIVATE|PUBLIC|INTERFACE> <item>...   
    [<PRIVATE|PUBLIC|INTERFACE> <item>...]...)
```
- **target**：指定要加载动态库的文件的名字
    - 可能是一个源文件
    - 可能是一个动态库文件
    - 可能是一个可执行文件
- **PRIVATE|PUBLIC|INTERFACE**：动态库的访问权限，默认为`PUBLIC`
如果各个动态库之间没有依赖关系，无需做任何设置，三者没有没有区别，一般无需指定，使用默认的 PUBLIC 即可。

`动态库的链接具有传递性`，如果动态库 A 链接了动态库B、C，动态库D链接了动态库A，此时动态库D相当于也链接了动态库B、C，并可以使用动态库B、C中定义的方法。
```cmake
target_link_libraries(A B C)  
target_link_libraries(D A)
```
- `PUBLIC`：在public后面的库会被Link到前面的target中，并且里面的符号也会被导出，提供给第三方使用。
- `PRIVATE`：在private后面的库仅被link到前面的target中，并且终结掉，第三方不能感知你调了啥库
- `INTERFACE`：在interface后面引入的库不会被链接到前面的target中，只会导出符号。
如果被链接的是public权限，链接的库中就会有这个库的所有的内容，也就是被链接的库中的数据写入到了链接的库中了；这样即使没有被链接的库也可以运行
如果被链接的是privare权限，那么这个库的数据只会被传递一次（传递到前一个链接的库中）
如果被链接的是interface只会把符号写入到链接的库中（链接库只知道这个库有这个方法及这个方法的名字而不知道具体实现）依旧需要调用被链接的库

#### 链接系统动态库

动态库的链接和静态库是完全不同的：

- 静态库会在生成可执行程序的链接阶段被打包到可执行程序中，所以可执行程序启动，静态库就被加载到内存中了。
- 动态库在生成可执行程序的链接阶段**不会**被打包到可执行程序中，当可执行程序被启动并且调用了动态库中的函数的时候，动态库才会被加载到内存

在程序运行时，需要用到被链接的库时就将该库写入到物理内存中，但因为优化，物理内存中只允许有一个该库，这样另一个程序也要用到这个动态库时就会调用已经在物理内存中的库，多个应用程序共用一个动态库，因此动态库也称为共享库。

因此，在`cmake`中指定要链接的动态库的时候，==应该将命令写到生成了可执行文件之后==：
```cmake
cmake_minimum_required(VERSION 3.0)  
project(TEST)  
file(GLOB SRC_LIST ${CMAKE_CURRENT_SOURCE_DIR}/*.cpp)  
# 添加并指定最终生成的可执行程序名  
add_executable(app ${SRC_LIST})  
# 指定可执行程序要链接的动态库名字  
target_link_libraries(app pthread)
```
在`target_link_libraries(app pthread)`中：

- `app:` 对应的是最终生成的可执行程序的名字
- `pthread`：这是可执行程序要加载的动态库，这个库是系统提供的线程库，全名为`libpthread.so`，在指定的时候一般会掐头（lib）去尾（.so）。

如果源代码比较多适合生成动态库，源代码比较少适合生成静态库

# 日志
用于调试
在CMake中可以用用户显示一条消息，该命令的名字为`message`：
```cmake
message([STATUS|WARNING|AUTHOR_WARNING|FATAL_ERROR|SEND_ERROR] "message to display" ...)
```
前面的关键字代表消息的重要级别

| 关键字              | 作用                     |
| ---------------- | ---------------------- |
| 没有关键字            | 重要消息                   |
| `STATUS`         | 非重要消息                  |
| `WARNING`        | 警告, 会继续执行              |
| `AUTHOR_WARNING` | 重要警告 (dev), 会继续执行      |
| `SEND_ERROR`     | 非重要错误, 继续执行，但是会跳过生成的步骤 |
| `FATAL_ERROR`    | 重要错误, 终止所有处理过程         |

# 变量操作
## 追加

有时候项目中的源文件并不一定都在同一个目录中，但是这些源文件最终却需要一起进行编译来生成最终的可执行文件或者库文件。如果我们通过`file`命令对各个目录下的源文件进行搜索，最后还需要做一个字符串拼接的操作，关于字符串拼接可以使用`set`命令也可以使用`list`命令。

### 使用set拼接
如果使用set进行字符串拼接，对应的命令格式如下：
```cmake
set(变量名1 ${变量名1} ${变量名2} ...)
```
将从第二个参数开始往后所有的字符串进行拼接，最后将结果存储到第一个参数中，如果第一个参数中原来有数据会对原数据就行覆盖。

### 使用list拼接

如果使用list进行字符串拼接，对应的命令格式如下：
```cmake
list(APPEND <list> [<element> ...])
```
`list`命令的功能比`set`要强大，字符串拼接只是它的其中一个功能，所以需要在它第一个参数的位置指定出我们要做的操作，`APPEND`表示进行数据追加，后边的参数和`set`就一样了。
cmake中并没有list，\<list>是一个字符串，后面的参数是拼接后添加到\<list>中
\<list>虽然对应的是一个变量，但是cmake在底层管理的时候会把若干个子字符串通过分号间隔，但是通过message进行输出是没有分号的。这是因为list虽然能完成字符串的拼接还能完成字符串的删除，删除的是存储到\<list>里面的某个字符串，在删除时就会进行搜索，如果没有分号搜索时就会有问题。

## 字符串移除

我们在通过`file`搜索某个目录就得到了该目录下所有的源文件，但是其中有些源文件并不是我们所需要的。此时，就需要将不需要的文件从搜索到的数据中剔除出去，想要实现这个功能，也可以使用`list`
```cmake
list(REMOVE_ITEM <list> <value> [<value> ...])
```
后边的\<value>就是要删除的字符串，可以删除多个

### list的其他作用
1. 获取 list 的长度（字符串个数）。
```cmake
list(LENGTH <list> <output variable>)
```
- `LENGTH`：子命令LENGTH用于读取列表长度
- `<list>`：当前操作的列表
- `<output variable>`：新创建的变量，用于存储列表的长度。（写入的虽然是数字但依旧是字符串类型）

2. 读取列表中指定索引的的元素，可以指定多个索引
```cmake
list(GET <list> <element index> [<element index> ...] <output variable>)|
```
- `<list>`：当前操作的列表
- `<element index>`：列表元素的索引
    - 从0开始编号，索引0的元素为列表中的第一个元素；
    - 索引也可以是负数，`-1`表示列表的最后一个元素，`-2`表示列表倒数第二个元素，以此类推
    - 当索引（不管是正还是负）超过列表的长度，运行会报错
- `<output variable>`：新创建的变量，存储指定索引元素的返回结果，也是一个列表。

3. 将列表中的元素用连接符（字符串）连接起来组成一个字符串
```cmake
list (JOIN <list> <glue> <output variable>)
```
- `<list>`：当前操作的列表
- `<glue>`：指定的连接符（字符串）
- `<output variable>`：新创建的变量，存储返回的字符串

4. 查找列表是否存在指定的元素，若果未找到，返回-1
```cmake
list(FIND <list> <value> <output variable>)
```
1. - `<list>`：当前操作的列表
    - `<value>`：需要再列表中搜索的元素
    - `<output variable>`：新创建的变量
        - 如果列表`<list>`中存在`<value>`，那么返回`<value>`在列表中的索引
        - 如果未找到则返回-1。

2. 将元素追加到列表中
```cmake
list (APPEND <list> [<element> ...])
```

6. 在list中指定的位置插入若干元素
索引从0开始
```cmake
list(INSERT <list> <element_index> <element> [<element> ...])
```

7. 将元素插入到列表的0索引位置
```cmake
list (PREPEND <list> [<element> ...])
```

8. 将列表中最后元素移除
```cmake
list (POP_BACK <list> [<out-var>...])
```

9. 将列表中第一个元素移除
```cmake
list (POP_FRONT <list> [<out-var>...])
```

10. 将指定的元素从列表中移除
```cmake
list (REMOVE_ITEM <list> <value> [<value> ...])
```

11. 将指定索引的元素从列表中移除
```cmake
list (REMOVE_AT <list> <index> [<index> ...])
```

12. 移除列表中的重复元素
```cmake
list (REMOVE_DUPLICATES <list>)
```

13. 列表翻转
```cmake
list(REVERSE <list>)
```

14. 列表排序
```cmake
list (SORT <list> [COMPARE <compare>] [CASE <case>] [ORDER <order>])
```
- `COMPARE`：指定排序方法。有如下几种值可选：
    - `STRING`:按照字母顺序进行排序，为默认的排序方法
    - `FILE_BASENAME`：如果是一系列路径名，会使用basename进行排序
    - `NATURAL`：使用自然数顺序排序
- `CASE`：指明是否大小写敏感。有如下几种值可选：
    - `SENSITIVE`: 按照大小写敏感的方式进行排序，为默认值
    - `INSENSITIVE`：按照大小写不敏感方式进行排序
- `ORDER`：指明排序的顺序。有如下几种值可选：
    - `ASCENDING`:按照升序排列，为默认值
    - `DESCENDING`：按照降序排列

# 宏定义

在进行程序测试的时候，我们可以在代码中添加一些宏定义，通过这些宏来控制这些代码是否生效
```c
#include <stdio.h>  
#define NUMBER  3  
  
int main()  
{  
    int a = 10;  
#ifdef DEBUG  
    printf("我是一个程序猿, 我不会爬树...\n");  
#endif  
    for(int i=0; i<NUMBER; ++i)  
    {  
        printf("hello, GCC!!!\n");  
    }  
    return 0;  
}
```
在程序的第七行对`DEBUG`宏进行了判断，如果该宏被定义了，那么第八行就会进行日志输出，如果没有定义这个宏，第八行就相当于被注释掉了，因此最终无法看到日志输入出（**上述代码中并没有定义这个宏**）。

为了让测试更灵活，我们可以不在代码中定义这个宏，而是在测试的时候去把它定义出来，其中一种方式就是在`gcc/g++`命令中去指定，如下：
```shell
$ gcc test.c -DDEBUG -o app
```
在`gcc/g++`命令中通过参数 `-D`指定出要定义的宏的名字，这样就相当于在代码中定义了一个宏，其名字为`DEBUG`。
在`CMake`中我们也可以做类似的事情，对应的命令叫做`add_definitions`:
```cmake
add_definitions(-D宏名称)
```
如：
```cmake
# 自定义 DEBUG 宏  
add_definitions(-DDEBUG)
```
通过这种方式，上述代码中的第八行日志就能够被输出出来了。

## 预定义宏
cmake中预定义的宏

|            宏             |                    功能                     |
| :----------------------: | :---------------------------------------: |
|    PROJECT_SOURCE_DIR    |         使用cmake命令后紧跟的目录，一般是工程的根目录         |
|    PROJECT_BINARY_DIR    |               执行cmake命令的目录                |
| CMAKE_CURRENT_SOURCE_DIR |         当前处理的CMakeLists.txt所在的路径          |
| CMAKE_CURRENT_BINARY_DIR |                target 编译目录                |
|  EXECUTABLE_OUTPUT_PATH  |            重新定义目标二进制可执行文件的存放位置            |
|   LIBRARY_OUTPUT_PATH    |             重新定义目标链接库文件的存放位置              |
|       PROJECT_NAME       |           返回通过PROJECT指令定义的项目名称            |
|     CMAKE_BINARY_DIR     | 项目实际构建路径，假设在`build`目录进行的构建，那么得到的就是这个目录的路径 |

## find_package
find_package主要用于导入包时找到包路径,找包规则是包制作者提供的,我们只需给出找包规则的路径即可
不同的包查找路径的宏定义也不同,以qt为例在qt6中要制定的搜索规则是Qt6_DIR
```cmake
set(Qt6_DIR "D:\\Develop\\Qt\\6.8.1\\mingw_64\\lib\\cmake\\Qt6")
find_package(Qt6 COMPONENTS Widgets REQUIRED)
target_link_libraries(${PROJECT_NAME} Qt6::Widgets)
```

# 函数

| 函数或宏                               | 含义                                                              |
| ---------------------------------- | --------------------------------------------------------------- |
| project(项目名)                       | 设置项目名,也可以在后面添加一个参数如:LANGUASGES CXX设置此项目是使用c++语言                 |
| add_library(项目名 资源文件)              | 将资源文件制作成静态库,指定项目名称                                              |
| target_link_libraries(项目名 动态库名)    | 将目标项目连接到指定的动态库                                                  |
| 宏PROJECT_NAME                      | 项目名,project中设置的                                                 |
| 宏CMAKE_PREFIX_PATH                 | 库文件所在位置,需要使用set设置                                               |
| 宏CMAKE_AUTOUIC                     | 自动添加qt文件                                                        |
| 宏CMAKE_AUTOMOC                     |                                                                 |
| 宏CMAKE_AUTORCC                     | 自动添加qt资源文件                                                      |
| find_package()                     | 插入需要引用的包,如qt的Widget核心                                           |
| add_compile_options()              | 添加编译设置,gcc编译器一般不用,msvc默认编码是gbk可以使用此函数设置为utf-8,如果是gcc编译器则自动忽略此选项 |
| target_link_libraries(项目名 权限 库名)   | 链接动态库                                                           |
| add_executable(项目名 选项 生成可执行文件的源文件) | 生成以项目名为可执行程序,选项可以使用WIN32,添加后运行程序会弹出终端,不使用则不弹出                   |

**将msvc编译器默认编码设置为utf-8**
```cmake
add_compile_options("$<$<C_COMPILER_ID:MSVC>:/utf-8>")
add_compile_options("$<$<CXX_cOMPILER_ID:MSVC>:/utf-8>")
```

**链接qt的Widget库**
```cmake
target_link_libraries(${PROJECT_NAME} PRIVATE Qt6::Widgets)
```
