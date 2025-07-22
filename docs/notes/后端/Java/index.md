---
title: 1 Java
createTime: 2025/06/22 09:46:34
permalink: /back/java/
---
java是一个编译解释混合型语言，写好的java程序需要先编译成字节码，然后在虚拟机上运行将字节码翻译成二进制指令

java编译一次到处运行，具有安全性
python是把源代码逐句翻译成二进制指令，因此要运行python程序即运行python程序的源代码没有安全性
# 文档注释
```java
/**
@version:
@属性名: 如作用，参数，返回值，版本，作者等
*/
```
可以被jdk提供的工具javadoc所解析，生成一套以网页形式体现的该程序的说明文档

```shell
//编译
javac 文件名(.java文件)
//运行
java 文件名
```

空类型是null

# 数据类型
## 基本数据类型  
byte数字类型范围是-127 128  
byte short char在进行运算的时候会先提升为int再进行运算  
布尔类型是boolean  
long类型是直接写long不需要加int，且long类型的数字字面量必须是以l作后缀无所谓大小写  
float必须以f作后缀而double不需要  
字符串类型只有+运算（拼接）  
## 引用数据类型  
  
Scanner类型用于获取键盘输入  
导包  
import java.until.Scanner  
创建对象（使用这个类）  
Scanner sc=new Scanner(System.in);  
接收数据  
int i=sc.nextInt

# 数组
定义
两种定义方式
```java
int[] array;
int array[];
```

- 动态初始化：手动指定数组长度，由系统给出默认初始值
- 静态初始化：手动指定数组元素，系统会根据元素个数计算出数组的长度

静态初始化
```java
int[] array=new int[]{1,2,3};
int[] array={1,2,3};
```
直接打印数组打印出来的是数组的地址，如：[I@776ec8df
其中I表示int整形的意思，D就是表示double型
@是固定格式的间隔符号
后面的十六进制数才是地址

获取数组的长度
```java
array.length;
```

动态初始化
```java
数据类型[] 数组名= new 数据类型[数组的长度]
```
程序员给出数组的长度，由虚拟机给出是默认的初始化值

| 数据类型 | 默认初始化值     |
| ---- | ---------- |
| 整型   | 0          |
| 小数   | 0.0        |
| 字符   | '/u0000'空格 |
| 布尔   | false      |
| 引用   | null       |

# 方法的重载
java中的方法就是c或Python中的函数
在同一个类中允许定义多个同名函数其参数类型和参数个数不同即构成重载。与返回值无关

## 引用数据类型
使用new出来的数据类型都是引用数据类型
数组就是引用数据类型，数组定义的完整形式是使用new运算符了
引用数据类型的变量存储的都是地址值

引用：使用了其他空间中的数据
 基本数据类型数据值是存储在自己的空间中赋值给其他变量是拷贝值过去修改值不影响原变量
引用数据类型数据值存储在其他空间，自己空间存储的是地址值，赋值给其他变量时拷贝的是地址的值这样两变量指向的是同一个数据修改也会影响另一个

String字符串也是引用数据类型
# 类和对象

# lambda

- () 对应着方法的形参列表
- ->固定格式
- {} 方法的方法体
```java
()->{}
```

lambda表达式可以用来简化匿名内部类的书写
lambda表达式只能简化函数式接口的匿名内部类写法

函数式接口:
有且仅有一个抽象方法的接口叫做函数式接口(可以使用@Functionallnterface注解判断是否是函数式接口,如果报错则不是)

lambda的省略规则：
1. 参数类型可以省略不写。
2. 如果只有一个参数，参数类型可以省略，同时（)也可以省略。
3. 如果Lambda表达式的方法体只有一行，大括号，分号，return可以省略不写，需要同时省略。
如:
```java
Integer[] arr = {1,2,3,4,5};
Arrays.sort(arr,new Comparetor<Integer>(){
    @Override
    public int compare(Integer o1,Integer o2){
        return o1-o2;
    }
}); 

//lambda完整格式
Arrays.sort(arr,(Integer o1,Integer o2)->{
    return o1-o2;
});
//lambda省略写法
Arrays.sort(arr,(o1, o2)-> o1 -o2);
```

# 泛型
泛型尖括号中只能写引用数据类型
对于一个集合如果不使用泛型指定其中内容的类型则该集合可以存储任意的类型
但存储的类型都会转化为Object对象来存储,因此无法调用子类特有的方法但可以强制类型转换后使用
```java
ArrayList list=new ArrayList();
list.add(123);
list.add("aaa");
list.add(new Student( name:"zhangsan", age: 123));
```

但java中的泛型是伪泛型,当数据存储到集合中时会将对象转换为object类型,但是当取出时又会自动强转为指定的数据类型

## 泛型类
当自己写一个泛型类的时候可以在尖括号中填写任一字母指代类型
自己实现一个ArrayList:
```java
public class MyArrayList<E> {
	Object[] obj= new object[10];
	int size;
	
	public E get(int index){
		return (E)obj[index];
	}
}
```

## 泛型方法

### 类名后面定义的泛型
所有方法都能用
```java
修饰符<类型>返回值类型 方法名(类型 变量名){}
public<T>void show(T t){}
```


### 在方法申明上定义自己的泛型
只有本方法能用

## 泛型接口
```java
修饰符 interface 接口名<类型>{}
public interface List<E>{}
```

实现类给出类型
```java
public class MyArrayList implements List<String>{}
```

实现类延续泛型
```java
public class MyArrayList<E> implements List<E>{}
```

## 泛型的通配符

泛型不具备继承性,但数据具备继承性
如:B继承A
在method的方法中已经指定了比如传入A类型的ArrayList,但它的孩子不能传递
```java
public static void method(ArrayList<A> list){}

ArrayList<A> la=new ArrayList<>;
ArrayList<B> lb=new ArrayList<>;

method(la);//ok
method(lb);//error
```

如果想要一个类型或方法能够接收一个类型及与其有继承关系的类型可以使用通配符
- ？也表示不确定的类型他可以进行类型的限定
- ? extends E：表示可以传递E或者E所有的子类类型
- ? super E：表示可以传递E或者E所有的父类类型
```java
public static void method(ArrayList<? extends A>list）{}
```
method可以接收E类型及其子类




