---
title: mybatis
createTime: 2025/04/05 12:12:26
permalink: /back/mybatis/
---
# ORM
ORM(Object Relational Mapping):对象关系映射
两者之间的映射关系

| Java概念 | 数据库概念 |
| ------ | ----- |
| 类      | 表     |
| 属性     | 字段/列  |
| 对象     | 记录/行  |

指的是持久化数据和实体对象的映射模式，为了解决面向对象与关系型数据库存在的互不匹配的现象的技术。

**原始JDBC的操作问题分析:**
1. 频繁创建和销毁数据库的连接会造成系统资源浪费从而影响系统性能。
2. sql语句在代码中硬编码，如果要修改sql语句，就需要修改java代码，造成代码不易维护。
3. 查询操作时，需要手动将结果集中的数据封装到实体对象中。
4. 增删改查操作需要参数时，需要手动将实体对象的数据设置到sql语句的占位符。

**MyBatis**
- MyBatis是一个优秀的基于Java的持久层框架，它内部封装了JDBC，使开发者只需要关注SQL语句本身，而不需要花费精力去处理加载驱动、创建连接、创建执行者等复杂的操作。
- MyBatis通过xml或注解的方式将要执行的各种Statement配置起来，并通过Java对象和Statement中SQL的动态参数进行映射生成最终要执行的SQL语句。
- 最后MyBatis框架执行完SQL并将结果映射为Java对象并返回。采用ORM思想解决了实体和数据库映射的问题，对JDBC进行了封装，屏蔽了JDBCAPI底层访问细节，使我们不用与JDBCAPI打交道，就可以完成对数据库的持久化操作。

```java
        //加载mybatis的核心配置文件，获取SqLSessionFactory
        String resource="mybatis-config.xml";
        InputStream inputStream=Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory=new SqlSessionFactoryBuilder().build(inputStream);
    
        //获取SqlSession对象用于执行sql
        SqlSession sqlSession=sqlSessionFactory.openSession();

        //执行sql
        List<User> users=sqlSession.selectList("test.selectAll");
        System.out.println(users);

        //释放资源
        sqlSession.close();
```

代理开发
```java
        //加载mybatis的核心配置文件，获取SqLSessionFactory
        String resource="mybatis-config.xml";
        InputStream inputStream=Resources.getResourceAsStream(resource);
        SqlSessionFactory sqlSessionFactory=new SqlSessionFactoryBuilder().build(inputStream);
    
        //获取SqlSession对象用于执行sql
        SqlSession sqlSession=sqlSessionFactory.openSession();

        //获取UserMapper代理对象
        UserMapper userMapper=sqlSession.getMapper(UserMapper.class);
        List<User> users=userMapper.selectAll();

        //执行sql
        // List<User> users=sqlSession.selectList("test.selectAll");
        System.out.println(users);

        //释放资源
        sqlSession.close();
        
```

openSession默认不自动提交事务,因此在进行删改操作时需要手动提交`sqlSession.commit()`
也可以在获取SqlSession对象时开始自动提交`sqlSessionFactory.openSession(true);
`

## 核心配置文件
习惯上命名为mybatis-config.xml，这个文件名仅仅只是建议，并非强制要求。将来整合Spring之后，这个配置文件可以省略
resource文件夹下
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE configuration PUBLIC "-//mybatis.org//DTD Config 3.0//EN" "http://mybatis.org/dtd/mybatis-3-config.dtd">
<configuration>
    <!-- 配置连接数据库的环境 -->
    <environments default="development">
        <environment id="development">
            <transactionManager type="JDBC" />
            <dataSource type="POOLED">
                <property name="driver" value="com.mysql.jdbc.Driver" />
                <property name="url" value="jdbc:mysql:///mybatis?useSSL=false" />
                <property name="username" value="root" />
                <property name="password" value="123456" />
            </dataSource>
        </environment>
    </environments>

    <!-- 引入映射文件 -->
    <mappers>
        <mapper resource="com/example/mapper/UserMapper.xml" />
    </mappers>
</configuration>
```

复数标签内部都可以包含多个同名的单数标签
- environments : 配置多个数据库环境
	default : 默认使用的环境id
- environment : 配置具体的环境
	id : 表示连接数据库环境的唯一标识,不能重复
- transactionManager : 事务管理方式
	type : 
		JDBC标识当前环境中执行事务时使用jdbc原生的事务管理方式(事务的提交或回滚需要手动处理)
		MANAGED被管理,如spring等
- dataSource : 数据源
	type : 数据源类型
		POOLED：表示使用数据库连接池缓存数据库连接
		UNPOOLED：表示不使用数据库连接池
		JNDI：表示使用上下文中的数据源

数据库连接配置也可以写在外部的.prooperties文件夹中,然后使用properties标签导入
```xml
<environment>
	<properties resource="jdbc.properties" />
	<dataSource type="POOLED">
		<！--设置连接数据库的驱动-->
		<property name="driver" value="${jdbc.driver}"/>
		<！--设置连接数据库的连接地址-->
		<property name="url" value="${jdbc.url}"/>
		<！--设置连接数据库的用户名-->
		<property name="username"value="${jdbc.username}"/>
		<！--设置连接数据库的密码-->
		<property name="password"value="${jdbc.password}"/>
	</dataSource>
</environment>
```

**设置类型别名**
```xml
<typeAliases>
	<typeAlias type="com.atguigu.mybatis.pojo.User" alias="User"></typeAlias>
</typeAliases>
```
将全类名设置User别名,这样在设置resultType属性时就不用写那么长,直接使用类型别名即可
如果不设置别名就默认设置为类名,不区分大小写

一般不使用默认的别名
可以以包为单位批量设置类型的默认别名

以包为单位，将包下所有的类型设置默认的类型别名，即类名且不区分大小写
```xml
<package name="com.atguigu.mybatis.pojo"/>
```

## 创建mapper接口

==MyBatis面向接口编程的两个一致：==
1. 映射文件的namespace要和mapper接口的全类名保持一致
2. 映射文件中sql语句的id要和mapper接口中的方法名一致

MyBatis中的mapper接口相当于以前的dao。但是区别在于，mapper仅仅是接口，我们不需要提供实现类。
```java
public interface UserMapper {
    List<User> selectAll();
    User selectById(int id);
}
```

映射文件要和接口放在同一文件夹下
java在编译后会将resources文件夹与java文件夹合并,也就是说在resources文件夹下创建一个同名路径文件夹存放映射文件
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.mapper.UserMapper">
    <select id="selectAll" resultType="user">
        select * from tb_user;
    </select>

    <!-- selectById --> 

    <select id="selectById" resultType="user">
        select * from tb_user where id = #{id};
    </select>
</mapper>
```

映射接口中不需要实现类,调用该接口执行sql语句,需要在映射文件中定义sql语句
接口函数有返回类型的映射文件中对应id的标签中也要指定同样类型的resultType,如果是自定义类可能需要全类名
resultType : 设置默认的映射关系,当实体类型设置出来之后会自动地把当前查询结果的字段名作为属性名为当前类的属性进行赋值,如果能匹配到就赋值,匹配不到就不赋值
resultMap : 设置自定义的映射关系,当字段名和属性名不一致的时候就用到resultMap

# 字符串拼接
${ } : 本质是字符串拼接,没有防止sql注入的功能
#{ } : 本质是占位符赋值,有防止sql注入的功能

```java
public interface UserMapper{
	User getuserByUsername(String username);
}

//映射文件中
<select id="getuserByUsername" resultType="User">
	select * from t_user where username = #{username};
</select>
```

`#{}`的大括号中的字符可以是任意字符,无需和方法的形参一致

但${}需要使用单引号引用起来将其转换成字符串
```xml
//映射文件中
<select id="getuserByUsername" resultType="User">
	select * from t_user where username = '${username}';
</select>
```

但两种方法在使用多参数时就不能随意写字符了,必须按照参数列表的顺序分配占位符为arg0,arg1或者param1,param2的形式,这两种形式可以混合使用,arg是从0开始的,param是从1开始的,arg1和param2指代的是同一个参数 

mybatis会将参数放到map集合中,以arg0,arg1...为键(或param1,param2...)以参数值为值

可以自己将参数和自定义的键放到一个map集合中,再传参的时候传入这个map集合,这样在映射文件中多参数的情况下就可以使用自定义字符了
```java
public interface ParameterMapper{
	//验证登录（参数为map）
	User checkLoginByMap(Map<String, Object> map);
}

Map<String,object>mapnew HashMap<>();
map.put("username","admin");
map.put("password","123456");
User user=mapper.checkLoginByMap(map);

<select id="checkLoginByMap" resultType="User">
	select * from t_user where username = #{username} and password= #{password}
</select>
```

当插入数据时传入的是一个实体类对象,可以直接使用实体类对象中的成员变量名获取值
```xml
mapper.insert(User);

<select id="insert">
	insert into tb_user valuses(#{id},#{name},#{age},#{email})
</select>
```

使用@param注解
```java
User checkLoginByParam(@Param("username") String username , @Param("password") String password)

User user = mapper.checkLoginByParam("admin", "123456");

<select id="checkLoginByParam" resultType="User">
	select * from t_user where username = #{username} and password = #{password}
</select>
```
这样的话mybatis底层在map存储的时候就会以@param中的参数为键传入参数为值构建map集合,取代了arg但是param没有被取代

当查询时如果接口中的返回值是单个的话而查询结果是多个就会报错
可以使用集合或数组作为返回值,这样既可以返回多个也可以返回单个

int类型在resultType中需要指定为Integer类型

可以将resultType指定为map类型,这样获取到的结果就会以字段为键,以数据为值

当有多条数据的的时候可以将其转换为一个map数组也可以指定map的键让整条数据作为值
```java
@MapKey("id")
Map<string,object>getAllUserToMap();
```
返回结果
```java
{
	3={pasgword=123456,sex=男,id=3,age=23,email=12345@qq.com,username=admin},
	6={password=123，sex=男，id=6,age=23，email=123@qq.com，username=李四}
}
```

### 不能使用#{}的场景
#### 模糊匹配
当进行模糊匹配的时候由于模糊匹配的内容都是字符串类型的所以需要使用单引号引起来,如果使用#{}的话就会导致内容被解读为字符串,所以模糊匹配是要用到${}
```xml
<select id="getUserByLike"resultType="User">
	select * from t user where username like '%${username}%'
</select>
```

如果使用#{}的话需要多次拼接
```mysql
select * from t user where username like"%"#{username}"%";
```

#### 批量删除
当传入多个id进行批量删除时不能使用#{},因为在使用#{}时会自动加单引号所以无法实现批量删除
```java
mapper.deleteMore("1,2,3");

delete from t user where id in (${ids})
```

#### 动态设置表名
这是因为在查询表明的时候是没有单引号的,而#{}会自动添加单引号
```mysql
select from ${tableName}
```


### 获取自动递增的主键

useGeneratedKeys : 表明要执行的sql是否使用自动递增主键
获取到的自动递增的主键值放在哪里(传参的变量中),将其当作传出参数,这是因为返回值是固定的所以只能将该值放到传出参数中
```java
void insertuser(User user);


<insert id="insertuser" useGeneratedKeys="true" keyProperty="id">
	insert into t_user values(null,#{username},#{password},#{age},#{sex},#{email})
</insert>

Preparedstatement ps =connection.preparestatement(sql:"insert",RETURN_GENERATED_KEYS)
User user=new User(new User(id:null,username:"王五"，password:"123"，age:23，sex:"男"，email:"123@163.com"));
mapper.insertuser(user);
System.out.println(user)
```
preparestatement(sql:"insert",RETURN_GENERATED_KEYS)设置是否能获取自动递增的主键

## 字段名和属性名不一致的情况

### 为字段起别名使其符合属性名
如果字段名和属性名不一致时那么查询出来的结果就为空,可以在查询时给字段设置别名来解决

```java
class User{
	string empName;
	int empAge;
}

select emp_name empName,emp_age emp_Age from emp;
```

### 设置setting属性
在核心配置文件添加mapUnderscoreTocamelcase配置设置为true表明自动将下划线命名映射为驼峰命名(单驼峰)
```xml
<settings>
	<!--将_自动映射为驼峰，em_pnqme:empName-->
	<setting name="mapUnderscoreTocamelcase" value="true"/>
</settings>
```
但映射也是有规则的,如:emp_name只能映射为empName

### 通过reslutMap

\<resultMap>标签设置resultMap要处理的映射关系
- id : 表示自己的id
- type : 表示要处理映射关系的类名
其中\<id>标签处理的是主键的映射关系
\<result>标签处理的是普通字段的映射关系
\<association>标签处理多对一的映射关系
\<collection>标签处理一对多的映射关系

```xml
<resultMap id="empResultMap" type="Emp">
	<id property="eid"column="eid"></id>
	<result property="empName" column="emp_name"></result>
	<result property="empAge" column="emp_age"></result>
</resultMap>

<select id="getAllEmpre" sultMap="empResultMap">

</select>
```
如果有的字段名和属性名一致可以不设置,但为了严谨性推荐设置

### 多表查询与类中自定义类型的映射
如果在一个实体类中有一个自定义类型对应着另一张表,而查询时需要多表查询,查询出的结果只是基础数据类型无法对应自定义类型,此时就需要进行级联映射
```xml
<resultMap id="empResultMapOne" type="Emp">
	<id property="eid"column="eid"></id>
	<result property="empName" column="emp_name"></result>
	<result property="empAge" column="emp_age"></result>
	<result property="dept.did" column="did"></result>
	<result property="dept.deptName" column="dept_name"></result>
</resultMap>

<selectid="getEmpAndDept" resultMap="empAndDeptResultMapOne">
	select * from t_emp left join t_dept on t_emp.did = t_dept.did where t_emp.eid = #{eid}
</select>
```

### association处理多对一的关系
property指明的多映射的表
javaType指明的java实体类,其中的id标签和result标签和result标签一样
和resultMap嵌套使用
```xml
<resultMap>
	<id property="eid"column="eid"></id>
	<result property="empName" column="emp_name"></result>
	<result property="empAge" column="emp_age"></result>
	<result property="dept.did" column="did"></result>
	<result property="dept.deptName" column="dept_name"></result>
	<association property="dept" javaType="Dept">
		<id property="did" column="did"></id>
		<result property="deptName" column="dept_name"></result>
	</association>
</resultMap>
```

### 分步查询
分步查询最大的优点是可以开始延迟加载
需要在setting标签中开启
开启延迟加载后所有分步查询都会延迟加载了,如果有的分步查询不需要延迟加载可以在属性中设置
association中的fetchType属性设置为lazy是延迟加载,eager是关闭延迟加载

### 一对多

如查询一个部门表中会返回多个员工
```xml
<resultMap id="deptAndEmpResultMap"ttype="Dept">
	<id property="did"'column="did"></id>
	<result property="deptName"column="dept_name"></result>
	<collection property="emps" ofType="Emp">
		<id property="eid"column="eid"></id>
		<result property="empName" column="emp_name"></result>
		<result property="age" column="age"></result>
		<result property="sex" column="sex"></result>
		<result property="email" column="eid"></result>
	</collection>
</resultMap>

<select id="getDeptAndEmp" resultMap="deptAndEmpResultMap">
	select * from t_dept left join t_emp on t_dept.did = t_emp.did where t_dept.did = #{did}
</select>
```

# 动态sql
可以更方便地拼接sql语句

## if
if标签可通过test属性的表达式进行判断，若表达式的结果为true，则标签中的内容会执行；反之标签中的内容不会执行
```xml
<select id="getEmpByCondition" resultType="Emp">
	select * from t_emp where
	<if test="ename != null and ename !=''">
		ename=#{ename}
	</if>
	<if test= "age != null and age !=''">
		and age=#{age}
	</if>
</select>
```
由于&&和||有特殊含义故用and和or代替

但如果第一个if没有执行成功而后面的if执行成功了就会出现where and不符合语法
或者所有if都没有执行成功就会出现语句后多了一个where
sql出现错误
此时可以在where后面加上一个永真式来解决,这样第一个if中也要加入and
```xml
<select id="getEmpByCondition" resultType="Emp">
	select * from t_emp where 1=1
	<if test="ename != null and ename !=''">
		and ename=#{ename}
	</if>
	<if test= "age != null and age !=''">
		and age=#{age}
	</if>
</select>
```

## where
对于多余where的问题也可以使用where标签去动态生成where
```xml
<select id="getEmpByCondition" resultType="Emp">
	select * from t_emp
	<where>
		<if test="ename != null and ename !=''">
			ename=#{ename}
		</if>
		<if test= "age != null and age !=''">
			and age=#{age}
		</if>
	</where>
</select>
```
当where标签中判断语句都不为真的时候就不慌生成where,如果为真也会自动去除**内容前**的and或or
不能将内容后多余的and或or去掉

## trim
若标签中有内容时:
prefix / suffix：将trim标签中内容前面或后面添加指定内容
suffixoverrides / prefixoverrides：将trim标签中内容前面或后面去掉指定内容

若标签内没有内容:
trim标签也没有任何效果
```xml
<trim prefix="where" suffixoverrides="and|or">
	<if test="empNamee != null and empName!=''">
		emp_name = #{empName}and
	</if>
	<if test="age != null and age!=''">
		age = #{age} or
	</if>
</trim>
```

## choose,when,otherwise
when和otherwise标签都需要写在choose标签里面
when相当于if,else if
toherwise相当于else

## foreach
遍历一个数组
```xml
<!--int deleteMoreByArray(@Param(eids) Integer[]eids);-->
<delete id="deleteMoreByArray">
	delete from t_emp where eid in(
	<foreach collection="eids" item="eid" separator:",">
		#{eid}
	</foreach>)
</delete>
```
根据id数组批量删除符合id的数据
collection是传入的数组名,元素是每次循环拿出的元素`相当于for(item:collection)`
separator表示的是分隔符,每个元素之间用什么分隔(如果自己在#{}后写分割符在开头或结尾元素会多出一个)生成的分隔符左右默认加上空格
open属性表示以什么开始
close属性标表示以什么结束

这样就可以省略自己写小括号了
```xml
<!--int deleteMoreByArray(@Param(eids) Integer[]eids);-->
<delete id="deleteMoreByArray">
	delete from t_emp where eid in
	<foreach collection="eids" item="eid" separator:"," open"()" close=")">
		#{eid}
	</foreach>
</delete>
```

也可以用于or或and 的单一场景
```xml
delete from t_emp where
<foreach collection="eids" item="eid" separator="or">
	eid = #{eid}
</foreach>
```

## sql和include
sql标签用于定义变量
include用于引入变量
```xml
<sql id="empcolumns">eid,emp_name,age,sex,email</sql>

<!--List<Emp> getEmpByCondition(Emp emp);-->
<select id="getEmpByCondition" resultType="Emp">
	select <include refid=empcolumns></include> from t_emp
</select>
```

# 缓存

## 一级缓存
一级缓存是默认开启的
一级缓存是SqISession级别的，通过同一个SqISession查询的数据会被缓存，下次查询相同的数据，就会从缓存中直接获取，不会从数据库重新访问

使一级缓存失效的四种情况：
1. 不同的SqISession对应不同的一级缓存
2. 同一个SqISession但是查询条件不同
3. 同一个SqISession两次查询期间执行了任何一次增删改操作(只要执行增删改都会情况缓存)
4. 同一个SqISession两次查询期间手动清空了缓存

## 二级缓存
二级缓存是SqlSessionFactory级别，通过同一个SqlSessionFactory创建的SqlSession查询的结果会被缓存；此后若再次执行相同的查询语句，结果就会从缓存中获取

二级缓存开启的条件：
1. 在核心配置文件中，设置全局配置属性cacheEnabled="true"，默认为true，不需要设置
2. 在映射文件中设置标签<cache />
3. 二级缓存必须在SqISession关闭或提交之后有效
4. 查询的数据所转换的实体类类型必须实现序列化的接口

使二级缓存失效的情况：
两次查询之间执行了任意的增删改，会使一级和二级缓存同时失效

### 相关属性
在mapper配置文件中添加的cache标签可以设置一些属性：

**eviction属性：缓存回收策略**
默认的是LRU。
- LRU（LeastRecentlyUsed）－最近最少使用的：移除最长时间不被使用的对象。
- FIFO（First in First out）-先进先出：按对象进入缓存的顺序来移除它们。
- SOFT-软引用：移除基于垃圾回收器状态和软引用规则的对象。
- WEAK-弱引用：更积极地移除基于垃圾收集器状态和弱引用规则的对象。

**flushlnterval属性：刷新间隔，单位毫秒**
二级缓存每隔多长时间刷新一次
默认情况是不设置，也就是没有刷新间隔，缓存仅仅调用语句时刷新

**size属性：引用数目，正整数**
代表缓存最多可以存储多少个对象，太大容易导致内存溢出

**readOnly属性：只读，true/false**
- true：只读缓存；会给所有调用者返回缓存对象的相同实例。因此这些对象不能被修改。这提供了很重要的性
能优势。
- false：读写缓存；会返回缓存对象的拷贝（通过序列化）。这会慢一些，但是安全，因此默认是false。

## 缓存的查询顺序
- 先查询二级缓存，因为二级缓存中可能会有其他程序已经查出来的数据，可以拿来直接使用。
- 如果二级缓存没有命中，再查询一级缓存
- 如果一级缓存也没有命中，则查询数据库
- SqlSession关闭之后，一级缓存中的数据会写入二级缓存

## 第三方缓存
mybatis由于是主要用于操作数据库,故缓存方面可能有做的不好的地方,mybatis也提供了二级缓存的接口可以使用第三方缓存管理二级缓存
但一级缓存是无法更改的

### EHCache

```xml
<!--MybatisEHCache整合包-->
<dependency>
	<groupId>org.mybatis.caches</groupId>
	<artifactId>mybatis-ehcache</artifactId>
	<version>1.2.1</version>
</dependency>
```

核心配置文件

```xml
<?xml version="1.0" encoding="utf-8"?>
<ehcache xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:noNamespaceSchemaLocation="../config/ehcache.xsd">
	<!--磁盘保存路径
	<diskstore path="D:\atguigu\ehcache"/>
	<defaultcache
		maxElementsInMemory="1000"    //内存上最大存储数量
		maxElements0nDisk="10000000"    //磁盘上最大存储数量
		eternal="false"
		overflowToDisk="true"
		timeToIdleSeconds="120"
		timeToLiveSeconds="120"
		diskExpiryThreadIntervalseconds="120"
		memoryStoreEvictionPolicy="LRU">
	</defaultcache>
</ehcache>
```

配置好后需要在映射文件中设置缓存
```xml
<cache type="org.mybatis.caches.ehcache.Ehcachecache"/>
```

# 逆向工程

正向工程：先创建Java实体类，由框架负责根据实体类生成数据库表。Hibernate是支持正向工程的。

逆向工程：先创建数据库表，由框架负责根据数据库表，反向生成如下资源：
- Java实体类
- Mapper接口
- Mapper映射文件

逆向工程的配置文件必须是generatorConfig.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DocTYPEgeneratorConfiguration
	PUBLIC "-//mybatis.org//DTD MyBatis Generator Configuration 1.o//EN"
	"http://mybatis.org/dtd/mybatis-generator-config_1_0.dtd">
<generatorConfiguration>

	<!--
		targetRuntime：执行生成的逆向工程的版本
		MyBatis3Simple：生成基本的CRUD（清新简洁版）只有增删改查五个方法:查询一条数据和查询所有数据以及增删改
		MyBatis3：生成带条件的cRUD（奢华尊享版）
	-->
	
	<context id="DB2Tables" targetRuntime="MyBatis3Simple">
		
		<!--数据库的连接信息-->
		<jdbcConnection driverClass="com.mysql.jdbc.Driver"
			connectionURL="jdbc:mysql://localhost:3306/mybatis"
			userId="root"
			password="123456">
		</jdbcConnection>
	
		<!--javaBean的生成策略-->
		<javaModelGenerator targetPackage="com.atguigu.mybatis.pojo" targetProject=".\src\main\java">
			<property name="enableSubpackages" value="true" />    
			<property name="trimStrings"value="true"/>
		</javaModelGenerator>
		
		<!--SQL映射文件的生成策略-->
		<SqlMapGenerator targetPackage="com.atguigu.mybatis.mapper"
		targetProject=".\src\main\resources">
			<property name="enableSubPackages" value="true"/>
		</sqlMapGenerator>
	
		<!--Mapper接口的生成策略-->
		<javaClientGenerator type="XMLMAPPER" targetPackage="com.atguigu.mybatis.mapper"
		targetProject=".\src\main\java">
			<property name="enableSubPackages" value="true" />
		</javaclientGenerator>
		
		<!--逆向分析的表-->
		<!--tableName设置为*号，可以对应所有表，此时不写domainobjectName
		<!--domainobjectName属性指定生成出来的实体类的类名-->
		<table tableName="t_emp" domainobjectName="Emp"/>
		<table tableName="t_dept" domainobjectName="Dept"/>
	</context>
</generatorConfiguration>
```
targetPackage根据哪个包生成
targetProject生成在哪个文件夹
enableSubpackages是否使用子包,如果是true那么targetPackage和targetProject中的点都代表的是一层目录,如果是false那么点只是文件名
trimStrings去掉字符串前面的空格
