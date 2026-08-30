# lOC（Inversion of Control）控制反转
强调的是原来在程序中创建 Bean 的权利反转给第三方。

原本的程序在使用 bean 时就是直接创建并使用
IOC 思想中就是将 bean 的控制权交给第三方，程序在使用的时候向第三方获取 bean


# DI（Dependency Injection）依赖注入
强调的 Bean 之间关系，这种关系第三方负责去设置。

在一个 bean 中包含了另一个 bean 的情况时，对于原本的思想是自己获取到 bean 1，然后再获取到 bean 2 并将 bean 2 注入到 bean 1
但再 DI 思想中都统一交给第三方去维护，程序在运行时直接向第三方获取包含 bean 2 的 bean 1


# AOP（Aspect Oriented Programming）面向切面编程
功能的横向抽取，主要的实现方式就是 Proxy

OOP 主要是纵向的设计，而 AOP 主要是横向的设计，主要功能是对类的功能的增强










