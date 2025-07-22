---
title: 1 线性结构
createTime: 2025/06/22 16:21:28
permalink: /base/dsa/
---
# 线性表

## 顺序表
```cpp
#include <iostream>
using namespace std;

template <typename T>
class Array
{
public:
    Array(int size = 64);
    ~Array();

    // 在尾部添加元素
    void append(T val);
    // 尾部删除元素
    void popBack();
    // 插入元素
    void insert(int pos, T val);
    // 删除元素
    void remove(int pos);
    // 查询元素-> 返回位置
    int find(T val);
    // 得到指定位置的元素的值
    int value(int pos);
    // 获取数组元素数量
    int size();
    // 打印数据
    void show();
    //元素逆序
    void reverse();
    //奇偶调整:将奇数放在线性表左侧,将偶数放在线性表右侧
    void adjust();
private:
	//扩容
    void expand(int size);
private:
    T* m_arry;           // 数组的起始地址
    int m_capacity;      // 数组容量
    int m_count;         // 数组中的元素数量
};
```

## 链表

```cpp
#pragma once
#include <iostream>
using namespace std;


struct Node
{
    int data;
    int next; 
};

// 静态链表列
class SLinkList
{
public:
    SLinkList(int size);
    ~SLinkList();
    // 插入元素, 把数据放到某个元素之前
    bool insert(int pos, int data);
    // 删除元素
    void remove(int pos);
    // 查找元素, 返回位置
    int find(int data);
    // 遍历元素
    void display();
private:
    Node* m_list = nullptr;
    int m_size;      // 链表的容量
    int m_length;    // 元素数量
};

```

带头节点的单向链表
```cpp
// SLinkList.h
#pragma once

struct Node
{
    int data = 0;
    Node* next = nullptr;
};

// 定义单向链表类
class LinkList
{
public:
    LinkList();
    ~LinkList();
    // 判断链表是否为空
    bool isEmpty();
    // 获取链表节点数量
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();
    // 返回头结点
    inline Node* head() { return m_head; }
    // 返回指定位置的节点的值
    int value(int pos);

private:
    int m_length = 0;
    Node* m_head = nullptr;
    Node* m_tail = nullptr;
};
```

不带头节点的单项链表
```cpp
// SLinkList1.h
#pragma once

// 定义节点
struct Node
{
    int data = 0;
    Node* next = nullptr;
};

class LinkList1
{
public:
    LinkList1();
    ~LinkList1();
    // 判断链表是否为空
    bool isEmpty();
    // 得到链表长度
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();

private:
    int m_length = 0;
    Node* m_head = nullptr;
    Node* m_tail = nullptr;
};
```

## 单向循环链表
带头节点的单向循环链表
```cpp
// CircularLinkList.h
#pragma once
struct Node
{
    int data = 0;
    Node* next = nullptr;
};

// 单向循环链表
class LoopLinkList
{
public:
    LoopLinkList();
    ~LoopLinkList();

    // 判断链表是否为空
    bool isEmpty();
    // 得到链表长度
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();

private:
    Node* m_head = nullptr;
    Node* m_tail = nullptr;
    int m_length = 0;
};
```

不带头节点的单向循环链表
```cpp
// CircularLinkList1.h
#pragma once
struct Node
{
    Node(int value) : data(value) {}
    int data;
    Node* next = nullptr;
};

// 单向循环链表
class LoopLinkList1
{
public:
    LoopLinkList1();
    ~LoopLinkList1();

    // 判断链表是否为空
    bool isEmpty();
    // 得到链表长度
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();

private:
    Node* m_head = nullptr;
    Node* m_tail = nullptr;
    int m_length = 0;
};
```

## 双向链表

带头节点的双向链表
```cpp
// DoubleLinkList.h
#pragma once
struct Node
{
    Node(int value) : data(value) {}
    int data;
    Node* next = nullptr;  
    Node* prior = nullptr; 
};

// 双向链表
class DLinkList
{
public:
    DLinkList();
    ~DLinkList();
    // 判断链表是否为空
    bool isEmpty();
    // 得到链表长度
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();

private:
    int m_length = 0;
    Node* m_head = nullptr;
    Node* m_tail = nullptr;
};
```

不带头节点的双向链表
```cpp
// DoubleLinkList1.h
#pragma once
struct Node
{
    Node(int value) : data(value) {}
    int data;
    Node* next; 
    Node* prior;
};

class DLinkList1
{
public:
    DLinkList1();
    ~DLinkList1();
    // 判断链表是否为空
    bool isEmpty();
    // 得到链表长度
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();

private:
    int m_length = 0;
    Node* m_head = nullptr;
    Node* m_tail = nullptr;
};
```

## 双向循环链表
带头节点的双向循环链表
```cpp
// DoubleCircularLinkList.h
#pragma once
#include <iostream>
using namespace std;

struct Node 
{
    int data;
    Node* prev;
    Node* next;
    Node(int d) : data(d), prev(nullptr), next(nullptr) {}
};

class LoopDLinkList 
{
public:
    LoopDLinkList();
    ~LoopDLinkList();
    // 判断链表是否为空
    bool isEmpty();
    // 得到链表长度
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();
private:
    Node* m_head;
    Node* m_tail;
    int m_length;
};
```

不带头节点的双向循环链表
```cpp
// DoubleCircularLinkList1.h
#pragma once

struct Node
{
    int data;
    Node* prev;
    Node* next;
    Node(int d) : data(d), prev(nullptr), next(nullptr) {}
};

class LoopDLinkList1
{
public:
    LoopDLinkList1();
    ~LoopDLinkList1();
    // 判断链表是否为空
    bool isEmpty();
    // 得到链表长度
    int length();
    // 数据添加到链表头部
    void prepend(int data);
    // 数据添加到链表尾部
    void append(int data);
    // 数据插入到链表任意位置, 第一个数据元素 pos=1
    bool insert(int pos, int data);
    // 搜索数值, 返回节点和位置, 没找到返回nullptr
    Node* find(int data, int& pos);
    // 删除节点
    bool remove(int pos);
    // 遍历链表
    void display();
private:
    // 添加节点
    void addNode(int data, bool isHead = true);
private:
    Node* m_head;
    Node* m_tail;
    int m_length;
};
```

## 索引表

## 约瑟夫问题

```cpp
struct Node
{
    int data;
    int pos;
    Node* next;
    Node(int value, int index) : 
        data(value), next(nullptr), pos(index) {}
};
```

# 特殊线性表

## 顺序栈
后进先出
抽象数据类型：
```python
class Stack:  
    """定义栈类"""  
    def __init__(self):  
        self.data=[]  
  
    def __del__(self):  
        while self.data:  
            del self.data[-1]  
  
    def isempty(self):  
        return not self.data  
  
    def push(self,value):  
        self.data.append(value)  
  
    def pop(self):  
        if not self.isempty():  
            return self.data.pop()  
        else:  
            print('栈空')  
            return None  
  
    def top(self):  
        if not self.isempty():  
            return self.data[-1]  
        else:  
            print('栈空')  
            return None  
  
    def size(self):  
        return len(self.data)
```

*栈常用于函数的调用*

**深度优先搜索算法DFS**
```cpp
// ArrayStack.h
#pragma once
const int MAX_SIZE = 100;

class ArrayStack 
{
public:
    ArrayStack();
    bool isEmpty();
    bool isFull();
    // 压栈
    void push(int x); 
    // 出栈
    int pop();
    // 得到栈顶元素
    int top();
private:
    int m_data[MAX_SIZE];
    int m_top;
};
```

## 链式栈
```cpp
// LinkedStack.h
#pragma once
struct Node 
{
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedStack 
{
public:
    LinkedStack();
    ~LinkedStack();
    bool isEmpty();
    void push(int x);
    int pop();
    int top();
private:
    Node* m_top;  // 栈顶指针，指向链表的头部
};
```

## 顺序非循环队列
```cpp
// ArrayQueue.h
#pragma once

const int MAX_SIZE = 100;
class ArrayQueue 
{
public:
    ArrayQueue();
    bool isEmpty();
    bool isFull();
    void enqueue(int x);
    int dequeue();
    // 获取队列头部元素的值
    int peek();
private:
    int m_data[MAX_SIZE];
    int m_front; 
    int m_rear; 
};
```

## 顺序循环队列
```cpp
// CircularQueue.h
#pragma once
class CircularQueue 
{
public:
    CircularQueue(int capacity);
    ~CircularQueue();
    bool isEmpty();
    bool isFull();
    void enqueue(int x);
    int dequeue();
    // 获取队头元素的值
    int peek();
private:
    int *m_data;
    int m_front;
    int m_rear;
    int m_size;
    int m_capacity;
};
```

定义一个数组
```cpp
typedef struct Queue{
	int capacity=10;
	int size=0;
	int front=0;
	int rear=0;
	int que[capacity];
}Queue;

//添加元素
void add(Queue* queue, int num){
	if(queue.size==queue.capacity){
		printf("队列已满,无法添加元素");
		return;
	}
	queue.que[queue.rear]=num;
	queue.rear=(queue.rear+1) % queue.capacity;
	queue.size++;
}

//取出元素
void del(Queue* queue){
	if(queue.size==0){
		printf("队列为空,无法取出元素");
		return;
	}
	int num = queue.que[queue.front];
	queue.front=(queue.front+1)%queue.capacity;
	queue.size--;
}
```
这样的队列由于是循环队列,头指针的索引不必比尾指针的索引小. 

## 链式队列

先进先出
可使用线性表或者链表实现

抽象数据类型：
队列：
```Python
class queue(object):  
    """队列"""  
    def __init__(self):  
        self.__list=[]  
    def enqueue(self,item):  
        """往队列中添加一个元素"""  
        self.__list.append(item)  
  
    def dequeue(self):  
        """从队列头部删除一个元素"""  
        return self.__list.pop(0)  
  
    def is_empty(self):  
        """判断队列是否为空"""  
        return self.__list==[]  
  
    def size(self):  
        """返回队列的大小"""  
        return len(self.__list)
```
双端队列：
```Python
class deque(object):  
    """双端队列"""  
    def __init__(self):  
        self.__list = []  
  
    def add_front(self, item):  
        """往头部中添加一个元素"""  
        self.__list.insert(0,item)  
  
    def add_rear(self,item):  
        """往尾部添加一个元素"""  
        self.__list.append(item)  
  
    def pop_front(self):  
        """删除头部元素"""  
        return self.__list.pop(0)  
  
    def pop_rear(self):  
        """删除尾部元素"""  
        return self.__list.pop()  
  
    def is_empty(self):  
        """判断队列是否为空"""  
        return self.__list == []  
  
    def size(self):  
        """"返回队列的大小"""  
        return len(self.__list)
```

*队列常用于作业的调度*

**宽度（广度）优先搜索算法BFS**

若为线性表每次出队元素的时间复杂度为O(n)，使用链表的话时间复杂度为O(1)，出队列也可以将队首往后移来使时间复杂度达到O(1)，但这样操作出队的元素并没有删除，依旧存在队列中
```cpp
// LinkedQueue.h
#pragma once

struct Node 
{
    int data;
    Node* next;
    Node(int d) : data(d), next(nullptr) {}
};

class LinkedQueue 
{
public:
    LinkedQueue();
    ~LinkedQueue();
    bool isEmpty();
    void enqueue(int x);
    int dequeue();
    int peek();
private:
    Node* m_front;
    Node* m_rear;   // 队尾指针，指向链表的尾部
};
```

## 栈和队列的转换

# 朴素匹配算法
