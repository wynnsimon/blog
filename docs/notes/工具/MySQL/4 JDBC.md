---
title: 4 JDBC
createTime: 2025/04/05 12:12:26
permalink: /tools/mysql/4/
---
通过JDBC可以调用所有关系型数据库

JDBC就是使用JaVa语言操作关系型数据库的一套API
全称：（JavaDataBaseConnectivity）Java数据库连接

JDBC本质：
官方（sun公司）定义的一套操作所有关系型数据库的规则，即接口
各个数据库厂商去实现这套接口，提供数据库驱动jar包
我们可以使用这套接口（JDBC）编程，真正执行的代码是驱动jar包中的实现类

1. 注册驱动
mysql5.0以上版本可以不执行此语句
```java
Class.forName("com.mysql.jdbc.Driver");
```

2. 获取连接对象
用户名和密码都是字符串类型
url:链接地址有一套固定的语法
jdbc:mysql://ip地址(域名):端口号/数据库名称?参数键值对1&参数键值对2...

如果连接的是本机mysq服务器，并且mysql服务默认端口是3306，则url可以简写为：jdbc:mysql:///数据库名称?参数键值对
配置useSSL=false参数，禁用安全连接方式，解决警告提示
```java
String url="jdbc:mysql://127.0.0.1:3306/db1?useSSL=false";
String username ="root";
tring password="1234";
Connection conn =DriverManager.getConnection(url,username,password);
```
3. 定义SQL语句

```java
String sql="update account setmoney=2000where id=1";
```

4. 获取执行sql的对象

```java
Statement stmt= conn.createStatement();
```

**普通执行SQL对象**
```java
Statement createStatement()
```

**预编译SQL的执行SQL对象**：防止SQL注入
```java
PreparedStatement prepareStatement(sql)
```

**执行存储过程的对象**
```java
CallableStatement prepareCall (sql)
```

5. 执行sql
- executeQuery，一般执行SELECT语句，返回ResultSet
- executeUpdate，一般执行DELETE或UPDATE或INSERT语句（这些操作更新数据库，所以是update），返回int，被改变的语句的行数,也可能是0。
- execute，不确定是什么类型的SQL语句时可以用这个方法。

```java
int count= stmt.executeUpdate(sql);
```

6. 处理结果
ResultSet(结果集对象)作用：封装了DQL查询语句的结果
使用了resultset在结束时也需要释放

将光标从当前位置向前移动一行并判断当前行是否为有效行返回值
true：有效行，当前行有数据f.alse：无效行，当前行没有数据
```java
boolean next()
```

获取数据
XXX：数据类型；如：int getlnt(参数)；String getString(参数)
参数：int：列的编号，从1开始String：列的名称
```java
XXX getXxx(参数)
```


```java
while(rs.next()){
    String flight=rs.getString("flight");
    System.out.println(flight);
}
```

7. 释放资源

```java
stmt.close();
conn.close();
```

8. 事务管理
一般配合事务处理,如果提交事务时出现异常就回滚

开启事务：
true为自动提交事务；false为手动提交事务，即为开启事务
```java
setAutoCommit(boolean autoCommit)
```

提交事务
```java
commit()
```

回滚事务
```java
rollback()
```

#### 防止sql注入
前面的流程都一样
但在获取statement对象步骤需要获取PrepareStatement对象
? : SQL语句中的参数值，使用?占位符替代
```java
String sql="select * from user where username=? and password=?;";
```

```java
PreparedStatement pstmt=conn.prepareStatement(sql)
```

PreparedStatement对象：
给？赋值
Xxx：数据类型；如 setlnt(参数1，参数2)

参数：参数1：？的位置编号，从1开始
参数2：？的值
```java
setXxx(参数1，参数2)
```

示例:
```java
String name="root";
String password="123456";

String sql="select * from tb_user where username=? and password=?;";

PreparedStatement pstmt=conn.prepareStatement(sql);
pstmt.setString(1,name);
pstmt.setString(2,pwd);

ResultSet rs =pstmt.executeQuery();
```
这样就不会有sql注入bug了

PreparedStatement执行sql本质上就是将传入的字符串前面设置一个转义字符,然后当成字符串看待,这样在执行sql时就会转义传入的字符串

PreparedStatement好处：
1. 预编译SQL，性能更高
2. 防止SQL注入：将敏感字符进行转义


