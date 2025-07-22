---
title: 4 vuex
createTime: 2025/05/05 21:44:20
permalink: /front/vue/4/
---
vuex是一个vue 的状态管理工具，状态就是数据。可以帮我们管理vue通用的数据（多组件共享的数据）

共同维护一份数据数据集中化管理
响应式变化
操作简洁(vuex提供了一些辅助函数）

vuex是将数据存放在仓库中,仓库一般放在stroe文件夹中

1. 创建仓库(空)
```js
const store=new Vuex.Store();
```

2. 导入仓库
```vue
new Vue({
	render:h=>h(App),
	store
})
```

3. 访问仓库
仓库是所有组件都能访问到的对象
```vue
$store
```

4. 给仓库提供数据
```vue
const store=new Vuex.Store({
	state:{
		count:10
	}
})
```

5. 访问仓库中的数据
```vue
$store.state.count
```

### 访问数据
在vue中可以通过`$store.state.count`来访问仓库中的数据
在js中可以通过`store.state.count`来访问仓库中的数据

#### 辅助函数
辅助函数可以将数据映射到当前组件中,当前组件可以像获取自己数据一样获取仓库数据
访问仓库数据的代码太过繁杂可以使用计算属性精简
```vue
computed:{
	count(){
		return this.$store.state.count
	}
}
```

vuex中提供的辅助函数可以自动生成对应的计算属性
mapState是辅助函数，帮助我们把store中的数据居自动映射到组件的计算属性中
```vue
mapState(['count'])
computed: {
	...mapState(['count'])    //展开mapState
}
```

#### 修改数据
vuex同样遵循单向数据流，组件中不能直接修改仓库的数据
但在组件中依旧可以直接修改数据,这是不符合规范的.由于监测需要性能开销,所以默认没有对其进行监测
如果要规范使用修改数据可以在Store对象中开启严格模式`strict:true`这样直接修改数据就会报错

**mutations**
仓库数据的修改只能通过mutations
mutations定义在Store内部
```vue
const storee= new Vuex.Store({
	state:{
		count:0
	},
	/ / 定义mutations
	mutations:{
		//第一个参数是当前store的state属性
		addcount (state) {
			state.count +=1
		},
		addncount (state,n) {
			state.count +=n
		},
		addCount(state，obj){
			console.log(obj.str)
			state.count +=obj.n
		}
	}
})
```
调用
```vue
this.$store.commit('addcount')
```

传参调用
```vue
this.$store.commit('addncount', 10)
```

要传多个参数时就需要使用obj包装了
```vue
this.$store.commit('addncount', {str:'cnm',n:2})
```

#### 辅助函数
mapMutations和mapState很像，它是把位于mutations中的方法提取了出来，映射到组件methods中
```vue
mutations:
	subcount（state,+n){
		statcount -= n
	},
}
```

```vue
methods:{
	...mapMutations(['subcount'])
}
```

#### 异步修改数据
actions用于异步操作仓库的函数
mutations必须是同步的（便于监测数据变化，记录调试)

1. 提供actions函数
```vue
actions:{
	setAsyncCount （context,num） {
		//一秒后，给一个数，去修改num
		setTimeout(() => {
			context.commit('changeCount', num)
		}，1000)
	}
}
```

2. 使用dispatch调用
```vue
this.$store.dispatch('setAsynccount', 200)
```

#### 辅助函数
mapActions是把位于actions中的方法提取了出来，映射到组件methods中
```vue
methods: {
	...mapActions(['changeCountAction'])
}
```

### getters
除了state之外，有时我们还需要从state中派生出一些状态，这些状态是依赖state的，此时会用到getters
类似于计算属性但不能修改

1. 设置getters
```vue
state: {
	list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
}
getters:{
	//注意：
	//（1）getters函数的第一个参数是state
	//（2）getters函数必须要有返回值
	filterList (state) {
		return state.list.filter(item => item > 5)
	}
}
```

2. 访问getters
**通过 store 访问 getters**
```vue
$store.getters.filterList
```
**通过辅助函数mapGetters映射**
```vue
computed:{
	...mapGetters(['filterList'])
}
{{ filterList }}
```

# module
由于vuex使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，
store对象就有可能变得相当臃肿。（当项目变得越来越大的时候，Vuex会变得越来越难以维护)

1. 模块拆分
将store根据业务拆分成不同模块放到store/modules/user.js文件中
在拆分出的模块js文件中定义store的核心概念就是自己设置的变量了
```vue
const state ={
	userInfo:{
		name: 'zs'
		age: 18
	}
}
const mutations = {}
const actions = {}
const getters = {}
export default {
	state,
	mutations,
	actions,
	getters
}
```

2. 导入模块
```vue
import user from'./modules/user'
const store = new Vuex.Store({
	modules:{
		user
	}
})
```

## 使用module
### state使用

**在使用模块中的功能或者数据时可以直接使用模块名**
```vue
$store.state.模块名.xxx
```

**使用辅助函数有两种方式**
1. 默认根级别的映射
```vue
mapState(['模块名'])

{{模块名.xxx}}
```

2. 子模块的映射
需要开启命名空间
开启命名空间需要在模块中设置`namespaced:true`
```vue
napState(模块名,['xxx])

{{xxx}}
```

### getters使用
**通过模块名访问**
```vue
$store.getters['模块名/xxx']
```

**辅助函数**
辅助函数的用法和state一样


### mutation使用
==默认模块中的mutation和actions会被挂载到全局，需要开启命名空间，才会挂载到子模块。==

**直接调用**
```vue
$store.commit('模块名/xxx'，额外参数)
```

**辅助函数**
辅助函数的用法同上

### action使用
**直接调用**
```vue
$store.dispatch('模块名/xxx'，额外参数)
```

**辅助函数**
辅助函数的用法同上
