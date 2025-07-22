---
title: 6 QT套接字
createTime: 2025/06/18 20:54:26
permalink: /cpp/qt/6/
---
在标准C++没有提供专门用于套接字通信的类，所以只能使用操作系统提供的基于C的API函数，基于这些C的API函数我们也可以封装自己的C++类
**需要导入network模块**

qt提供了用于套接字通信的类（TCP、UDP）

使用Qt提供的类进行基于TCP的套接字通信需要用到两个类：
这些类的父类和qt中的文件类QFile是一样的都是QIOdevice

- QTcpServer：服务器类，用于监听客户端连接以及和客户端建立连接。
- QTcpSocket：通信的套接字类，客户端、服务器端都需要使用。

这两个套接字通信类都属于网络模块`network`。

# # QTcpServer
用于监听客户端连接以及和客户端建立连接

### 公共成员函数

#### 构造函数
```cpp
QTcpServer::QTcpServer(QObject *parent = Q_NULLPTR);
```

#### 设置监听


**绑定端口并设置监听**
- address：通过类`QHostAddress`可以封装`IPv4`、`IPv6`格式的IP地址，
	`QHostAddress::Any`表示自动绑定任意ip地址
	`AnyIPv6`: 任意ipv6地址
	`AnyIPv4`: 任意的ipv4地址
	`Broadcast`: 广播地址
	`LocalHostIPv6`: 本地的ipv6地址
	`LocalHopst`: 本地的ip地址127.0.0.1
	`Null`: 空地址
- port：如果指定为0表示随机绑定一个可用端口。
- 返回值：绑定成功返回true，失败返回false
```cpp
bool QTcpServer::listen(const QHostAddress &address = QHostAddress::Any, quint16 port = 0);
```

**判断监听**

判断当前对象是否在监听, 是返回true，没有监听返回false  
```cpp
bool QTcpServer::isListening() const;  
```

如果当前对象正在监听返回监听的服务器地址信息, 否则返回 QHostAddress::Null  
```cpp
QHostAddress QTcpServer::serverAddress() const;  
```

如果服务器正在侦听连接，则返回服务器的端口; 否则返回0  
```cpp
quint16 QTcpServer::serverPort() const
```

#### 获取连接
得到和客户端建立连接之后用于通信的`QTcpSocket`套接字对象
`QTcpSocket`是`QTcpServer`的一个子对象

```cpp
QTcpSocket *QTcpServer::nextPendingConnection();
```
指向的是一块堆内存,`QTcpServer`对象析构的时候会自动析构这个子对象，也可自己手动析构，建议用完之后自己手动析构这个通信的`QTcpSocket`对象。

#### 
阻塞等待客户端发起的连接请求，不推荐在单线程程序中使用，建议使用非阻塞方式处理新连接，使用信号 `newConnection()` 。
- msec：指定阻塞的最大时长，单位为毫秒（ms）
- timeout：传出参数，如果操作超时timeout为true，没有超时timeout为false
```cpp
bool QTcpServer::waitForNewConnection(int msec = 0, bool *timedOut = Q_NULLPTR);
```

### 信号槽

socketError参数描述了发生的错误相关的信息。
当接受新连接导致错误时，将发射该信号。
```cpp
[signal] void QTcpServer::acceptError(QAbstractSocket::SocketError socketError);
```

每次有新连接可用时都会发出 newConnection() 信号。
```cpp
[signal] void QTcpServer::newConnection();
```

# QTcpSocket

### 构造函数
```cpp
QTcpSocket::QTcpSocket(QObject *parent = Q_NULLPTR);
```

### 连接服务器
需要指定服务器端绑定的IP和端口信息。
```cpp
[virtual] void QAbstractSocket::connectToHost(const QString &hostName, quint16 port, OpenMode openMode = ReadWrite, NetworkLayerProtocol protocol = AnyIPProtocol);  
  
[virtual] void QAbstractSocket::connectToHost(const QHostAddress &address, quint16 port, OpenMode openMode = ReadWrite);
```
在Qt中不管调用读操作函数接收数据，还是调用写函数发送数据，操作的对象都是本地的由Qt框架维护的一块内存。因此，调用了发送函数数据不一定会马上被发送到网络中，调用了接收函数也不是直接从网络中接收数据

#### 接收数据
指定可接收的最大字节数 maxSize 的数据到指针 data 指向的内存中  
```cpp
qint64 QIODevice::read(char *data, qint64 maxSize);  
```
指定可接收的最大字节数 maxSize，返回接收的字符串  
```cpp
QByteArray QIODevice::read(qint64 maxSize);  
```
将当前可用操作数据全部读出，通过返回值返回读出的字符串 
```cpp
QByteArray QIODevice::readAll();
```

#### 发送数据
发送指针 data 指向的内存中的 maxSize 个字节的数据 
```cpp
qint64 QIODevice::write(const char *data, qint64 maxSize);  
```
发送指针 data 指向的内存中的数据，字符串以 \0 作为结束标记  
```cpp
qint64 QIODevice::write(const char *data);  
```
发送参数指定的字符串  
```cpp
qint64 QIODevice::write(const QByteArray &byteArray);
```

### 信号槽
在使用`QTcpSocket`进行套接字通信的过程中，如果该类对象发射出`readyRead()`信号，说明对端发送的数据达到了，之后就可以调用 `read 函数`接收数据了。
```cpp
[signal] void QIODevice::readyRead();
```

调用`connectToHost()`函数并成功建立连接之后发出`connected()`信号。
```cpp
[signal] void QAbstractSocket::connected();
```

在套接字断开连接时发出`disconnected()`信号。
```cpp
[signal] void QAbstractSocket::disconnected();
```

### 通信流程

#### 服务器端
1. 创建套接字服务器`QTcpServer`对象
2. 通过`QTcpServer`对象设置监听，即：`QTcpServer::listen()`
3. 基于`QTcpServer::newConnection()`信号检测是否有新的客户端连接
4. 如果有新的客户端连接调用`QTcpSocket *QTcpServer::nextPendingConnection()`得到通信的套接字对象
5. 使用通信的套接字对象`QTcpSocket`和客户端进行通信

#### 客户端
1. 创建通信的套接字类`QTcpSocket`对象
2. 使用服务器端绑定的IP和端口连接服务器`QAbstractSocket::connectToHost()`
3. 使用`QTcpSocket`对象和服务器进行通信