---
title: 1 概述
createTime: 2025/04/05 12:12:26
permalink: /back/springboot/
---
- 请求行：请求数据第一行（请求方式、资源路径、协议）
- 请求头：从第二行开始，格式key：value
- 请求体 : POST请求，存放请求参数
请求行或每个请求头结尾都是`\r\n`
请求体和请求头之间有空行隔开他们之间的字符是`\r\n\r\n`
```http
POST /brand HTTP/1.1
Accept:application/json,text/plain, */*
Accept-Encoding: gzip, deflate,br
Accept-Language: zh-CN,zh;q=0.9
Content-Length: 161
Content-Type: application/json;charset=UTF-8
Cookie: Idea-8296eb32=841b16f0-0cfe-495a-9cc9-d5aaa71501a6;JSESSI0NID=0FDE4E430876BD9C5C955F061207386F
Host: 1ocalhost:8080
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/..

{"status":1,"brandName":"黑马","companyName":"黑马程序员","id":"","description"："黑马程序员"}
```


| 常见请求头           | 作用                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------- |
| Host            | 请求的主机名                                                                                        |
| User-Agent      | 浏览器版本，例如Chrome浏览器的标识类似Mozilla/5.0 ...Chrome/79，IE浏览器的标识类似Mozilla/5.(WindowsNT ...) like Gecko |
| Accept          | 表示浏览器能接收的资源类型，如text/\*，image/\*或者\*/*表示所有;                                                    |
| Accept-Language | 表示浏览器偏好的语言，服务器可以据此返回不同语言的网页；                                                                  |
| Accept-Encoding | 表示浏览器可以支持的压缩类型，例如gzip，deflate等。                                                               |
| Content-Type    | 请求主体的数据类型。                                                                                    |
| Content-Length  | 请求主体的大小（单位：字节）。                                                                               |
- 请求方式-GET：请求参数在请求行中，没有请求体，如：/brand/findAll?name=OPPO&status=1。GET请求大小是有限制的。
- 请求方式-POST：请求参数在请求体中，POST请求大小是没有限制的。
浏览器地址栏发送到请求全部都是get请求

Spring 有两个最核心模块：loC 和 AOP。

1. loC：Inverse of Control的简写，译为"控制反转"，指把创建对象过程交给Spring 进行管理。
2. AoP：Aspect Oriented Programming 的简写，译为"面向切面编程"。AOP 用来封装多个类的公共行为，将那些与业务无关，却为业务模块所共同调用的逻辑封装起来，减少系统的重复代码，降低模块间的耦合度。另外，AOP还解决一些系统层面上的问题，比如日志、事务、权限等。

spring项目进行打包时，需要引入插件（基于官网骨架创建项目，会自动添加该插件）

配置的优先级:
命令行参数>java系统属性>.properties>.yml>.yaml
# REST
（Representational State Transfer），表现形式状态转换
通俗来讲就是网络风格资源描述形式

- 传统风格资源描述形式
```
http://localhost/user/getById?id=1
http://localhost/user/saveUser
```

- REST风格描述形式
```
http://localhost/user/1
http://localhost/user
```

优点：
1. 隐藏资源的访问行为，无法通过地址得知对资源是何种操作
2. 书写简化

这也使有的访问资源的行为使用了同样的描述
要区分访问资源的行为可以通过请求的方法来区分

按照REST风格访问资源时使用行为动作区分对资源进行了何种操作

| url                      | 行为       | 请求           |
| ------------------------ | -------- | ------------ |
| http://localhost/users   | 查询全部用户信息 | GET (查询)     |
| http://localhost/users/1 | 查询指定用户信息 | GET (查询)     |
| http://localhost/users   | 添加用户信息   | POST (新增/保存) |
| http://localhost/users   | 修改用户信息   | PUT (修改/更新)  |
| http://localhost/users/1 | 删除用户信息   | DELETE (删除)  |
上述行为是约定方式，约定不是规范，可以打破，所以称REST风格，而不是REST规范
描述模块的名称通常使用复数，也就是加s的格式描述，表示此类资源，而非单个资源，例如：users、books、accounts.

**根据REST风格对资源进行访问称为RESTful**

在springboot中使用RESTful的方法是在路由上对指定路径的资源访问方式做限制
```java
@RequestMapping(value="/users",method=RequestMethod.POST)
```

#### 设定请求参数(路径变量)
在形参列表中对指定的参数设置@PathVariable注解可以让该形参作为变量,在@RequestMapping中使用大括号的方法对该形参名可以取值
```java
@RequestMapping(value = "/users/{id}",method = RequestMethod.DELETE)
@ResponseBody
public String delete(@PathVariable Integer id){
	System.out.println("user delete..." + id);
	returnn "{'module':'user delete'}";
}
```

- @RequestParam用于接收url地址传参或表单传参
- @RequestBody用于接收json数据
- @PathVariable用于接收路径参数，使用{参数名称}描述路径参数

### REST快速开发

#### @RestController
基于SpringMVc的RESTful开发控制器类定义上方
设置当前控制器类为RESTful风格，等同于@Controller与@ResponseBody两个注解组合功能
```java
@RestController
public class BookController{

}
```

#### @GetMapping @PostMapping @PutMapping @DeleteMapping
基于SpringMVc的RESTful开发控制器方法定义上方
设置当前控制器方法请求访问路径与请求动作，每种对应下个请求动作，例如@GetMapping对应GET请求
- value（默认）：请求访问路径
```java
@GetMapping("/{id}")
public String getById(@PathVariable Integer id){
	System.out.println("book getById..."+id);
	return"{'module':'book getById'}";
}
```

# 配置文件
springboot的配置文件名必须为application,后缀名可以是properties,yml,ymal
如果三个格式同时存在
有冲突的属性默认使用properties文件,其次是yml最后是yaml
没有冲突的属性全都保留(取并集)

### 读取配置信息
#### 读取单个信息
使用@Value注解
```java
@Value("${name})
private String name1;

@Value("${user.name}")
private String name2;
```
这样就可以把name1赋值为配置文件里的name的值了
获取指定键下的键的值使用.分层
如果是数组使用方括号根据索引取值

#### 读取全部的配置信息
一个一个获取变量很不方便可以使用自动装配配置到一个环境中,使用spring提供的Environment类接收
```java
@Autowried
private Environment env;
```

使用getProperty函数根据传入的键获取Environment中对应的值
```java
env.getProperty("user.name");
```

#### 读取部分信息
但很多时候一个类并不需要所有的配置,只需要一部分配置,这时就需要读取部分信息
需要先设置一个类
在类上面加上@Component注解是spring能够管控这个类
在类上面加上@configurationProperties注解其中的profix指定配置文件的键用于根据键获取对应的值
在使用的时候在该类的实例上添加Autowired自动装配
```java
// datasource:
//     driver:com.mysql.jdbc.Driver
//     url:jdbc:mysql://localhost/springboot_db
//     username:root
//     password:root666123

@Component
@configurationProperties(profix="datasource")
public class MyDtatSource{
	private String driver;
	private String url;
	private String username;
	private String password;
}

@Autowired
private MyDataSource myDataSource;
```

SpringBoot除了支持配置文件属性配置，还支持Java系统属性和命令行参数的方式进行属性配置。
### java系统属性
前面加一个横杠
```shell
-Dserver.port=9000
```

### 命令行参数
前面要加两个横杠
```shell
--server.port=10010
```

# 获取配置信息

### @Value
通过
```java
@Value("${键名}")
```
获取键名中的值,不同层级需要使用.指明

如:获取server中port的值
```java
@Value("server.port")
public string port;
```

### @ConfigurationProperties
使用这个注解可以获取一个前缀中的所有键值
```java
@ConfigurationProperties(prefix="server")
public class Test{
	public string port;
};
```
\
### 第三方依赖提示
如果有引入第三方依赖的配置,在配置文件中可能不会有提示,可以引入springboot-configuration-process依赖,引入此依赖后在配置第三方配置时就会有提示了,且使用注入获取配置信息也不会爆红了
```xml
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-configuration-processor</artifactId>
		</dependency>
```
但有时候提示的配置拼写是横杠分隔的,而传统的配置是驼峰命名的这也没关系,两种方法都能使用
# beans.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://www.springframework.org/schema/beans
	http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

	<bean id="user" class="com.example.spring6.User"></bean>

</beans>
```

### bean标签

- id属性：唯一标识
- class属性：要创建对象所在类的全路径（包名称+类名称）

# 使用spring的方法创建对象
传入配置文件的路径加载配置文件
```java
ApplicationContext context = new ClassPathXmlApplicationContext("beans.xml");
```

获取创建的对象
根据配置文件中的bean的id获取对应的对象
```java
User user = (User)context.getBean("user");
```

使用spring 的方法创建对象不用new 的方式,底层是使用反射创建的

# 自动配置

SpringBoot的自动配置就是当spring容器启动后，一些配置类、bean对象就自动存入到了lOc容器中，不需要我们手动去声明，从而简化了开发，省去了繁琐的配置操作。

## 组件扫描
当spring启动时会进行扫描扫描启动类所在包及子包,当有被@Componect及其衍生注解修饰的类时就会注册为bean对象加入到ioc容器中由spring管理
如果有包不在被扫描的范围内,可以使用@Componentscan指定要扫描的包,被扫描的包及其子包也会被扫描

### @Conditional
作用：按照一定的条件进行判断，在满足给定条件后才会注册对应的bean对象到SpringIOc容器中。
位置：方法、类
声明在类上表示对整个类都有效
声明在方法上(要与@Bean配合使用)表示只对当前方法声明的bean有效

@Conditional本身是一个父注解，派生出大量的子注解：
- @ConditionalOnClass：判断环境中是否有对应字节码文件，才注册bean到ioc容器。
- @ConditionalOnMissingBean：判断环境中没有对应的bean（类型或名称），才注册bean到loc容器。如果要根据指定的类型判断需要使用value属性指定,如果要根据指定的名称判读需要使用name属性指定
- @ConditionalOnProperty：判断配置文件中有对应属性和值，才注册bean到loc容器。name属性用于指定属性名,havingValue属性用于指定属性名对应的值

## 起步依赖
在实际开发中，经常会定义一些公共组件，提供给各个项目团队使用。而在SpringBoot的项目中，一般会将这些公共组件封装为SpringBoot 的 starter。

一般来说springboot整合的起步依赖都是 : spring-boot-starter-名称
第三方主动适配spring的起步以来都是 : 名称-spring-boot-starter

# 引导类

SpringBoot的引l导类是Boot工程的执行入口，运行main方法就可以启动项目
SpringBoot工程运行后初始化Spring容器，扫描引导类所在包加载bean
```java
@SpringBootApplication
public class QuickstartApplication {
	public static void main(String[] args) {
		SpringApplication.run(QuickstartApplication.class, args);
	}
}
```
返回的是spring的ioc容器,可以使用getBean获取其中加载的bean对象

# 配置
## 使用传统的spring配置文件

## 使用注解

## 基于配置文件项目配置的注解
如果要接手一个项目,这个项目是使用xml文件配置的,若想要使用注解开发可以在配置类上添加一个@ImportResource导入对应的配置
```java
@ImportResource("application.xml")
```


```java
@Import(MyImportSelector.class)
public class SpringConfig {

  @Bean
  //@ConditionalOnClass(Mouse.class)//当发现有一个老鼠就创建一个猫类
  //@ConditionalOnMissingClass("com.itheima.bean.Mouse")//当没有这个类的话就创建一个猫类
  @ConditionalOnBean(name="jerry")//只有名为jerry的bean存在时才创建一个猫类
  public Cat tom(){
    return new Cat();
  }
}
```
