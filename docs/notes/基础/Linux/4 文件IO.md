---
title: 4 文件IO
createTime: 2025/06/18 20:42:42
permalink: /base/linux/4/
---
### 函数
```c
//打开文件。参数：文件路径和名称，模式。
//r：只读模式，如果没有文件报错
//w：只写模式，如果文件存在清空文件，不存在创建新文件
//a：只追加写模式，如果文件存在，在末尾写，如果不存在创建文件后在末尾写
//r+：读写模式，文件必须存在，不存在会报错，写入是从头覆盖的
//w+：读写模式，如果文件存在清空内容，如果不存在创建新文件
//a+：读追加写模式，如果文件存在在末尾开始写，如果不存在创建新文件
//FILE* 结构体指针，指向一个文件
//如果打开失败（报错）返回一个空值
FILE* fopen(const char *__restrict __filename,const char *__restrict __modes)

//关闭文件。参数：需要关闭的文件。成功返回0，失败返回EOF（负数）
int fclose(FILE *__stream)

//将错误信息拼接到__s后面打印出来
void perror (const char *__s)

------------------------------写入函数------------------------------
//向指定文件写入一个字符。__c：字符的ASCII码，也可以直接一个字符。FILE：打开的文件。成功返回0，失败返回EOF（负数）
int fputc(int __c, FILE *__stream)

//写入一个字符串，参数：字符串，打开的文件。成功返回非负整数（0或1），失败返回EOF
int fputs(const char *__restrict __s,FILE *__restrict __stream)

//写入格式化字符串。...可变参数，格式化字符个数。成功返回写入的字符的个数不包含换行符失败返回EOF
int fprintf(FILE* __restrict __stream, const char* __restrict __fmt,...)

------------------------------读取函数------------------------------
//读取一个字节并返回，如果出错或读到文件末尾返回EOF
int fgetc(FILE *__stream)

//读取指定长度的字符串，__s用于接收读到的字符串，成功返回字符串，失败返回NULL
char * fgets(char *__restrict __s,int __n,FILE *__restrict __stream)

//格式化读取，根据带格式化的字符串读取文件，返回成功匹配的个数
//如："tom 18 American"
//可以使用fscanf读取：fcanf(f,"%s %d %s",name,age,address)
//fscanf是经过优化的，遇到空行自动跳过
int fscanf(FILE* __restrict __stream,const char* __restrict __format,...)
```
## 标准输入输出
系统已经提供了标准输入输出的文件指针可以使用
### 标准输入
stdin
```c
fgets(ch,10,stdin)
```
### 标准输出
标准输出和错误输出文件描述符不一样
stdout
```c
fputs(ch,stdout)
```
### 标准错误输出
stderr
```c
fputs(ch,stderr)
```

## 系统调用
系统调用是操作系统内核提供给应用程序，使其可以间接访问硬件资源的接口
系统调用相比于库函数更加底层
<unistd.h>   unix衍生的操作系统的系统调用库
```c
//打开文件。
//__path：打开文件的路径
//__oflag：打开文件的模式，有其对应的宏
//1 O_RDONLY 只读模式
//2 O_WRONLY 只写模式
//3 O_RDWR 读写模式
//4 O_CREAT 如果不存在创建文件
//5 O_APPEND 追加写模式
//6 O_TRUNC 截断文件长度为0
//...可变参数，只有在O_CREAT模式才会用到，表示创建文件的权限使用八进制数（在数加上0）表示
//返回文件描述符，如果打开失败返回-1，同时显示到系统的错误输出中设置全局变量errno表示对应错误
//linux中有文件权限保护，默认删除掉其他用户的写权限，因此有时0666会变成0664
int open(const char *__path，int __oflag,...)

//根据指向的文件描述符读对应长度的字符串存到__buf中，__nbytes读取的最大字节数。
//返回成功读取的字节数，若读取失败或遇到文件末尾EOF返回-1
ssize_t read(int __fd,void *__buf,size_t __nbytes);

//从__buf中取出对应__n长度的字符串存到指定文件中。若成功返回成功写入的字节数，失败返回-1
ssize_t write(int __fd,const void* __buf, size_t __n);

//根据文件描述符__fd关闭指定文件，成功返回0，失败返回-1
int close(int __fd)
```
ssize_t是__ssize_t的别名，\_\_ssize_t 是long int的别名

**exit 和_exit()**
系统调用_exit()
\_exit()是由POSIX标准定义的系统调用，用于立即终止一个进程，定义在unistd.h中。这个调用确保进程立即退出，不执行任何清理操作。
\_exit()在子进程终止时特别有用，这可以防止子进程的终止影响到父进程（比如，防止子进程意外地刷新了父进程未写入的输出缓冲区）。
exit和_Exit功能一样。

exit()函数是由C标准库提供的，定义在stdlib.h中。
终止当前进程，但是在此之前会执行3种清理操作
1. 调用所有通过atexit()注册的终止处理函数（自定义）
2. 刷新所有标准I/O缓冲区（刷写缓存到文件）
3. 关闭所有打开的标准I/O流（比如通过fopen打开的文件）
```c
//statu父进程可接收到的退出状态码0表示成功非0表示各种不同的错误
void exit(int status)
void _exit(int status)
void _Exit(int __status)
```

# 文件描述符
每个文件描述符都关联到内核的一个struct file类型的结构体数据，定义于/usr/src/linux-hwe-6.5-headers-6.5.0-27/include/linux/fs.h文件中
```c
struct file{
	......
	atomic_long_t f_count;//引用计数，管理文件对象的生命周期
	struct mutex f_pos_lock;//保护文件位置的互斥锁
	loff_t f_pos;//当前文件位置（读写位置）
	......
	struct path f_path;//记录文件路径
	struct inode *f_inode;//指向与文件相关联的inode对象的指针，该对象用于维护文件元数据，如文件类型、访问权限等
	const struct file_operations* f_op;//指向文件操作函数表的指针，定义了文件支持的操作，如读、写、锁定等
	......
	void* private_data;//存储特定驱动或模块的私有数据
	......
}__randomize_layout
	__attribute__((aligned(4)));
```
inode就相当于文件的编号，把同一个文件删除后再在该路径创建一个新的同名文件它们也并不是同一个文件，inode也不一样

**struct path**
结构体定义于Linux系统的/usr/src/linux-hwe-6.5-headers-6.5.0-27/include/linux/path.h文件中
```c
struct path {
	struct vfsmount *mnt;//虚拟文件系统挂载点的表示，存储有关挂载文件系统的信息
	struct dentry *dentry;目录项结构体，代表了文件系统中的一个目录项。目录项是文件系统中的一个实体，通常对应一个文件或目录的名字。通过这个类型的属性，可以定位文件位置。
}__randomize_layout;
```

**struct inode**
结构体定义于Linux系统的/usr/src/linux-hwe-6.5-headers-6.5.0-27/include/linux/fs.h文件中
```c
struct inode{
	umode_t i_mode；//文件类型和权限。这个字段指定了文件是普通文件、目录、字符设备、块设备等，以及它的访问权限（读、写、执行）。
	unsigned short i_opflags;
	kuid_t i_uid；//文件的用户ID，决定了文件的拥有者。
	kgid_t i_gid；//文件的组 ID，决定了文件的拥有者组。
	unsigned int i_flags;
	......
	unsigned long i_ino;//inode编号，是文件系统中文件的唯一标识。
	......
	loff_t i_size;//文件大小
}__randomize_layout;
```

**struct files_struct**
是用来维护一个进程（下文介绍）中所有打开文件信息的。结构体定义于/usr/src/linux-hwe-6.5-headers-6.5.0-27/include/linux/fdtable.h文件中
```c
struct files_struct{
	......
	struct fdtable __rcu*fdt;//指向当前使用的文件描述符表（fdtable）
	......
	unsigned int next_fd;//存储下一个可用的最小文件描述符编号
	......
	struct file __rcu *fd_array[NR_OPEN_DEFAULT]; // struct file 指针的数组，大小固定，用于快速访问。
}
```
NR_OPEN_DEFAULT默认长度1024，当文件描述符的数量超过NR_OPEN_DEFAULT时，会发生动态扩容，会将fdarray的内容复制到扩容后的指针数组，f指向扩容后的指针数组。这一过程是内核控制的。
文件描述符是一个非负整数，其值实际上就是其关联的struct file在fd指向的数组或fdarray中的下标。
![](attachments/Pasted%20image%2020250711223509.png)

# 缓冲机制
分为:
1. 无缓冲
2. 行缓冲
	行缓冲下只有遇到换行符或缓冲区满才能写入
3. 全缓冲
**设置文件流的缓冲模式**
- stream要设置的文件流，可以是输入缓冲流也可以是输出缓冲流
- buf指向缓冲区的指针，这个参数为NULL则自动分配缓冲区。
- mode缓冲区模式
	`_IOFBF`: 全缓冲，数据会存储在缓冲区中直到缓冲区满。
	`_IOLBF`：行缓冲，娄数据会存储在缓冲区中直到碰到换行符或缓冲区满。
	`_IONBF`：无缓冲，输出操作将直接从调用进程到目标设备，不经过缓冲区
- size缓冲区大小，以字节为单位。size为0时
	如果buf 为NULL，则标准C库将为该文件流自动分配一个默认大小的缓
	如果buf 不为NULL，将size设置为θ不合逻辑，行为是未定义的
- return: 成功返回0，失败返回非零值
```c
int setvbuf(FILE *stream,char *buf, int mode, size_t size);
```

**刷写**
刷新一个流，如果是输出流，强制将用户空间所有缓冲的数据输出到下游设备或目标文件, 如果是输入流，若是与可寻址文件关联的输入流（不包含管道和终端），丢弃缓冲区未被应用消费的数据, 对管道和终端关联的输入流执行fflush()通常不会有任何效果
主要是用来处理输出流
- stream: 待刷新的数据流，如果为NULL，则刷新所有打开的输出流。
- return: 成功返回0. 失败返回 EOF，并设置 errno
```c
int fflush(FILE *stream);
```
