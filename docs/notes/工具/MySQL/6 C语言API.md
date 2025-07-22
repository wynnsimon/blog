---
title: 6 C语言API
createTime: 2025/04/05 12:12:26
permalink: /tools/mysql/6/
---
MySQL数据库是一个典型的C/S结构，即：客户端和服务器端。如果我们部署好了MySQL服务器，想要在客户端访问服务器端的数据，在编写程序的时候就可以通过官方提供的C语言的API来实现。

编译时要在末尾加上选项连接到mysql的动态库
```shell
gcc -o $@ $^ -lmysqlclient
```

数据库开发时出错不能使用perror打印,这是mysql的错误不会写到系统错误中

1. 创建数据库对象
分配或初始化MYSQL结构体。
- mysql: MYSQL对象, 如果是NULL指针，将分配、初始化、并返回新对象。否则，将初始化对象，并返回对象的地址。
- return: 成功返回指向MYSQL对象的指针, 失败: 当内存不足以分配新对象时返回NULL
```c
MYSQL* mysql_init(MYSQL* mysql);
```

2. 连接数据库
连接到指定的数据库对象
- mysql: 要连接的MYSQL对象
- host: 打开该数据库主机的ip地址,通常填127.0.0.1本地主机名
- user: 要以哪个数据库用户的身份打开数据库的用户名
- passwd: 用户名对应的密码
- db: 要登陆的数据库名
- port: 通常填0为默认端口,(mysql也通常为3306)
- unix_socket: 套接字,默认填NULL不用
- client_flag:客户端标志,一般填0
- return: 如果连接成功返回指向MYSQL的指针(和mysql参数一样),失败返回NULL
```c
MYSQL* mysql_real_connect(
	MYSQL* mysql,
	const char* host,
	const char* user,
	const char* passwd,
	const char* db,
	unsigned int port,
	const char* unix_socket,
	unsigned long client_flag);
```

3. 执行sql语句
执行传入的sql语句
- mysql: 要执行语句的MYSQL对象
- query: 字符串类型的sql语句结尾不需要添加;
- return: 成功返回0, 失败返回非0值. 如果是查询, 结果集在mysql 对象中
```c
int mysql_query(MYSQL* mysql, const char* query)
```

4. 取回结果集
```c
typedef struct st_mysql_res{
	my_ulonglong row_count;
	MYSQL_FIELD* fields;
	MYSQL DATA* data;
	MYSQL_ROWS* data_cursor;
	unsigned long* lengths;    /* column lengths of current row */
	MYSQL* handle;    /* for unbuffered reads */
	const struct st_mysql_methods* methods;
	MYSQL_ROW row    /* If unbuffered road */*
	MYSQL_ROW current_row;    /* buffer to current row */
	MEM_ROOT field_alloc;
	unsigned int field_count,current_field;
	my_bool eof;    /* Used by mysql_fetch_row */
	/* mysql_stmt_close() had to cancel this result */
	my_bool unbuffered_fetch_cancelled;
	void* extension;
}MYSQL_RES;
```
取回完整的结果集
- mysql: 要取结果的MYSQL对象
- return: MYSQL_RES对象指针,
```c
MYSQL_RES *mysql_store_result(MYSQL* mysql)
```

5. 获取数据

```c
// mysql.h
// 结果集中的每一个列对应一个 MYSQL_FIELD
typedef struct st_mysql_field {
  char *name;                 /* 列名-> 字段的名字 */
  char *org_name;             /* Original column name, if an alias */
  char *table;                /* Table of column if column was a field */
  char *org_table;            /* Org table name, if table was an alias */
  char *db;                   /* Database for table */
  char *catalog;              /* Catalog for table */
  char *def;                  /* Default value (set by mysql_list_fields) */
  unsigned long length;       /* Width of column (create length) */
  unsigned long max_length;   /* Max width for selected set */
  unsigned int name_length;
  unsigned int org_name_length;                                                                                        
  unsigned int table_length;
  unsigned int org_table_length;
  unsigned int db_length;
  unsigned int catalog_length;
  unsigned int def_length;
  unsigned int flags;         /* Div flags */
  unsigned int decimals;      /* Number of decimals in field */
  unsigned int charsetnr;     /* Character set */
  enum enum_field_types type; /* Type of field. See mysql_com.h for types */
  void *extension;
} MYSQL_FIELD;
```

获取结果集中数据的行数
```c
int mysql_num_rows(MYSQL_RES &res)
```
从结果集中获取下一行
- result: 要获取的结果集对象
- return: 成功得到了当前记录中每个字段的值,失败:NULL, 说明数据已经读完了
```c
MYSQL_ROW mysql_fetch_row(MYSQL_RES* result)
```
MYSQL_ROW是一个`char**`类型,可以遍历直接打印一行的数据,也可以对这个二维数组再次取索引获取每个属性的值

得到结果集的列数
```c
unsigned int mysql_num_fields(MYSQL_RES *result)
```
得到结果集中所有列的名字
返回MYSQL_FIELD* 指向一个结构体
```c
MYSQL_FIELD *mysql_fetch_fields(MYSQL_RES *result);
```

返回结果集内当前行的列的长度:
1. 如果打算复制字段值，使用该函数能避免调用strlen()。
2. 如果结果集包含二进制数据，必须使用该函数来确定数据的大小，原因在于，对于包含Null字符的任何字段，strlen()将返回错误的结果。
- result: 通过查询得到的结果集
- return:无符号长整数的数组表示各列的大小。如果出现错误，返回NULL。
```c
unsigned long *mysql_fetch_lengths(MYSQL_RES *result);
```

6. 释放结果集
获取结果集后必须使用指定函数释放结果集
- result: 要释放的结果集对象
```c
void mysql_free_result(MYSQL_RES* result)
```

7. 关闭数据库的连接
- mysql: 要关闭的数据库对象
```c
void mysql_close(MYSQL* mysql)
```

**字符编码**
获取api默认使用的字符编码
为当前连接返回默认的字符集。
- 返回值: 默认字符集的名称。 
```c
const char *mysql_character_set_name(MYSQL *mysql) 
```

设置api使用的字符集
第二个参数 csname 就是要设置的字符集 -> 支持中文: utf8
```c
int mysql_set_character_set(MYSQL *mysql, char *csname);
```

**事务**
mysql中默认会进行事务的提交
因为自动提交事务, 会对我们的操作造成影响
如果我们操作的步骤比较多, 集合的开始和结束需要用户自己去设置, 需要改为手动方式提交事务

设置自动提交模式
- mode: 如果模式为“1”，启用autocommit模式；如果模式为“0”，禁止autocommit模式。
- return: 如果成功，返回0，如果出现错误，返回非0值。
```c
my_bool mysql_autocommit(MYSQL *mysql, my_bool mode) 
```

事务提交
返回值: 成功: 0, 失败: 非0
```c
my_bool mysql_commit(MYSQL *mysql);
```

数据回滚
返回值: 成功: 0, 失败: 非0
```c
my_bool mysql_rollback(MYSQL *mysql) 
```

**打印错误信息**
返回错误的描述
```c
const char *mysql_error(MYSQL *mysql);
```

返回错误的编号
```c
unsigned int mysql_errno(MYSQL *mysql);
```

#### 部分API函数表

| 函数                    | 作用描述                      |
| --------------------- | ------------------------- |
| mysql_init()          | 获取或初始化MYSQL结构。            |
| mysql_real_connect()  | 连接到MySQL服务器。              |
| mysql_query()         | 执行指定为“以Null终结的字符串”的SQL查询。 |
| mysql_store_result()  | 检索完整的结果集至客户端。             |
| mysql_use_result()    | 初始化逐行的结果集检索               |
| mysql_fetch_field()   | 返回下一个表字段的类型。              |
| mysql_fetch_fields()  | 返回所有字段结构的数组。              |
| mysql_fetch_lengths() | 返回当前行中所有列的长度。             |
| mysql_fetch_row()     | 从结果集中获取下一行                |
| mysql_field_count()   | 返回上次执行语句的结果列的数目。          |
| mysql_free_result()   | 释放结果集使用的内存。               |
| mysql_close()         | 关闭服务器连接。                  |
| mysql_autocommit()    | 切换 autocommit模式，ON/OFF    |
| mysql_commit()        | 提交事务。                     |
| mysql_errno()         | 返回上次调用的MySQL函数的错误编号       |
| mysql_error()         | 返回上次调用的MySQL函数的错误消息       |
| mysql_options()       | 为mysql_connect()设置连接选项。   |
| mysql_ping()          | 检查与服务器的连接是否工作，如有必要重新连接。   |
