---
title: 9 IO多路复用
createTime: 2025/06/15 13:33:30
permalink: /base/os/9/
---
常用于高并发服务器的实现, 多线程的程序需要不停的切换,当连接的客户端比较多时,上下文切换带来的代价非常高,使用io多路复用可以在单线程的情况下实现并发
IO多路转接也称为IO多路复用，它是一种网络通信的手段（机制），通过这种方式可以同时监测多个文件描述符并且这个过程是阻塞的，一旦检测到有文件描述符就绪（ 可以读数据或者可以写数据）程序的阻塞就会被解除，之后就可以基于这些（一个或多个）就绪的文件描述符进行通信了。通过这种方式在单线程/进程的场景下也可以在服务器端实现并发。常见的IO多路转接方式有：select、poll、epoll。

与多进程和多线程技术相比，I/O多路复用技术的最大优势是系统开销小，系统不必创建进程/线程，也不必维护这些进程/线程，从而大大减小了系统的开销。

epoll底层是一个红黑树, select和poll底层是线性表.
epoll效率更高, select是跨平台的,select连接上限是1024, 而poll和epoll没有连接限制
主要使用select和epoll
![](attachments/Pasted%20image%2020250711214325.png)
**多线程/多进程并发**
- 主线程/父进程：调用 accept()监测客户端连接请求
	如果没有新的客户端的连接请求，当前线程/进程会阻塞
	如果有新的客户端连接请求解除阻塞，建立连接
- 子线程/子进程：和建立连接的客户端通信
	调用 read() / recv() 接收客户端发送的通信数据，如果没有通信数据，当前线程/进程会阻塞，数据到达之后阻塞自动解除
	调用 write() / send() 给客户端发送数据，如果写缓冲区已满，当前线程/进程会阻塞，否则将待发送数据写入写缓冲区中
**IO多路转接并发**
使用IO多路转接函数委托内核检测服务器端所有的文件描述符（通信和监听两类），这个检测过程会导致进程/线程的阻塞，如果检测到已就绪的文件描述符阻塞解除，并将这些已就绪的文件描述符传出
根据类型对传出的所有已就绪文件描述符进行判断，并做出不同的处理
- 监听的文件描述符：和客户端建立连接
	此时调用accept()是不会导致程序阻塞的，因为监听的文件描述符是已就绪的（有新请求）
- 通信的文件描述符：调用通信函数和已建立连接的客户端通信
	调用 read() / recv() 不会阻塞程序，因为通信的文件描述符是就绪的，读缓冲区内已有数据
	调用 write() / send() 不会阻塞程序，因为通信的文件描述符是就绪的，写缓冲区不满，可以往里面写数据
对这些文件描述符继续进行下一轮的检测（循环往复。。。）

使用io多路复用检测到的集合中文件描述符有多个, 其中有1个用于监听的文件描述符和n个各个子线程进行通讯的文件描述符.

# select

> [!NOTE] Title
> 如果不知道nfds是什么可以指定1024,因为select可检测文件描述符个数最大就是1024,这和每个进程地址空间里边存储的文件描述符的个数是相同的.只要创建了进程,在这个进程内核区就有一个文件描述符表,这个文件描述符表默认是1024个文件描述符( 0~1023 ),只要在进程中要对文件描述符进行操作,每个文件描述符都在文件描述符表中对应的占用一个文件描述符

函数检测所有的文件描述符后就返回,或者到达指定的超时时长后没有检测完也返回.
- nfds：委托内核检测的这三个集合中==最大的文件描述符的值 + 1==
就是后面三个参数`readfds` ,`writefds` ,`exceptfds` 中的最大值
	内核需要线性遍历这些集合中的文件描述符，这个值是循环结束的条件
	在Window中这个参数是无效的，指定为-1即可
- readfds：文件描述符的集合, 内核只检测这个集合中文件描述符对应的读缓冲区
传出参数，读集合一般情况下都是需要检测的，这样才知道通过哪个文件描述符接收数据
- writefds：文件描述符的集合, 内核只检测这个集合中文件描述符对应的写缓冲区
传出参数，如果不需要使用这个参数可以指定为NULL
- exceptfds：文件描述符的集合, 内核检测集合中文件描述符是否有异常状态
传出参数，如果不需要使用这个参数可以指定为NULL
- timeout：超时时长，用来强制解除select()函数的阻塞的
NULL：函数检测不到就绪的文件描述符会一直阻塞。
等待固定时长（秒）：函数检测不到就绪的文件描述符，在指定时长之后强制解除阻塞，函数返回0
不等待：函数不会阻塞，直接将该参数对应的结构体初始化为0即可。
- return :  
大于0：成功，返回集合中已就绪的文件描述符的总个数
-1：函数调用失败
0：超时，没有检测到就绪的文件描述符

```c
struct timeval {
    time_t      tv_sec;         //毫秒
    suseconds_t tv_usec;        //微秒
};

int select(int nfds, fd_set* readfds, fd_set* writefds,fd_set* exceptfds, struct timeval* timeout);
```
fd_set是一个1024bit的类型,一个bit存一个文件描述符,对应1024个文件描述符, 占用128字节.
每个bit是0或1, 1表示此位置对应的文件描述符可用, 0表示不可用

```c
// 将文件描述符fd从set集合中删除 == 将fd对应的标志位设置为0        
void FD_CLR(int fd, fd_set *set);
// 判断文件描述符fd是否在set集合中 == 读一下fd对应的标志位到底是0还是1
int  FD_ISSET(int fd, fd_set *set);
// 将文件描述符fd添加到set集合中 == 将fd对应的标志位设置为1
void FD_SET(int fd, fd_set *set);
// 将set集合中, 所有文件文件描述符对应的标志位设置为0, 集合中没有添加任何文件描述符
void FD_ZERO(fd_set *set);
```

**流程**
```c
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <arpa/inet.h>

int main()
{
    // 1. 创建监听的fd
    int lfd = socket(AF_INET, SOCK_STREAM, 0);

    // 2. 绑定
    struct sockaddr_in addr;
    addr.sin_family = AF_INET;
    addr.sin_port = htons(9999);
    addr.sin_addr.s_addr = INADDR_ANY;
    bind(lfd, (struct sockaddr*)&addr, sizeof(addr));

    // 3. 设置监听
    listen(lfd, 128);

    // 将监听的fd的状态检测委托给内核检测
    int maxfd = lfd;
    // 初始化检测的读集合
    fd_set rdset;
    fd_set rdtemp;
    // 清零
    FD_ZERO(&rdset);
    // 将监听的lfd设置到检测的读集合中
    FD_SET(lfd, &rdset);
    // 通过select委托内核检测读集合中的文件描述符状态, 检测read缓冲区有没有数据
    // 如果有数据, select解除阻塞返回
    // 应该让内核持续检测
    while(1)
    {
        // 默认阻塞
        // rdset 中是委托内核检测的所有的文件描述符
        rdtemp = rdset;
        int num = select(maxfd+1, &rdtemp, NULL, NULL, NULL);
        // rdset中的数据被内核改写了, 只保留了发生变化的文件描述的标志位上的1, 没变化的改为0
        // 只要rdset中的fd对应的标志位为1 -> 缓冲区有数据了
        // 判断
        // 有没有新连接
        if(FD_ISSET(lfd, &rdtemp))
        {
            // 接受连接请求, 这个调用不阻塞
            struct sockaddr_in cliaddr;
            int cliLen = sizeof(cliaddr);
            int cfd = accept(lfd, (struct sockaddr*)&cliaddr, &cliLen);

            // 得到了有效的文件描述符
            // 通信的文件描述符添加到读集合
            // 在下一轮select检测的时候, 就能得到缓冲区的状态
            FD_SET(cfd, &rdset);
            // 重置最大的文件描述符
            maxfd = cfd > maxfd ? cfd : maxfd;
        }

        // 没有新连接, 通信
        for(int i=0; i<maxfd+1; ++i)
        {
			// 判断从监听的文件描述符之后到maxfd这个范围内的文件描述符是否读缓冲区有数据
            if(i != lfd && FD_ISSET(i, &rdtemp))
            {
                // 接收数据
                char buf[10] = {0};
                // 一次只能接收10个字节, 客户端一次发送100个字节
                // 一次是接收不完的, 文件描述符对应的读缓冲区中还有数据
                // 下一轮select检测的时候, 内核还会标记这个文件描述符缓冲区有数据 -> 再读一次
                // 	循环会一直持续, 知道缓冲区数据被读完位置
                int len = read(i, buf, sizeof(buf));
                if(len == 0)
                {
                    printf("客户端关闭了连接...\n");
                    // 将检测的文件描述符从读集合中删除
                    FD_CLR(i, &rdset);
                    close(i);
                }
                else if(len > 0)
                {
                    // 收到了数据
                    // 发送数据
                    write(i, buf, strlen(buf)+1);
                }
                else
                {
                    // 异常
                    perror("read");
                }
            }
        }
    }

    return 0;
}
```
# poll
poll的机制与select类似，与select在本质上没有多大差别，使用方法也类似
内核对应文件描述符的检测也是以线性的方式进行轮询，根据描述符的状态进行处理
poll和select检测的文件描述符集合会在检测过程中频繁的进行用户区和内核区的拷贝，它的开销随着文件描述符数量的增加而线性增大，从而效率也会越来越低。
select检测的文件描述符个数上限是1024，poll没有最大文件描述符数量的限制
select可以跨平台使用，poll只能在Linux平台使用

- fds: 这是一个struct pollfd类型的数组, 里边存储了待检测的文件描述符的信息，这个数组中有三个成员：
- fd：委托内核检测的文件描述符
- nfds: 这是第一个参数数组中最后一个有效元素的下标 + 1（也可以指定参数1数组的元素总个数）
- timeout: 指定poll函数的阻塞时长
	-1：一直阻塞，直到检测的集合中有就绪的文件描述符（有事件产生）解除阻塞
	0：不阻塞，不管检测集合中有没有已就绪的文件描述符，函数马上返回
	大于0：阻塞指定的毫秒（ms）数之后，解除阻塞
- return：失败 返回-1, 成功返回一个大于0的整数，表示检测的集合中已就绪的文件描述符的总个数[]
```c
// 每个委托poll检测的fd都对应这样一个结构体
struct pollfd {
    int   fd;         // 委托内核检测的文件描述符
    short events;     // 委托内核检测的fd事件（输入、输出、错误），每一个事件有多个取值
    short revents;    // 传出参数，数据由内核写入，存储内核检测之后的结果
};

struct pollfd myfd[100];
int poll(struct pollfd* fds, nfds_t nfds,int timeout);
```
内核传入revents的结果是根据我们委托它查询events决定的, 如果委托读事件内核只会返回读事件, 如果委托读写事件有可能返回读写事件也有可能只返回读或写事件


**events的取值及其含义**

| 事件   | 常值         | 作为events的值 | 作为revents的值 | 说明            |
| ---- | ---------- | ---------- | ----------- | ------------- |
| 读事件  | POLLIN     | Y          | Y           | 普通或优先带数据可读    |
|      | POLLRDNORM | Y          | Y           | 普通数据可读        |
|      | POLLRDBAND | Y          | Y           | 优先级带数据可读      |
|      | POLLPRI    | Y          | Y           | 高优先级数据可读      |
| 写事件  | POLLOUT    | Y          | Y           | 普通或优先带数据可写    |
|      | POLLWRNORM | Y          | Y           | 普通数据可写        |
|      | POLLWRBAND | Y          | Y           | 优先级带数据可写      |
| 错误事件 | POLLERR    | N          | Y           | 发生错误          |
|      | POLLHUP    | N          | Y           | 发生挂起          |
|      | POLLNVAL   | N          | Y           | 描述不是打开的文件<br> |
其中使用读\写\错误事件时大多数情况用第一个参数
如果需要获取多个事件,可以使用| 分隔都传入.

# epoll
epoll 全称 eventpoll，是 linux 内核实现IO多路转接/复用（IO multiplexing）的一个实现。IO多路转接的意思是在一个操作里同时监听多个输入输出源，在其中一个或多个输入输出源可用的时候返回，然后对其的进行读写操作。epoll是select和poll的升级版，epoll改进了工作方式，因此它更加高效。

1. 对于待检测集合select和poll是基于线性方式处理的，epoll是基于红黑树来管理待检测集合的。
2. select和poll每次都会线性扫描整个待检测集合，集合越大速度越慢，epoll使用的是回调机制，效率高，处理效率也不会随着检测集合的变大而下降
3. select和poll工作过程中存在内核/用户空间数据的频繁拷贝问题(==待定==)，在epoll中内核和用户区使用的是共享内存（基于mmap内存映射区实现），省去了不必要的内存拷贝。
4. 程序猿需要对select和poll返回的集合进行判断才能知道哪些文件描述符是就绪的，通过epoll可以直接得到已就绪的文件描述符集合，无需再次检测
使用epoll没有最大文件描述符的限制，仅受系统中进程能打开的最大文件数目限制

select/poll低效的原因之一是将“添加/维护待检测任务”和“阻塞进程/线程”两个步骤合二为一。每次调用select都需要这两步操作，然而大多数应用场景中，需要监视的socket个数相对固定，并不需要每次都修改。epoll将这两个操作分开，先用epoll_ctl()维护等待队列，再调用epoll_wait()阻塞进程（解耦）。
![](attachments/Pasted%20image%2020250711214410.png)
## 函数
**创建epoll**
- size：在Linux内核2.6.8版本以后，这个参数是被忽略的，只需要指定一个大于0的数值就可以了。
- return：失败返回-1, 成功返回一个有效的文件描述符，通过这个文件描述符就可以访问创建的epoll实例
```c
// 创建一个红黑树模型的实例，用于管理待检测的文件描述符的集合。
int epoll_create(int size);
```

**管理红黑树的节点**
管理红黑树实例上的节点，可以进行添加、删除、修改操作。
- epfd：epoll_create() 函数的返回值，通过这个参数找到epoll实例
- op：一个枚举值，控制通过该函数执行什么操作
	EPOLL_CTL_ADD：往epoll模型中添加新的节点
	EPOLL_CTL_MOD：修改epoll模型中已经存在的节点
	EPOLL_CTL_DEL：删除epoll模型中的指定的节点
- fd：文件描述符，即要添加/修改/删除的文件描述符
- event：epoll事件，用来修饰第三个参数对应的文件描述符的，指定检测这个文件描述符的什么事件
	events：委托epoll检测的事件
		EPOLLIN：读事件, 接收数据, 检测读缓冲区，如果有数据该文件描述符就绪
		EPOLLOUT：写事件, 发送数据, 检测写缓冲区，如果可写该文件描述符就绪
		EPOLLERR：异常事件
	data：用户数据变量，这是一个联合体类型，通常情况下使用里边的fd成员，用于存储待检测的文件描述符的值，在调用epoll_wait()函数的时候这个值会被传出。
- return：失败返回-1, 成功返回0
```c
// 联合体, 多个变量共用同一块内存        
typedef union epoll_data {
 	void        *ptr;
	int          fd;	// 通常情况下使用这个成员, 和epoll_ctl的第三个参数相同即可
	uint32_t     u32;
	uint64_t     u64;
} epoll_data_t;

struct epoll_event {
	uint32_t     events;      // Epoll events
	epoll_data_t data;        // User data variable
};
int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);
```

**检测**
检测创建的epoll实例中有没有就绪的文件描述符。
- epfd：epoll_create() 函数的返回值, 通过这个参数找到epoll实例
- events：传出参数, 这是一个结构体数组的地址, 里边存储了已就绪的文件描述符的信息
- maxevents：修饰第二个参数, 结构体数组的容量（元素个数）
- timeout：如果检测的epoll实例中没有已就绪的文件描述符，该函数阻塞的时长, 单位ms 毫秒
	0：函数不阻塞，不管epoll实例中有没有就绪的文件描述符，函数被调用后都直接返回
	大于0：如果epoll实例中没有已就绪的文件描述符，函数阻塞对应的毫秒数再返回
	-1：函数一直阻塞，直到epoll实例中有已就绪的文件描述符之后才解除阻塞
- return：
	成功：
		0：函数是阻塞被强制解除了, 没有检测到满足条件的文件描述符
		大于0：检测到的已就绪的文件描述符的总个数
	失败：返回-1
```c
int epoll_wait(int epfd, struct epoll_event * events, int maxevents, int timeout);
```

## 操作流程

1. 创建监听的套接字
```c
int lfd = socket(AF_INET, SOCK_STREAM, 0);
```

2. 设置端口复用（可选）
```c
int opt = 1;
setsockopt(lfd, SOL_SOCKET, SO_REUSEADDR, &opt, sizeof(opt));
```

3. 使用本地的IP与端口和监听的套接字进行绑定
```c
int ret = bind(lfd, (struct sockaddr*)&serv_addr, sizeof(serv_addr));
```

4. 给监听的套接字设置监听
```c
listen(lfd, 128);
```

5. 创建epoll实例对象
```c
int epfd = epoll_create(100);
```

6. 将用于监听的套接字添加到epoll实例中
```c
struct epoll_event ev;
ev.events = EPOLLIN;    // 检测lfd读读缓冲区是否有数据
ev.data.fd = lfd;
int ret = epoll_ctl(epfd, EPOLL_CTL_ADD, lfd, &ev);
```

7. 检测添加到epoll实例中的文件描述符是否已就绪，并将这些已就绪的文件描述符进行处理
```c
int num = epoll_wait(epfd, evs, size, -1);
```
如果是监听的文件描述符，和新客户端建立连接，将得到的文件描述符添加到epoll实例中
```c
int cfd = accept(curfd, NULL, NULL);
ev.events = EPOLLIN;
ev.data.fd = cfd;
// 新得到的文件描述符添加到epoll模型中, 下一轮循环的时候就可以被检测了
epoll_ctl(epfd, EPOLL_CTL_ADD, cfd, &ev);
```
如果是通信的文件描述符，和对应的客户端通信，如果连接已断开，将该文件描述符从epoll实例中删除
```c
int len = recv(curfd, buf, sizeof(buf), 0);
if(len == 0){
    // 将这个文件描述符从epoll模型中删除
    epoll_ctl(epfd, EPOLL_CTL_DEL, curfd, NULL);
    close(curfd);
}
else if(len > 0){
    send(curfd, buf, len, 0);
}
```

8. 重复第7步的操作

## epoll的工作模式

### 水平模式
水平模式可以简称为LT模式，LT（level triggered）是缺省的工作方式，并且同时支持block和no-block socket。在这种做法中，内核通知使用者哪些文件描述符已经就绪，之后就可以对这些已就绪的文件描述符进行IO操作了。如果我们不作任何操作，内核还是会继续通知使用者。

**水平模式的特点：**
- 读事件：如果文件描述符对应的读缓冲区还有数据，读事件就会被触发，epoll_wait()解除阻塞
当读事件被触发，epoll_wait()解除阻塞，之后就可以接收数据了
如果接收数据的buf很小，不能全部将缓冲区数据读出，那么读事件会继续被触发，直到数据被全部读出，如果接收数据的内存相对较大，读数据的效率也会相对较高（减少了读数据的次数）
因为读数据是被动的，必须要通过读事件才能知道有数据到达了，因此对于读事件的检测是必须的
- 写事件：如果文件描述符对应的写缓冲区可写，写事件就会被触发，epoll_wait()解除阻塞
当写事件被触发，epoll_wait()解除阻塞，之后就可以将数据写入到写缓冲区了
写事件的触发发生在写数据之前而不是之后，被写入到写缓冲区中的数据是由内核自动发送出去的
如果写缓冲区没有被写满，写事件会一直被触发
因为写数据是主动的，并且写缓冲区一般情况下都是可写的（缓冲区不满），因此对于写事件的检测不是必须的

### 边沿模式

边沿模式可以简称为ET模式，ET（edge-triggered）是高速工作方式，只支持no-block socket。在这种模式下，当文件描述符从未就绪变为就绪时，内核会通过epoll通知使用者。然后它会假设使用者知道文件描述符已经就绪，并且不会再为那个文件描述符发送更多的就绪通知（only once）。如果我们对这个文件描述符做IO操作，从而导致它再次变成未就绪，当这个未就绪的文件描述符再次变成就绪状态，内核会再次进行通知，并且还是只通知一次。ET模式在很大程度上减少了epoll事件被重复触发的次数，因此效率要比LT模式高。

**边沿模式的特点:**
- 读事件：当读缓冲区有新的数据进入，读事件被触发一次，没有新数据不会触发该事件
如果有新数据进入到读缓冲区，读事件被触发，epoll_wait()解除阻塞
读事件被触发，可以通过调用read()/recv()函数将缓冲区数据读出
如果数据没有被全部读走，并且没有新数据进入，读事件不会再次触发，只通知一次
如果数据被全部读走或者只读走一部分，此时有新数据进入，读事件被触发，并且只通知一次
- 写事件：当写缓冲区状态可写，写事件只会触发一次
如果写缓冲区被检测到可写，写事件被触发，epoll_wait()解除阻塞
写事件被触发，就可以通过调用write()/send()函数，将数据写入到写缓冲区中
写缓冲区从不满到被写满，期间写事件只会被触发一次
写缓冲区从满到不满，状态变为可写，写事件只会被触发一次

epoll的边沿模式下 epoll_wait()检测到文件描述符有新事件才会通知，如果不是新的事件就不通知，通知的次数比水平模式少，效率比水平模式要高。

**ET模式的设置**
边沿模式不是默认的epoll模式，需要额外进行设置。
epoll管理的红黑树实例中每个节点都是struct epoll_event类型，只需要将EPOLLET添加到结构体的events成员中即可：
```c
struct epoll_event ev;
ev.events = EPOLLIN | EPOLLET;	// 设置边沿模式
```

**设置非阻塞**

对于写事件的触发一般情况下是不需要进行检测的，因为写缓冲区大部分情况下都是有足够的空间可以进行数据的写入。对于读事件的触发就必须要检测了，因为服务器也不知道客户端什么时候发送数据，如果使用epoll的边沿模式进行读事件的检测，有新数据达到只会通知一次，那么必须要保证得到通知后将数据全部从读缓冲区中读出。

常见的处理方式是循环接收数据: 
```c
int len = 0;
while((len = recv(curfd, buf, sizeof(buf), 0)) > 0){
    // 数据处理...
}
```
这样做也是有弊端的，因为套接字操作默认是阻塞的，当读缓冲区数据被读完之后，读操作就阻塞了也就是调用的read()/recv()函数被阻塞了，当前进程/线程被阻塞之后就无法处理其他操作了。

要解决阻塞问题，就需要将套接字默认的阻塞行为修改为非阻塞，需要使用fcntl()函数进行处理：
```c
// 设置完成之后, 读写都变成了非阻塞模式
int flag = fcntl(cfd, F_GETFL);
flag |= O_NONBLOCK;                                                        
fcntl(cfd, F_SETFL, flag);
```

epoll在边沿模式下，必须要将套接字设置为非阻塞模式，但是，这样就会引发另外的一个bug，在非阻塞模式下，循环地将读缓冲区数据读到本地内存中，当缓冲区数据被读完了，调用的read()/recv()函数还会继续从缓冲区中读数据，此时函数调用就失败了，返回-1，对应的全局变量 errno 值为 EAGAIN 或者 EWOULDBLOCK如果打印错误信息会得到如下的信息：Resource temporarily unavailable
