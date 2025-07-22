---
title: 5 reactor
createTime: 2025/06/15 13:33:26
permalink: /base/os/5/
---
对于io多路复用的处理方式:

1. 面向io的处理
```c
if(listenfd){
	accept();
}else if(clientfd){
	recv();
	send();
}
```


2. 面向事件的处理
```c
if(events & EPOLLIN){

}else if(events & EPOLLOUT){

}
```

面向事件的处理方式对于一个io对应的不同事件进行不同的处理,相比于面向io的处理划分更细致, 且代码易于维护

像这样的面向事件的处理,按照事件的反应堆不同的事件对应不同的处理即为reactor模型
