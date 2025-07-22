---
title: 1 简介
createTime: 2025/06/22 10:04:20
permalink: /tools/mongodb/
---
并不像关系型数据库那样在数据表创建之初就确定好列
它支持的数据结构非常松散，是一种类似于JSON的格式叫BSON，所以它既可以存储比较复杂的数据类型，又相当的灵活。
它是文档型数据库,其中一个数据库中有多个集合,一个集合中有多个文档
集合类似于关系型数据库中的表,文档类似于关系型数据库中的行

| SQL术语/概念    | MongoDB术语/概念 | 解释/说明                                |
| ----------- | ------------ | ------------------------------------ |
| database    | database     | 数据库                                  |
| table       | collection   | 数据库表/集合                              |
| row         | document     | 数据记录行/文档                             |
| column      | field        | 数据字段/域                               |
| index       | index        | 索引                                   |
| table joins |              | 表连接,MongoDB不支持                       |
|             | 嵌入文档         | MongoDB通过嵌入式文档来替代多表连接                |
| primary key | primary key  | 主键，MongoDB中主键不是自己设置的而是会自动将_id字段设置为主键 |
| index       | index        | 索引                                   |
| view        | view         | 视图                                   |
| table joins | lookup       | 聚合操作                                 |

启动
```shell
mongod --dbpath D:\MongoDB\data\db --logpath D:\MongoDB\logs\mongodb.log
```
添加到windows服务
```shell
mongod --dbpath "D:\MongoDB\data\db" --logpath "D:\MongoDB\log\mongo.log" -install -serviceName "MongoDB"
```
如果没有权限需要使用管理员身份打开cmd

有一些数据库名是保留的，可以直接访问这些有特殊作用的数据库。
- admin：从权限的角度来看，这是"root"数据库。要是将一个用户添加到这个数据库，这个用户自动继承所有数据库的权限。一些特定的服务器端命令也只能从这个数据库运行，比如列出所有的数据库或者关闭服务器。
- local：这个数据永远不会被复制，可以用来存储限于本地单台服务器的任意集合
- config:当Mongo用于分片设置时，config数据库在内部使用，用于保存分片的相关信息。

# BSON
SON( Binary Serialized Document Format) 是一种二进制形式的存储格式，采用了类似于 C 语言结构体的名称、对表示方法，支持内嵌的文档对象和数组对象，具有轻量性、可遍历性、高效性的特点，可以有效描述非结构化数据和结构化数据。

BSON是一种类json的一种二进制形式的存储格式，简称Binary JSON，它和JSON一样，支持内嵌的文档对象和数组对象，但是BSON有JSON没有的一些数据类型，如Date和BinData类型。
BSON可以做为网络数据交换的一种存储形式，这个有点类似于Google的Protocol Buffer，但是BSON是一种schema-less的存储形式，它的优点是灵活性高，但它的缺点是空间利用率不是很理想

BSON有三个特点：轻量性、可遍历性、高效性。

#### BSON中的数据类型

| 数据类型      | 描述                                              | 举例                             |
| --------- | ----------------------------------------------- | ------------------------------ |
| 字符串       | UTF-8字符串都可表示为字符串类型的数据                           | `{"x" :"foobar"}`              |
| 对象id      | 对象id是文档的12字节的唯一ID                               | `{"X" :ObjectId()}`            |
| 布尔值       | 真或者假：true或者false                                | `{"x":true}`                   |
| 数组        | 值的集合或者列表可以表示成数组                                 | `{"x" : ["a", "b", "c"]}`      |
| 32位整数     | 类型不可用。JavaScript仅支持64位浮点数，shell中默认会32位整数会被自动转换。 | shell是不支持该类型的转换成64位浮点数         |
| 64位整数     | 不支持这个类型。shell会使用一个特殊的内嵌文档                       | shell是不支持该类型的转换成64位浮点数         |
| 64位浮点数    | shell中的数字就是这一种类型                                | `{"x": 3.14159, "y": 3}`       |
| null      | 表示空值或者未定义的对象                                    | `{"x":null}`                   |
| undefined | 文档中也可以使用未定义类型                                   | `{"x":undefined}`              |
| 符号        | shell不支持，shell会将数据库中的符号类型的数据自动转换成字符串            |                                |
| 正则表达式     | 文档中可以包含正则表达式，采用JavaScript的正则式表达式语法              | `{"x":/foobar/i}`              |
| 代码        | 文档中还可以包含JavaScript代码                            | `{"x" : function(){/* ....*/`} |
| 二进制数据     | 二进制数据可以由任意字节的串组成，不过shell中据无法使用                  |                                |
| 最大值/最小值   | BSON包括一个特殊类型，表示可能的最大值。shell中没有这个类型。<br>         |                                |

# 数据库操作
**使用数据库或创建数据库**
如果要使用的数据库不存在则创建
```js
use 数据库名字
```
创建数据库操作先是创建在内存中,并没有创建到硬盘中,此时使用查询将查询不到新建的数据库,如果对新建的数据库进行插入数据的操作时数据库会自动保存到硬盘中了
> [!warning] 注意
> 在MongoDB中，集合只有在内容插入后才会创建！就是说。创建集合(数据表)后要再插入一个文档（记录），集合才会真正创建。

**查看有权限查看的所有数据库命令**
```js
show dbs
或
show databases
```

**查看当前正在使用的数据库命令**
```js
db
```

**删除数据库**
删除正在使用的数据库
```js
db.dropDatebase()
```

# 集合操作

**创建集合**

显式创建
```js
db.createCollection("集合名")
```

隐式创建
当向一个集合插入文档时如果集合不存在则自动创建一个集合

通常隐式创建

**删除集合**
删除当前正在使用数据库中的集合
```js
db.collection.drop()
或
db.集合名.drop()
```

# 文档操作

嵌套文档要加双引号才能找到嵌套文档内的某个字段
**异常处理**
mongodb是支持js语法的因此也可以使用try catch进行异常处理
```js
try{
	操作语句
}catch(e){
	print(e)
}
```

**插入文档**
insert只能插入一条数据
在新版本中被弃用,可以使用insertOne方法,语法一样,只需要把insert改为insertOne即可

- \<docuent or array of documents>: 要插入到集合中的文档或文档数组
- writeConcern: 要插入的文档的级别
- ordered: 可选。类型为布尔值 如果为真，则按顺序插入数组中的文档，如果其中一个文档出现错误，MongoDB将返回而不处理数组中的其余文档。如果为假，则执行无序插入，如果其中一个文档出现错误，则继续处理数组中的主文档。在版本2.6+中默认为true
```js
db.集合名称.insert{
	<document orarray of documents>,
	{
		writeConcern:<document>,
		ordered:<boolean>
	}
}
```

示例:
```js
db.comment.insertOne(  
    {        
	    "articleid":"100000",  
        "content":"今天天气真好,阳光明媚",  
        "userid":"1001","nickname":"Rose",  
        "createtime":new Date(),  
        "likenum":NumberInt(10),  
        "state":null  
    }  
)
```

1. mongo中的数字，默认情况下是double类型，如果要存整型，必须使用函数Numberlnt(整型数字)，否则取出来就有问题了。
2. 插入当前日期使用newDate()
3. 插入的数据没有指定_id，会自动生成主键值
4. 如果某字段没值，可以赋值为null，或不写该字段。

**插入多条**
insertMany

**文档查询**
不填任何参数查询的是所有
```js
db.集合名.find()
```

如果想要查询特定的数据需要在参数中指定BSJON数据
```js
db.集合名.find({"articleid": "100002"})
```
如果要只想拿到符合条件的第一条数据可以使用findOne
```js
db.集合名.findOne()
```

**投影查询**
如果要查询结果返回部分字段，则需要使用投影查询（不显示所有字段，只显示指定的字段）
如：查询结果只显示_id、userid、nickname：
```js
db.comment.find(  
    {userid: "1003"},  
    {userid: 1, nickname: 1}  
)
```
在查询时将指定字段的值设为1,这样就可以只显示指定字段了
但这样查询即使没有指定_id也会默认查询_id字段,可以将_id的值设为0强制将其排除
```js
db.comment.find(  
    {userid: "1003"},  
    {userid: 1, nickname: 1, _id: 0}  
)
```

**文档更新**
==mongo链接允许全局覆盖,mongosh只允许局部修改==

- collection : 要操作的集合
- query : 查询的条件
- option : 修改选项
```js
db.collection.update(query,update,option)
```
==不能使用_id字段进行查询==

- $set : 修改数据
- $push : 用于数组添加数据
- $unset : 删除**字段**

update已经被弃用,可以使用updateOne替代
update对多条指定字段一致的数据进行修改时默认只修改第一个查询到的文档,若要修改多条需要更改修改选项
```js
db.comment.update(
    {nickname: "Rose"},
    {$set: {nickname: "Sunset"}},
    {multi:true}
)
```
updateIOne不支持多文档同时修改,需要使用updateMany
```js
db.comment.updateMany(  
    {nickname: "Rose"},  
    {$set: {nickname: "Sunset"}},  
)
```

示例:

局部覆盖
局部覆盖只修改了指定的元素
将articleid为100000的likenum字段设置为30020

```js
db.comment.updateOne(
    {articleid: "100000"},
    {$set: {likenum: NumberInt(30020)}}
)
```

全局覆盖
全局覆盖就是把原数据删除,新插入更新的数据,没有指定更新字段处为空白
```js
db.comment.updateOne(  
    {articleid: "100301"},  
    {likenum: NumberInt(1145)}  
)
```

列值增长
将指定的likenum字段增长1
```js
db.comment.updateOne(
    {articleid: "100000"},
    {$inc: {likenum: NumberInt(1)}}
)
```

**文档删除**
将符合条件的文档全部删除
mongosh链接无法使用_id字段查询
- collection : 集合名
- query : 查询出来要删除的字段
```js
db.collection.remove(query)
```

将数据全部删除
```js
db.comment.remove({})
```

删除_id=1的记录
```js
db.comment.remove({_id:"1"})
```

已经被弃用,使用deleteOne删除第一个符合条件的文档,使用deleteMany删除所有符合条件的文档

### 统计查询
统计符合查询条件的字段数
- query : 查询选择条件。
- options : 可选。用于修改计数的额外选项。
```js
db.collection.count(query,options)
```
count被弃用,使用countDocuments代替

查询所有
```js
db.collection.count()
```

- $match : 管道操作,将当前的结果内容传输到下一个
- $group : 分组,设为null的字段不参与分组条件

```js
db.student.aggregate([  
    {$match:{Age:{$gt:NumberInt(20)}}},  
    {$group:{_id:null,avgHeight:{$avg:"$Height"}}}  
])
```
将查询到的年龄大于20的数据传递到下面的分组取平均值

### 分页查询
- limit : 读取指定数量的数据
- skip : 跳过指定数量的数据。
```js
db.collection.find().limit(number).skip(number)
```
skip是跳到一定数量的数据的位置开始查询

### 排序查询
sort()方法对数据进行排序，sort()方法可以通过参数指定排序的字段，并使用1和-1来指定排序的方式，其中1为升序排列，而-1是用于降序排列。

```js
db.collection.find().sort({KEY:1})
或
db.集合名称.find().sort（排序方式）
```

根据articleid降序进行查询
```js
db.comment.find().sort({articleid: -1})
```

### 正则查询
```js
db.collection.find({field：/正则表达式/})
或
db.集合.find({字段：/正则表达式/)
```

查询content字段中包含阳光的
```js
db.comment.find({content:/阳光/})
```

# 比较查询
```js
db.collection.find({"field":{$gt:value}})//大于：field>value
db.collection.find([“field":{$1t:value}})//小于：field<value
db.collection.find(["field":{$gte:value}})/大于等于：field>=value
db.collection.find({"field":{$lte:value}})/小于等于：field<=value
db.collection.find({"field":{$ne:value}})不等于：field！=value
db.collection.find({"field":{$in:value}})包含：field包含value
db.collection.find({"field":{$nin:value}})不包含：field不包含value
```

示例:查询likenum数大于700的数据
```js
db.comment.find({1ikenum:{$gt:NumberInt(700)}})
```

多条件需要写在中括号里面,并且中间使用逗号隔开
```js
db.comment.find({$and: [{likenum:{$gte:NumberInt(700)}},{likenum: {$1t:NumberInt(2000)}}]})
```

# 聚合操作
MongoDB提供了多种聚合方法，其中最常用的是`aggregate()`方法。该方法能够接受多个聚合管道阶段，每个阶段对输入文档进行处理，并将结果传递给下一个阶段。聚合框架的灵活性使得它能够处理复杂的数据处理需求。

聚合管道由一系列阶段组成，每个阶段使用一个操作符来处理输入数据。常见的管道阶段包括：

- $match：过滤文档，类似于查询中的find()。
- $group：对文档进行分组，并计算聚合值。
- $sort：对文档进行排序。
- $project：重塑文档，选择需要的字段或计算新字段。
- $limit：限制返回的文档数量。
- $skip：跳过指定数量的文档。
- $unwind：将文档中的某一个数组类型字段拆分成多条，每条包含数组中的一个值。

```js
db.borrow.aggregate(
	{$lookup:{from:"reader",loclaField:"reader_id",foreignField:"reader_id",as:"readerinfor"}}
)
```
