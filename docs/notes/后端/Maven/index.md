---
title: 1 概述
createTime: 2025/06/18 20:59:26
permalink: /back/maven/
---
### 命令

需要在有pom.xml文件夹下对该文件执行
```shell
mvn compile    #编译,生成的字节码放在target文件夹中
mvn clean      #清理编译出的字节码文件,就是清理target文件夹
mvn test       #测试
mvn package    #打包(打包前会先自动执行编译和测试)
mvn install    #将打包的内容安装到本地仓库(会先自动执行打包)
```

#### maven插件创建工程

自动创建maven结构的工程
```shell
mvn archetype:generate
	-DgroupId={project-packaging}
	-DartifactId={project-name}
	-DarchetypeArtifactId=maven-archetype-quickstart
	-DinteractiveMode=false
```

##### 自动创建java工程
```shell
 mvn archetype:generate -DgroupId=com.itheima -DartifactId=java-projectDarchetypeArtifactId=maven-archetype-quickstart -Dversion=0.0.1-snapshotDinteractiveMode=false
```

##### 自动创建web工程
```shell
mvn archetype:generate -DgroupId=com.itheima -DartifactId=web-projectDarchetypeArtifactId=maven-archetype-webapp-Dversion=0.0.1-snapshotDinteractiveMode=false
```

## maven的文件结构

### java工程

```
my-java-project/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── HelloWorld.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── HelloWorldTest.java
│       └── resources/
│           └── test.properties
```

### web工程
```
my-web-project/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── example/
│   │   │           └── HelloServlet.java
│   │   ├── resources/
│   │   │   └── log4j.properties
│   │   └── webapp/
│   │       ├── WEB-INF/
│   │       │   ├── web.xml
│   │       │   ├── classes/
│   │       │   └── lib/
│   │       └── index.html
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── example/
│       │           └── HelloServletTest.java
│       └── resources/
│           └── test.properties
```

pom.xml配置
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/poM/4.0.0"
    xmlns:xsi="http://www.w3.org/2001/xMLSchema-instance"
    xsi:schemaLoaction="http://maven.apache.org/POM/4.0.0 http://maven.apache.orgmaven-4.0.0.xsd">
    <!-- 指定pom版本-->
    <modelVersion>4.0.0</modelVersion>

    <!-- 组织id-->
    <groupId>com.itheima</groupId>
    <!-- 项目id-->
    <artifactId>maven</artifactId>
    <!-- 项目版本-->
    <version>1.0</version>
    <!-- 打包方式-->
    <packaging>jar</packaging>

    <!-- 当前项目的依赖项 -->
    <dependencies>
        <!-- 具体依赖项-->
        <dependency>
            <groupId>junit</groupId>
            <artifactId>junit</artifactId>
            <version>4.12</version>
        </dependency>
    </dependencies>

    <!--构建-->
    <build>
        <!--表明要设置插件-->
        <plugins>
            <!--具体的插件配置-->
            <plugin>
                <groupId>org.apache.tomcat.maven</groupId>
                <artifactId>tomcat7-maven-plugin</artifactId>
                <version>2.1</version>
                <configuration>
	                <!--对插件的设置-->
		            <port>80</port>
		            <path>/</path>
	            </configuration>
            </plugin>
        </plugins>
    </build>

</project>
```

#### 依赖传递
如果在一个自己做的项目中需要用到另一个自己做的项目,可以向引入依赖的方式引入自己的被依赖的项目

项目project02中导入项目project01的依赖
```xml
<dependency>
	<groupId>com.itheima</groupId>
	<artifactId>project01</artifactId>
	<version>1.0-SNAPSHOT</version>
</dependency>
```
如果在project01中有依赖,那么project02也会导入project01的依赖

##### 依赖传递冲突问题

- 路径优先：当依赖中出现相同的资源时，层级越深，优先级越低，层级越浅，优先级越高
- 声明优先：当资源在相同层级被依赖时，配置顺序靠前的覆盖配置顺序靠后的
- 特殊优先：当同级配置了相同资源的不同版本，后配置的覆盖先配置的
![](attachments/Pasted%20image%2020250711212209.png)

#### 可选依赖
如果一个项目导入另一个项目作为依赖时,被依赖的项目不想被知道自己使用的依赖可以在自己的pom.xml中对需要隐藏的依赖添加`<optional>true</optional>
如project02导入project01
project01中的pom.xml
```xml
    <dependency>
        <groupId>junit</groupId>
        <artifactId>junit</artifactId>
        <version>4.12</version>
        <optional>true</optional>
    </dependency>
```

#### 排除依赖
如果一个项目在导入另一个项目时不需要依赖项目的依赖可以将不需要的依赖排除,排除的依赖不需要写版本号
如project02需要导入project01
在project02的pom.xml文件中修改
```xml
    <dependency>
        <groupId>com.itheima</groupId>
        <artifactId>project03</artifactId>
        <version>1.0-SNAPSHOT</version>
        <exclusions>
            <exclusion>
                <groupId>log4j</groupId>
                <artifactId>log4j</artifactId>
            </exclusion>
        </exclusions>
    </dependency>
```

### 依赖范围
设置依赖使用的范围,需要在指定的依赖中设置scope标签
依赖的jar默认情况可以在任何地方使用，可以通过scope标签设定其作用范围

作用范围:
- 主程序范围有效(main文件夹范围内）
- 测试程序范围有效(test文件夹范围内）
- 是否参与打包(package指令范围内)

| scope        | 主代码 | 测试代码 | 打包  | 范例           |
| ------------ | --- | ---- | --- | ------------ |
| compile (默认) | y   | y    | y   | log4j        |
| test         |     | y    |     | junit        |
| provided     | y   | y    |     | servlet-apir |
| untime       |     |      | y   | jdbc         |

#### 依赖范围传递性
带有依赖范围的资源在进行传递时，作用范围将受到影响

横行表示直接依赖设置
竖列表示间接依赖设置

|          | compile | test | provided | runtime |
| -------- | ------- | ---- | -------- | ------- |
| compile  | compile | test | provided | runtime |
| test     |         |      |          |         |
| provided |         |      |          |         |
| runtime  | runtime | test | provided | runtime |
