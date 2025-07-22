---
title: 2 bable
createTime: 2025/06/18 21:09:36
permalink: /front/engineering/2/
---
对于js代码有些浏览器还不支持es6语法，因此在使用es6语法的项目需要使用bable将其编译成es5规范的语法的代码
bable通常在dev环境下使用

- bable-loader：提供bable的接口
- @bable/core：bable的核心，编译需要bable核心参与
```shell
npm install bable-loader @bable/core --save-dev
```

从es6到es5中也是有多种规范，如果不指定使用哪种规范bableloader不会工作
通常使用的规范是preset-env，需要安装
```shell
npm install @bable/preset-env --save-dev
```

# 配置文件

bable的配置文件在`.bablerc`中
```js
presets:[
	[
		'@bable/preset-env',
		{
			targets:{
				browsers:[
					">1%",
					"last 2 versions",
					"not ie<=8"
				]
			}
		}
	]
]
```

### 预设
- @babel/preset-env：—个智能预设，允许您使用最新的JavaScript。I
- @babel/preset-react：一个用来编译Reactjsx语法的预设
- @babel/preset-typescript：一个用来编译TypeScript语法的预设

### 插件
Babel为编译的每个文件都插入了辅助代码，使代码体积过大！
Babel对一些公共方法使用了非常小的辅助代码，比如_extend。默认情况下会被添加到每一个需要它的文件中。

@babel/plugin-transform-runtime：禁用了Babel自动对每个文件的runtime注入，而是引l入
gbabel/plugin-transform-runtime并且使所有辅助代码从这里引用。
