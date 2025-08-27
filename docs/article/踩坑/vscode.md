---
title: vscode
createTime: 2025/06/23 21:09:00
tags:
  - vscode
  - 踩坑
permalink: /article/question/1/
---
# 无法正常生成launch.json和tasks.json文件
此问题可以不解决而使用手动配置json文件
- C/C++版本问题
C/C++在1.7.1版本之后就不会自动生成launch.json文件了(不过影响较小)
- clangd覆盖问题
如果使用clangd插件而禁用C/C++插件也不能正常生成launch.json和tasks.json文件
可以二者一起使用并关闭冲突提示,但这样做也会有时无法正常生成两个文件,这时可以禁用或删除C/C++插件后然后再(下载)启用

# 格式化错误
- clangd覆盖问题
为对clangd的clang-tidy代码格式化进行配置,C/C++插件不仅有代码校验还有代码格式化功能,如果禁用而使用clangd会导致使用默认的clang-tidy风格进行格式化. 提供以下两种解决方案
1. 使用clang-format插件进行格式化
可以使用clang-format插件并配合.clang-format文件进行代码格式化
2. 不禁用C/C++插件(推荐)
在C/C++中配置格式化风格.如果有插件冲突提示勾选不再显示即可.
使用此方法可以[方便进行vscode中json文件的配置](#profile issues)

# clangd代码检查引入的不是目标编译器
- 没有为clangd指定编译器或指定语法不符合规范
若电脑上有多个编译器,想要使用指定的编译器运行程序,可clangd检测使用的是另一款编译器,需要在setting.json文件中在`"clangd.arguments": []`中添加`"--query-driver=编译器1所在目录绝对路径,编译器2所在目录绝对路径"`来指定==编译器文件==, 如:
```
"--query-driver=D:\\qt\\Tools\\mingw1120_64\\bin\\gcc.exe,D:\\qt\\Tools\\mingw1120_64\\bin\\g++.exe"
```
若多个编译器在同一个文件夹中也可以使用:
```
"--query-driver=D:\\qt\\Tools\\mingw1120_64\\bin\\*"
```

> [!warning] 注意
> 1. 不可指定文件夹,必须精确到编译器的可执行文件
> 2. 此路径严格区分大小写,若windows系统盘符必须大写,若需要添加多个编译器可以使用逗号隔开

# 工作区settings.json配置vscode-proto3插件问题
```json
    "protoc": {
        "options": [
            "--proto_path=${workspaceRoot}\\proto",
            "--java_out=."
        ]
    }
```
在工作区配置时必须要有"--proto_path"参数,只写在用户区会出错

# Code Spell Checker和Error Lens一起使用时拼写检查提示显示整行提示信息太过明显
在Error Lens中的Enabled Diagnostic Levels属性中将information选项去除,这样只会在拼写错误的信息下面显示蓝色下划线而不是整行高亮提示


# ESLint和Prettier关于函数名后与圆括号之间空格冲突问题 Missing space before function parentheses
**原因：**
prettier中没有配置此规则的设置，所以使用prettier格式化时默认是无空格的`function func()`
但eslin默认是要求有空格的`function func () `
**解决方法：**
在eslint中禁用此项警告
在`.eslintrc.json`中的rule属性中添加以下设置
```.eslintrc.json
rules:{
	"space-before-function-paren": 0
}
```