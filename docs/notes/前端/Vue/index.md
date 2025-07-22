---
title: 1 vue
createTime: 2025/05/04 17:20:02
permalink: /front/vue/
---
Vue是一个用于构建用户界面的渐进式框架，免除原生JavaScript中的DOM操作，简化书写。

# 开始
1. 创建项目
```shell
vue create 项目名
```

2. 启动项目
```shell
npm run serve
```
# vue对象
- el属性指定选择器所管理的标签
- data用于存储数据
- methods用于存储定义的函数
当设置好管理的标签后在该标签内就可以通过插值表达式直接使用vue中的数据了
```vue
  <div class="app">
    {{ msg }}
  </div>

  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <script>
    new Vue({
      el: '.app',
      data: {
        msg: 'Hello World'
      }
    })
  </script>
```

## 计算属性
基于现有的数据，计算出来的新属性。依赖的数据变化，自动重新计算。

- 声明在computed配置项中，一个计算属性对应一个函数
- 使用起来和普通属性一样使用`{{计算属性名}}`
```vue
computed:{
	计算属性名(){
		基于现有数据，编写求值逻辑
		return 结果
	}
}
```

相比于methods中的函数,计算属性具有缓存特性（提升性能）：
计算属性会对计算出来的结果缓存，再次使用直接读取缓存 . 依赖项变化了，会自动重新计算→并再次缓存

### 完整写法
计算属性默认的简写，只能读取访问，不能“修改"。
如果要“修改”→需要写计算属性的完整写法。

计算属性是具有get和set方法的,非完整写法默认是get
```vue
computed:{
	计算属性名：{
		get() {
			一段代码逻辑（计算逻辑）
			return 结果
		}
		set（修改的值）{
			一段代码逻辑（修改逻辑）
		}
	}
}
```

## watch侦听器(监视器)
监视数据变化，执行一些业务逻辑或异步操作。
监听器会在监听的数据改变的时候调用,newValue是改变后的新值,oldValue是改变前的旧值 . 如果数据比较复杂需要使用引号包裹取值
```vue
new Vue({
    el: '.app',
	data: {
	    count:10,
	    obj:{
		    words:""
	    }
    },
    watch: {
	    count(newValue,oldValue){}
	    'obj.words'(newValue){}
    }
})
```

#### 异步请求
将监听器函数像正常的函数一样设置异步请求即可
```vue
watch:{
	async 'obj.words'(newValue){
		const res = await axios({
			url:'https://applet-base-api-t.itheima.net/api/
			params:{
				words:newValue
			}
		})
		console.log(res.data.data)
	}
}
```

#### 完整属性
- deep : 深度监视,当监视的数据更改时就调用handler函数(监视obj时其内部的words和lang更改时都会触发)
- immediate : 立刻执行,当监视的内容被创建时立即执行一次
```vue
new Vue({
    el: '.app',
	data: {
	    count:10,
	    obj:{
		    words:"",
		    lang:""
	    }
    },
    watch: {
	    obj:{
	    	deep:true,
		    immediate:true,
		    handler(newValue){}
	    }
    }
})
```


# vue指令
vue指令就是带有v-前缀的特殊==标签属性==

### v-html
以html的方式解析对应的文本
```vue
  <div class="app">
    <div v-html="msg"></div>
  </div>

  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <script>
    new Vue({
      el: '.app',
      data: {
        msg: '<a href="https://www.google.com">Google</a>'
      }
    })
  </script>
```

### v-show
控制元素的显示或隐藏
赋值为一个表达式,表达式的结果为true就是显示,表达式的结果是false就是隐藏

底层原理是切换css的display属性

### v-if v-elif v-else
控制元素的显示与隐藏
v-if和v-elif后面跟表达式,值为true则显示,值为false则隐藏
从上往下如果遇到为true的则不会执行后面的v-if或v-elif了,如果都不符合则显示v-else的

底层原理是根据判断条件选择是否创建或移除元素

### v-on
用于注册事件(添加监听+提供处理逻辑)
简写形式使用@代替v-on:

当需要的事件逻辑比较复杂时可以将v-on中的值赋值为vue对象的methods中函数名
如果需要函数传参也可直接像正常的函数调用那样传参
语法
```vue
v-on:事件名="内联语句(要绑定的函数名)"
@事件名="内联语句(要绑定的函数名)"
```

示例
```vue
  <div class="app">
    <button v-on:click="count++">{{count}}</button>
    <button @click="count--">{{count}}</button>
  </div>

  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <script>
    new Vue({
      el: '.app',
      data: {
        count:10
      }
    })
  </script>
```

### v-bind
用于设置动态属性
简写形式可以省略v-bind直接在属性前加:

```vue
  <div class="app">
    <a v-bind:href="url">Hello World</a>
  </div>

  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <script>
    new Vue({
      el: '.app',
      data: {
        url : 'https://www.google.com'
      }
    })
  </script>
```

##### 操作class
```vue
:class="对象/数组"
```

对象→键就是类名，值是布尔值。如果值为true，有这个类，否则没有这个类
```vue
<div class="box" :class="{ 类名1：布尔值，类名2：布尔值 }"></div>
```

数组→数组中所有的类，都会添加到盒子上，本质就是一个 class 列表
```vue
<div class="box" :class="[ 类名1，类名2，类名3 ]"></div>
```

##### 操作style

```vue
<div class="box" :style="{ CSS属性名1:CSS属性值, CSS属性名2:CSS属性值 }"></div>
```

### v-for
基于数据进行循环,多次渲染整个元素
item是元素,index是元素对应的索引,也可以省略item,当只有item一个元素时可以省略括号
```vue
  <div class="app">
    <ul>
      <li v-for="(item,index) in skills" :key="index">{{item}}-{{index}}</li>
    </ul>
  </div>

  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <script>
    new Vue({
      el: '.app',
      data: {
        skills:["五禁玄光气","逆流护身印","玄天斩灵剑"]
      }
    })
  </script>
```

:key属性用于帮助v-for排序
v-for的默认行为会尝试原地修改元素（就地复用）

如果不指定key的情况下删除一个元素那么默认删除的是最后一个元素,并将删除后的数据再使用原本的元素容器复用存放数据,如果删除的元素不是最后一个那么这个元素的样式会留下,但其中的数据被按照修改后的数据从前往后依次替换了

如果指定了key就可以定位到具体要修改的是哪个元素

1. key 的值只能是字符串或数字类型
2. key 的值必须具有唯一性
3. 推荐使用 id 作为 key（唯一），不推荐使用 index 作为 key（会变化，不对应)

### v-model
作用：给表单元素使用，双向数据绑定→可以快速获取或设置表单元素内容
```vue
  <div class="app">
    <input type="text" v-model="user" placeholder="请输入用户名">
    <input type="password" v-model="pwd" placeholder="请输入密码">
    <button @click="login">登录</button>
    <button @click="register">重置</button>
  </div>

  <!-- vue -->
  <script src="https://cdn.jsdelivr.net/npm/vue@2.7.14/dist/vue.js"></script>
  <script>
    new Vue({
      el: '.app',
      data: {
        user: "",
        pwd: ""
      },
      methods: {
        login() {
          console.log(this.user, this.pwd)
        },
        register() {
          this.user = ""
          this.pwd = ""
        }
      }
    })
  </script>
```

常见的表单元素都可以用v-model绑定关联→快速获取或设置表单元素的值
它会根据控件类型自动选取正确的方法来更新元素

## 指令修饰符
通过`.`指明一些指令后缀，，不同 后缀封装了不同的处理操作用于简化代码

1. 按键修饰符
`@keyup`用于监听按键弹起事件 , `@keyup.enter`监听键盘回车

2. v-model修饰符
`v-model.trim`去除首尾空格
`v-model.number`转数字

3. 事件修饰符
`@事件名.stop`阻止冒泡
`@事件名.prevent` 阻止默认行为

# defineAsyncComponent
异步加载一个组件
里面是一个promise，在里面设置的component、loadingComponent、errorComponent分别对应于promise的已完成、进行中、已拒绝状态的组件

可以使用这个函数异步加载一个组件，将这个函数返回的组件挂载到页面上，当该组件未加载完毕时会显示loadingComponent的组件，当组件加载完成后会显示加载的组件，当组件加载失败时会显示errorComponent的组件

也可以使用它异步加载一个页面

# 响应式数据

| API      | 传入                    | 返回          | 说明                                                                                                                                 |
| -------- | --------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| reactive | plain-object          | 对象          | 代理深度代理对象中的所有成员                                                                                                                     |
| readonly | plain-object or proxy | 对象          | 代理只能读取代理对象中的成员，不可修改                                                                                                                |
| ref      | any                   | {value:...} | 对value的访问是响应式的，如果给value的值是一个对象，则会通过reactive函数进行代理，如果已经是代理，则直接使用代理。因为proxy只能代理对象无法代理基本数据类型，所以ref就会将所有的数据类型都封装到一个对象中，这样就可以使用proxy代理了 |
| computed | function              | {value:...} | 当读取value值时，会根据情况决定是否要运行函数                                                                                                          |

# 自定义指令
自己定义的指令，可以封装一些dom操作，扩展额外功能

指令的钩子函数有两个:
- inserted会在指令所在元素被插入到页面中时触发
- update会在指令的值修改的时候触发
1. 全局注册
```vue
Vue.directive()'指令名',{
	"inserted"(el){
		//可以对 el标签，扩展额外功能
		el.focus()
	}
})
```

2. 局部注册
```vue
directives:{
	'指令名"：{
		inserted () {
			//可以对 el标签，扩展额外功能
			el.focus()
		}
	}
}
```

# 插槽

让组件内部的一些结构支持自定义

### 匿名插槽
在定义组件的时候使用`<slot></slot>`标签占位
在使用的时候将插入的内容使用自定义的标签报告就会把内容插入到slot的位置了
```vue
<MyDialog>内容</MyDialog>
```

### 具名插槽
匿名插槽只有一个占位,如果有多个需要插槽的地方可以使用具名插槽
若要定义具名插槽也是使用slot标签,不过需要加上name属性作以区分
```vue
<div>
	<slot name="a"></slot>
	<slot name="b"></slot>
</div>
```
在使用时需要用template标签包裹内容,并使用v-slot命令表示插入哪个插槽中
```vue
<MyDialog>
	<template v-slot:a>
		大标题
	</template>
	<template v-slot:a>
		内容文本
	</template>
</MyDialog>
```

v-slot可使用`#`代替
### 默认值
要将插槽设置默认值只需要将值放在slot标签内即可

### 作用域插槽
定义 slot插槽的同时是可以传值的。给插槽上可以绑定数据将来使用组件时可以用

基本使用步骤：
1. 给slot标签，以添加属性的方式传值
```vue
<slot :id="item.id" msg="测试文本"></slot>
```

2. 所有添加的属性,都会被收集到一个对象中
```vue
{ id: 3, msg:测试文本’}
```

3. 在template中,通过E#插槽名="obj"接收，默认插槽名为default
```vue
<MyTable :list="list">
	<template #default="obj">
		<button @click="del(obj.id)">删除</button>
	</template>
</MyTable>
```
