---
title: 1 概述
createTime: 2025/06/18 21:08:30
permalink: /tools/kubernetes/
---
# 应用部署方式的演变

在部署应用程序的方式上，主要经历了三个阶段：

1. 传统部署：互联网早期，会直接将应用程序部署在物理机上
一个服务器上运行多个程序,但当一个程序出现内存泄漏就会挤占其他程序的内存,会影响到其他程序
> [!tip] Title
> 优点：简单，不需要其它技术的参与
> 缺点：不能为应用程序定义资源使用边界，很难合理地分配计算资源，而且程序之间容易产生影响

2. 虚拟化部署：可以在一台物理机上运行多个虚拟机，每个虚拟机都是独立的一个环境
> [!tip] Title
> 优点：程序环境不会相互产生影响，提供了一定程度的安全性
> 缺点：增加了操作系统，浪费了部分资源

3. 容器化部署：与虚拟化类似，但是共享了操作系统

> [!tip] Title
> 优点：
> 可以保证每个容器拥有自己的文件系统、CPU、内存、进程空间等
> 运行应用程序所需要的资源都被容器包装，并和底层基础架构解耦
> 容器化的应用程序可以跨云服务商、跨Linux操作系统发行版进行部署

容器化部署方式给带来很多的便利，但是也会出现一些问题：
- 一个容器故障停机了，怎么样让另外一个容器立刻启动去替补停机的容器
- 当并发访问量变大的时候，怎么样做到横向扩展容器数量

这些容器管理的问题统称为容器编排问题，为了解决这些容器编排问题，就产生了一些容器编排的软件：
- Swarm：Docker自己的容器编排工具
- Mesos：Apache的一个资源统一管控的工具，需要和Marathon结合使用
- Kubernetes：Google开源的的容器编排工具

kubernetes的本质是一组服务器集群，它可以在集群的每个节点上运行特定的程序，来对节点中的容器进行管理。它的目的就是是实现资源管理的自动化，主要提供了如下的主要功能：
1. 自我修复：一旦某一个容器崩溃，能够在1秒中左右迅速启动新的容器
2. 弹性伸缩：可以根据需要，自动对集群中正在运行的容器数量进行调整
3. 服务发现：服务可以通过自动发现的形式找到它所依赖的服务
4. 负载均衡：如果一个服务起动了多个容器，能够自动实现请求的负载均衡
5. 版本回退：如果发现新发布的程序版本有问题，可以立即回退到原来的版本
6. 存储编排：可以根据容器自身的需求自动创建存储卷

一个kubernetes集群主要是由控制节点（master)、工作节点（node)构成，每个节点上都会安装不同的组件。

**master：集群的控制平面，负责集群的决策**
- ApiServer：资源操作的唯一入口，接收用户输入的命令，提供认证、授权、API注册和发现等机制
- Scheduler：负责集群资源调度，按照预定的调度策略将Pod调度到相应的node节点上
- ControllerManager：负责维护集群的状态，比如程序部署安排、故障检测、自动扩展、滚动更新等
- Etcd：负责存储集群中各种资源对象的信息

**node：集群的数据平面，负责为容器提供运行环境**
- Kubelet：负责维护容器的生命周期，即通过控制docker，来创建、更新、销毁容器
- KubeProxy：负责提供集群内部的服务发现和负载均衡
- Docker：负责节点上容器的各种操作

**kubernetes系统各个组件调用关系：**
1. 首先要明确，一旦kubernetes环境启动之后，master和node都会将自身的信息存储到etcd数据库中
2. 一个程序服务的安装请求会首先被发送到master节点的apiServer组件
3. apiServer组件会调用scheduler组件来决定到底应该把这个服务安装到哪个node节点上 , 在此时，它会从etcd中读取各个node节点的信息，然后按照一定的算法进行选择，并将结果告知apiServe
4. apiServer调用controller-manager去调度Node节点安装该程序服务
5. kubelet接收到指令后，会通知docker，然后由docker来启动一个程序的pod , pod是kubernetes的最小操作单元，容器必须跑在pod中至此，
6. 一个程序服务就运行了，如果需要访问该程序，就需要通过kube-proxy来对pod产生访问的代理
这样，外界用户就可以访问集群中的该程序服务了

### kubernetes概念
- Master：集群控制节点，每个集群需要至少一个master节点负责集群的管控
- Node：工作负载节点，由master分配容器到这些node工作节点上，然后node节点上的docker负责容器的运行
- Pod：kubernetes的最小控制单元，容器都是运行在pod中的，一个pod中可以有1个或者多个容器
- Controller：控制器，通过它来实现对pod的管理，比如启动pod、停止pod、伸缩pod的数量等等
- Service：pod对外服务的统一入口，下面可以维护者同一类的多个pod
- Label：标签，用于对pod进行分类，同一类pod会拥有相同的标签
- NameSpace：命名空间，用来隔离pod的运行环境

### 集群类型
kubernetes集群大体上分为两类：一主多从和多主多从。
- 一主多从：一台Master节点和多台Node节点，搭建简单，但是有单机故障风险，适合用于测试环境
- 多主多从：多台Master节点和多台Node节点，搭建麻烦，安全性高，适合用于生产环境

### 安装方式
kubernetes有多种部署方式，目前主流的方式有kubeadm、minikube、二进制包
- minikube：一个用于快速搭建单节点kubernetes的工具
- kubeadm：一个用于快速搭建kubernetes集群的工具
- 二进制包：从官网下载每个组件的二进制包，依次去安装此方式对于理解kubernetes组件更加有效

# 配置环境

## 主机配置
1. 主机名解析
为了方便后面集群节点间的直接调用，在这配置一下主机名解析，企业中推荐使用内部DNS服务器
```shell
#主机名成解析编辑三台服务器的/etc/hosts文件，添加下面内容
192.168.109.100 master
192.168.109.101 node1
192.168.109.102 node2
```

2. 时间同步
kubernetes要求集群中的节点时间必须精确一致，这里直接使用chronyd服务从网络同步时间。
企业中建议配置内部的时间同步服务器
```shell
#启动chronyd服务
[root@master~]# systemctl start chronyd
#设置chronyd服务开机自启
[root@master~]# systemctl enable chronyd
#chronyd服务启动稍等几秒钟，就可以使用date命令验证时间了
[root@master~]# date
```

3. 禁用iptables和firewalld服务
kubernetes和docker在运行中会产生大量的iptabtes规则，为了不让系统规则跟它们混淆，直接关闭系统的规则
```shell
#1关闭firewalld服务
[root@master~]# systemctl stop firewalld
[root@master~]# systemctl disable firewalld
#2关闭iptables服务
[root@master~]# systemctl stop iptables
[root@master~]# systemctl disable iptables
```

4. 禁用selinux
selinux是linux系统下的一个安全服务，如果不关闭它，在安装集群中会产生各种各样的奇问题
```shell
#编辑/etc/selinux/config文件，修改SELINUx的值为disabled
#注意修改完毕之后需要重启linux服务
SELINUX=disabled
```

5. 禁用swap分区
swap分区指的是虚拟内存分区，它的作用是在物理内存使用完之后，将磁盘空间虚拟成内存来使用
启用swap设备会对系统的性能产生非常负面的影响，因此kubernetes要求每个节点都要禁用swap设备
但是如果因为某些原因确实不能关闭swap分区，就需要在集群安装过程中通过明确的参数进行配置说明

```shell
#编辑分区配置文件/etc/fstab，注释掉swap分区一行
#注意修改完毕之后需要重启linux服务
UUID=455cc753-7a60-4c17-a424-7741728c44a1 /boot xfs defaults 0 0
/dev/mapper/centos-home /home                   xfs defaults 0 0
#/dev/mapper/centos-swap swap                   swap defaults 0 0
```

6. 修改linux的内核参数
```shell
# 修改linux的内核采纳数，添加网桥过滤和地址转发功能
# 编辑/etc/sysctl.d/kubernetes.conf文件，添加如下配置：
net.bridge.bridge-nf-call-ip6tables = 1
net.bridge.bridge-nf-call-iptables = 1
net.ipv4.ip_forward = 1

# 重新加载配置
[root@master ~]# sysctl -p
# 加载网桥过滤模块
[root@master ~]# modprobe br_netfilter
# 查看网桥过滤模块是否加载成功
[root@master ~]# lsmod | grep br_netfilter
```

7.  配置ipvs功能
在Kubernetes中Service有两种带来模型，一种是基于iptables的，一种是基于ipvs的两者比较的话，ipvs的性能明显要高一些，但是如果要使用它，需要手动载入ipvs模块
```shell
# 1.安装ipset和ipvsadm
[root@master ~]# yum install ipset ipvsadm -y
# 2.添加需要加载的模块写入脚本文件
[root@master ~]# cat <<EOF> /etc/sysconfig/modules/ipvs.modules
#!/bin/bash
modprobe -- ip_vs
modprobe -- ip_vs_rr
modprobe -- ip_vs_wrr
modprobe -- ip_vs_sh
modprobe -- nf_conntrack_ipv4
EOF
# 3.为脚本添加执行权限
[root@master ~]# chmod +x /etc/sysconfig/modules/ipvs.modules
# 4.执行脚本文件
[root@master ~]# /bin/bash /etc/sysconfig/modules/ipvs.modules
# 5.查看对应的模块是否加载成功
[root@master ~]# lsmod | grep -e ip_vs -e nf_conntrack_ipv4
```

## 组件安装

1. 安装docker
```shell
# 1、切换镜像源
[root@master ~]# wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo

# 2、查看当前镜像源中支持的docker版本
[root@master ~]# yum list docker-ce --showduplicates

# 3、安装特定版本的docker-ce
# 必须制定--setopt=obsoletes=0，否则yum会自动安装更高版本
[root@master ~]# yum install --setopt=obsoletes=0 docker-ce-18.06.3.ce-3.el7 -y

# 4、添加一个配置文件
#Docker 在默认情况下使用Vgroup Driver为cgroupfs，而Kubernetes推荐使用systemd来替代cgroupfs
[root@master ~]# mkdir /etc/docker
[root@master ~]# cat <<EOF> /etc/docker/daemon.json
{
	"exec-opts": ["native.cgroupdriver=systemd"],
	"registry-mirrors": ["https://kn0t2bca.mirror.aliyuncs.com"]
}
EOF

# 5、启动dokcer
[root@master ~]# systemctl restart docker
[root@master ~]# systemctl enable docker
```

2. 安装Kubernetes组件
```shell
# 1、由于kubernetes的镜像在国外，速度比较慢，这里切换成国内的镜像源
# 2、编辑/etc/yum.repos.d/kubernetes.repo,添加下面的配置
[kubernetes]
name=Kubernetes
baseurl=http://mirrors.aliyun.com/kubernetes/yum/repos/kubernetes-el7-x86_64
enabled=1
gpgchech=0
repo_gpgcheck=0
gpgkey=http://mirrors.aliyun.com/kubernetes/yum/doc/yum-key.gpg
			http://mirrors.aliyun.com/kubernetes/yum/doc/rpm-package-key.gpg

# 3、安装kubeadm、kubelet和kubectl
[root@master ~]# yum install --setopt=obsoletes=0 kubeadm-1.17.4-0 kubelet-1.17.4-0 kubectl-1.17.4-0 -y

# 4、配置kubelet的cgroup
#编辑/etc/sysconfig/kubelet, 添加下面的配置
KUBELET_CGROUP_ARGS="--cgroup-driver=systemd"
KUBE_PROXY_MODE="ipvs"

# 5、设置kubelet开机自启
[root@master ~]# systemctl enable kubelet
```

3. 准备集群镜像
```shell
# 在安装kubernetes集群之前，必须要提前准备好集群需要的镜像，所需镜像可以通过下面命令查看
[root@master ~]# kubeadm config images list

# 下载镜像
# 此镜像kubernetes的仓库中，由于网络原因，无法连接，下面提供了一种替换方案
images=(
	kube-apiserver:v1.17.4
	kube-controller-manager:v1.17.4
	kube-scheduler:v1.17.4
	kube-proxy:v1.17.4
	pause:3.1
	etcd:3.4.3-0
	coredns:1.6.5
)

for imageName in ${images[@]};do
	docker pull registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName
	docker tag registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName k8s.gcr.io/$imageName
	docker rmi registry.cn-hangzhou.aliyuncs.com/google_containers/$imageName 
done

```

4. 集群初始化
**下面的操作只需要在master节点上执行即可**
```shell
# 创建集群
[root@master ~]# kubeadm init \
	--apiserver-advertise-address=192.168.81.128 \
	--image-repository registry.aliyuncs.com/google_containers \
	--kubernetes-version=v1.17.4 \
	--service-cidr=10.96.0.0/12 \
	--pod-network-cidr=10.244.0.0/16
# 创建必要文件
[root@master ~]# mkdir -p $HOME/.kube
[root@master ~]# sudo cp -i /etc/kubernetes/admin.conf $HOME/.kube/config
[root@master ~]# sudo chown $(id -u):$(id -g) $HOME/.kube/config
```

**下面的操作只需要在node节点上执行即可**
```shell
kubeadm join 192.168.0.100:6443 --token awk15p.t6bamck54w69u4s8 \
    --discovery-token-ca-cert-hash sha256:a94fa09562466d32d2952
```