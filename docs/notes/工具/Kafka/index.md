---
title: 1 概述
createTime: 2025/06/22 10:58:26
permalink: /tools/kafka/
---

kafka版本: kafka 2.12-2.4.1,由于kafka是使用scala语言开发的,第一个版本号是scala语言版本号,第二个才是kafka版本号

## 消息队列中间件

消息队列中间件就是用来存储消息的软件（组件）。举个例子来理解，为了分析网站的用户行为我们需要记录用户的访问日志。这些一条条的日志，可以看成是一条条的消息，我们可以将它们保存到消息队列中。将来有一些应用程序需要处理这些日志，就可以随时将这些消息取出来处理。

目前市面上的消息队列有很多，例如：Kafka、RabbitMQ、ActiveMQ、RocketMQ、ZeroMQ等。

## 应用场景
- 异步处理
	可以将一些比较耗时的操作放在其他系统中，通过消息队列将需要进行处理的消息进行存储，其他系统可以消费消息队列中的数据
	比较常见的：发送短信验证码、发送邮件
- 系统解耦
	原先一个微服务是通过接口（HTTP）调用另一个微服务，这时候耦合很严重，只要接口发生变化就会导致系统不可用
	使用消息队列可以将系统进行解耦合，现在第一个微服务可以将消息放入到消息队列中，另一个微服务可以从消息队列中把消息取出来进行处理。进行系统解耦
- 流量削峰
	因为消息队列是低延迟、高可靠、高吞吐的，可以应对大量并发
- 日志处理
	可以使用消息队列作为临时存储，或者一种通信管道

# 启动

要先启动zooleeper后才能启动kafka
启动命令不能太长否则会报错,可以缩短路径

启动zookeeper
```shell
zookeeper-server-start.bat ..\..\config\zookeeper.properties
```
默认端口：2181

启动kafka
```shell
kafka-server-start.bat ..\..\config\server.properties
```
默认端口：9092

# 基础操作
在kafka中存放消息需要有一个主题(Topic)相当于一块内存名称

创建名为test的主题
```shell
.\kafka-topics.bat --bootstrap-server localhost:9092 --topic test --create
```

查看目前Kafka中的主题
```shell
.\kafka-topics.bat --bootstrap-server localhost:9092 --list 
```

查看指定主题的详细信息
```shell
.\kafka-topics.bat --bootstrap-server localhost:9092 --topic test --describe
```

修改主题的信息
需要使用alter选项
如:修改test主题的partitions数量
```shell
.\kafka-topics.bat --bootstrap-server localhost:9092 --topic test --alter --partitions 2
```

删除指定主题
在windows环境下可能会出错,因为权限问题
```shell
.\kafka-topics.bat --bootstrap-server localhost:9092 --topic test --delete  
```

使用Kafka内置的测试程序，生产一些消息到Kafka的test主题中。
```shell
bin/kafka-console-producer.sh --broker-list node1.itcast.cn:9092 --topic test
```

消费test主题中的消息。
```shell
bin/kafka-console-consumer.sh--bootstrap-servernode1.itcast.cn:9092--topictest --from-beginning
```

# JavaAPI
导入坐标
```xml
    <!--kafka客户端工具-->
    <dependency>
      <groupId>org.apache.kafka</groupId>
      <artifactId>kafka-clients</artifactId>
      <version>3.8.1</version>
    </dependency>
```

# 使用

## 生产者-消费者模型

### 管理者
基于分层解耦的概念,生产者和消费者只需要专注于发送消息和接收消息即可,对于消息队列属性的控制如:创建主题,管理分区,管理备份等都是由管理者来控制

1. 配置管理者
```java
    Map<String, Object> configMap = new HashMap<>();
    configMap.put(AdminClientConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
```

2. 根据配置创建管理者
```java
    Admin admin=Admin.create(configMap);
```

3. 配置主题
第一个参数表示主题的名称：字母，数字，点，下划线，中横线。
第二个参数表示主题分区的数量：int，
第三个参数表示主题分区副本的（因子）数量：short，
```java
    NewTopic topic1=new NewTopic("test1", 1, (short)1);
    NewTopic topic2=new NewTopic("test2", 2, (short)2);
```

4. 根据配置创建主题
```java
    CreateTopicsResult result = admin.createTopics(Arrays.asList(topic1, topic2));
```

5. 关闭管理者
```java
    admin.close();
```

### 生产者
1. 创建配置类
配置是以键值对形式存储的,且有多个属性的配置,因此使用map存储
```java
Map<String, Object> configMap = new HashMap<>();
configMap.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG,"localhost:9092");
configMap.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG,StringSerializer.class.getName());
configMap.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,StringSerializer.class.getName());
```
kafka提供有枚举类用于配置
在配置键值的时候需要指定序列化器,获取序列化器的名称来传入

2. 创建生产者对象
泛型需要指定键值的类型
```java
KafkaProducer<String, String> producer = new KafkaProducer<String, String>(configMap);
```

3. 创建数据
指定发送到的消息主题是test,键为key,值为value
```java
ProducerRecord<String,String> record=new ProducerRecord<String,String>("test","key","value");
```

4. 发送数据
```java
producer.send(record);
```

5. 关闭生产者对象
```java
producer.close();
```

### 消费者

1. 配置生产者对象
对于生产者还还需要添加一个订阅组
```java
Map<String, String> configMap = new HashMap<>();
configMap.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,"localhost:9092");
configMap.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,StringDeserializer.class.getName());
configMap.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,StringDeserializer.class.getName());
configMap.put(ConsumerConfig.GROUP_ID_CONFIG, "itcast"); 
```

2. 创建消费者对象并订阅指定主题的消息
```java
KafkaConsumer<String,String> consumer = new KafkaConsumer(configMap);
consumer.subscribe(Collections.singletonList("test"));
```

3. 拉取数据
poll是拉取数据,设置一个超时时间
```java
ConsumerRecords<String, String> records = consumer.poll(100);
```

4. 处理数据
由于拉取的数据是一个数组,可能有多条数据,因此需要遍历处理
```java
for (ConsumerRecord<String, String> data: records) {
    System.out.println(data.value());
}
```

5. 关闭消费者
```java
consumer.close();
```