---
title: 8 IndexDB
createTime: 2025/09/17 21:49:37
permalink: /front/sb3zfd7w/
---
### 特点
1. 非关系型数据库：以键值对的形式存储数据
2. 持久化存储：和cookie、localStorage、sessionStorage等方式不同，IndexDB中的数据必须手动删除才会被清除
3. 异步操作
4. 支持事务
5. 同源策略：每个数据库对应创建它的域名，网页只能访问自身名下的数据库，不能访问跨域的数据库
6. 容量大

### 重要概念

1. 仓库objectStore：IndexedDB没有表的概念，它只有仓库store的概念，可以理解为表，即一个store是一张表。
2. 索引index：给对应的表字段添加索引以便加快查找速率。给某个字段添加索引后，在后续插入数据的过成功，索引字段便不能为空
3. 游标cursor：游标是IndexedDB数据库新的概念，类似一个指针。当我们要查询满足某一条件的所有数据时，就需要用到游标，让游标一行一行的往下走，游标走到的地方便会返回这一行数据，此时便可对此行数据进行判断，是否满足条件。
4. 事务：只要一个事务中的事件失败了，都会回滚到最初始的状态，确保数据的一致性

> [!NOTE] Title
> IndexedDB查询不像MySQL等数据库使用查询语句那么方便，它只能通过主键、索引、游标方式查询数据。

> [!NOTE] Title
> IndexDb的所有对于仓库的操作都是基于事务的

indexedDB对于数据库存储库有版本号的概念，如果要更新表则需要更新版本号，和软件包的版本号类似
数据库包含着存储库，存储库相当于mysql中的表

api大都是返回一个request，需要对request做监听处理，成功的话e.target.result包含成功的数据
# 操作

1. 获取数据库对象
数据库对象是挂载到window对象上的，不同的浏览器名称也不同
```js
const indexedDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
```

2. 打开数据库，如果没有则会创建
- name：数据库名称
- version：版本号
```js
const request=indexedDB=open(name,version)
```
对于数据库打开或是失败可以使用事件监听的方式
```js
let db
// 数据库打开成功的回调
request.onsuccess=(e)=>{
	db=e.target.result
}

// 数据库打开失败的回调
request.onerror=(e)=>{
	console.err(e)
}

let objectStore
//有更新时的回调（数据库创建或升级的时候）
request.onupgradeneeded=(e)=>{
	db=e.target.resullt
}
```

3. 创建存储库
- name：存储库名称
- options：配置项
```js
objectStore=db.createObjectStore('aaa',{
	keyPath:'id', //主键
	autoIncrement:true //是否主键自增
})
```

4. 创建索引
- name：名字
- field：对应的字段名
- options：配置项，主键必须唯一
```js
objectStore.createIndex('id','id',{unique:false})
```

5. 获取数据库中指定的存储库
- storeName：字符串，要获取的存储库的名称
- mode：字符串，模式，读写或读写
- return：存储库对象
```js
const store=db.transaction([storeName],mode)
```

6. 获取存储库对象中的存储库实例
- storeName：字符串，存储库名称
- return：存储库实例
```js
const objectStore=store.objectStore(storeName) 
```

7. 添加数据
- data：数据，object对象
```js
objectStore.add(data)
```

8. 根据主键获取数据
- key：主键名
```js
const request=objectStore.get(key)
```

9. 根据游标查询数据
continue：游标往下走
```js
const request= store.openCursor()//获取指针对象
const list=[]
request.onsuccess=(e)=>{
	const cursor=e.target.result
	if(cursor){
		list.push(cursor.value)
		cursor.continue()
	}
}
```

10. 根据索引查询
- name：索引名
- indexValue：索引值
查询第一条匹配的数据（索引名等于索引值的数据）
```js
const request=store.index(name).get(indexValue)
request.onsuccess=(e)=>{}
request.onerror=(e)=>{}
```

11. 索引和游标查询
- only：等于indexValue的数据
```js
const request=store.index(indexName).openCursor(IDBKeyRange.only(indexValue))
```