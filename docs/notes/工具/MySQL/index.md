---
title: 1 基础
createTime: 2025/06/22 11:04:36
permalink: /tools/mysql/
---
# 简介
关键字语句不区分大小写，但推荐大写，小写会被自动转换为大写
DDL （Data Definition Language）数据定义语言，用来定义数据库对象(数据库，表，字段)
DML （Data Manipulation Language）数据操作语言，用来对数据库表中的数据进行增删改
DQL （Data Query Language）数据查询语言，用来查询数据库中表的记录
DCL （Data Control Language）数据控制语言，用来创建数据库用户、控制数据库的访问权限

# DDL语句

## 数据库操作
### 查询
查询所有数据库
```mysql
SHOW DATABASES;
```
查询当前数据库
```mysql
SELECT DATABASE();
```
### 创建
```mysql
CREATE DATABASE [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET字符集] [COLLATE 排序规则];
```
创建数据库
```mysql
create database 名字;
```
如果已经存在同名数据库则会创建失败报错
可以加上可选项 IF NOT EXISTS解决
```mysql
create database if not exists 名字；
```
如果不存在同名数据库则创建如果已经存在则不创建

以默认utf-8编码方式创建数据库
```mysql
create database 名字 default charset utf8;
```
不推荐使用utf8因为汉字长度只占三个字节但有些特殊字符占四个字节所以推荐utf8mb4
### 删除
```mysql
DROP DATABASE[IF EXISTS]数据库名;
```
删除指定数据库，如果不存在这个数据库就会报错
```mysql
drop database 名字;
```
可以使用可选项如果不存在不报错

### 使用
```mysql
USE 数据库名;
```

## 表操作

### 数据类型

主要有三类：数值类型，字符串类型，日期时间类型

#### 数值类型

如果需要给数据类型指定为无符号类型要在数据类型后面加unsigned如：
age int unsigned

#### 字符串类型

char效率较高，varchar效率较低
varchar类型会根据当前字符串内容确定需要分配的存储空间，自然效率较低但是存储利用率高

#### 日期类型


### 查询
#### 查询当前数据库所有表
```mysql
SHOW TABLES;
```

#### 查询表结构
```mysql
DESC表名;
```

#### 查询指定表的建表语句
```mysql
SHOW CREATE TABLE 表名;
```

### 创建
```mysql
CREATE TABLE 表名(
	字段1 字段1类型[COMMENT 字段1注释],
	字段2 字段2类型 [COMMENT 字段2注释],
	字段3 字段3类型[COMMENT 字段3注释],
	字段n 字段n类型[COMMENT 字段n注释]
)[COMMENT 表注释];
```
[..]为可选参数，最后一个字段后面没有逗号

### 修改
#### 添加字段
```mysql
ALTER TABLE 表名 ADD 字段名 类型(长度)[COMMENT 注释][约束];
```
案例:
为emp表增加一个新的字段”昵称”为nickname，类型为varchar(20)
```mysql
ALTER TABLE emp AD nickname varchar(20)COMMENT'昵称'
```

#### 修改数据类型
```mysql
ALTER TABLE 表名 MODIFY 字段名 新数据类型(长度);
```

#### 修改字段名和字段类型
```mysql
ALTER TABLE 表名 CHANGE 旧字段名 新字段名 类型(长度)[COMMENT 注释】[约束];
```
案例:
将emp表的nickname字段修改为username，类型为varchar(30)
```mysql
ALTER TABLE emp CHANGE nickname username varchar(30) COMMENT'昵称';
```

#### 删除字段
```mysql
ALTER TABLE 表名 DROP 字段名;
```
案例:
将emp表的字段username删除
```mysql
ALTER TABLE emp DROP username;
```

#### 修改表名
```mysql
ALTER TABLE 表名 RENAME TO 新表名;
```
案例:
将emp表的表名修改为 employe
```mysql
ALTER TABLE emp RENAME TO emplpye;
```

#### 删除表
在删除表时，表中的全部数据也会被删除
```mysql
DROP TABLE[IF EXISTS] 表名;
```
删除指定表，并重新创建该表（此操作与格式化不同，它是做了两个操作：一个是清除数据一个是创建表结构）
```mysql
TRUNCATE TABLE 表名;
```

# DML语句
### 添加数据
插入数据时，指定的字段顺序需要与值的顺序是一一对应的。
字符串和日期型数据应该包含在引号中。
插入的数据大小，应该在字段的规定范围内。

#### 给指定字段添加数据
```mysql
INSERT INTO 表名 (字段名1,字段名2,……) VALUES(值1,值2,……);
```

#### 给全部字段添加数据
```mysql
INSERT INTO 表名 VALUES (值1,值2,……);
```

#### 批量添加数据
```mysql
INSERT INTO 表名 (字段名1,字段名2,……) VALUES (值1,值2,..),(值1,值2,….),(值1,值2,.);
```

```mysql
INSERT INTO 表名 VALUES (值1,值2,….),(值1,值2,….),(值1,值2,…);
```

### 修改数据
```mysql
UPDATE 表名 SET 字段名1=值1,字段名2=值2, ……[WHERE 条件];
```
修改语句的条件可以有，也可以没有，如果没有条件，则会修改整张表的所有数据

### 删除数据
```mysql
DELETE FROM 表名[WHERE 条件];
```
DELETE语句的条件可以有，也可以没有，如果没有条件，则会删除整张表的所有数据。
DELETE 语句不能删除某一个字段的值(可以使用UPDATE)。

# DQL语句
DQL语法结构
```mysql
SELECT
	字段列表
FROM
	表名列表
WHERE
	条件列表
GROUP BY
	分组字段列表
HAVING
	分组后条件列表
ORDER BY
	排序字段列表
LIMIT
	分页参数
```

## 基本查询

### 查询多个字段
```mysql
SELECT 字段1,字段2,字段3.. FROM 表名;

SELEGT * FROM 表名    #查询表中所有字段的数据
```
示例：
```mysql
select name,workno,age from emp;
```
查询emp表中的name，workno，age列中的数据
如果查询所有数据建议罗列出所有字段，不建议使用* 会影响效率

### 设置别名
```mysql
SELECT 字段1[AS 别名1],字段2[AS 别名2]…… FROM 表名;
```
示例：
```mysql
select emp.workaddress '工作地址' from emp;
```
使用此代码查看数据在展示的数据列表中workaddress将会改为工作地址
使用as语法也是一样效果
```mysql
select emp.workaddress as '工作地址' from emp;
```

### 去除重复记录
```mysql
SELECT DISTINCT 字段列表 FROM 表名;
```
可以把该字段的数据去重后都显示出来
示例：
```mysql
select distinct emp.workaddress from emp;
```

## 条件查询（where）

```mysql
select 字段列表 from 表名 where 条件列表;
```
条件列表：

示例：
在emp表中查询age为88的员工信息
```mysql
select * from emp where age=88;
```
如果要查询名字为两个字的员工信息就需要使用like
```mysql
select * from emp where name like '__';
```
查询身份证号最后一位是x的员工信息
```mysql
select * from emp where emp.idcard like '%x';
```
%表示多个字符（包括0），_ 表示一个字符

## 聚合函数（count、max、min、avg、sum）
将一列数据作为一鞥整体，进行纵向计算

| 函数    | 功能   |
| ----- | ---- |
| count | 统计数量 |
| max   | 最大值  |
| min   | 最小值  |
| avg   | 平均值  |
| sum   | 求和   |
null不参与聚合函数的运算
```mysql
select 聚合函数（字段列表）from 表名;
```
示例：
统计员工总数量
```mysql
select count(*) from emp;
//或
select count(idcard) from emp;
```

## 分组查询（group by）
```mysql
SELECT 字段列表 FROM 表名 [WHERE 条件] GROUP BY 分组字段名 [HAVING 分组后过滤条件];
```

> [!NOTE] where与having区别
> 
1、执行时机不同:where是分组之前进行过滤，不满足where条件，不参与分组;而having是分组之后对结果进行过滤。
2、判断条件不同:where不能对聚合函数进行判断，而having可以。

示例：
根据性别分组，统计男员工和女员工的数量
```mysql
select count(*) from emp group by gender;
```
但是不显示性别只显示两个数据，要显示性别可以：
```mysql
select gender,count(*) from emp group by gender;
```
查询年龄小于45的员工，并根据工作地址分组，获取员工数量大于3的工作地址
```mysql
select emp.workaddress,count(*) from emp where age<45 group by workaddress having count(*)>3;
```
也可以使用别名
```mysql
select emp.workaddress,count(*) address_cont from emp where age<45 group by workaddress having address_cont>3;
```

> [!warning] 注意
> 
执行顺序: 聚合函数 > where > having
分组之后，查询的字段一般为聚合函数和分组字段，查询其他字段无任何意义。

分组查询的时候查询name只显示第一个字段

## 排序查询（order by）
```mysql
SELECT 字段列表 FROM 表名 ORDER BY 字段1 排序方式1,字段2 排序方式2;
```
排序方式：
- ASC:升序(默认值)
- DESC:降序
多字段排序：当第一个字段值相同时才会根据第二个字段进行排序

## 分页查询（limit）
```mysql
SELECT 字段列表 FROM 表名 LIMIT 起始索引,查询记录数;
```

起始索引从0开始，起始索引=(查询页码-1)* 每页显示记录数。
分页查询是数据库的方言，不同的数据库有不同的实现，MySQL中是LIMIT。
如果查询的是第一页数据，起始索引可以省略，直接简写为limit 10。

示例；
查询第1页员工数据，每页展示10条记录
```mysql
select * from emp limit 0,10;  
select * from emp limit 10;
```
查询第2页员工数据，每页展示10条记录
```mysql
select * from emp limit 10,10;  
```

## DQL语句执行顺序

表中循序是编写顺序
序号是执行顺序

# DCL语句
## 用户管理

1、查询用户
```mysql
USE mysql;
SELECT * FROM user;
```

2、创建用户
```mysql
CREATE USER '用户名'@'主机名’IDENTIFIED BY '密码';
```

3、修改用户密码
```mysql
ALTER USER '用户名'@'主机名' IDENTIFIED WTH mysl_native_password BY '新密码';
```

4、删除用户
```mysql
DROP USER'用户名'@'主机名;
```
主机名可以使用%通配表示任意主机都可以访问mysql服务器

## 权限控制
mysql定义了很多权限，但常用的就以下几种

| 权限                  | 说明         |
| ------------------- | ---------- |
| ALL, ALL PRIVILEGES | 所有权限       |
| SELECT              | 查询数据       |
| INSERT              | 插入数据       |
| UPDATE              | 修改数据       |
| DELETE              | 删除数据       |
| ALTER               | 修改表        |
| DROP                | 删除数据库/表/视图 |
| CREATE              | 创建数据库/表    |
1、查询权限
```mysql
SHOW GRANTS FOR '用户名'@'主机名';
```
usage表示没有其他权限，只有连接上数据库的权限

2、授予权限
```mysql
GRANT 权限列表 ON 数据库名.表名 TO '用户名'@'主机名';
```
示例：
授予pink用户在test数据库中的所有权限
```mysql
grant all on test.* to 'pink'@'%'
```

3、撤销权限
```mysql
REVOKE 权限列表 ON 数据库名.表名 FROM'用户名'@'主机名';
```
