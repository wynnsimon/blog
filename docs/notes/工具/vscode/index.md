---
title: 1 配置
createTime: 2025/06/22 10:25:08
permalink: /tools/vscode/
---
# C++配置
```json
{
    // 使用 IntelliSense 了解相关属性。 
    // 悬停以查看现有属性的描述。
    // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
    "version": "0.2.0",
    "configurations": [
        {
            "name": "(gdb) 启动",
            "type": "cppdbg",
            "request": "launch",
            "program": "${command:cmake.launchTargetPath}",
            "args": [],
            "stopAtEntry": false,
            "cwd": "${fileDirname}",
            "environment": [],
            "externalConsole": false,
            "MIMode": "gdb",
            "miDebuggerPath": "D:\\qt\\Tools\\mingw1120_64\\bin\\gdb.exe",
            "setupCommands": [
                {
                    "description": "为 gdb 启用整齐打印",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                },
                {
                    "description": "将反汇编风格设置为 Intel",
                    "text": "-gdb-set disassembly-flavor intel",
                    "ignoreFailures": true
                }
            ],
            "preLaunchTask": "cmake build"
        }
    ]
}
```

```json
{
    "version": "2.0.0",
    "options": {
        "cwd": "${workspaceFolder}\\build"  //cwd相当于cd命令，workspaceFolder是工作区目录
    },

    "tasks": [
        {
            "label": "cmake",
            "type": "shell",    //执行shell命令
            "command": "cmake",    //shell命令叫做cmake
            "args": [    //cmake的shell命令后的参数
                ".."
            ]
        },
        {
            "label": "make",
            "group":{
                "kind":"build",
                "isDefault":true
            },
            "command": "mingw32-make.exe",    //第三个命令，mingw中的构建工具
            "args":[   //由于这个命令不需要参数因此命令字符串为空
            ]
        },
        {
            "label":"cmake build",
            "dependsOn":[    //二者皆是label值，lable相当于一个标题
                "cmake",
                "make"                
            ]
        }
    ]
}
```

```cmake
cmake_minimum_required(VERSION 3.27)

project(test)

aux_source_directory(${PROJECT_SOURCE_DIR}/src SRCS)
include_directories(${PROJECT_SOURCE_DIR}/include)

set(EXECUTABLE_OUTPUT_PATH ${PROJECT_SOURCE_DIR}/output)

add_executable(${PROJECT_NAME} ${SRCS})
```

vscode
- 简单文件对话框
```json
"files.simpleDialog.enable": true
```

- 文件关联
为未正确检测到的文件创建语言关联。例如，许多具有自定义文件扩展名的配置文件实际上是 JSON。创建文件关联后会默认以关联的文件格式打开此后缀的文件
```json
"files.associations": {
    ".database": "json"
}
```

# vscode中json文件中的配置

## 宏或json变量的含义

| 宏或变量                     | 含义                                                                                                                      |     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------- | --- |
| ${}                      | 表示取出宏中的内容                                                                                                               |     |
| program                  | 要运行的可执行文件的路径                                                                                                            |     |
| 宏fileDirname             | 项目所在文件夹                                                                                                                 |     |
| 宏fileBasenameNoExtension | 当前打开的是哪个文件就代表的哪个文件名(NoExtension是不带后缀名的意思)                                                                               |     |
| externalConsole          | 布尔值,使用外部终端还是内部终端,外部终端就是操作系统自带的中断. (旧版,现在常用console选项)                                                                    |     |
| console                  | 控制台选项,externalTerminal是外部控制台                                                                                            |     |
| miDebuggerPath           | 调试器的所在路径,要带调试器的文件名                                                                                                      |     |
| preLaunchTask            | 在执行程序前要执行的任务 ( 在tasks.json中找task中label值相同的标签,执行里面的任务 )                                                                  |     |
| command                  | 要运行的编译器的路径                                                                                                              |     |
| args                     | 运行编译器时的参数                                                                                                               |     |
| file                     | 当前打开的文件名(带后缀)                                                                                                           |     |
| type                     | 编译器的选项,gcc编译器是cdbg,msvc是cvcdbg,g++是cppdbg,c++的msvc是cppvcdbg                                                             |     |
| environment              | 当前工作区临时添加环境变量,在启动前会先向环境变量中添加写入的环境变量,结束后再删除. 里面是json数组存储的,json数组中存储多条环境变量,每条环境变量以json对象的格式,其中的元素name为环境变量名,value是环境变量的名字 |     |
| request                  | 启动或附加,启动就是生成.exe文件启动它,附加就是配合其他的多文件项目使用一般很少使用附加                                                                          |     |
| editor.formatOrSave      | 在保存时格式化文件.布尔值表示是否打开                                                                                                     |     |

```json
"environment":[
	{
		"name":"PATH",
		"value":"d:/Qt/Tools/mingw1130_64/bin/gdb.exe"
	}
]
```

将launch.json中的progarm变量的值设置为cmake返回的可执行路径名以此和cmake配合使用
```json
program:"${command:cmake.launchTargetPath}"
```
这时把preLaunchTask变量取消掉就可以了,这个命令是执行前使用gcc编译器生成可执行文件
也可以使用cmake取代
command:cmake.launchTargetPath的返回值是目标目录,正好被program接收从而执行vscode
### cmake扩展中的命令

| 命令                             | 含义                                                      |
| ------------------------------ | ------------------------------------------------------- |
| command:cmake.launchTargetPath | command表示运行一个命令,这个命令就是:后边的命令.即:启动目标目录(执行目录中的程序,并返回这个目录) |
|                                |                                                         |

# 代码风格
**格式化代码风格Google Style 及4空格缩进**
在`Clang_format_fallback Style`设置填入
由于Google Style为括号不换行，缩进2空格。也可以使用Google风格只针对缩进更改
`Clang_format_fallback Style`设置为格式化代码的风格，它和保存代码的风格并不同步
保存代码的风格是`Clang_format_style`
```js
{ BasedOnStyle: Google, UseTab: Never, IndentWidth: 4, TabWidth: 4, BreakBeforeBraces: Attach, AllowShortIfStatementsOnASingleLine: false, IndentCaseLabels: false, ColumnLimit: 0, AccessModifierOffset: -4 }
```

**google风格但权限修饰符不缩进**
```js
{BasedOnStyle: Google,AccessModifierOffset: -2,IndentWidth: 2}
```
# clangd

和微软官方的`C/C++`代码提示冲突,必须禁用一个
如果禁用C/C++代码提示会导致自动生成launch.json文件和tasks.json文件出问题,可以两个都打开关闭冲突提示,这样clang会默认覆盖C/C++代码提示,但这样会导致有时生成文件正常有时不正常

如果要在项目引入一个第三方库需要更改此项目文件夹下的.vscode文件夹中的settings.json
在其中加上
```json
{
	"clangd.fallbackFlags":[
		"-I+库文件夹路径"
	]
}
```
如需要引入的第三方库头文件在D:\\path\\include中
```json
{
	"clangd.fallbackFlags":[
		"-Id:/path/inculde"
	]
}
```
如果需要多个文件的项目就需要使用cmake和vscode配合引入了

```json
  // 开启粘贴保存自动格式化
  "editor.formatOnPaste": true,
  "editor.formatOnType": true,
  "C_Cpp.errorSquiggles": "Disabled",
  "C_Cpp.intelliSenseEngineFallback": "Disabled",
  "C_Cpp.intelliSenseEngine": "Disabled",
  "clangd.path": "/usr/bin/clangd",
  // Clangd 运行参数(在终端/命令行输入 clangd --help-list-hidden 可查看更多)
  "clangd.arguments": [
    // compile_commands.json 生成文件夹
    "--compile-commands-dir=${workspaceFolder}/build",
    // 让 Clangd 生成更详细的日志
    "--log=verbose",
    // 输出的 JSON 文件更美观
    "--pretty",
    // 全局补全(输入时弹出的建议将会提供 CMakeLists.txt 里配置的所有文件中可能的符号，会自动补充头文件)
    "--all-scopes-completion",
    // 建议风格：打包(重载函数只会给出一个建议）
    // 相反可以设置为detailed
    "--completion-style=bundled",
    // 跨文件重命名变量
    "--cross-file-rename",
    // 允许补充头文件
    "--header-insertion=iwyu",
    // 输入建议中，已包含头文件的项与还未包含头文件的项会以圆点加以区分
    "--header-insertion-decorators",
    // 在后台自动分析文件(基于 complie_commands，我们用CMake生成)
    "--background-index",
    // 启用 Clang-Tidy 以提供「静态检查」
    "--clang-tidy",
    // Clang-Tidy 静态检查的参数，指出按照哪些规则进行静态检查，详情见「与按照官方文档配置好的 VSCode 相比拥有的优势」
    // 参数后部分的*表示通配符
    // 在参数前加入-，如-modernize-use-trailing-return-type，将会禁用某一规则
    "--clang-tidy-checks=cppcoreguidelines-*,performance-*,bugprone-*,portability-*,modernize-*,google-*",
    // 默认格式化风格: 谷歌开源项目代码指南
    // "--fallback-style=file",
    // 同时开启的任务数量
    "-j=2",
    // pch优化的位置(memory 或 disk，选择memory会增加内存开销，但会提升性能) 推荐在板子上使用disk
    "--pch-storage=disk",
    // 启用这项时，补全函数时，将会给参数提供占位符，键入后按 Tab 可以切换到下一占位符，乃至函数末
    // 我选择禁用
    "--function-arg-placeholders=false",
    // compelie_commands.json 文件的目录位置(相对于工作区，由于 CMake 生成的该文件默认在 build 文件夹中，故设置为 build)
    "--compile-commands-dir=build"
  ],
```

除了在总体设置设置clangd,还可以在工作区目录中建立compile_commands.json文件设置clangd在当前工作区的设置
通常配合cmake构建工具链, cmake可以生成compile_commands.json文件
在使用cmake构建后在构建出的build目录生成有compile_commands.json文件,如果没有可以在build目录中make一下makefile就可以生成.
如果不想再次make可以使用`compiledb -n make`命令假装make也可以生成但不会真的执行编译过程

## 调试

### 直接监视一个地址或从此开始后边的元素
监视一个首元素地址为`0x2aba9f64980`长度为10的数组
```
*(int(*)[10])0x2aba9f64980
```

### 监视一个数组中的内容
若传入参数为数组指针的话在调试时显示的变量会是地址值,可以在调试监视中添加表达式将指针解析为数组进行调试

如:监视一个大小为10的整形数组
- arr_name: 是要监视的数组的名字
```
*(int(*)[10])arr_name
```

### 监视一个类中的成员变量:数组指针
要监视类中的成员变量就需要使用指针符`->`从类中取出
- class : 要监视的类的实例
- arr : 要监视的类中的对象
```
*(int(*)[10])class->arr
```

### 要监视一个函数中变量的成员
要监视一个函数中的局部变量就需要使用作用域符`::`取出函数中的局部变量然后再取出成局部变量中的成员变量

- func : 函数名
- class : 实例名
- arr : 成员变量名
```
*(int(*)[10])func::class->arr
```

# Qt
```cmake
cmake_minimum_required(VERSION 3.30) # CMake install : https://cmake.org/download/
project(test LANGUAGES CXX)
set(CMAKE_INCLUDE_CURRENT_DIR ON)
set(CMAKE_PREFIX_PATH "D:/Develop/Qt/6.8.1/mingw_64") # Qt Kit Dir

# 自动把ui转换为h文件
# uiname.ui -> ui_uiname.h
set(CMAKE_AUTOUIC ON)
# 自动生成信号槽代码
set(CMAKE_AUTOMOC ON)
# 自动生成资源文件rcc -> .h
set(CMAKE_AUTORCC ON)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

include_directories(
  ${PROJECT_SOURCE_DIR}/head
  ${PROJECT_SOURCE_DIR}/ui
)
aux_source_directory(./src SRCS)

add_executable(${PROJECT_NAME}
  ${SRCS} 
) 

set(Qt6_DIR "D:/Develop/Qt/6.8.1/mingw_64/lib/cmake/Qt6")

find_package(Qt6 COMPONENTS Widgets REQUIRED) # Qt COMPONENTS
target_link_libraries(${PROJECT_NAME} PRIVATE Qt::Widgets) # Qt5 Shared Library
```

# Python

### 跨文件调用
当两个文件文件夹结构如下:
```
test-
	|
	|--demo
	|      |
	|      --test.py
	|
	|--demo2
	|      |
	|      --test.py
```
两个py文件相互调用时
直接import导入是无法直接使用的
```python
from demo import add
```

可以使用官方库:
```python
import sys
sys.path.append("./")
```
将上一级目录中的所有文件添加到当前临时环境变量中就可以找到了
但使用格式化代码会自动把添加到环境变量的代码排到导入demo文件夹的下面

```python
from demo import add
import sys
sys.path.append("./")
```
导致出错

需要在settings.json中将排序关闭
```json
"python.formatting.autopep8Args":[
	"--ignore",
	"E402"
]
```
添加以上代码后就不会破坏代码顺序了

# 通用配置
在主题中的`colors`字段中的属性表示的是除代码部分其他区域的配色也就是工作台配色workbench colors
```json
"colors":{
}
```

`tokenColors`是代码部分的配色也就是语法配色synax colors

#### 配置protobuf
```json
    "protoc": {
        "path": "protoc",\\protoc的路径,如果有配置环境变量可以使用默认,没有配置环境变量就需要指定绝对路径
        "compile_on_save": false,//保存时编译
        "options": [
            "--proto_path=${workspaceRoot}\\proto",//目标.proto文件所在文件经
            //需要在不同语言项目下根据对应语言进行配置,否则会把所有语言的文件都生成一遍
            // "--cpp_out=${workspaceRoot}\\proto",
            // "--java_out=${workspaceRoot}\\proto"
        ]
    },
```


```json
{
    "workbench.preferredDarkColorTheme": "Default Dark+",
    "workbench.preferredHighContrastColorTheme": "Default High Contrast Light",
    "workbench.colorCustomizations": {
        "editorCursor.foreground": "#a56cdbe8",
        // #00b7e4 errorlens
    },
    "remote.SSH.configFile": "C:\\Users\\pinkdopeybug\\.ssh\\config",
    "remote.SSH.remotePlatform": {
        "192.168.248.132": "linux",
        "Ubuntu22.04": "linux",
    },
    "workbench.editor.autoLockGroups": {
        "workbench.editor.chatSession": true,
    },
    "editor.mouseWheelZoom": true,
    "editor.acceptSuggestionOnEnter": "smart",
    "editor.suggestSelection": "first",
    "window.dialogStyle": "custom",
    "debug.showBreakpointsInOverviewRuler": true,
    "cmake.configureOnOpen": true,
    "explorer.confirmDragAndDrop": false,
    "vsintellicode.modify.editor.suggestSelection": "choseToUpdateConfiguration",
    "Lingma.LocalStoragePath": "C:\\Users\\pinkdopeybug\\.lingma",
    "explorer.confirmDelete": false,
    "cmake.pinnedCommands": [
        "workbench.action.tasks.configureTaskRunner",
        "workbench.action.tasks.runTask"
    ],
    "C_Cpp.clang_format_fallbackStyle": "{BasedOnStyle: Google,AccessModifierOffset: -2,IndentWidth: 2}",
    "C_Cpp.clang_format_style": "{BasedOnStyle: Google,AccessModifierOffset: -2,IndentWidth: 2}",
    "C_Cpp.inlayHints.autoDeclarationTypes.enabled": true,
    "C_Cpp.inlayHints.referenceOperator.enabled": true,
    "javascript.inlayHints.enumMemberValues.enabled": true,
    "database-client.showUser": true,
    "database-client.highlightSQLBlock": true,
    "makefile.makePath": "D:\\qt\\Tools\\mingw1120_64\\bin",
    "clangd.path": "clangd.exe",
    "cmake.cmakePath": "cmake.exe",
    "cmake.options.statusBarVisibility": "compact",
    "clangd.detectExtensionConflicts": false,
    "[cpp]": {
        "editor.defaultFormatter": "ms-vscode.cpptools",
    },
    "cmake.buildTask": true,
    "cmake.showOptionsMovedNotification": false,
    "[c]": {
        "editor.defaultFormatter": "ms-vscode.cpptools",
    },
    "clangd.arguments": [
        "--clang-tidy",
        "--header-insertion=never",
        // compile_commands.json 生成文件夹
        "--compile-commands-dir=${workspaceFolder}\\build",
        // 让 Clangd 生成更详细的日志
        "--log=verbose",
        // 输出的 JSON 文件更美观
        "--pretty",
        // 输入建议中，已包含头文件的项与还未包含头文件的项会以圆点加以区分
        "--header-insertion-decorators",
        // 启用这项时，补全函数时，将会给参数提供占位符，键入后按 Tab 可以切换到下一占位符，乃至函数末
        // 我选择禁用
        "--function-arg-placeholders=false",
        "--query-driver=D:\\qt\\Tools\\mingw1120_64\\bin\\*"
    ],
    "editor.linkedEditing": true,
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    "editor.guides.bracketPairs": true,
    //"C_Cpp.intelliSenseEngine": "disabled",
    "C_Cpp.loggingLevel": "Debug",
    "mdb.persistOIDCTokens": false,
    "livePreview.portNumber": 10000,
    "files.simpleDialog.enable": true,
    "makefile.configureOnOpen": true,
    "cmake.buildDirectory": "${workspaceFolder}\\build",
    "window.zoomLevel": 0.5,
    "javascript.referencesCodeLens.enabled": true,
    "javascript.referencesCodeLens.showOnAllFunctions": true,
    "typescript.implementationsCodeLens.enabled": true,
    "typescript.implementationsCodeLens.showOnInterfaceMethods": true,
    "typescript.referencesCodeLens.enabled": true,
    "typescript.referencesCodeLens.showOnAllFunctions": true,
    "java.referencesCodeLens.enabled": true,
    "java.implementationsCodeLens.enabled": true,
    "diffEditor.codeLens": true,
    "editor.codeLens": true,
    "workbench.preferredLightColorTheme": "Default Dark+",
    "protoc": {
        "path": "protoc",
        "compile_on_save": false,
        "options": [
            "--proto_path=${workspaceRoot}\\proto"
        ]
    },
    "[java]": {
        "editor.defaultFormatter": "redhat.java"
    },

    "terminal.integrated.cursorWidth": 3,
    "editor.cursorSmoothCaretAnimation": "on",
    "editor.cursorWidth": 3,
    "editor.cursorBlinking": "smooth",
    "leetcode.endpoint": "leetcode-cn",
    "leetcode.workspaceFolder": "D:\\project\\vscode\\stswot",
    "leetcode.hint.configWebviewMarkdown": false,
    "leetcode.hint.commentDescription": false,
    "leetcode.defaultLanguage": "c",
    "[xml]": {
        "editor.defaultFormatter": "redhat.vscode-xml"
    },
    "npm.packageManager": "npm",
    "editor.accessibilitySupport": "off",
    "java.configuration.maven.userSettings": "D:\\path\\maven-3.9.9\\conf\\settings.xml",
    "java.configuration.maven.globalSettings": "D:\\path\\maven-3.9.9\\conf\\settings.xml",
    "workbench.editorAssociations": {
        "{hexdiff}:/**/*.*": "hexEditor.hexedit",
        "*.copilotmd": "vscode.markdown.preview.editor",
        "{git,gitlens,git-graph}:/**/*.{md,csv,svg}": "default",
        "{git,gitlens}:/**/*.{md,csv,svg}": "default"
    },
    "vscode-office.editorTheme": "Auto",
    "java.format.settings.profile": "GoogleStyle",
    "editor.tabSize": 2,
    "cSpell.logLevel": "Information",
    "errorLens.fontStyleItalic": true,
    "cSpell.diagnosticLevel": "Hint",
    "livePreview.showServerStatusNotifications": true,
    "terminal.integrated.env.windows": {},
    "console-ninja.featureSet": "Community",
    "security.workspace.trust.untrustedFiles": "open",
    "vscode-office.openOutline": true,
    "debug.console.wordWrap": false,
    "python.createEnvironment.trigger": "off",
    "workbench.editor.editorActionsLocation": "titleBar",
    "workbench.startupEditor": "none",
    "database-client.autoSync": true,
    "redhat.telemetry.enabled": true,
    "vue.server.hybridMode": true,
    "editor.bracketPairColorization.independentColorPoolPerBracketType": true,
    "window.title": "${dirty}${activeEditorMedium}${separator}${rootName}",
    "workbench.colorTheme": "PinkDopeyBug",
    "editor.inlayHints.enabled": "onUnlessPressed",
    "window.newWindowProfile": "默认",
}
```

# 文件嵌套
有些相关的文件可以在资源管理器中整合在一起
如package.json和package-lock.josn

将选项`file nesting`勾选

配置需要嵌套的文件在`File Nesting: Patterns`中

# 文件关联
`Files: Associations`中配置,将需要关联的文件关联为目标格式,如json不允许注释但jsonc允许注释可以将需要的json文件关联至jsonc

**配置所有json文件都可以写注释**
在文件关联中设置`*.json`:`jsonc`
不建议这样做
package.json如果有注释可能会出问题

建议单独为需要的文件配置允许注释
