---
title: 1 概述
createTime: 2025/04/05 12:12:26
permalink: /tools/redis/
---
Redis是一个key-value的数据库，key一般是String类型，不过value的类型多种多样：

# 通用命令

#### keys

查看符合模板的所有key,可以使用通配符*

```redis
keys *name*    //查看含有name的所有键
```

#### del

删除指定的key
可以删除多个,用空格隔开

```redis
del key1 key2
```

#### exists

判断key是否存在

#### expire

给key设置一个有效期,有效期到期自动删除
给age设置20秒的有效期

```redis
expire age 20
```

#### ttl

查看key的剩余有效期,如果是-1则永久有效

# key的层级结构

Redis的key允许有多个单词形成层级结构，多个单词之间用：隔开，格式如下：

```redis
项目名:业务名:类型:id
```

这个格式并非固定，也可以根据自己的需求来删除或添加词条。

# 数据类型

基本类型

| 类型        | 示例                      |
| --------- | ----------------------- |
| string    | hello world             |
| Hash      | `{name:"Jack",age: 21}` |
| List      | [A -> B -> C -> C]      |
| Set       | `{A, B, C}`             |
| Sortedset | `{A: 1, B: 2, C: 3}`    |
| 特殊类型      |                         |

| 类型       | 示例                  |
| -------- | ------------------- |
| GEO      | `{A:(120.3,30.5)}`  |
| BitMap   | 0110110101110101011 |
| HyperLog | 0110110101110101011 |

## String类型

根据字符串的格式不同，又可以分为3类：

1. string：普通字符串
2. int：整数类型，可以做自增、自减操作
3. float：浮点类型，可以做自增、自减操作
   不管是哪种格式，底层都是字节数组形式存储，只不过是编码方式不同。字符串类型的最大空间不能超过512m.

常见命令

| 命令          | 说明                                     |
| ----------- | -------------------------------------- |
| SET         | 添加或者修改已经存在的一个String类型的键值对              |
| GET         | 根据key获取String类型的value                  |
| MSET        | 批量添加多个String类型的键值对                     |
| MGET        | 根据多个key获取条个String类型的value              |
| INCR        | 让一个整型的key自增1                           |
| INCRBY      | 让一个整型的key自增并指定步长，例如：incrbynum2让num值自增2 |
| INCRBYFLOAT | 让一个浮点类型的数字自增并指定步长                      |
| SETNX       | 添加一个String类型的键值对，前提是这个key不存在，否则不执行     |
| SETEX       | 添加一个String类型的键值对，并且指定有效期               |

## Hash类型
Hash类型，也叫散列，其value是一个无序字典，类似于Java中的HashMap结构。

Hash的存储结构示例

| key          | value                          |
| ------------ | ------------------------------ |
| heima:user:1 | field1:value1 field2:value2... |

常见命令

| 命令                   | 说明                                            |
| -------------------- | --------------------------------------------- |
| HSET key field value | 添加或者修改hash类型key的field的值                       |
| HGET key field       | 获取一个hash类型key的field的值                         |
| HMSET                | 批量添加多个hash类型key的field的值                       |
| HMGET                | 批量获取多个hash类型key的field的值                       |
| HGETALL              | 获取一个hash类型的key中的所有的field和value                |
| HKEYS                | 获取一个hash类型的key中的所有的field                      |
| HVALS                | 获取一个hash类型的key中的所有的value                      |
| HINCRBY              | 让一个hash类型key的字段值自增并指定步长                       |
| HSETNX               | 添加一个hash类型的key的field值，前提是这个field不存在，否则不执行<br> |


## List类型

Redis中的List类型与Java中的LinkedList类似，可以看做是一个双向链表结构。既可以支持正向检索和也可以支持反向检索。


| 命令                   | 说明                                      |
| -------------------- | --------------------------------------- |
| LPUSH key element... | 向列表左侧插入一个或多个元素                          |
| LPOP key             | 移除并返回列表左侧的第一个元素，没有则返回nil                |
| RPUSH key element... | 列表右侧插入一个或多个元素                           |
| RPOP key             | 移除并返回列表右侧的第一个元素                         |
| LRANGE key star end  | 返回一段索引范围内的所有元素                          |
| BLPOP和BRPOP          | 与LPOP和RPOP类似，只不过在没有元素时等待指定时间，而不是直接返回nil |

## set类型

Redis的Set结构与Java中的HashSet类似，可以看做是一个value为null的HashMap。因为也是一个hash表，因此具备与HashSet类似的特征


| 命令                   | 说明                |
| -------------------- | ----------------- |
| SADD key member...   | 向set中添加一个或多个元素    |
| SREM key member...   | 移除set中的指定元素       |
| SCARD key            | 返回set中元素的个数       |
| SISMEMBER key member | 判断一个元素是否存在于set中   |
| SMEMBERS             | 获取set中的所有元素       |
| SINTER key1 key2...  | 求key1与key2的交集     |
| SDIFF key key2 ...   | 求key1与key2的差集     |
| SUNION key1 key2 ... | 求key1和key2的并集<br> |

## SortedSet类型
Redis的SortedSet是一个可排序的set集合，与Java中的TreeSet有些类似，但底层数据结构却差别很大。SortedSet中的每一个元素都带有一个score属性，可以基于score属性对元素排序，底层的实现是一个跳表（SkipList）加hash表。

| 命令                            | 说明                                    |
| ----------------------------- | ------------------------------------- |
| ZADD key score member         | 添加一个或多个元素到sorted set，如果已经存在则更新其score值 |
| ZREM key member               | 删除sorted set中的一个指定元素                  |
| ZSCORE key member             | 获取sortedset中的指定元素的score值              |
| ZRANK key member              | 获取sortedset中的指定元素的排名                  |
| ZCARD key                     | 获取sorted set中的元素个数                    |
| ZCOUNT key min max            | 统计score值在给定范围内的所有元素的个数                |
| ZINCRBY key increment  member | 让sorted set中的指定元素自增，步长为指定的increment值  |
| ZRANGE key min max            | 按照score排序后，获取指定排名范围内的元素               |
| ZRANGEBYSCORE key min max     | 按照score排序后，获取指定score范围内的元素            |
| ZDIFF、ZINTER、ZUNION           | 求差集、交集、并集                             |

所有的排名默认都是升序，如果要降序则在命令的Z后面添加REV即可

# 缓存问题

### 缓存穿透
缓存穿透是指客户端请求的数据在缓存中和数据库中都不存在，这样缓存永远不会生效，这些请求都会打到数据库。

常见的解决方案有两种：
1. 缓存空对象:如果查询到缓存和数据库中都没有这条数据就在缓存中缓存一个null并返回,这样下次请求该数据的话就不用频繁查询数据库了.会带来额外的内存消耗
2. 布隆过滤:当数据进行请求时先查询布隆过滤器,如果布隆过滤器中记录的请求数据存在的话再向缓存请求,否则就返回空.布隆过滤器就是一个哈希表,内存占用少,实现起来复杂,也存在误判的可能

### 缓存雪崩
缓存雪崩是指在同一时段大量的缓存key同时失效或者Redis服务岩机，导致大量请求到达数据库，带来巨大压力。
解决方案:
1. 对于多个缓存同时失效的原因,可以给不同key的TTL添加随机值
2. 对于redis宕机,可以利用redis集群提高服务的高可用性
3. 当redis出现故障时,可以做服务降级,拒绝服务
4. 给业务添加多级缓存

### 缓存击穿
缓存击穿问题也叫热点Key问题，就是一个被高并发访问并且缓存重建业务较复杂的key突然失效了，无数的请求访问会在瞬间给数据库带来巨大的冲击。

# 持久化
redis中有两中持久化方案aof和rdb

|         | RDB                    | AOF                              |
| ------- | ---------------------- | -------------------------------- |
| 持久化方式   | 定时对整个内存做快照             | 记录每一次执行的命令                       |
| 数据完整性   | 不完整，两次备份之间会丢失          | 相对完整，取决于刷盘策略                     |
| 文件大小    | 会有压缩，文件体积小             | 记录命令，文件体积很大                      |
| 岩机恢复速度  | 很快                     | 慢                                |
| 数据恢复优先级 | 低，因为数据完整性不如AOF         | 高，因为数据完整性更高                      |
| 系统资源占用  | 高，大量CPU和内存消耗           | 低，主要是磁盘I0资源.但AOF重写时会占用大量CPU和内存资源 |
| 使用场景    | 可以容忍数分钟的数据丢失，追求更快的启动速度 | 对数据安全性要求较高常见                     |

# RDB
RDB全称RedisDatabaseBackup file（Redis数据备份文件），也被叫做Redis数据快照。简单来说就是把内存中的所有数据都记录到磁盘中。当Redis实例故障重启后，从磁盘读取快照文件，恢复数据。
快照文件称为RDB文件，默认是保存在当前运行目录。

默认就是rdb持久化,当redis停机时执行,将缓存中的数据持久化到rdb文件中,但因为故障宕机时不会进行,所以会造成数据的丢失

触发rdb的机制可以再redis.conf文件中找到
```redis
#900秒内，如果至少有1个key被修改，则执行bgsave，如果是save ""则表示禁用RDB
save 900 1
#300秒内，如果至少有10个key被修改，则执行bgsave
save 300 10
save 60 10000

#是否压缩，建议不开启，压缩也会消耗cpu，磁盘的话不值钱
rdbcompression yes
#RDB文件名称
dbfilename dump.rdb
#文件保存的路径目录
dir ./
```

bgsave开始时会fork主进程得到子进程，子进程共享主进程的内存数据。完成fork后读取内存数据并写入 RDB 文件。

# AOF
AOF全称为Append Only File（追加文件）。Redis处理的每一个写命令都会记录在AOF文件，可以看做是命令日志文件。

AOF默认是关闭的，需要修改redis.conf配置文件来开启AOF：
```redis
#是否开启AOF功能，默认是no
appendonly yes
#AOF文件的名称
appendfilename "appendonly.aof"

#表示每执行一次写命令，立即记录到AOF文件
appendfsync always
#写命令执行完先放入AOF缓冲区，然后表示每隔1秒将缓冲区数据写到AOF文件，是默认方案
appendfsync everysec
#写命令执行完先放入AOF缓冲区，由操作系统决定何时将缓冲区内容写回磁盘
appendfsync no
```

在开启aof前还需要禁用rdb
```redis
save ""
```

### 混合模式
如果同时开启rdb和aof那么只会加载aof文件而不开启rdb

开启混合模式后两种方案同时应用

1. 开启方式
设置`aof-use-rdb-preamble`的值为yes


### 纯缓存模式
要同时关闭rdb和aof
`save ""`禁用rdb持久化模式后依旧可以使用save,bgsave生成rdb文件
`appendonly no`禁用aof后依旧可以使用bgrewriteaof生成aof文件

# 事务

如果是编译期错误那么在执行前就会报错,且当前事务中的所有命令都被清空
如果是运行时错误,那么在执行后会执行对的命令,只对出错的命令报错

1. 开启事务
使用multi命令开启事务,开启事务后在执行事务命令前的所有命令都被放在一个事务中执行
```redis
MULLTI
```

2. 执行事务
使用exec命令执行事务
```redis
EXEC
```

3. 放弃事务
```redis
DISCARD
```
放弃事务后前面未执行的事务都被清零,此后再次执行命令不会作为事务

# 订阅发布
redis的消息即发即失,无法判断消息是否被消费

1. 订阅
```redis
SUBSCRIBE 主题名列表
```

订阅的客户端每次收到一个三个参数的消息分别是:消息种类,始发频道的名称,实际的消息内容


2. 发布消息
```redis
PUBLISH 主题名 消息
```

3. 取消订阅
```redis
UNSUBSCRIBE
```
