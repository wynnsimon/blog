---
title: 4 常用API
createTime: 2025/04/05 12:12:26
permalink: /back/java/4/
---
# Math
进行数学计算的工具类,其中所有的方法都是静态的

| 函数                                          | 作用                         |
| ------------------------------------------- | -------------------------- |
| public static double ceil(double a)         | 向上取整                       |
| public static double floor(double a)        | 向下取整                       |
| public static int round(float a)            | 四舍五入                       |
| public static int max(int a,int b)          | 获取两个int值中的较大值              |
| public static double pow(double a,double b) | 返回a的b次幂的值                  |
| public static double random()               | 返回值为double的随机值，范围[0.0,1.0) |
| public static double sqrt(double a)         | 返回a的平方根                    |
| public static double cbrt(double a)         | 返回a的立方根                    |
| public static int abs(int a）                | 获取a的绝对值                    |

# System
与系统相关的工具类


| 函数                                                       | 作用               |
| -------------------------------------------------------- | ---------------- |
| public static void exit(int status)                      | 终止当前运行的 Java 虚拟机 |
| public static long currentTimeMillis()                   | 返回当前系统的时间毫秒值形式   |
| public static void arraycopy(数据源数组,起始索引,目的地数组,起始索引,拷贝个数) | 数组拷贝<br>         |

# Runtime
表示当前java虚拟机的运行环境
这个对象不能直接获得需要根据它的一个内部函数获得


| 函数                                 | 作用                           |
| ---------------------------------- | ---------------------------- |
| public static Runtime getRuntime() | 当前系统的运行环境对象                  |
| public void exit(int status)       | 停止虚拟机. System中的exit方法就是调用此方法 |
| public int availableProcessors()   | 获得CPU的线程数                    |
| public long maxMemory()            | JVM能从系统中获取总内存大小（单位byte）      |
| public long totalMemory()          | JVM已经从系统中获取总内存大小（单位byte）     |
| public longfreeMemory()            | JVM剩余内存大小（单位byte）            |
| public Processexec(String command) | 运行cmd命令                      |
|                                    |                              |

# Object
Object是Java中的顶级父类。所有的类都直接或间接的继承于object类。
顶级父类中只有无参构造方法

| 函数                                | 作用           |
| --------------------------------- | ------------ |
| public Object()                   | 空参构造         |
| public String tostring()          | 返回对象的字符串表示形式 |
| public boolean equals(object obj) | 比较两个对象是否相等   |
| protected object clone(int a)     | 对象克隆         |

Object中的tostring一般是地址值,如果想要看属性值的话需要重写

自定义的数据类型一般都需要重写equals方法
1. 如果没有重写equals方法，那么默认使用object中的方法进行比较，比较的是地址值是否相等
2. 一般来讲地址值对于我们意义不大，所以我们会重写，重写之后比较的就是对象内部的属性值了。

```java
String s ="abc";
StringBuilder sb =new StringBuilder("abc");

System.out.println(s.equals(sb));
// false
//因为equals方法是被s调用的，而s是字符串
//所以equals要看String类中的
//字符串中的equals方法，先判断参数是否为字符串
//如果是字符串，再比较内部的属性
//但是如果参数不是字符串，直接返回false

System.out.println(sb.equals(s));
// false
//因为equals方法是被sb调用的，而sb是StringBuilder
//所以这里的equals方法要看StringBuilder中的equals方法
//那么在StringBuilder当中，没有重写equals方法
//使用的是object中的//在object当中默认是使用==号比较两个对象的地址值
//而这里的s和sb记录的地址值是不一样的，所以结果返回false
```

**clone因为是protected保护权限,只能在本包内使用,因此在使用的时候必须要在当前类重写clone方法,相当于拷贝构造**
Object中的clone默认是浅拷贝

# Objects
Objects是一个工具类，提供了一些方法去完成一些功能。

| 函数                                       | 作用             |
| ---------------------------------------- | -------------- |
| public boolean equals(Object a,Object b) | 先做非空判断,再比较两个对象 |
| public boolean isNull(Object a)          | 判断对象是否为空       |
| public bollean nonNull(Object a)         | 判断对象是否非空       |

# BigInteger

对象一旦创建,内部的值无法改变

| 函数                                         | 作用                        |
| ------------------------------------------ | ------------------------- |
| public BigInteger(int num, Random rnd)     | 获取随机大整数，范围：[0～2的num次方-1]  |
| public BigInteger(String val)              | 获取指定的大整数                  |
| public BigInteger(String val, int radix)   | 获取指定进制的大整数                |
| public static BigInteger value0f(long val) | 静态方法获取BigInteger的对象，内部有优化 |
Bigdecimal在构造时需要把值使用引号引用起来,引号内不能有除数字外的其他字符

如果BigInteger表示的数字没有超出long的范围，可以用静态方法获取。
如果BigInteger表示的超出long的范围，可以用构造方法获取。
对象一旦创建，BigInteger内部记录的值不能发生改变。
只要进行计算都会产生一个新的BigInteger对象(如果是和0相加不会创建新的对象)


| 函数                                                     | 作用                           |
| ------------------------------------------------------ | ---------------------------- |
| public BigInteger add(BigInteger val)                  | 加法                           |
| public BigInteger subtract(BigInteger val)             | 减法                           |
| public BigInteger multiply(BigInteger val)             | 乘法                           |
| public BigInteger ddivide(BigInteger val)              | 除法，获取商                       |
| public BigInteger[] divideAndRemainder(BigInteger val) | 除法，获取商和余数. 返回的数组0索引是商,1索引是余数 |
| public boolean equals(Object x)                        | 比较是否相同                       |
| public BigInteger pow(int exponent)                    | 次幂                           |
| public BigInteger max/min(BigInteger val)              | 返回较大值/较小值                    |
| publicint intValue(BigInteger val)                     | 转为int类型整数，超出范围数据有误           |

BigInteger存储方式是从左往右每32位为一组,首部加上一个符号位,符号位0表示负数,1表示正数,符号位单独为一组,然后把每组数据都转成十进制存储到一个数组中,数组的0号索引为符号位
![](attachments/Pasted%20image%2020250711211550.png)

# BigDecimal

它有许多构造方法,但如果需要精确计算的小数只能使用字符串的构造方法
```java
public BitgDeciaml(String s)
```

1. 如果要表示的数字不大，没有超出double的取值范围，建议使用静态方法
2. 如果要表示的数字比较大，超出了double的取值范围，建议使用构造方法
3. 如果我们传递的是0~10之间的整数，包含0，包含10，那么方法会返回已经创建好的对象，不会重新new

也具有和Biginteger一样的基础算数运算的函数
