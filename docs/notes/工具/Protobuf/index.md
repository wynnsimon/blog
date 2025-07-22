---
title: 1 Protobuf
createTime: 2025/06/22 10:59:04
permalink: /tools/protobuf/
---
1. 确定数据格式，数据可简单可复杂，比如：
1. 单一数据类型
```c
int number;
```


2. 复合数据类型
```c
struct Person{
    int id;
    string name;
    string sex;	
    int age;
}
```

2. 创建一个后缀为`.proto`的新文件, 文件名随意指定

3. 根据protobuf的语法, 编辑.proto文件

4. 使用 protoc 命令将 .proto 文件转化为相应的 C++ 文件

源文件: xxx.pb.cc –> xxx对应的名字和 .proto文件名相同
头文件: xxx.pb.h –> xxx对应的名字和 .proto文件名相同
5. 需要将生成的c++文件添加到项目中, 通过文件中提供的类 API 实现数据的序列化/反序列化

**protobuf中的数据类型 和 C++ 数据类型对照表:**

| Protobuf类型 | C++类型              | 备注                                       |
| ---------- | ------------------ | ---------------------------------------- |
| double     | double             | 64位浮点数                                   |
| float      | float              | 32位浮点数                                   |
| int32      | int                | 32位整数                                    |
| int64      | long               | 64位整数                                    |
| uint32     | unsigned int       | 32位无符号整数                                 |
| uint64     | unsigned long      | 64位无符号整数                                 |
| sint32     | signed int         | 32位整数，处理负数效率比int32更高                     |
| sint64     | signed long        | 64位整数，处理负数效率比int64更高                     |
| fixed32    | unsigned int(32位)  | 总是4个字节。如果数值总是比总是比228大的话，这个类型会比uint32高效。  |
| fixed64    | unsigned long(64位) | 总是8个字节。如果数值总是比总是比256大的话，这个类型会比uint64高效。  |
| sfixed32   | int (32位)          | 总是4个字节                                   |
| sfixed64   | long (64位)         | 总是8个字节                                   |
| bool       | bool               | 布尔类型                                     |
| string     | string             | 一个字符串必须是UTF-8编码或者7-bit ASCII编码的文本        |
| bytes      | string             | 处理多字节的语言字符、如中文, 建议protobuf中字符型类型使用 bytes |
| enum       | enum               | 枚举                                       |
| message    | object of class    | 自定义的消息类型                                 |
string如果只有英文可以使用string,如果有其他字符如中文使用bytes

使用`protoc`编译proto文件,如:编译当前文件夹中的person.proto文件,生成的目录是当前文件夹:`protoc ./person.proto --cpp_out=./`
`--cpp_out`指定生成的c++文件的存储路径参数,linux命令中的参数如果是字母的话一般都是一个-,参数是一个单词的话就是两个-

#### 指定使用的protobuf版本
```properties
syntax="proto3";
```

#### 在一个protobuf文件中导入其他的protobuf文件
```java
import "Address.proto";
```

#### 包
相当于c++中的命名空间
在一个proto文件中声明它的命名空间
```cpp
package bao1;
```
在另一个proto文件中import引入了这个proto文件后就需要使用包名取出其中的变量了
```cpp
bao1.Person p;
```

包在C++中对应的就是命名空间了
在C++中使用同名的命名空间就能取出包中的内容

#### 数组
如果protobuf类中要使用数组,需要使用`repeated`关键字修饰
```cpp
reperted bytes name;
```
申请的是动态数组,使用一块就申请一块内存

**示例:**
```proto
message Person{
	repeated bytes name;
}
```

```cpp
Person p;
p.set_name(0,"pink");    //设置数组中0号元素的值
p.add_name("baga");      //在数组中添加元素
```

#### 枚举值
在protobuf中枚举类型的值必须指定出来,且第一个枚举值必须为0

### protobuf保留内容

**保留编号**

编号从1到2^29-1其中19000~19999之间的编号不能使用,这是protobuf保留的

**保留字段**
- singular : 使用这个关键字修饰的值只能是0个或者1个,所有声明的变量在不加修饰字的情况下都默认使用singular修饰(0个表示使用null作为值)
- repeated : 表示这个变量的值有多个,使用数组储存,转换成相应的文件后存储到对应语言的数组中,使用get或set方法并在变量名后加list
```proto
message Result{
    string content=1;
    repeated string stutas=2;//等价于java List Protobuf getStutasList()-->List
}
```

### 消息嵌套

```proto
message SearchResponse{
	message Result{
		string url=1;
		string title=2;
	}
	string x=1;
	int32 y=2;
	Result p=3;
}

# 外部使用消息内部嵌套的消息
SearchResponse.Result z=3;
```

### oneof
oneof其中之一,此关键字声明的消息,其实例化后取值只能是其中定义的属性之一
```proto
oneof test_oneof{
	string name=1;
	int32 age=2;
}

# t的属性只能是name或者age其中之一,取值视传参而定
test_oneof t;
```

#### 服务
使用service关键字声明
在服务中就可以定义若干个服务的风法
方法名使用rpc关键字声明
方法的参数就是定义的消息体,参数只需要定义形参的类型即可不需要变量名
returns : 返回值
```proto
service HelloService {
  rpc Hello(HelloRequest) returns (HelloResponse){}
}
```
在protobuf中只是定义了服务的接口并没有给出实现,实现需要在编程语言中自行实现

# 序列化与反序列化
生成的类提供的公共成员函数有如下规律：
- 清空(初始化) 私有成员的值: `clear_变量名()`
- 获取类私有成员的值: `变量名()`
- 给私有成员进行值的设置: `set_变量名(参数)`
- 得到类私有成员的`地址`, 通过这块地址`读/写当前私有成员变量的值`: `mutable_变量名()`
- 如果这个变量是数组类型:
    数组中元素的个数: `变量名_size()`
    添加一块内存, 存储新的元素数据: `add_变量名() 、add_变量名(参数)`

## 序列化
序列化是指将数据结构或对象转换为可以在储存或传输中使用的二进制格式的过程。在计算机科学中，序列化通常用于将内存中的对象持久化存储到磁盘上，或者在分布式系统中进行数据传输和通信。
```cpp
// 头文件目录: google\protobuf\message_lite.h  
// --- 将序列化的数据 数据保存到内存中  
// 将类对象中的数据序列化为字符串, c++ 风格的字符串, 参数是一个传出参数  
bool SerializeToString(std::string* output) const;  
// 将类对象中的数据序列化为字符串, c 风格的字符串, 参数 data 是一个传出参数  
bool SerializeToArray(void* data, int size) const;  
  
// ------ 写磁盘文件, 只需要调用这个函数, 数据自动被写入到磁盘文件中  
// -- 需要提供流对象/文件描述符关联一个磁盘文件  
// 将数据序列化写入到磁盘文件中, c++ 风格  
// ostream 子类 ofstream -> 写文件  
bool SerializeToOstream(std::ostream* output) const;  
// 将数据序列化写入到磁盘文件中, c 风格  
bool SerializeToFileDescriptor(int file_descriptor) const;
```
使用这些序列化函数得到的数据依旧是二进制的,即使接收他们的变量是c基础变量类型,若直接打印还是乱码,因此还需要进行反序列化

## 反序列化

反序列化是指将序列化后的二进制数据重新转换为原始的数据结构或对象的过程。通过反序列化，我们可以将之前序列化的数据重新还原为其原始的形式，以便进行数据的读取、操作和处理。

反序列化将传入的数据存到调用反序列化的对象里面
反序列化的对象不呢和序列化的对象是同一个,否则会覆盖其中的数据
```cpp
// 头文件目录: google\protobuf\message_lite.h  
bool ParseFromString(const std::string& data) ;  
bool ParseFromArray(const void* data, int size);  
// istream -> 子类 ifstream -> 读操作  
// wo ri  
// w->写 o: ofstream , r->读 i: ifstream  
bool ParseFromIstream(std::istream* input);  
bool ParseFromFileDescriptor(int file_descriptor);
```

### 编译
```shell
protoc --java_out=/xxx/xxx /xxx/xxx/xx.proto
```
将.proto文件编译成对应语言的文件
`--java`就是编译成java,`--go`就是编译成go语言的形式等号后面指定的是生成的位置
`/xxx/xxx/xx.proto`是要编译的文件及其路径

# Java使用

### java相关语法
```proto
#后续protobuf生成的java代码一个源文件还是多个源文件xx.java
//java中一个文件可以包含一个类也可以包含多个类,通过控制这个选型的布尔值选择是生成单文件还是多文件
option java_multiple_files = false;

#指定protobuf生成的类放置在哪个包中
option java_package="com.suns";

#指定的protobuf生成的外部类的名字（管理内部类【内部类才是真正开发使用】）option java_outer_classname ="UserServce";
```

protobuf中设置的消息体通常是被转换为java的内部类放在一个总的外部类中,因此在使用的时候通常是以外部类.内部类的方式

### 通用语法

**逻辑包**
所有编程语言都可以使用
对于protobuf对于文件内容的管理
```proto
package xxx;
```
java通常不用,java使用`option java_package="com.suns`选项

在实战中并不经常使用protoc命令编译,而是使用maven插件编译
需要导入依赖
```xml
  <dependencies>

    <dependency>
      <groupId>io.grpc</groupId>
      <artifactId>grpc-netty-shaded</artifactId>
      <version>1.52.1</version>
      <scope>runtime</scope>
    </dependency>
    <dependency>
      <groupId>io.grpc</groupId>
      <artifactId>grpc-protobuf</artifactId>
      <version>1.70.0</version>
    </dependency>
    <dependency>
      <groupId>io.grpc</groupId>
      <artifactId>grpc-stub</artifactId>
      <version>1.70.0</version>
    </dependency>
    <dependency>
      <groupId>org.apache.tomcat</groupId>
      <artifactId>annotations-api</artifactId>
      <version>6.0.53</version>
      <scope>provided</scope>
    </dependency>

  </dependencies>

  <build>
    <extensions>
      <extension>
        <groupId>kr.motd.maven</groupId>
        <artifactId>os-maven-plugin</artifactId>
        <version>1.7.0</version>
      </extension>
    </extensions>

    <plugins>
      <plugin>
        <groupId>org.xolstice.maven.plugins</groupId>
        <artifactId>protobuf-maven-plugin</artifactId>
        <version>0.6.1</version>
        <configuration>
          <protocArtifact>
            com.google.protobuf:protoc:3.21.12:exe:${os.detected.classifier}
          </protocArtifact>
          <pluginId>grpc-java</pluginId>
          <pluginArtifact>
            io.grpc:protoc-gen-grpc-java:1.52.1:exe:${os.detected.classifier}
          </pluginArtifact>
          <!-- 生成中生成的java文件存放路径,默认是在target中的,更改为代码所在文件夹中 -->
          <outputDirectory>${basedir}/src/main/java</outputDirectory>
	        <!-- 是否清除outputDirectory,默认true是追加 -->
          <clearOutputDirectory>false</clearOutputDirectory>
        </configuration>
        <executions>
          <execution>
            <goals>
              <goal>compile</goal>
              <goal>compile-custom</goal>
            </goals>
          </execution>
        </executions>
      </plugin>
    </plugins>
  </build>
```
插件可使用mave命令自动编译proto

# 生成文件内容

## service
- ImplBase : 对应真正的服务接口,开发时候继承这个类并覆盖其中的业务方法
- BlockingStub : Stub结尾的类对应的就是客户端的代理对象,区别是网络通信方式不同,blockingstub是阻塞处理
- FutureStub : 异步处理
