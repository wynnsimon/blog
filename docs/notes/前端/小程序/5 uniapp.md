---
title: 5 uniapp
createTime: 2025/06/18 21:10:54
permalink: /front/mini-program/5/
---
uni-app是国人开发的基于vue语法,可以编译成各个小程序的项目,不过由于种类多,且小程序api经常更改,uniapp会有较多bug


# vscode创建uniapp项目
```shell
npx degit dcloudio/uni-preset-vue#vite demo
```
创建基于ts的项目
```shell
npx degit dcloudio/uni-preset-vue#vite-ts demo
```
访问仓库失败处理
```shell
npx @dcloudio/uvm
```
vue3创建的项目默认不安装api语法提示依赖,手动安装
```shell
npm i @dcloudio/types miniprogram-api-typings mini-types -D
```
安装uni-ui组件库
也有其他组件库可使用,但uni-ui组件库是跨平台的
```shell
pnpm i @dcloudio/uni-ui
```

运行项目相关的命令在package.son文件中

**配置uni-ui类型(ts)**
uni-ui是js开发的,因此所有的uni-ui组件都没有类型,要想使用ts的类型检查需要导入第三方的软件包
```shell
npm i -D @uni-helper/uni-ui-types
```

# 自动导入规则的配置
在pages.json文件中添加
```json
  "easycom": {
    "autoscan": true,
    "custom": {
	  // 以uni-开头的文件自动导入@dcloudio/uni-ui/lib/后续文件夹中的对应文件,$1是占位符表示uni-后面名字
      "^uni-(.*)": "@dcloudio/uni-ui/lib/uni-$1/uni-$1.vue",
    }
  }
```

### ts配置
安装ts类型校验
```shell
pnpm i-D @types/wechat-miniprogram @uni-helper/uni-app-types
```
ts配置文件
```json
"compileroptions":{
	"types":[
		"@dcloudio/types",
		"@types/wechat-miniprogram""
		"@uni-helper/uni-app-types"
	]
}
"vueCompileroptions":{
	"experimentalRuntimeMode":"runtime-uniapp"
}
```

# 持久化
在uniapp中可以使用pinia持久化,但默认开启的持久化方式只适用于浏览器
需要对创建的store对象进行额外的配置
```js
persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key)
        },
        setItem(key, value) {
          uni.setStorageSync(key, value)
        }
      }
    }
```

# 网络请求
uni.request的success回调函数只是表示服务器响应成功，没处理响应状态码，业务中使用不方便
axios函数是只有响应状态码是2xx才调用resolve函数，表示获取数据成功，业务中使用更准确

# api

### 安全区域
不同手机上的安全区域是不同的,所有内容都应放在安全区域内,否则就会被遮挡
对于非全面屏,小程序已经默认将状态栏区域排除在外
对于非全面屏,如:刘海,胶囊,挖孔,水滴等安全区域是不同的,如果不进行配置内容部分可能会被遮挡

`uni.getSystemInfoSync()`函数用于获取系统信息,其中的safeAreaInsets是安全区域
