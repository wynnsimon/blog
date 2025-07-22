---
title: 2 STL
createTime: 2025/04/05 12:12:26
permalink: /back/java/2/
---
# String
### 构造方法
```java
//创建空白字符串
public String()
//根据传入的字符串，创建字符串对象
public String(String original)
//根据字符数组，创建字符串对象
public String(char[] chs)
//根据字节数组，创建字符串对象
public String(byte[] chs)

//直接赋值的方式
String s="abc"
```
当使用双引号直接赋值时，系统会检查该字符串是否在串池中存在，如果不存在则创建新得，如果存在就复用，也就是字符串类型指针指向该字符串
而使用new创建出来的字符串不管有没有都会在堆内存中创建一个新的

比较运算符==
如果比较的时基本数据类型比较的都是数据值
如果是引用数据类型，因为引用数据类型中存的实际上是指向值的地址，因此比较的是地址

### 成员函数
```java
//完全一样返回true，不一样返回false
boolean equals(String s) 
//忽略大小写比较
boolean equalsIgnoeCase(String s)

//根据索引获取返回字符
public char charAt(int index)
//返回此字符串的长度
public int length()
//返回截取字符串，范围[begin,end)
String substring(int beginIndex,int endIndex)
```

# StringBuilder
如果要进行很多字符串拼接操作时，前一个字符串和后一个字符串拼接产生新的字符串然后再与后面的字符串拼接会导致性能很慢，而使用StringBuilder本质上是一个容器（相当于字符串数组）就可以将多个字符串一同放到容器中统一拼接性能就很高

直接打印StringBuilder是属性值而不是像String一样的地址值，这是因为java再底层做了特殊的处理
### 构造方法
```java
//创建一个空白可变字符串对象，不含有任何内容public
public StringBuilder() 
//根据字符串的内容，来创建可变字符串对象
StringBuilder(String str)
```

### 成员方法
```java
//添加数据，并返回对象本身
public StringBuilder append(任意类型)
//反转容器中的内容 
public StringBuilder reverse()
//返回长度(字符出现的个数) 
public int length()
//把StringBuilder转换为String
public String toString()
```

# StringJoiner
StringJoiner跟StringBuilder一样，也可以看成是一个容器，创建之后里面的内容是可变的。作用：提高字符串的操作效率，而且代码编写特别简洁

### 构造函数
```java
//创建一个StringJoiner对象，指定拼接时的间隔符号
public StringJoiner (间隔符号)
//创建一个StringJoiner对象，指定拼接时的间隔符号、开始符号、结束符号
public StringJoiner(间隔符号，开始符号，结束符号)
```

### 成员函数
```java
添加数据，并返回对象本身
public StringJoiner add(添加的内容)
返回长度（字符出现的个数）
public int length()
返回一个字符串（该字符串就是拼接之后的结果）
public String toString() 
```

# 字符串相关类的底层原理
![](attachments/Pasted%20image%2020250711211240.png)
java8之后会对字符串先进行预估，但预估依旧消耗很多性能

# 集合
集合可以自动扩容，无法存基本数据类型  
```java
ArrayList<String> str=new ArrayList<String>();  
ArrayList<String> str=new ArrayList<>();
```

添加元素`boolean add(E e)`,返回当前字符串是否被添加成功

删除元素`bollean remove(E e)`,

修改元素`E set(int index,E e)`将index位置上的值修改为e的值,并返回该位置原本的值

查询`E get(int index)`返回index位置上的元素

获取长度`int size()`返回集合的长度

### 基本数据类型对应的包装类

| 基本数据类型  | 对应的包装类    |
| ------- | --------- |
| byte    | Byte      |
| short   | Short     |
| char    | Character |
| int     | Integer   |
| long    | Long      |
| float   | Float     |
| double  | Double    |
| boolean | Boolean   |

# 单列集合

![](attachments/Pasted%20image%2020250711211319.png)
vector已经被淘汰了

List系列集合：添加的元素是有序可重复、有索引
有序指的是存储的顺序是有序的,而不是按从大到小顺序

Set系列集合：添加的元素是无序、不重复、无索引

如果往list中添加数据，那么方法永远返回true，因为List系列的是允许元素重复的。
如果往set中添加数据教据，如果当前要添加元素不存在，方法返回true，表示添加成功。

## Collection

| 方法名称                                | 说明                   |
| ----------------------------------- | -------------------- |
| public boolean add(E e)             | 把给定的对象添加到当前集合中,添加到末尾 |
| public void clear()                 | 清空集合中所有的元素           |
| public boolean remove(E e)          | 把给定的对象在当前集合中删除       |
| public boolean contains(object obj) | 判断当前集合中是否包含给定的对象     |
| public boolean isEmpty()            | 判断当前集合是否为空           |
| public int size()                   | 返回集合中元素的个数/集合的长度<br> |

### 迭代器

| 方法名称                    | 说明                                |
| ----------------------- | --------------------------------- |
| Iterator\<E> iterator() | 返回迭代器对象，默认指向当前集合的0索引              |
| boolean hasNext()       | 判断当前位置是否有元素，有元素返回true，没有元素返回false |
| next()                  | 获取当前位置的元素并将迭代器对象移向下一个位置。<br>      |

当迭代器遍历的时候不能用集合的方法**删除**,这样会报并发修改异常,但可以用迭代器的方法**删除**
该迭代器只能用于删除
```java
Collection<String> coll=new ArrayList<>();
Iterator<String> it =coll.iterator();

while(it.hasNext()){
	if('b'.equals(str)){
		coll.remove('b');//error
		it.remove();//ok
	}
}
```

## List
Collection的方法List都继承了
List集合因为有索引，所以多了很多索引操作的方法。

| 方法名称                          | 说明                  |
| ----------------------------- | ------------------- |
| void add(int index,E element) | 在此集合中的指定位置插入指定的元素   |
| E remove(int index)           | 删除指定索引处的元素，返回被删除的元素 |
| E set(int index,E element)    | 修改指定索引处的元素，返回被修改的元素 |
| E get(int index)              | 返回指定索引处的元素          |

当调用重载函数时会优先调用形参和实参一致的方法,
如:使用remove删除integer类型数组中的元素时会优先按索引删除,这是因为list中的rmove的形参是int类型,不需要封装即可直接使用,而Collection中的remove是Object类型,需要封装后使用.
若想要删除指定元素需要进行一次封装

```java
List<Integer> list = new ArrayList<>();

list.remove(1);//删除的是索引为1的方法

Integer i=Integer.valueOf(1);
list.remove(i);//删除值为1的方法
```

### 迭代器
除了本身从collection中继承的迭代器外,list还有自己的迭代器ListIterator
该迭代器能用于删除也能用于添加

| 方法                    | 作用                                                               |
| --------------------- | ---------------------------------------------------------------- |
| void add(E e)         | 将指定的元素插入列表（可选操作）。                                                |
| boolean hasNext()     | 以正向遍历列表时，如果列表迭代器有多个元素，则返回true（换句话说，如果next返回一个元素而不是抛出异常，则返回true）。 |
| boolean hasPrevious() | 如果以逆向遍历列表，列表迭代器有多个元素，则返回true。                                    |
| next()                | 返回列表中的下一个元素。                                                     |
| int nextIndex()       | 返回对next的后续调用所返回元素的索引。                                            |
| previous()            | 列表中的前一个元素。                                                       |
| int previousIndex()   | 返回对previous 的后续调用所返回元素的索引。                                       |
| void remove()         | 从列表中移除由next或previous 返回的最后一个元素（可选操作）。                            |
| void set(E e)         | 用指定元素替换next或previous返回的最后一个元素（可选操作）。                             |
和hasNext,next一样hasPrevious,previos也是配合使用的,但迭代器默认位置依旧是从0索引开始,因此在使用hasPrevious,previos时需要让迭代器移动到末尾

## Set
1. 如果想要集合中的元素可重复用ArrayList集合，基于数组的。（用的最多）
2. 如果想要集合中的元素可重复，而且当前的增删操作明显多于查询用LinkedList集合，基于链表的。
3. 如果想对集合中的元素去重用HashSet集合，基于哈希表的。（用的最多）
4. 如果想对集合中的元素去重，而且保证存取顺序用LinkedHashSet集合，基于哈希表和双链表，效率低于HashSet。
5. 如果想对集合中的元素进行排序用TreeSet集合，基于红黑树。后续也可以用List集合实现排序。


无序 不重复 无索引
Collection是单列集合的祖宗接口，它的功能是全部单列集合都可以继承使用的。

| 方法名称                                | 说明               |
| ----------------------------------- | ---------------- |
| public boolean add(E e)             | 把给定的对象添加到当前集合中   |
| public void clear()                 | 清空集合中所有的元素       |
| public boolean remove(E e)          | 把给定的对象在当前集合中删除   |
| public boolean contains(object obj) | 判断当前集合中是否包含给定的对象 |
| public boolean isEmpty()            | 判断当前集合是否为空       |
| public int size()                   | 返回集合中元素的个数/集合的长度 |

### HashSet
HashSet集合底层采取哈希表存储数据

JDK8之前：数组+链表
JDK8开始：数组+链表+红黑树

#### 哈希值
根据hashCode方法算出来的int类型的整数
该方法定义在Object类中，所有对象都可以调用，默认使用地址值进行计算
般情况下，会重写hashCode方法，利用对象内部的属性值计算哈希值

如果发生哈希冲突
JDK8以前：新元素存入数组，老元素挂在新元素下面
JDK8以后：新元素直接挂在老元素下面


### LinkedHashSet
有序、不重复、无索引。

底层数据结构是依然哈希表，只是每个元素又额外的多了一个双链表的机制记录存储的顺序。

### TreeSet

不重复、无索引、可排序
可排序：按照元素的默认规则（有小到大）排序。

TreeSet集合底层是基于红黑树的数据结构实现排序的，增删改查性能都较好。

#### TreeSet的两种比较方式
- 负数：表示当前要添加的元素是小的，存左边
- 正数：表示当前要添加的元素是大的，存右边
- 0:表示当前要添加的元素已经存在，舍弃

**默认排序/自然排序：Javabean类实现comparable接口指定比较规则**
```java
public class Student implements Comparable<Student2>{
	@Override
	public int compareTo(Student2 o) { 
		//判断语文成绩
		int i=this->yuwen_score-o.yuwen_score;
		//如果语文成绩一样比较数学成绩
		i= i==0 ? this->shuxue_score - o.shuxue_score:i;
		return i;
	}
}
```

**比较器排序：创建TreeSet对象时候，传递比较器Comparator指定规则**

```java
TreeSet<String> ts= new TreeSet<>(new Comparator<String>(){
	@Override
	public int compare(String o1,String o2）{
		//按照长度排序
		int i =o1.length()-o2.length();
		//如果一样长则按照首字母排序(默认排序)
		i = i == θ ? o1.compareTo(o2):i;
		return i;
	}
});
```

# 双列集合
![](attachments/Pasted%20image%2020250711211349.png)

## Map

| 方法名称                                 | 说明                 |
| ------------------------------------ | ------------------ |
| V put(K key,V value)                 | 添加元素               |
| V remove(object key)                 | 根据键删除键值对元素,返回删除的值  |
| void clear()                         | 移除所有的键值对元素         |
| boolean containsKey(object key)      | 判断集合是否包含指定的键       |
| boolean containsValue(object value)  | 判断集合是否包含指定的值       |
| boolean isEmpty()                    | 判断集合是否为空           |
| int size()                           | 集合的长度，也就是集合中键值对的个数 |
| Set\<T t> keySet()                   | 获取键的集合             |
| Set<Entry<String,String>> entrySet() | 获取所有键值对对象的集合       |

如果添加重复键的话就会把原本的键值覆盖,返回被覆盖的值

Entry是Map中的一个接口,因此调用的时候需要使用Map.的形式
```
Set<Map.Entry<String,String>> entries = map.entrySet();
```
对于一个Entry对象是一个键值对对象,因此还需要使用getKey()和getValue()获取键和值

**遍历**
每个可遍历的容器都有一个forEach()函数用于遍历,但遍历时需要传入一个函数在该函数中表明对此容器中每个元素的操作
default void forEach(BiConsumer\<? super K, ? super V> action)

```
//lambda表达式
map.forEach((String key,String value)->{
		System.out.println(key + "=" + value);
	}
);

//匿名内部类
map.forEach(new BiConsumer<String, String>(){
	@Override
	public void accept(String key,String value){
		System.out.println(key+""="+value);
	}
);
```

## HashMap
由键决定：无序、不重复、无索引。

HashMap是Map里面的一个实现类。没有额外的特有方法，直接使用Map里面的方法就可以了。

HashMap跟HashSet底层原理是一模一样的天都是哈希表结构
计算的是键的哈希值

jdk8以前
如果在键对应的位置上已经有元素了在判断值是否一样如果一样就用新值覆盖旧值,如果不一样会把新的键值对添加到哈希数组中,再将旧的键值对使用链地址法挂到新键值对下面形成一个链表

jdk8之后新元素会之间挂在旧元素下面,当链表的长度超过8且数组长度>=64，自动转成红黑树

如果键存储的是自定义对象需要重写equals方法,因为在进行插入时是使用equals方法比较的

## LinkedHashMap
由键决定：有序、不重复、无索引。

继承自HashMap,没有额外的方法

有序指的是保证存储和取出的元素顺序一致原理：底层数据结构是依然哈希表，只是每个键值对元素又额外的多了一个双链表的机制记录存储的顺序。

# TreeMap
TreeMap跟TreeSet底层原理一样，都是红黑树结构的。
由键决定特性：不重复、无索引、可排序可排序：对键进行排序。
默认按照键的从小到大进行排序，也可以自己规定键的排序规则

**规定排序规则的两种方法**
- 实现comparable接口，指定比较规则。
- 创建集合时传递comparator比较器对象，指定比较规则，

# 可变参数
方法形参的个数是可以发生变化的

在一个方法的形参中只能有一个可变参数,且必须放在形参列表最后

将可变参数当作数组使用即可,它底层就是被编译器自动封装成一个数组
```
属性类型...名字

int...args

public static int getSum(int...args){
	int sum=0;
	for(int i:args){
		sum+=i;
	}
	return sum;
}
```

# Collections
和Collection不一样它是集合的工具类。


| 方法名称                                                               | 说明               |
| ------------------------------------------------------------------ | ---------------- |
| public static \<T> boolean addAll(Collection\<T> c, T... elements) | 批量添加元素           |
| public static void shuffle(List\<?> list)                          | 打乱List集合元素的顺序    |
| public static \<T> void sort(List\<T> list)                        | 排序               |
| public static \<T> void sort(List\<T> list, Comparator\<T> c)      | 根据指定的规则进行排序      |
| public static \<T> int binarySearch (List\<T> list, T key)         | 以二分查找法查找元素       |
| public static \<T> void copy(List\<T> dest, List\<T> src)          | 拷贝集合中的元素         |
| public static \<T> int fill (List\<T> list, T obj)                 | 使用指定的元素填充集合      |
| public static \<T> void max/min(Collection\<T> coll)               | 根据默认的自然排序获取最大/小值 |
| public static \<T> void swap(List\<?> list, int i, int j)          | 交换集合中指定位置的元素     |

# 不可变集合
如果想要让别人只对一个集合有查询权限而没有修改权限就可以使用不可变集合
在List、Set、Map接口中，都存在静态的of方法，可可以获取一个不可变的集合

| 方法名称                                     | 说明                  |
| ---------------------------------------- | ------------------- |
| static \<E> List\<E> of(E...elements)    | 创建一个具有指定元素的List集合对象 |
| static \<E> Set\<E> of(E...elements)     | 创建一个具有指定元素的Set集合对象  |
| static <K, V> Map<K, V> of(E...elements) | 创建一个具有指定元素的Map集合对象  |
通过这些方法获取到的集合不能添加，不能删除，不能修改
