---
title: 4 Qt中常用的类
createTime: 2025/06/22 10:40:12
permalink: /cpp/qt/4/
---
# QObject
qt中类可以指定一个父对象，如果不指定父对象那它就是单独的窗口，如果指定父对象该窗口就内嵌到父对象窗口中，父对象析构会连带着子对象一块析构

QObject类是所有使用元对象系统的类的基类
必须在一个类的开头部分插入宏Q_OBJECT，才可以使用元对象系统的特性。包括开启信号和槽机制，建议所有QObject的子类都加上这个宏，不管用不用到信号和槽
当MOC发现类中定义了Q_OBJECT宏时，会为其生成相应的C++源文件元对象编译器（Meta-Object Compiler，Moc）是一个预处理器，先将Qt的特性程序转换为标准C++程序，再由标准C++编译器进行编译

- 元对象（meta object）：每个QObject及其子类的实例都有一个元对象（静态变量staticMetaObject）。函数metaObject()可以返回它的指针。
- 类型信息：QObject的inherits()函数可以判断继承关系。
调用inherits()函数时在括号里填上类型名的字符串，然后判断调用者是否是它的子类。返回布尔类型
- 动态翻译：函数tr()返回一个字符串的翻译版本。
- 对象树：表示对象间从属关系的树状结构。QObject提供了parent()、children()findChildren(等函数。对象树种的某个对象被删除时，它的子对象也将被删除
- 信号和槽：对象间的通信机制。
- 属性系统：可以使用宏Q_PROPERTY定义属性，QObject的setProperty()会设置属性的值或定义动态属性；property函数会返回属性的值。（多用于把开发的内容与其他语言联系的情况）

元对象是对类的描述，包含类信息、方法、属性等元数据。
QObject和QMetaObject提供了一些函数接口，可以获取运行时类型信息，类似标准C++中的RTTI(run time type information)

## 常用的函数

| 函数                                     | 作用                                                 |
| -------------------------------------- | -------------------------------------------------- |
| cick()                                 | 表示是否被点击                                            |
| clicked(bool)                          | 表示是否被选中（点击过）                                       |
| setObjectName("name")                  | 用来设置对象名字                                           |
| objectName()                           | 用来查询名字                                             |
| deleteLater()                          | 稍后删除当窗口使用exec()函数阻塞窗口退出时使用这个deleteLater()会在窗口关闭后删除 |
| exec()                                 | 阻塞函数，消息驱动循环、时间驱动循环，使窗口阻塞一直运行，点击关闭才会跳出循环停止运行        |
| bool QObject::blockSignals(bool block) | 阻断信号，参数填true就是阻断信号，填false就是不阻断                     |

## 属性

在QObject的子类中可以通过Q_PROPERTY宏定义属性
常用于qml
[ ]表示可选项
|表示或

| 关键字                                                                                             | 作用                                       |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------- |
| (READ getFunction [WRITE setFunction]lMEMBER memberName[(READ getFunction I WRITE setFunction)] | red表示读，\|或表示没有read就必须要有member指定一个对象与属性关联 |
| [RESET resetFunction]                                                                           | 指定一个函数重新设置属性的值                           |
| [NOTIFY notifySignal]                                                                           | 当属性值变化的时候会发出信号                           |
| [REVISION int [ REVISION(int[,int])]-                                                           | revision表示api的版本，在指定的版本中才会用到             |
| [DESIGNABLE bool]                                                                               | 在qtcreate中需要用到的话就把bool改为true             |
| [SCRIPTABLE bool]                                                                               | 表示是否可以通过脚本修改                             |
| [STORED bool]                                                                                   | 表示属性是否独立存在，或依赖其他值，在存储对象的状态时是否必须保存属性值     |
| [USER bool]                                                                                     | 用户是否可编辑                                  |
| [BINDABLE bool]                                                                                 | 是否有绑定的情况                                 |
| [CONSTANT]                                                                                      | 常量                                       |
| [FINAL]                                                                                         | 不可以重写                                    |
| [REQUIRED])                                                                                     | 需要的                                      |

## 对象树
QObject以对象树的形式组织自己，其构造函数里有一个parent参数。当用另一个对象作为父对象创建一个QObject时，它会被添加到父对象的children()列表中，而当父对象被删除时是时，它会被删除。这种方法非常适合GUI对象的需求。例如，QShortcut(键盘快捷键)是相关窗口的子对象，因此当用户关闭该窗口时，快捷键也会被删除。

**children()函数**
返回对象的子对象列表
原型：
```cpp
const QobjectList &Qobject::children()
```
函数的返回类型是Qobject类型指针列表（可遍历）
typedef QList<Qobject*> QobjectList;
对于界面上的容器类组件，容器内所有的组件（包括布局）都是其子对象

**findChild()函数**
返回此对象的1个具有给定名称的子对象，该子对象可以转换为类型T，如果没有该对象，则返回nullptr。
原型：
```cpp
template <typename T> T Qobject::findchild(const QString &name = QString(),Qt::Findchildoptions options = Qt::FindchildrenRecursively) const
```
第一个参数是对象的名字，省略name将匹配所有对象。
第二个选项是选项，表示是否往下进行寻找（查找所有子孙节点），搜索是递归执行的，如果options指定为FindDirectChildrenOnly则只查找字节点。
示例：
返回parentWidget的一个子按钮QPushButton，名为"button1"即使这个按钮不是父元素
```cpp
QPushButton *button = parentWidget->findChild<QPushButton *>("button1");
```

# QVariant变体

类似于Qt常见数据类型的union（类型不确定，某时刻只能为一种类型）。 但在Qt中比union强大很多, QVariant内置支持所有QMetaType::Type里声明的类型如:int，QString，QFont，QColor等，甚至QList，QMap<QString， QVariant>等组成的任意复杂类型。简单的说QVariant可以存储任意数据类型，表现的类似弱语言，如JS中的var如，包括容器类型的值，如QStringlist。Qt的很多功能都是建立在QVariant类的基础之上的，如Qt对象属性及数据库功能等，

如果要使自定义类型或其他非QMetaType内置类型在QVariant中使用，必须使用宏Q_DECLARE_METATYPE  
如果非QMetaType内置类型要在信号与槽中使用，必须使用qRegisterMetaType。

C++的union不支持具有非默认构造函数或析构函数的类型，所以大多数Qt类不能在union中使用。如果没有QVariant，这对于QObject:property()和库相关等来说将是一个问题。
QObject::property()原型：
```cpp
QVariant QObject::property(const char* name)const
```
各种属性的数据类型不同，需要使用QVariant类表示可以存储任意类型的数据

由于QVariant是Qt核心模块的一部分，不能提供到Qt GUI中定义的数据类型的转换函数，因此对于QtGUi模块中的一些类，QVariant没有相应的toT函数，需要通过QVariant:value()函数来得到指定类型的值：
```cpp
QFont font=this->font();//窗口的字体
QVariant var=font;//赋值给一个QVariant变量
QFont font2=var.value<QFont>()；//转换为QFont类型
```

## 方法

### 获取数据
它本身有一种方法toT()，例如：toInt()、toString()等都是const 的函数用于转换为具体的类型。toT()是复制和转换，并不会改变对象本身
```cpp
int n = v1.toInt(); // 将整数转换为int类型
QString str = v2.toString(); // 将字符串转换为QString类型
QList<int> list = v3.toList(); // 将整数列表转换为QList<int>类型
```

### 存储数据
可以通过构造函数、赋值操作符、setValue函数等方法将数据存储到QVariant对象中。
```cpp
QVariant v1 = 10; // 存储整数
QVariant v2 = "hello"; // 存储字符串
QVariant v3 = QList<int>() << 1 << 2 << 3; // 存储整数列表
```

### 判断数据类型
#### type()
可以使用type函数判断QVariant对象中存储的数据类型。
type()返回的是一个enum QMeatType的枚举值
```cpp
if (v1.type() == QVariant::Int) {}
```


### 类型转换
#### canConvert()
bool QVariant::canConvert(int targetTypeId) const
如果变量的类型可以转换为请求的类型targetTypeId，则返回true。
使用时需要进行模板的判定
```cpp
QVariant v=3;
v.canCovert<int>();
```
使用指定模板类型对变量进行判定，如果类型相等返回true，否则返回false
判定好后需要把数值转换回来使用value() 函数
#### convert()
bool QVariant::convert(int targetTypeId)
将变量转换为请求的类型targetTypeId。如果转换不能完成，则清除变量。如果成功转换了变量的当前类型，则返回true;否则返回false。

#### value()
T QVariant::value() const
返回转换为模板类型T的存储值。如果不能转换该值，将返回一个默认构造的值。
```cpp
QVariant v;
MyCustomStruct c;
if(v.canConvert<MyCustomStruct>()){
	c=v.value<MyCustomStruct>();
}
```
#### setValue()
将参数包装为QVariant类型

#### fromValue()
static QVariant QVariant::fromValue(const T &value)
返回一个包含值副本的QVariant。否则，其行为与setValue()完全相同。

### 清空数据
可以使用clear函数清空QVariant对象中存储的数据。
```cpp
v1.clear(); // 清空v1中存储的数据
```

## QVariant存储自定义类型
QVariant可以存储自定义类型，被QVariant存储的数据类型需要包含一个默认构造函数和一个拷贝构造函数，将Q_DECLARE_METATYPE(type)宏放在类声明所在的头文件下为该类型添加元数据
其中type就是用户自定义的类型
将自定义类型包装成QVariant类型就只能使用setValue，和fromValue
使用自定义类型包装的QVariant不能使用type()获取类型，type()返回的是一个enum QMeatType的枚举值，但自定义类型不在这个枚举值内
但可以使用canConvert()
```cpp
class MyCustomType {
public:
    MyCustomType() {}
    MyCustomType(int i, QString str) : m_i(i), m_str(str) {}

    int m_i;
    QString m_str;
};

Q_DECLARE_METATYPE(MyCustomType);

QDataStream& operator<<(QDataStream &out, const MyCustomType &val) {
    out << val.m_i << val.m_str;
    return out;
}

QDataStream& operator>>(QDataStream &in, MyCustomType &val) {
    in >> val.m_i >> val.m_str;
    return in;
}
```

## QVariant实现模板函数

QVariant还可以使用模板函数，实现任意类型转换:
```cpp
template
inline QVariant toVariant(const T &value){
    return QVariant::fromValue(value);
}
```

# QFlags
QFlags\<Enum>类是一个模板类，其中Enum是枚举类型。QFlags在Qt中用于存储枚举值的组合。

用于存储或组合枚举值的传统C++方法是使用整型变量。这种方法的不便之处在于根本没有类型检查，任何枚举值都可以与任何其他枚举值进行逻辑运算。

```cpp
enum Orientation{
    Up = 1,
    Down = 2,
    Left = 4,
    Right = 8,
};
 
enum Direction{
	horizontal = 2,
    vertical = 3,
};
Orientation::Up | Direction::horizontal;
Orientation::Up | Orientation::Down;
```
这两种操作编译器不会报错
第一种两个不相关的枚举值做逻辑运算没有意义，第二种运算结果是3，但Orientation中没有值是3的标识符。

QFlags\<Enum>是一个模板类，其中Enum是枚举类型，QFlags用于定义枚举值的或运算组合，在Qt中经常用到 QFlags 类。例如，QLabel 有一个alignment 属性，其读写函数分别定义如下:

```cpp
Qt::Alignment alignment()
void setAlignment(Ot::Alignment)
```

alignment属性值是Qt:Alignment类型Qt帮助文档中显示的Qt::Alignment信息有如下表示

```cpp
enum Qt::AlignmentFlag  //枚举类型
flags Qt::Alignment     //标志类型
```

第一行代码翻译一下就是Qt命名空间下的有一个变量名字叫做AlignmentFlag他是枚举类型

这表示Qt::Alignment是QFlags<Qt::AlignmentFlag>类型，但是Qt中并没有定义实际的类型Qt::Alignment

Qt::AlignmentFlag 是枚举类型，其有一些枚举常量。Ot::Alignment是一个或多个Qt:AlignmentFlag类型枚举值的组合，是一种特性标志。

## 自己定义类型使用QFlags
如果要对自己的枚举类型使用QFlags，应使用Q_DECLARE_FLAGS()和Q_DECLARE_OPERATORS_FOR_FLAGS()。

```cpp
例：
  class MyClass
  {
  public:
    enum Orientation
    {
        Up = 1,
        Down = 2,
        Left = 4,
        Right = 8,
    };
    Q_DECLARE_FLAGS(Orientations, Orientation)
      ...
  };
  Q_DECLARE_OPERATORS_FOR_FLAGS(MyClass::Orientations)
```

这样为枚举Orientation创建了一个Flags：Orientations，这个Orientations的类型就是QFlags<MyClass::Orientation>。可以用Orientations对象接收逻辑运算的值了：

```cpp
Orientations f = Orientation::Up | Orientation::Down;
```

# QPoint坐标点
QPoint封装了我们常用的坐标点(x,y)，常用API如下

```cpp
// 构造函数  
// 构造一个坐标原点, 即(0, 0)  
QPoint::QPoint();  
// 参数为 x轴坐标, y轴坐标  
QPoint::QPoint(int xpos, int ypos);  
  
// 设置x轴坐标  
void QPoint::setX(int x);  
// 设置y轴坐标  
void QPoint::setY(int y);  
  
// 得到x轴坐标  
int QPoint::x() const;  
// 得到x轴坐标的引用  
int &QPoint::rx();  
// 得到y轴坐标  
int QPoint::y() const;  
// 得到y轴坐标的引用  
int &QPoint::ry();  
  
// 直接通过坐标对象进行算术运算: 加减乘除  
QPoint &QPoint::operator*=(float factor);  
QPoint &QPoint::operator*=(double factor);  
QPoint &QPoint::operator*=(int factor);  
QPoint &QPoint::operator+=(const QPoint &point);  
QPoint &QPoint::operator-=(const QPoint &point);  
QPoint &QPoint::operator/=(qreal divisor);  
  
// 其他API请自行查询Qt帮助文档, 不要犯懒哦哦哦哦哦......
```

# QLine直线

直线类，封装了两个坐标点（两点确定一条直线）
```cpp
// 构造函数
// 构造一个空对象
QLine::QLine();
// 构造一条直线, 通过两个坐标点
QLine::QLine(const QPoint &p1, const QPoint &p2);
// 从点 (x1, y1) 到 (x2, y2)
QLine::QLine(int x1, int y1, int x2, int y2);

// 给直线对象设置坐标点
void QLine::setPoints(const QPoint &p1, const QPoint &p2);
// 起始点(x1, y1), 终点(x2, y2)
void QLine::setLine(int x1, int y1, int x2, int y2);
// 设置直线的起点坐标
void QLine::setP1(const QPoint &p1);
// 设置直线的终点坐标
void QLine::setP2(const QPoint &p2);

// 返回直线的起始点坐标
QPoint QLine::p1() const;
// 返回直线的终点坐标
QPoint QLine::p2() const;
// 返回值直线的中心点坐标, (p1() + p2()) / 2
QPoint QLine::center() const;

// 返回值直线起点的 x 坐标
int QLine::x1() const;
// 返回值直线终点的 x 坐标
int QLine::x2() const;
// 返回值直线起点的 y 坐标
int QLine::y1() const;
// 返回值直线终点的 y 坐标
int QLine::y2() const;

// 用给定的坐标点平移这条直线（偏移量）
void QLine::translate(const QPoint &offset);
void QLine::translate(int dx, int dy);
// 用给定的坐标点平移这条直线, 返回平移之后的坐标点，有返回值
QLine QLine::translated(const QPoint &offset) const;
QLine QLine::translated(int dx, int dy) const;

// 直线对象进行比较，比较是否在同一位置
bool QLine::operator!=(const QLine &line) const;
bool QLine::operator==(const QLine &line) const;

// 其他API请自行查询Qt帮助文档, 不要犯懒哦哦哦哦哦......
```

# QSize窗口尺寸
用来形容长度和宽度
```cpp
// 构造函数  
// 构造空对象, 对象中的宽和高都是无效的  
QSize::QSize();  
// 使用宽和高构造一个有效对象  
QSize::QSize(int width, int height);  
  
// 设置宽度  
void QSize::setWidth(int width)  
// 设置高度  
void QSize::setHeight(int height);  
  
// 得到宽度  
int QSize::width() const;  
// 得到宽度的引用  
int &QSize::rwidth();  
// 得到高度  
int QSize::height() const;  
// 得到高度的引用  
int &QSize::rheight();  
  
// 交换高度和宽度的值  
void QSize::transpose();  
// 交换高度和宽度的值, 返回交换之后的尺寸信息  
QSize QSize::transposed() const;  
  
// 进行算法运算: 加减乘除  
QSize &QSize::operator*=(qreal factor);  
QSize &QSize::operator+=(const QSize &size);  
QSize &QSize::operator-=(const QSize &size);  
QSize &QSize::operator/=(qreal divisor);  
```

# QRect矩形
它结合了之前的坐标类和尺寸类
```cpp
// 构造函数
// 构造一个空对象
QRect::QRect();
// 基于左上角坐标, 和右下角坐标构造一个矩形对象
QRect::QRect(const QPoint &topLeft, const QPoint &bottomRight);
// 基于左上角坐标, 和 宽度, 高度构造一个矩形对象
QRect::QRect(const QPoint &topLeft, const QSize &size);
// 通过 左上角坐标(x, y), 和 矩形尺寸(width, height) 构造一个矩形对象
QRect::QRect(int x, int y, int width, int height);

// 设置矩形的尺寸信息, 左上角坐标不变
void QRect::setSize(const QSize &size);
// 设置矩形左上角坐标为(x,y), 大小为(width, height)
void QRect::setRect(int x, int y, int width, int height);
// 设置矩形宽度
void QRect::setWidth(int width);
// 设置矩形高度
void QRect::setHeight(int height);

// 返回值矩形左上角坐标
QPoint QRect::topLeft() const;
// 返回矩形右上角坐标
// 该坐标点值为: QPoint(left() + width() -1, top())
QPoint QRect::topRight() const;
// 返回矩形左下角坐标
// 该坐标点值为: QPoint(left(), top() + height() - 1)
QPoint QRect::bottomLeft() const;
// 返回矩形右下角坐标
// 该坐标点值为: QPoint(left() + width() -1, top() + height() - 1)
QPoint QRect::bottomRight() const;
// 返回矩形中心点坐标
QPoint QRect::center() const;

// 返回矩形上边缘y轴坐标
int QRect::top() const;
int QRect::y() const;
// 返回值矩形下边缘y轴坐标
int QRect::bottom() const;
// 返回矩形左边缘 x轴坐标
int QRect::x() const;
int QRect::left() const;
// 返回矩形右边缘x轴坐标
int QRect::right() const;

// 返回矩形的高度
int QRect::width() const;
// 返回矩形的宽度
int QRect::height() const;
// 返回矩形的尺寸信息
QSize QRect::size() const;
```

# 容器
QSet和标准C++中的set不一样,它不会自动排序,只能存储可比较的数据类型(即标准数据类型)
若想要让其可以存储自定义的类型需要重载该类型的\==运算符和qHash全局函数
因为QSet底层是使用QHash哈希表实现的
```cpp
bool operator==(const Card& left,const Card& right){
    return(left.point()==right.point() && left.suit()==right.suit());
}

uint qHash(const Card& card){
    return card.point()*100+card.suit();
}
```

但是可以存储指针类型
可以通过存储自定义类型的指针