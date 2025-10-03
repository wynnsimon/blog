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

# 在vscode的除settings.json之外的json文件颜色预览器不生效

### 现象
在 VSCode 里，`"#RRGGBB"` 这样的字符串在 JSON 文件中不会显示颜色预览。
即使安装了 `Colorize` 等扩展，也可能无效或被覆盖。

### 原因

**内置 ColorProvider 的优先级**
VSCode 的颜色预览是通过 **ColorProvider** 提供的。 JSON 文件的解析由 **JSON 语言服务**接管。JSON 语言服务只做结构校验（数据类型、必填属性等），**不会自动识别字符串是不是颜色**。因此如果没有 schema 提示，它不会启用颜色预览。

**避免误判**
JSON 是通用的数据格式。`"#64D103"` 在有些场景是颜色，但在另一些场景可能是 ID、哈希、验证码等。如果无脑对所有 `"#xxxxxx"` 上色，可能会误导用户。

只有当 schema 明确声明这是颜色字段时，才显示颜色预览。

**解决方案**
可以通过 `json.schemas` 绑定 schema 文件。
Schema 里如果写了：`"format": "color"`那么 VSCode 才会对这个属性启用颜色预览。

**实践**
目录结构
```
your-project/
├── .vscode/
├── ├── theme-schema.json    # 自定义 JSON Schema，声明颜色字段
│   └── settings.json        # VSCode 工作区配置，绑定 schema
├── starry-night-theme.json  # 你的 VSCode 主题文件
└── other-config.json        # 其他 JSON 文件（也能享受颜色预览）
```

theme-schema.json
规则：将所有json属性递归，匹配到#开头6或8位字符在0-f或0-F的字符串解析应用颜色预览
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "$id": "http://example.com/schemas/universal-color-schema.json",
  "title": "Universal Recursive Color Schema",
  "type": "object",
  "patternProperties": {
    ".*": { "$ref": "#/definitions/colorOrAny" }
  },
  "additionalProperties": true,
  "definitions": {
    "colorOrAny": {
      "anyOf": [
        {
          "type": "string",
          "pattern": "^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$",
          "format": "color"
        },
        { "type": "string" },
        { "type": "number" },
        { "type": "boolean" },
        { "type": "null" },
        {
          "type": "array",
          "items": { "$ref": "#/definitions/colorOrAny" }
        },
        {
          "type": "object",
          "patternProperties": {
            ".*": { "$ref": "#/definitions/colorOrAny" }
          },
          "additionalProperties": true
        }
      ]
    }
  }
}
```

settings.json
```json
{
	// ...... 其他配置
  "json.schemas": [
    {
      "fileMatch": [
        "theme/*.json" // 应用到theme下所有json文件
      ],
      "url": "./.vscode/theme-schema.json"
    }
  ]
}
```
