---
title: 2 基于xml管理bean
createTime: 2025/06/18 20:59:30
permalink: /back/springboot/2/
---
loC是Inversion of Control的简写，译为"控制反转"，它不是一门技术，而是一种设计思想，是一个重要的面向对象编程法则，能够指导我们如何设计出松耦合、更优良的程序。

控制反转是为了降低程序耦合度，提高程序扩展力。
控制反转，反转的是什么？
	将对象的创建权利交出去，交给第三方容器负责。
	将对象和对象之间关系的维护权交出去，交给第三方容器负责。

通过DI(Dependency Injection)依赖注入实现控制反转

Spring通过loC容器来管理,所有Java对象的实例化和初始化，控制对象与对象之间的依赖关系。
我们将由loC容器管理的Java对象称为SpringBean，它与使用关键字new创建的Java对象没有任何区别。

```java
//1 根据id获取bean
User user1 = (User)context.getBean( name: "user");
System.out.println("1 根据id获取bean："+user1);

//2 根据类型获取bean
User user2 = context.getBean(User.class);
System.out.println（"2 根据类型获取bean:"+user2);

//3 根据id和类型获取beanl
User user3 = context.getBean( name: "user", User.class);
System.out.println("3 根据类型获取bean："+user2);
```

当根据类型获取bean时，要求loc容器中指定类型的bean有且只能有一个
当IOC容器中一共配置了两个：
```java
<bean id="user" class="com.atguigu.spring6.bean.User"></bean>
<bean id="user1" class="com.atguigu.spring6.bean.User"></bean>
```
根据类型获取时会抛出异常：

如果组件类实现了接口，可以根据接口类型获取bean但前提是bean唯一
如果一个接口有多个实现类，这些实现类都配置了bean，就不能根据接口类型获取bean了
```java
interface UserDao{
	void run();
}

class User impliments UserDao{
	@Override
	void run(){
		System.out.println("run");
	}
}

UserDao userDao= context.getBean(UserDao.class);
System.out.println(userDao);
userDao.run();
```

# 依赖注入

## 普通类型注入

### set方法注入

```java
class Book{
	String bname;
	String auther;

	setName(String name){
		bname=name;
	}

	setAuther(String auther){
		this.auther=auther;
	}
}

<bean id="book" class="com.atguigu.spring6.iocxml.di.Book">
	<property name="name" value="前端开发"></property>
	<property name="author" value="尚硅谷"></property>
</bean>
```
property标签会自动调用set方法给类设置初始值,,其中的name是set方法set后名字的小写
使用这样依赖注入获取到的类具有指定的初始值

### 构造器注入

```xml
<bean id="bookCon" class="com.atguigu.spring6.iocxml.di.Book">
	<constructor-arg name="bname" value="java开发"></constructor-arg>
	<constructor-arg name="author" value="尚硅谷"></constructor-arg>
</bean>

<bean id="bookCon"class="com.atguigu.spring6.iocxml.di.Book">
	<constructor-arg index="0" value="java开发"></constructor-arg>
	<constructor-arg index="1" value="尚硅谷"></constructor-arg>
</bean>
```
有两种写法一种是使用参数名注入,一种是使用索引注入,索引0代表第一个参数,1代表第二个参数

在写特殊符号的时候需要转义
xml提供cdata区用来创建原始字面量
使用`<![CDATA[ 内容 ]]>`来使用
内容不需要添加引号

```xml
<property name="others">
	<value><![CDATA[a<b]]></value>
</property>
```

## 特殊类型注入

### 对象类型注入
如果在一个对象中有另一个自定义对象的成员,在该类初始化时也需要对其成员类初始化

#### 外部bean注入

例:员工类中有一个部门类
```xml
<bean id="dept" class="com.atguigu.spring6.iocxml.ditest.Dept">
	<property name="dname" value="安保部"></property>
</bean>

<bean id="emp" class="com.atguigu.spring6.iocxml.ditest.Emp">
	<！--注入对象类型属性private Dept dept;-->
	<property name="dept" ref="dept"></property>
	<！--普通属性注入-->
	<property name="ename" value="lucy"></property>
	<property name="age" value="50"></property>
</bean>
```
通过property标签的ref属性对当前成员的bean类引入

#### 内部bean注入

```xml
<bean id="emp2" class="com.atguigu.spring6.iocxml.ditest.Emp">
	<!--普通属性注入-->
	<property name="ename" value="mary"></property>
	<property name="age" value="20"></property>
	<!--内部bean-->
	<property name="dept">
		<bean id="dept2" class="com.atguigu.spring6.iocxml.ditest.Dept">
			<property name="dname" value="财务部"></property>
		</bean>/
	</property>
</bean>
```

#### 级联属性赋值
```xml
<bean id="emp3" class="com.atguigu.spring6.iocxml.ditest.Emp">
	<property name="ename" value="tom"></property>
	<property name="age" value="30"></property>
	<property name="dept.dname" value="测试部"></property>
</bean>
```

### 数组类型注入

```xml
class Emp{
	String name;
	int age;
	Dept dept;
	String[] loves;
}

<bean id="emp" class="com.atguigu.spring6.iocxml.ditest.Emp">
	<！--普通属性-->
	<property name="ename" value="lucy"></property>
	<propertyy name="age" value="20"></property>
	<！--对象类型属性-->
	<property name="dept" ref="dept"></property>
	<！--数组类型属性-->
	<propertyname="loves">
		<array>
			<value>吃饭</value>
			<value>睡觉</value>
			<value>敲代码</value>
		</array>
	</property>
</bean>
```

### 集合类型注入

如果是基础数据类型的集合可以之间使用value标签写值
如果是自定义数据类型需要使用ref标签引入已有的bean类
```java
class Dept{
	List<Emp> empList;
}

<bean id="empone" class="com.atguigu.spring6.iocxml.ditest.Emp">
	<property name="ename" value="lucy"></property>
	<property name="age" value="20"></property>
</bean>
<bean id="emptwo" class="com.atguigu.spring6.iocxml.ditest.Emp">
	<property name="ename" value="mary"></property>
	<property name="age" value="30"></property>
</bean>

<beann id="dept" class="com.atguigu.spring6.iocxml.ditest.Dept">
	<property name="dname" value="技术部"></property>
	<property name="empList">
	<list>
		<ref bean="empone"></ref>
		<ref bean="emptwo"></ref>
	</list>
	</property>
</bean>
```

### Map类型注入
```java
class Student{
	Map<String,Teacher> teacherMap;
}

<bean id="teacher" class="com.atguigu.spring6.iocxml.dimap.Teacher">
	<！--注入普通类型属性-->I
	<property name="teacherId" value="100"></property>
	<property name="teacherName" value="西门讲师"></property>
</bean>

<bean id="student" class="com.atguigu.spring6.iocxml.dimap.Student">
	<!－-注入普通类型属性-->
	<property name="sid" value="2000"></property>
	<property name="sname" value="张三"></property>
	<!--在学生bean注入map集合类型属性-->
	<propertyy name="teacherMap">
		<map>
			<entry>
				<key>
				<value>10010</value>
				</key>
				<ref bean="teacher">/ref>
			</entry>
		</map>
	</property>
</bean>
```
一个entry标签代表一个键值对,如果要给集合注入若个数据需要在后面添加多个entry

### 引用集合类型的bean完成list和map的注入
在使用引用集合类型时需要在xml头部引入util
加上以下代码
```xml
xmlns:util="http://www.springframework.org/schema/util"
xsi:schemaLocation="http:/ /www.springframework.org/schema/util
http://www.springframework.org/schema/util/spring-util.xsd"
```

```xml
<!--list集合类型的bean-->
<util:list id="students">
	<ref bean="studentone"></ref>
	<ref bean="studentTwo"></ref>
	<ref bean="studentThree"></ref>
</util:list>

<!--map集合类型的bean-->
<util:map id="teacherMap">
	<entry>
		<key>
			<value>10010</value>
		</key>
	<ref bean="teacherone"></ref>
	</entry>
	<entry>
		<key>
			<value>10086</value>
		</key>
		<ref bean="teacherTwo"></ref>
	</entry>
</uti1:map>

<bean id="student" class="com.atguigu.spring6.iocxml.dimap.Student">
	<property name="sid" value="10000"></property>
	<property name="sname" value="lucy"></property>
	<!--注入List、map类型属性-->
	<property name="lessonList" ref="lessonList"></property>
</bean>
```

### p命名空间注入
需要在头部引入p命名空间
```xml
xmlns:p="http:/ /www.springframework.org/schema/p

<bean id="studentp" class="com.atguigu.spring6.iocxml.dimap.Student"
	p:sid="100" p:sname="mary"p:lessonList-ref="lessonList" p:teacherMap-ref="teacherMay"
</bean>
```

# 引入外部属性文件
首先需要在头部引入contex标签,在contex标签中引入文件
```xml
xmlns:context="http: / /www.springframework.org/schema/context"
xsi:schemaLocation="http://www.springframework.org/schema/context
http://www.springframework.org/schema/context/spring-context.xsd"

<context:property-placeholder location="classpath:jdbc.properties">
</context:property--placeholder>

<bean id="druidDataSource" class="com.alibaba.druid.pool.DruidDataSource
	<property name="url" value="${jdbc.url}"></property>
	<property name="username" value="${jdbc.user}"></property>
	<property name="password" value="${jdbc.password}"></property>
	<property name="driverClassName" value="${jdbc.driver}"></property>
</bean>
```

# bean的作用域
使用getbean函数获取到的bean对象是object类型的,还需要强转

在Spring中可以通过配置bean标签的scope属性来指定bean的作用域范围
也可以使用@scope注解设置
各取值含义参加下表：

| 取值             | 含义                                          | 创建对象的时机 |
| -------------- | ------------------------------------------- | ------- |
| singleton (默认) | 在lOC容器中，这个bean的对象始终为单实例IOC容器,在spring启动时就创建了 | 初始化时    |
| prototype      | 这个bean在lOC容器中有多个实例,每次使用都会创建一个新的             | 获取bean时 |
| request        | 每个请求范围内会创建新的实例（web环境中，了解）                   |         |
| session        | 每个会话范围内会创建新的实例（web环境中，了解）                   |         |
| application    | 每个应用范围内会创建新的实例（web环境中，了解）<br>               |         |
如果是在WebApplicationContext环境下还会有另外几个作用域（但不常用）

也可以使用@Lazy注解延迟初始化,使用singleton作用域的bean对象在spring启动时就创建了,使用@Lazy注解后它会在第一次使用的时候初始化


## bean的生命周期

1. bean对象创建（调用无参数构造）
2. 给bean对象设置相关属性
3. bean后置处理器（初始化之前）
4. bean对象初始化（调用指定初始化方法）
5. bean后置处理器(初始化之后）
6. bean对象创建完成了，可以使用了
7. bean对象销毁（配置指定销毁的方法）
8. loC容器关闭了

除了java类默认的生命周期,还可以让bean类实现BeanPostProcessor接口重写`postProcessBeforeInitialization`函数和`postProcessAfterInitialization`函数来让bean类具有初始化之前的后置处理器和初始化之后的后置处理器

## 获取bean的几种方式
### 1.根据xml配置获取

### 2.FactoryBean获取
FactoryBean是Spring提供的一种整合第三方框架的常用机制。和普通的bean不同，配置一个FactoryBean类型的bean，在获取bean的时候得到的并不是class属性中配置的这个类的对象，而是getObject()方法的返回值。通过
这种机制，Spring可以帮我们把复杂组件创建的详细过程和繁琐细节都屏蔽起来，只把最简洁的使用界面展示给我们。

要使用FactoryBean需要实现FactoryBean接口,这是一个泛型,传入的类型就是要返回的类型
```java
public class MyFactoryBean implements FactoryBean<User>{
	@Override
	public User getobject()throws Exception {
		return new User();
	}
	
	@Override
	public Class<?>getobjectType(）{
		return User.class;
	}

	@Override
	public boolean isSingleton(){
		return ture;
	}
}
```
getObject函数返回创建的对象
getObjectType返回创建对象的类型
isSingleton创建的对象是否单例,返回true是单例,返回false不是单例

### 3.使用@Bean注解获取
如果是自己创建的类只需要在上面加上@Component及其衍生注解即可设置为bean对象,但如果使用第三方包提供的类,第三方包往往是只读的,所以无法使用添加@Component注解的方式将其设置为bean对象

如果要管理的bean对象来自于第三方（不是自定义的）是无法用及衍生注解声明bean的，就需要用到@Bean注解。
可以定义一个方法,方法的返回值是这个第三方包中的对象,在这个方法上面添加@Bean注解表示这个方法的返回值交由ioc容器管理(这个方法往往是定义在配置类中)
在使用时将这个对象使用@Autowried自动注入
```java
@Configuration
public class CommonConfig{
	@Bean//将方法返回值交给Ioc容器管理，成为Ioc容器的bean对象
	public SAXReadersaxReader(){
		return new SAxReader();
	}
}

@Autowired
private SAXReader saxReader;
```
可以通过Bean注解的name或value属性设置第三方bean对象的bean名称,如果未指定则默认是方法名

如果在这个生成第三方类的函数中需要使用bean对象中的方法可以不使用@Autowired自动注入,只需要将要使用的bean对象声明为方法形参即可自动注入
```java
@Bean
public SAXReader reader(DeptService deptService){
	System.out.println(deptService);
	return new SAXReader();
}
```

#### 4.使用@Import注解获取
@lmport导入。使用@lmport导入的类会被Spring加载到loc容器中，导入形式主要有以下几种：
- 普通类 : 使用@Import导入的类不需要加任何注解也会被注册为bean对象
- 配置类 : 配置类导入后这个配置类中的所有bean对象都会加载到ioc容器中
- ImportSelector接口实现类 : 这个类中有一个selectImports函数需要重写,它的返回值是一个字符串数组,其中存储着要加载到ioc容器中bean对象的全类名,即这个函数返回的全类名都会被注册为bean对象加载到ioc容器中
```java
public class MyImportSelector implements ImportSelector{
	public String[] selectImports(AnnotationMetadata importingClassMetadata){
		return new String[]{"com.example.HeaderConfig"};
	}
}
```

第三方包中支持spring的话往往会提供一个@Enable开头的注解,这个注解封装了@Import注解,可以根据此判断都会导入哪些类能加载到ioc容器中

在org.springframework.boot.autoconfigure.AutoConfiguration.imports文件中存储着被ioc容器管理类的全类名,他们大多数是不会默认加载到ioc中的,只有在特定条件下才会加载到ioc容器中被使用
其中@Conditional开头的注解就是在达成特定条件才会被加载

### 5.上下文容器对象初始化完成后手动注册bean
手动注册的类不需要spring 的注解是一个普通类就能注册
```java
public class App5 {
	public static void main(String[] args){
		AnnotationConfigApplicationContext ctx=new AnnotationConfigApplicationContext (SpringConfig4.class);
		//上下文容器对象已经初始化完毕后，手工加载bean
		ctx.registerBean( beanName: "tom", Cat.class, ..constructorArgs: 0);

		ctx.register(Mouse.class);
		String[] names = ctx.getBeanDefinitionNames();
		
		for (String name : names){
			System.out.println(name);
		}
		System.out.println(ctx.getBean(Cat.class));
	}
}
```
使用registerBean和register都可以注册是两种方法

### 6.ImportSelector接口实现
需要实现ImportSelector接口,在selectImports的返回值列表中返回要注册bean类的全类名
接着把实现类导入到配置类中
```java
public class MyImportSelector implements ImportSelector{
	@override
	public String[] selectImports(AnnotationMetadata importingClassMetadata){
		return new String[]("com.itheima.bean.Dog");
	}
}

@Import(MyImportSelector.class)
public class SpringConfig6{
}
```
AnnotationMetadata元数据,谁加载了这个类描述的就是谁,该例中importingClassMetadata表示的就是SpringConfig6这个类
同时AnnotationMetadata类还提供了一系列方法用于对元数据的类进行操作或判定
这种方法在源码中大量使用

### 7.ImportBeanDefinitionRegistrar接口实现
相比于ImportSelector接口它功能更加强大,除了具有元数据类外还有一个beanDefinitionRegistry注册用于注册bean对象,因此不需要返回值即可在里面直接创建bean对象
此接口还提供了另一个函数多了bean命名器的类,使用那个类可以给bean对象命名
然后在配置类中导入这个类在ioc容器加载配置类后就能使用了

```java
public class MyRegistrar implements ImportBeanDefinitionRegistrar {
	@Override
	public void registerBeanDefinitions(AnnotationMetadata importingClassMetadata , BeanDefinitionRegistry registry）{
	//1.使用元数据去做判定
	BeanDefinition beanDefinition = BeanDefinitionBuilder.rootBeanDefinition (Dog.class).getBeanDefinition();
	registry.registerBeanDefinition(beanName:"yellow",beanDefinition);
}

@Import(MyRegistrar.class)
public class SpringConfig7{
}
```

### 8. PostProcessor
后处理器
```java
public class MyPostProcessor implements BeanDefinitjionRegistryPostProcessor{
	@Override
	public void postProcessBeanDefinitionRegistry(BeanDefinitionRegistry registry) throws BeansException{
		BeanDefinition beanDefinition = BeanDefinitionBuilder.rootBeanDefinition (BookServiceImpl4.class).getBeanDefinition();
		registry.registerBeanDefinition(beanName:"bookService",beanDefinition);
	}
	@Override
	public void postProcessBeanFactory(ConfigurableListableBeanFactory beanFactory) throws BeansException {}
```
使用方法和ImportBeanDefinitionRegistrar基本一样
如果在配置类上的Import注解导入太多类时一般会使用最后导入的类
使用postprocessor后就可以指定类了,接口函数中使用的是哪个类,配置类中使用的也是哪个
