---
title: 3 基于注解管理bean
createTime: 2025/06/18 20:59:32
permalink: /back/springboot/3/
---
# 开启组件扫描
Spring默认不使用注解装配Bean，因此我们需要在Spring的XML配置中，通过context:component-scan 元素开启SpringBeans的自动扫描功能。开启此功能后，Spring会自动从扫描指定的包（base-package属性设置)及其子包下的所有类，如果类上使用了@Component注解，就将该类装配到容器中。

开启组件扫描表示要扫描的包名,这样在这个包中的注解都能被识别了
## 基础扫描
只对指定的包开启全部扫描

```xml
xmlns: context="http: / /www.springframework.org/schema/context"
xsi:schemaLocation="http://www.springframework.org/schema/context
http:/ /www.springframework.org/schema/context/spring-context.xsd"

<context:nent-scan base-package="com.atguigu"></context:component-scan>
```

## 过滤扫描
context:exclude-filter标签：指定排除规则
	type：设置排除或包含的依据
	type="annotation"，根据注解排除，expression中设置要排除的注解的全类名
	type="assignable"，根据类型排除，expression中设置要排除的类型的全类名

```xml
<context:component-scan base-package="com.atguigu.spring6">
	<context:exclude-filter type="annotation" expression="org.springframework.stereotype.Controller"/>
	<context:exclude-filter type="assignable"
	expression="com.atguigu.spring6.controller.UserController"/>
</context:component-scan>
```
表示Controller这个注解不被扫描
和UserController这个类上面的注解不被扫描

# 使用注解定义Bean

Spring 提供了以下多个注解，这些注解可以直接标注在Java类上，将它们定义成SpringBean。

| 注解          | 说明                                                                                                         |
| ----------- | ---------------------------------------------------------------------------------------------------------- |
| @Component  | 该注解用于描述Spring中的Bean，它是一个泛化的概念，仅仅表示容器中的一个组件（Bean），并且可以作用在应用的任何层次，例如 Service层、Dao 层等。使用时只需将<br>该注解标注在相应类上即可。 |
| @Repository | 该注解用于将数据访问层（Dao层）的类标识为Spring 中的Bean，其功能与@Component 相同。                                                     |
| @Service    | 该注解通常作用在业务层（Service层），用于将业务层的类标识为Spring中的Bean，其功能与 @Component 相同。                                          |
| @Controller | 该注解通常作用在控制层（如SpringMVC的Controller），用于将控制层的类标识为相同                                                           |

```java
@Component(value="user")
class User{};
```
value可以不写,默认是类名小写

# @Autowired注入
单独使用@Autowired注解，默认根据类型装配【默认是byType】

```java
@TargetC{ElementType.CONSTRUCTOR, ElementType.METHoD， ElementType.PARAMETER,ElementType.FIELD, ElementType.ANNOTATION_TYPE})
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface Autowired {
	boolean required() default true;
}
```

### 自动注入

在成员变量中设置@Autowired注解自动注入
```java
@Controller
public class UserController{
	@Autowired//根据类型找到对应对象，完成注入
	private UserService userService;
	public void add() {
		System.out.println("controller...");
	}
}

Applicationcontext context = new ClassPathXmlApplicationContext( configLocation: "bean.xml");
UserController controller = context.getBean(UserController.class);
controller.add();
```

### set方法注入
```java
@Controller
public class UserController{
	private UserService userService;

	@Autowired
	public void setUserService(UserService userService) {
		this.userService = userService;
	}
	
	public void add() {
		System.out.println("controller...");
	}
}
```
设置set函数,在set函数上面添加@Autowired注解

### 构造方法注入
在构造方法上添加@Autowired注解
```java
@Controller
public class UserController{
	private UserService userService;

	@Autowired
	public UserController(UserService userService){
		this.userServicee = userService;
	}

	public void add() {
		System.out.println("controller...");
	}
}
```

### 形参注入
在函数的形参上添加@Autowired注解 
```java
@Controller
public class UserController{
	private UserService userService;

	public UserController(@Autowired UserService userService) {
		this.userService = userService;
	}

	public void add() {
		System.out.println("controller...");
	}
}
```

### 无注解注入
当这个类只有一个有参构造时不需要@Autowired注解也能注入

### 通过两个注解根据名称注入
当一个接口有多个实现类的时候就无法只使用@Autowried注解注入了,可以搭配@Qualifier注解根据名称注入,名称是类名首字母小写

```java
@Controller
public class UserController{
	private UserService userService;

	@Autowired
	@Qualifier(value="userRedisDaoImpl")
	privatee UserDaouserDao;

	public void add() {
		System.out.println("controller...");
	}
}
```

### 通过@Recource注入
@Resource注解也可以完成属性注入。
@Resource注解是JDK扩展包中的，也就是说属于JDK的一部分。所以该注解是标准注解，更加具有通用性。

默认根据名称装配byName，未指定name时，使用属性名作为name。通过name找不到
的话会自动启动通过类型byType装配
@Autowired注解默认根据类型装配byType，如果想根据名称装配，需要配合@Qualifier注解一起用

- @Resource注解用在属性上、setter方法上。
- @Autowired注解用在属性上、setter方法上、构造方法上、构造方法参数上

@Resource注解属于JDk扩展包，所以不在JDK当中，需要额外引I入以下依赖：( 如果是JDK8的话不需要额外引入依赖。高于JDK11或低于JDK8需要引入以下依赖。)
```xml
<dependency>
	<groupId>jakarta.annotation</groupId>
	<artifactId>jakarta.annotation-api</artifactId>
	<version>2.1.1</version>
</dependency>
```

#### 根据名称注入
```java
@Service("myUserService")
public class UserServiceImplimplementss UserService{
	@Override
	public void add(){
		System.out.println("service....");
	}
}

@Controller
public class UserController{
	@Resource(name = "myUserService")
	private UserService userService;

	public voidd add(){
		System.out.println("controller...);
	}
}
```

#### 根据属性名注入
属性名要和@Repository注解中的值保持一致
```java
@Repository("myUserDao")
public class UserDaoImpl implements UserDao{
	@Override
	public void add() {
		System.out.println("dao...");
	}
}

@Service("myUserService")
public class UserServiceImpl implements UserService {
	@Resource
	private UserDao myUserDao;

	@Override
	public void add(){
		System.out.println("service....");
	}
};
```
当@Resource没有指定名字,属性名也没有和@Repository中的一致,这是时就会根据类型注入

## 全注解开发
使用@Configuration注解的类是配置类
@ComponentScan注解表示开去组件扫描相当于context:exclude-filter标签,里面的值表示扫描的包
这样在加载配置类的时候就不用加载xml文件了,直接加载配置类即可

```java
@Configuration//配置类
@ComponentScan("com.atguigu·spring6")//开启组件扫描
public class SpringConfig{
}

ApplicationContext context =new AnnotationConfigApplicationContext(SpringConfig.class);
UserController controller = context.getBean(UserController.class);
controller.add();
```
