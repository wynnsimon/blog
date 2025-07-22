---
title: 概述
createTime: 2025/06/18 20:59:24
permalink: /back/log4j2/
---
在项目开发中，日志十分的重要，不管是记录运行情况还是定位线上问题，都离不开对日志的分析。日志记录了系统行为的时间、地点、状态等相关信息，能够帮助我们了解并监控系统状态，在发生错误或者接近某种危险状态时能够及时提醒我们处理，同时在系统产生问题时，能够帮助我们快速的定位、诊断并解决问题。

ApacheLog4j2是一个开源的日志记录组件，使用非常的广泛。在工程中以易用方便代替了System.out等打印语句，它是JAVA下最流行的日志输入工具。

Log4j2主要由几个重要的组件构成：
1. 日志信息的优先级，日志信息的优先级从高到低有 : TRACE < DEBUG < INFO < WARN < ERROR < FATAL
- TRACE：追踪，是最低的日志级别，相当于追踪程序的执行
- DEBUG：调试，一般在开发中，都将其设置为最低的日志级别
- INFO：信息，输出重要的信息，使用较多I
- WARN：警告，输出警告的信息
- ERROR：错误，输出错误信息
- FATAL：严重错误
这些级别分别用来指定这条日志信息的重要程度；级别高的会自动屏蔽级别低的日志，也就是说，设置了WARN的日志，则INFO、DEBUG的日志级别的日志不会显示
2. 日志信息的输出目的地，日志信息的输出目的地指定了日志将打印到控制台还是文件中；
3. 日志信息的输出格式，而输出格式则控制了日志信息的显示内容。

### 引入依赖
```xml
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.24.1</version>
        </dependency>

        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-slf4j-impl</artifactId>
            <version>2.24.1</version>
        </dependency>
```

### 日志配置文件
在类的根路径下提供log4j2.xml配置文件（文件名固定为：log4j2.xml，文件必须放到类根路径下。）
```xml
<?xml version="1.0" encoding="UTF-8"?>  
<configuration>  
    <loggers>  
        <!--  
            level指定日志级别，从低到高的优先级：  
                TRACE < DEBUG < INFO < WARN < ERROR < FATAL                trace：追踪，是最低的日志级别，相当于追踪程序的执行  
                debug：调试，一般在开发中，都将其设置为最低的日志级别  
                info：信息，输出重要的信息，使用较多  
                warn：警告，输出警告的信息  
                error：错误，输出错误信息  
                fatal：严重错误  
        -->  
        <root level="DEBUG">  
            <appender-ref ref="spring6log" />  
            <appender-ref ref="RollingFile" />  
            <appender-ref ref="log" />  
        </root>  
    </loggers>  
  
    <appenders>        <!--输出日志信息到控制台-->  
        <console name="spring6log" target="SYSTEM_OUT">  
            <!--控制日志输出的格式-->  
            <PatternLayout  
                pattern="%d{yyyy-MM-dd HH:mm:ss SSS} [%t] %-3level %logger{1024} - %msg%n" />  
        </console>  
  
        <!--文件会打印出所有信息，这个log每次运行程序会自动清空，由append属性决定，适合临时测试用-->  
        <File name="log" fileName="spring6_log/test.log" append="false">  
            <PatternLayout pattern="%d{HH:mm:ss.SSS} %-5level %class{36} %L %M - %msg%xEx%n" />  
        </File>  
  
        <!-- 这个会打印出所有的信息，  
            每次大小超过size，  
            则这size大小的日志会自动存入按年份-月份建立的文件夹下面并进行压缩，  
            作为存档-->  
        <RollingFile name="RollingFile" fileName="spring6_log/app.log"  
            filePattern="log/$${date:yyyy-MM}/app-%d{MM-dd-yyyy}-%i.log.gz">  
            <PatternLayout  
                pattern="%d{yyyy-MM-dd 'at' HH:mm:ss z} %-5level %class{36} %L %M - %msg%xEx%n" />  
            <SizeBasedTriggeringPolicy size="50MB" />  
            <!-- DefaultRolloverStrategy属性如不设置，  
            则默认为最多同一文件夹下7个文件，这里设置了20 -->  
            <DefaultRolloverStrategy max="20" />  
        </RollingFile>  
    </appenders>  
</configuration>
```

- Configuration : 根标签
- root : 日志总体设置,通过level属性设置级别
	- appender-ref :  引入后面的配置,ref属性用于引入配置的name
- console : 控制台输出,target指定日志输入的地方
	- PatternLayout : 配置日志的格式通过pattern属性
- File : 日志输入到文件,fileName指定日志写入的文件及路径
- RollingFile : 打印所有信息
	- SizeBasedTriggeringPolicy : 指定文件的大小,超过此大小会压缩
- DefaultRolloverStrategy : 更改同一文件夹下默认日志文件个数,默认为7个
