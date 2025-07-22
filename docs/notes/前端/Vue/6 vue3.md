---
title: 6 vue3
createTime: 2025/05/06 22:01:42
permalink: /front/vue/6/
---
1. 更容易维护
- 组合式API
- 更好的TypeScript支持(底层也使用ts重写了)

2. 更快的速度
- 重写diff算法
- 模版编译优化
- 更高效的组件初始化

3. 更小的体积
- 良好的TreeShaking
- 按需引入

4. 更优的数据响应式
- Proxy

5. 更新的构建工具
vue2使用的构建工具是vue-cli是基于webpack
vue3使用的构建工具是create-vue是基于vite(下一代构建工具)的

# 开始

要创建vue3项目必须使用16版本以上的node
1. 创建项目
```shell
npm init vue@latest
```

2. 启动项目
```shell
npm run dev
```

在vue3中标签顺序也变化了,以script,template,style标签的顺序
在script标签中加上setup属性允许在script标签中声明组合式api
导入组件也无需再注册了
template标签中的根标签可以有多个

mount设置挂载点
`#app`id为app的盒子
```js
createApp(App).mount('#app')
```

# 组合式api

### setup
组合式api的入口
1. setup的执行时机比beforeCreate更早,因此再setup函数中获取不到this因为当时this还未创建是undefined
2. setup中的数据或函数需要return出去才能被使用

```vue
export default{
	setup(){
		const str='aeolian'
		function test(){}
		return {
			str,
			test
		}
	}
}

<div @click="test">{{ str }}</div>
```

**简化写法**
数据和函数再setup中return还是过于复杂,为了简化结构可以给script标签加上setup属性,加上setup属性后这个script标签内都是setup的作用范围,在里面定义的数据和函数不用显式return底层会自动地return
```vue
<script setup>
	const str='aeolian'
	function test(){}
</script>
```

### reactive
接受对象类型数据的参数传入并返回一个响应式的对象
它定义在vue包中,需要按需导入
```vue
const state = reactive({
	count:100
})

const setCount=()=>{
	state.count++
}

<div>{{ state.count }}</div>
<button @click="setCount">+l</button>
```

reactive通常用于接收复杂的类型

### ref
接收简单类型或者对象类型的数据专入并返回一个响应式的对象
也需要从vue包中按需导入

```vue
const count=ref(0)
console.log(count.value)
```
底层是在传入的数据基础上包装了一个对象成为了复杂类型,然后再借助reactive实现响应式,要访问数据需要通过.value
但是在template中获取数据不需要.value
```vue
<div>{{ count }}</div>
```

### computed
computed计算属性优化了写法
只需要将计算属性的逻辑函数传入到computed函数中再赋值给变量就可直接使用变量名获取
```vue
const list=ref([1,2,3,4])
const computedList=computed(()=>{
	return list.value.filter(item=>item>2)
})
```

### watch
监听一个或多个数据的变化,数据变化时执行传入的函数
```vue
//监听一个数据
watch(count,(newValue,oldValue)=>{})

//监听多个数据并设置刷新页面立即执行
watch([count1,count2],(newArr,oldArr)=>{},{immediate:true})
```
一次性监听多个数据时传入的参数就是新数据数组和旧数据数组,哪个值改变都会调用该传入的函数
**深度监视**
默认是浅层监视,这样只能监视简单数据类型,复杂数据类型监视的是地址,也就是说复杂数据类型只有改变指向时才会被监视到
在选项中加入`deep:true`开启深度监视
深度监视可以监视到复杂数据类型中数据的变化

**只监视复杂数据类型中的其中一个数据**
只监视对象中的一个数据就需要特定写法了
```vue
watch(
	()=>user.age,
	()=>console.log('用户的年龄变化了')
)
```

# 生命周期函数

| 选项式API               | 组合式API          |
| -------------------- | --------------- |
| beforeCreate/created | setup           |
| beforeMount          | onBeforeMount   |
| mounted              | onMounted       |
| beforeUpdate         | onBeforeUpdate  |
| updated              | onUpdated       |
| beforeUnmount        | onBeforeUnmount |
| unmounted            | onUnmounted     |
在vue3中也可以使用vue2中的选项式api
选项式api只能定义一个函数
组合式api可以定义多个函数,按照定义的顺序执行

# 父子间数据传递

### props
script标签中加上setup属性后就无法再使用vue2中的props属性了
可以使用编译器宏
父传子的方式不变,在子组件中接收数据使用编译器宏`defineProps`
```vue
const props = defineProps({
	car:String,
	money: Number
})
```

### emit
子传父的过程变化不大
在子组件中调用emit传递
```vue
const buy=（）=>{
	emit（'changeMoney'，5)
}
```

## 跨层级传递数据

### provide和inject
在vue3中provide和inject使用更加方便
```vue
// 顶层组件
provide('key',数据)

// 底层组件
const message=inject('key')
```
也可以传递函数

# 模板引用
```vue
const testRef =ref(null)
const getCom =() =>{
	console.log(testRef.value)
}

<TestCom ref="testRef"></TestCom>
<button@click="getCom">获取组件</button>
```
通过ref属性和ref函数配合获取dom对象

默认情况下在\<script setup>下组件内部的属性和方法是不开放给父组件访问的
可以通过defineExpose编译宏指定哪些属性和方法允许访问

# defineOptins
在3.3版本引入的
使用了`<script setup>`标签后无法使用评级属性引入了defineSetup和defineEmits宏,但使用依旧麻烦,且只有这两个宏

所以在Vue3.3中新引l入了defineOptions宏。顾名思义，主要是用来定义OptionsAPI的选项。可以用defineOptions定义任意的选项，props,emits,expose,slots除外（因为这些可以使用defineXXX来做到）

# defineModel
在vue2中v-model相当于@和:value组合
在vue3中v-model相当于@和update:modelValue组合

因为是实验性质的所以使用时需要在vite中开启
```js
plugins:[
	vue({
		script:{
			defineModel:true
		}
	})
]
```

使用defineModel绑定的数据在子组件中也可以修改绑定的父组件的值
```vue
const modelValue=defineModel()

<input type="text" :value="modelValue" @input="e=>modelValue=e.target.value"
```

# pinia
Pinia是Vue的最新状态管理工具，是Vuex的替代品
1. 提供更加简单的APl（去掉了mutation和modules）
2. 提供符合，组合式风格的API（和Vue3新语法统一）
3. 去掉了modules的概念，每一个store都是一个独立的模块
4. 配合TypeScript更加友好，提供可靠的类型推断

## 使用
1. 下载pinia
```shell
npm install pinia
```
2. 导入pinia
```js
import {createPinia} from 'pinia'
```
3. 创建pinia实例
```js
const pinia=createPinia()
```
4. 注册根实例
```js
createApp(App).use(pinia)
```

## 使用
使用definestore定义store
定义store并提供数据
在store中要定义getters需要借助computed
action中异步函数的写法和普通函数中写法一样
```vue
export const useCounterStore = defineStore('count',()=>{
	//声明数据 state-count
	const count = ref(θ)
	
	//声明操作数据的方法action（普通函数）
	const addCount=()=> count.value++
	const subCount=()=> count.value--
	//action异步函数的写法
	async test(){
		const res=await axios.get('url')
	}
	
	//声明基于数据派生的计算属性getters（computed）
	const double=computed(() => count.value *2）

	//声明数据state-msg
	const msg = ref('hello pinia')
	return {
		count,
		double,
		addCount,
		subCount
	}
})
```

使用数据
导入store后要使用直接像对象那样调用里面的函数或者使用里面的值
```vue
import {useCounterStore} from '@/store/counte'

<div>{{useCounterStore().count}</div>
```
使用store中的数据时应不使用解构,如果使用解构会丢失数据的响应式
```vue
const {count,msg}=counterStore
```
此时再对store中的数据进行更改就不会同步到store中了
因为store式用reactive包装的对象,reactive是使用对象包装的,只要对象存在就是响应式的,而解构是将数值拷贝给解构时创建的对象,和原reactive对象的数据没有关联

要让解构赋值数据支持响应式可以使用`storeToRegs`

## 持久化插件
导入并使用
```vue
import persist from 'pinia-plugin-persistedstate'
createApp(App).use(pinia.use(persist))
```
开启模块的持久化
在选项中开启`persist:true`
```vue
export const useCounterStore = defineStore('count',()=>{},{persist:true})
```
如果要使用自定义键名可以在`persist`下指定
