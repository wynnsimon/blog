---
title: 5 面向切片AOP
createTime: 2025/06/18 20:59:38
permalink: /back/springboot/5/
---
底层是使用动态代理

# 概述

AOP（Aspect Oriented Programming）是一种设计思想，是软件设计领域中的面向切面编程，它是面向对象编程的一种补充和完善，它以通过预编译方式和运行期动态代理方式实现，在不修改源代码的情况下，给程序动态统添加额外功能的一种技术。利用AOP可以对业务逻辑的各个部分进行隔离，从而使得业务逻辑各部分之间的耦合度降低，提高程序的可重用性，同时提高了开发的效率。

其实就是面向特定方法编程

动态代理是面向切面编程最主流的实现。而SpringAOP是Spring框架的高级技术，旨在管理bean对象的过程中，主要通过底层的动态代理机制，对特定的方法进行编程。

### 横切关注点
分散在每个各个模块中解决同一样的问题，如用户验证、日志管理、事务处理、数据缓存都属于横切关注点。

从每个方法中抽取出来的同一类非核心业务。在同一个项目中，我们可以使用多个横切关注点对相关方法进行多个不同方面的增强。

这个概念不是语法层面的，而是根据附加功能的逻辑上的需要：有十个附加功能，就有十个横切关注点。

### 通知(增强)
**Advice，指哪些重复的逻辑，也就是共性功能（最终体现为一个方法）**

增强，通俗说，就是你想要增强的功能，比如安全，事物，日志等。

每一个横切关注点上要做的事情都需要写一个方法来实现，这样的方法就叫**通知方法**。

- 前置通知：在被代理的目标方法前执行
- 返回通知：在被代理的目标方法成功结束后执行（寿终正寝）
- 异常通知：在被代理的目标方法异常结束后执行（死于非命）
- 后置通知：在被代理的目标方法最终结束后执行（盖棺定论）
- 环绕通知：使用try...catch...finally结构围绕整个被代理的目标方法，包括上面四种通知对应的所有位置

### 切面
**Aspect，描述通知与切入点的对应关系（通知+切入点）**

封装通知方法的类
也叫切面类

### 目标
**Target，通知所应用的对象**

被代理的目标对象

### 代理
向目标对象应用通知之后创建的代理对象

### 连接点
**连接点：JoinPoint，可以被AOP控制的方法（暗含方法执行时的相关信息）**

这也是一个纯逻辑概念，不是语法定义的。

把方法排成一排，每一个横切位置看成x轴方向，把方法从上到下执行的顺序看成y轴，x轴和y轴的交叉点就是连接点。通俗说，就是spring允许你使用通知的地方

### 切入点
**切入点：PointCut，匹配连接点的条件，通知仅会在切入点方法执行时被应用**

定位连接点的方式。

每个类的方法中都包含多个连接点，所以连接点是类中客观存在的事物（从逻辑上来说）。

如果把连接点看作数据库中的记录，那么切入点就是查询记录的SQL语句。

Spring的AOP技术可以通过切入点定位到特定的连接点。通俗说，要实际去增强的方法

切点通过 org.springframework.aop.Pointcut 接口进行描述，它使用类和方法作为连接点的查询条件。

## 动态代理分类
动态代理分类：JDK动态代理和cglib动态代理

有接口的情况使用jdk的动态代理
代理对象和目标对象实现同样的接口

没有接口的情况使用的是cglib动态代理
通过**继承被代理的目标类（认干爹模式）实现代理，所以不需要目标类实现接口**。

Aspect：是AOP思想的一种实现。本质上是静态代理，将代理逻辑"织入"被代理的目标类编译得到的字节码文件，所以最终效果是动态的。weaver就是织入器。Spring只是借用了Aspect中的注解

需要引入依赖
```xml
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-aop</artifactId>
		</dependency>
```

开启aspectj自动代理,为目标对象生成代理
```xml
<aop:aspectj-autoaopxy></aop:aspectj-autoproxy>
```

在需要aop的方法上加上@Aspect注解,表示当前类是一个aop类.并在里面使用@Around注解指明要作用到哪些方法上

```java
@Slf4j
@Component
@Aspect
public class TimeAspect {

  @Around("execution(* com.itheima.service.*.*(..))")//作用在com.itheima.service包下的所有方法上
  public Object recordTime(ProceedingJoinPoint joinPoint) throws Throwable{
    //记录开始时间
    Long begin=System.currentTimeMillis();
    //执行目标方法
    Object result=joinPoint.proceed();
    //记录结束时间
    Long end=System.currentTimeMillis();

    log.info(joinPoint.getSignature()+"耗时: {}ms",end-begin);

    return result;
  }
}
```
当com.itheima.service包中的所有方法调用时都会执行此切片方法记录耗时

# 通知类型

| 通知              | 说明                                   |
| --------------- | ------------------------------------ |
| @Around         | 环绕通知，此注解标注的通知方法在目标方法前、后都被执行          |
| @Before         | 前置通知，此注解标注的通知方法在目标方法前被执行             |
| @After          | 后置通知，此注解标注的通知方法在目标方法后被执行，无论是否有异常都会执行 |
| @AfterReturning | 返回后通知，此注解标注的通知方法在目标方法后被执行，有异常不会执行    |
| @AfterThrowing  | 异常后通知，此注解标注的通知方法发生异常后执行              |

```java
@Slf4j
@Component
@Aspect
public class MyAspect {
  @Before("execution(* com.itheima.service.impl.DeptServiceImpl.*(..))")
  public void before() {
    log.debug("before...");
  }

  @Around("execution(* com.itheima.service.impl.DeptServiceImpl.*(..))")
  public Object around(ProceedingJoinPoint pjp) throws Throwable {
    log.debug("around before...");
    Object ret = pjp.proceed();
    log.debug("around after...");
    return ret;
  }

  @After("execution(* com.itheima.service.impl.DeptServiceImpl.*(..))")
  public void after() {
    log.debug("after...");
  }

  @AfterReturning("execution(* com.itheima.service.impl.DeptServiceImpl.*(..))")
  public void afterReturning() {
    log.debug("afterReturning...");
  }

  @AfterThrowing("execution(* com.itheima.service.impl.DeptServiceImpl.*(..))")
  public void afterThrowing() {
    log.debug("afterThrowing...");
  }
}
```
@Around环绕通知需要自己调用FProceedingJoinPoint.roceed(）来让原始方法执行，其他通知不需要考虑目标方法执行
@Around环绕通知方法的返回值，必须指定为object，来接收原始方法的返回值。

对于监控同一个包下的切入点表达式太过冗余,可以定义切点来引入
```java
@Slf4j
@Component
@Aspect
public class MyAspect {
  @Pointcut("execution(*com.itheima.service.impl.DeptServiceImpl.*(..))")
  private void pt(){}

  @Before("pt")
  public void before() {}
  
  @Around("pt")
  public Object around(ProceedingJoinPoint pjp) throws Throwable {}
}
```
对一个空函数上面加上@Pointcut注解写上切入点表达式后就可以直接在通知注解里使用这个空函数名作为切入点表达式的引用了
这样的切入点也可以在其他类中引用,其作用范围受权限修饰符的限制

## 通知顺序
当有多个切面的切入点都匹配到了目标方法，目标方法运行时，多个通知方法都会被执行。
不同切面类中，默认按照切面类的类名字母排序：
- 目标方法前的通知方法：字母排名靠前的先执行
- 目标方法后的通知方法：字母排名靠前的后执际

用@Order(数字）加在切面类上来控制顺序
- 目标方法前的通知方法：数字小的先执行
- 目标方法后的通知方法：数字小的后执行

## 切入点表达式

切入点表达式：描述切入点方法的一种表达式
作用：主要用来决定项目中的哪些方法需要加入通知

常见形式：
1. execution(...) : 根据方法的签名来匹配
2. @annotation(...) : 根据注解匹配

### execution
execution主要根据方法的返回值、包名、类名、方法名、方法参数等信息来匹配，语法为：
```java
execution(访问修饰符? 返回值 包名.类名.?方法名(方法参数) throws 异常?)
```
其中带?的表示可以省略的部分
异常：是指方法上声明抛出的异常，不是实际抛出的异常

**可以使用通配符描述切入点**

- *  : 单个独立的任意符号，可以通配任意返回值、包名、类名、方法名、任意类型的一个参数，也可以通配包、类、方法名的一部分
- **  : 多个连续的任意符号，可以通配任意层级的包，或任意类型、任意个数的参数

书写建议
- 所有业务方法名在命名时尽量规范，方便切入点表达式快速匹配。如：查询类方法都是find 开头，更新类方法都是update开头。
- 描述切入点方法通常基于接口描述，而不是直接描述实现类，增强拓展性。
- 在满足业务需要的前提下，尽量缩小切入点的匹配范围。如：包名匹配尽量不使用.，使用＊匹配单个包。

### @annotation
@annotation切入点表达式，用于匹配标识有特定注解的方法

### 连接点
在Spring中用JoinPoint抽象了连接点，用它可以获得方法执行时的相关信息，如目标类名、方法名、方法参数等。

对于@Around通知，获取连接点信息只能使用ProceedingJoinPoint
对于其他四种通知，获取连接点信息只能使用JoinPoint，它是ProceedingJoinPoint的父类型
