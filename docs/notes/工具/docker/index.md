---
title: 1 概述
createTime: 2025/06/18 21:07:44
tags:
 - 工具
permalink: /tools/docker/
---

```shell
// 启动docker
systemctl start docker

// 停止docker
systemctl stop docker

// 重启
systemctl restart docker

//设置开机自启
systemctl enable docker

// 执行docker ps命令如果不报错表示启动成功
docker ps
```

如果遇到权限不足可以使用sudo命令运行,但使用systemctl启动选择用户使用的是用户本身的权限,因此一般默认只有root用户可以访问

可以将用户添加到docker的用户组中
```shell
sudo gpasswd -a username docker
```
更新用户组
```shell
newgrp docker
```
查看用户组
```shell
groups
```
查看用户所属的用户组
```shell
groups username
```

当我们利用Docker安装应用时，Docker会自动搜索并下载应用镜像（image）。镜像不仅包含应用本身，还包含应用运行所需要的环境、配置、系统函数库。Docker会在运行镜像时创建一个隔离环境，称为容器（container）。

# 常用命令

**创建镜像**
```shell
docker run -d \
	--name mysql \
	-p 3306:3306 \
	-e TZ=Asia/Shanghai \
	-e MYSQL_R00T_PASSWORD=123 \
	mysql
```
- docker run：创建并运行一个容器，-d是让容器在后台运行
- --name mysql：给容器起个名字，必须唯一
- -p 3306:3306：设置端口映射
- -e KEY=VALUE：是设置环境变量
- -v：目录挂载，将镜像需要用到的目录挂载到指定路径
- mysql：指定运行的镜像的名字

#### 镜像命名规范
镜像名称一般分两部分组成：
```
[repository]:[tag]
```
其中repository就是镜像名
tag是镜像的版本
在没有指定tag时，默认是latest，代表最新版本的镜像

**拉取镜像**
拉取一个镜像,镜像名后面跟指定版本,如果不指定则拉取最新
```shell
docker pull 镜像名
```

**查看已下载镜像**
查看当前docker容器中的镜像
```shell
docker images
```

**保存打包镜像**
将已有的镜像打包,如果是最新版本版本名可以用latest
```shell
docker save -o 镜像名.tar 镜像名:版本号
```

**删除镜像**
```shell
docker rmi 镜像名:版本号
```

**读取镜像**
从使用docker save 命令打包的镜像包中读取镜像
```shell
docker load 镜像包名
```

**查看容器**
查看正在运行的镜像
```shell
docker ps
```
- -a：查看所有镜像（包括未启动的）

**启动容器**
```shell
docker start 容器名
```

**停止容器**
```shell
docker stop 容器名
```

**查看日志**
查看指定容器的运行日志
```shell
docker logs 容器名
```

**进入容器内交互**
```shell
docker exec 容器名
```

一般使用-it参数表示使用命令行交互

使用bash命令行终端交互
```shell
docker exec -it nginx bash
```
在容器内部有模拟的运行环境,可以使用linux命令

# 数据卷
在docker容器内模拟了虚拟的运行环境,但这个环境只包括了当前容器运行最小的环境,也就是与让当前容器运行无关的命令都不提供

数据卷（volume）是一个虚拟目录，是容器内目录与宿主机目录之间映射的桥梁。

容器内运行环境不够用的问题,可以使用数据卷解决

在数据卷中配置文件与容器虚拟环境的映射,将容器内的文件系统与宿主机内的docker的文件系统双向绑定,其中一个修改另一个也会修改,这样可以使用宿主机的运行环境操作映射的文件
![](attachments/Pasted%20image%2020250710231556.png)

### 命令

**创建数据卷**
```shell
docker volume create
```


**查看所有数据卷**
```shell
docker volume ls
```


**删除指定数据卷**
```shell
docker volume rm 数据卷名
```


**查看某个数据卷的详情**
```shell
docker volume inspect 数据卷名
```

**清除未使用的数据卷**
```shell
docker volume prune
```

## 匿名卷
如果下载一个数据库容器,如mysql,没有手动配置数据卷
可以查看一些mysql的数据卷详情,发现mysql有配置数据卷,且名字并不是mysql而是随机生成的字符
这是因为对于这些容器来说,如果不做配置数据卷,那么数据就会存储到容器中,出于数据解耦的目的便做了数据卷,将数据放在宿主机内
当删除了mysql容器后,其保存在宿主机内的数据并没有删除,数据卷也没有删除,但再次下载mysql容器后会生成新的数据卷就无法访问旧数据了

所以不推荐使用匿名卷

对于旧的数据可以使用指定目录挂载,将旧的目录挂载到新的数据卷中实现数据迁移

**目录挂载**
```shell
docker run -v 本地目录:容器内目录
```
本地目录必须以“/”或“./”开头的绝对路径，如果直接以名称开头，会被识别为数据卷而非本地目录
-v mysql:/var/lib/mysql 会被识别为一个数据卷叫mysql
-v ./mysql:/var/lib/mysql 会被识别为当前目录下的mysql目录

# 自定义镜像
镜像就是包含了应用程序、程序运行的系统函数库、运行配置等文件的文件包。构建镜像的过程其实就是把上述文件打包的过程。
![](attachments/Pasted%20image%2020250710231738.png)

对于部分应用,它们可能有些层是相同的,这样在下载镜像的时候就可以跳过该层,这样可以加快下载速度,减少文件体积

# dockerfile
Dockerfile就是一个文本文件，其中包含的指令nstruction）令来说明要执行什么操作来构建镜像。将来Docker可以根据Dockerfile帮我们构建镜像。常见指令如下：

| 指令         | 说明                         | 示例                                                                |
| ---------- | -------------------------- | ----------------------------------------------------------------- |
| FROM       | 指定基础镜像                     | FROM centos:6                                                     |
| ENV        | 设置环境变量，可在后面指令使用            | ENV key value                                                     |
| COPY       | 拷贝本地文件到镜像的指定目录             | COPY ./jre11.tar.gz /tmp                                          |
| RUN        | 执行Linux的shell命令，一般是安装过程的命令 | RUN tar -zxvf /tmp/jrel1.tar.gz && EXPORTS  path=/tmp/jre11:$path |
| EXPOSE     | 指定容器运行时监听的端口，是给镜像使用者看的     | EXP0SE 8080                                                       |
| ENTRYPOINT | 镜像中应用的启动命令，容器运行时调用         | ENTRYPOINT java -jar xx.jar                                       |


我们可以基于Ubuntu基础镜像，利用Dockerfile描述镜像结构，+也可以直接基于JDK为基础镜像，省略前面的步骤：当编写好了Dockerfile，可以利用下面命令来构建镜像：
```shell
docker build -t 镜像名:版本号 dockerfile所在目录
```
-t：是给镜像起名，格式依然是repository:tag的格式，不指定tag时，默认为latest

# 网络

默认情况下,所有容器都是以bridge方式连接到docker的一个虚拟网桥上的,docker会为容器分配网络地址,但如果启动顺序不同分配的地址也不同

## 自定义网络
自定义网络的地址组就可能和docker的不同了

加入自定义网络的容器才可以通过容器名互相访问，Docker的网络操作命令如下：


| 命令                        | 说明           | 文档地址                      |
| ------------------------- | ------------ | ------------------------- |
| docker network create     | 创建一个网络       | docker network create     |
| docker network ls         | 查看所有网络       | docker network ls         |
| docker network rm         | 删除指定网络       | docker network rm         |
| docker network prune      | 清除未使用的网络     | docker networkprune       |
| docker network connect    | 使指定容器连接加入某网络 | docker network connect    |
| docker network disconnect | 使指定容器连接离开某网络 | docker network disconnect |
| docker network inspect    | 查看网络详细信息     | docker network inspect    |
