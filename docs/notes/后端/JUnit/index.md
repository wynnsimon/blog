---
title: 概述
createTime: 2025/06/18 20:59:22
permalink: /back/junit/
---
单元测试:
- 单元测试是针对最小的功能单元编写测试代码
- Java程序最小的功能单元是方法
- 单元测试就是针对单个Java方法的测试

**JUnit的设计:**
- TestCase：一个TestCase表示一个测试
- TestSuite：一个TestSuite包含一组TestCase，表示一组测试
- TestFixture：一个TestFixture表示一个测试环境
- TestResult：用于收集测试结果
- TestRunner：用于运行测试
- TestListener：用于监听测试过程，收集测试数据
- Assert：用于断言测试结果是否正确

### @BeforeEach和AfterEach注解

`@BeforeEach` 和 `@AfterEach` 注解用于标记方法，这些方法会在每个测试方法执行前后自动调用。

- **@BeforeAll**：
    在所有测试方法执行之前仅运行一次。
    常用于一次性初始化资源，这些资源在整个测试类中都会被多个测试方法共享。
    需要注意的是，`@BeforeAll` 方法必须是静态的（static）。
- **@AfterAll**：
    在所有测试方法执行之后仅运行一次。
    常用于一次性清理资源，确保测试类执行完毕后资源被正确释放。
    同样，`@AfterAll` 方法也必须是静态的（static）。
- **@BeforeEach**：
    在每个测试方法执行之前运行。
    常用于初始化每个测试方法所需的资源或设置测试环境。
    确保每个测试方法都在一个干净的状态下开始。
- **@AfterEach**：
    在每个测试方法执行之后运行。
    常用于清理每个测试方法使用的资源或恢复测试环境。
    确保每个测试方法都不会影响其他测试方法的执行。

如果测试的方法与spring没有关系可以将spring的测试注解注释掉,这样在测试时就不会运行spring的环境可以更快速完成测试

