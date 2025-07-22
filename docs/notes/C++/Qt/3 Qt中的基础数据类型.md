---
title: 3 Qt中的基础数据类型
createTime: 2025/06/22 10:39:02
permalink: /cpp/qt/3/
---
# qt中的基本数据类型
qt中基本数据类型定义在\<QtGlobal>中
qt自己实现基本数据类型是为了确保在各个平台上个数据类型都有统一确定的长度

| 类型名称       | 注释                                           | 备注                                         |
| ---------- | -------------------------------------------- | ------------------------------------------ |
| qint8      | signed char                                  | 有符号8位数据                                    |
| qint16     | signed short                                 | 16位数据类型                                    |
| qint32     | signed short                                 | 32位有符号数据类型                                 |
| qint64     | long long int 或(__ int64)                    | 64位有符号数据类型，Windows中定义为__ int64             |
| qintptr    | qint32 或 qint64                              | 指针类型 根据系统类型不同而不同，32位系统为qint32、64位系统为qint64 |
| qlonglong  | long long int 或(__ int64)                    | Windows中定义为__int64                         |
| qptrdiff   | qint32 或 qint64                              | 根据系统类型不同而不同，32位系统为qint32、64位系统为qint64      |
| qreal      | （实数）double 或 float                           | 除非配置了-qreal float选项，否则默认为double            |
| quint8     | unsigned char                                | 无符号8位数据类型                                  |
| quint16    | unsigned short                               | 无符号16位数据类型                                 |
| quint32    | unsigned int                                 | 无符号32位数据类型                                 |
| quint64    | unsigned long long int 或 (unsigned __ int64) | 无符号64比特数据类型，Windows中定义为unsigned __ int64   |
| quintptr   | quint32 或 quint64                            | 根据系统类型不同而不同，32位系统为quint32、64位系统为quint64    |
| qulonglong | unsigned long long int 或 (unsigned __ int64) | Windows中定义为__int64                         |
| uchar      | unsigned char                                | 无符号字符类型                                    |
| uint       | unsigned int                                 | 无符号整型                                      |
| ulong      | unsigned long                                | 无符号长整型                                     |
| ushort     | unsigned short                               | 无符号短整型                                     |
虽然在Qt中有属于自己的整形或者浮点型, 但是在变成过程中这些一般不用, 常用的类型关键字还是 C/C++中的 int, float, double 等。

# 宏定义
| 宏                              | 作用                                                                          |
| ------------------------------ | --------------------------------------------------------------------------- |
| qDebug(const char* message,……) | debugger窗体显示信息。类似的宏还有qWarning、qCritical、qFatal、qlnfo等，也是用于在 debugger窗体显示信息。 |
| QT_VERSION                     | 展开为数值形式 OxMMNNPP(MM= major, NN = minor, PP = patch)表示Qt 编译器版本。              |
| QT_VERSION_STR                 | 展开为Qt版本号的字符串                                                                |
| Q_BYTE_ORDER                   | 示系统内存中数据的字节序。在需要判断系统字节序时会用到                                                 |
| Q_BIG_ENDIAN                   | 表示大端字节序                                                                     |
| Q_LITTLE_ENDIAN                | 表示小端字节序。                                                                    |
| Q_DECL_IMPORT                  | 在使用或设计共享库时，用于导入库的内容                                                         |
| QDECL_EXPORT                   | 用于导出库的内容                                                                    |
| Q_UNUSED(name)                 | 于在函数中定义不在函数体里使用的参数（定义参数后不使用编译器会给出警告，使用这个宏可以消除警告）                            |
| foreach(variable,container)    | 用于容器类的遍历                                                                    |

# 容器类
Qt库提供了一组通用的基于模板的容器类。可用于存储指定类型的项。
例如，如果需要一个大小可变的QString数组，可以使用`QList<QString>`或`QStringList`。两者是一个东西
Qt容器类成比STL容器更轻巧（速度和存储优化）、更安全（线程安全）Qt容器提供了用于遍历的选代器。STL风格的选代器是最高效的迭代器，可以与Qt和STL的泛型算法一起使用。提供java风格的迭代器是为了向后兼容。

# log输出
在Qt中进行log输出, 一般不使用c中的`printf`, 也不是使用C++中的`cout`, Qt框架提供了专门用于日志输出的类, 头文件名为 `QDebug`, 使用方法如下:
```cpp
// 包含了QDebug头文件, 直接通过全局函数 qDebug() 就可以进行日志输出了  
qDebug() << "Date:" << QDate::currentDate();  
qDebug() << "Types:" << QString("String") << QChar('x') << QRect(0, 10, 50, 40);  
qDebug() << "Custom coordinate type:" << coordinate;  
  
// 和全局函数 qDebug() 类似的日志函数还有: qWarning(), qInfo(), qCritical()  
int number = 666;  
float i = 11.11;  
qWarning() << "Number:" << number << "Other value:" << i;  
qInfo() << "Number:" << number << "Other value:" << i;  
qCritical() << "Number:" << number << "Other value:" << i;  
  
qDebug() << "我是要成为海贼王的男人!!!";  
qDebug() << "我是隔壁的二柱子...";  
qDebug() << "我是鸣人, 我擅长嘴遁!!!";
```
使用上面的方法只能在项目调试过程中进行日志输出, 如果不是通过`IDE`进行程序调试, 而是直接执行`可执行程序`在这种情况下是没有日志输出窗口的, 因此也就看不到任何的日志输出。

默认情况下日志信息是不会打印到终端窗口的, 如果想要实现这样的效果, 必须在项目文件中添加相关的属性信息
打开项目文件（* .pro）找到配置项 config, 添加 console 控制台属性:
```cpp
CONFIG += c++11 console
```
属性信息添加完毕, `重新编译项目` 日志信息就可以打印到终端窗口了

# 字符串类型
| 语言类型 | 字符串类型                     |
| ---- | ------------------------- |
| C    | `char*`                   |
| C++  | `std::string`, `char*`    |
| Qt   | `QByteArray`, `QString` 等 |
qt的两种字符串类型没太大差距
## QByteArray
在Qt中`QByteArray`可以看做是c语言中 `char*`的升级版本。我们在使用这种类型的时候可通过这个类的构造函数申请一块动态内存，用于存储我们需要处理的字符串数据。
- 构造函数
```cpp
QByteArray::QByteArray();  // 构造空对象, 里边没有数据  
QByteArray::QByteArray(const char *data, int size = -1);  // 将data中的size个字符进行构造, 得到一个字节数组对象,如果 size==-1 函数内部自动计算字符串长度, 计算方式为: strlen(data)  
QByteArray::QByteArray(int size, char ch);// 构造一个长度为size个字节, 并且每个字节值都为ch的字节数组 
```

- 数据操作
每个操作都有相同效果的两个函数，一个为qt风格，一个为stl风格
```cpp
// 在尾部追加数据  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QByteArray &QByteArray::append(const QByteArray &ba);  
void QByteArray::push_back(const QByteArray &other);  
  
// 头部添加数据  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QByteArray &QByteArray::prepend(const QByteArray &ba);  
void QByteArray::push_front(const QByteArray &other);  
  
// 插入数据, 将ba插入到数组第 i 个字节的位置(从0开始)  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QByteArray &QByteArray::insert(int i, const QByteArray &ba);  
  
// 删除数据  
// 从大字符串中删除len个字符, 从第pos个字符的位置开始删除  
QByteArray &QByteArray::remove(int pos, int len);  
// 从字符数组的尾部删除 n 个字节  
void QByteArray::chop(int n);  
// 从字节数组的 pos 位置将数组截断 (前边部分留下, 后边部分被删除)  
void QByteArray::truncate(int pos);  
// 将对象中的数据清空, 使其为null  
void QByteArray::clear();  
  
// 字符串替换  
// 将字节数组中的 子字符串 before 替换为 after  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QByteArray &QByteArray::replace(const QByteArray &before, const QByteArray &after);
```

- 子字符串查找和判断
重载的同名函数分别是C++风格的和C语言风格的
```cpp
// 判断字节数组中是否包含子字符串 ba, 包含返回true, 否则返回false  
bool QByteArray::contains(const QByteArray &ba) const;  
bool QByteArray::contains(const char *ba) const;  
// 判断字节数组中是否包含子字符 ch, 包含返回true, 否则返回false  
bool QByteArray::contains(char ch) const;  
  
// 判断字节数组是否以字符串 ba 开始, 是返回true, 不是返回false  
bool QByteArray::startsWith(const QByteArray &ba) const;  
bool QByteArray::startsWith(const char *ba) const;  
// 判断字节数组是否以字符 ch 开始, 是返回true, 不是返回false  
bool QByteArray::startsWith(char ch) const;  
  
// 判断字节数组是否以字符串 ba 结尾, 是返回true, 不是返回false  
bool QByteArray::endsWith(const QByteArray &ba) const;  
bool QByteArray::endsWith(const char *ba) const;  
// 判断字节数组是否以字符 ch 结尾, 是返回true, 不是返回false  
bool QByteArray::endsWith(char ch) const;
```

- 遍历
```cpp
// 使用迭代器  
iterator QByteArray::begin();  
iterator QByteArray::end();  
  
// 使用数组的方式进行遍历  
// i的取值范围 0 <= i < size()  
char QByteArray::at(int i) const;  
char QByteArray::operator[](int i) const;
```

- 查看字节数
```cpp
// 返回字节数组对象中字符的个数  
int QByteArray::length() const;  
int QByteArray::size() const;  
int QByteArray::count() const;  
  
// 返回字节数组对象中 子字符串ba 出现的次数  
int QByteArray::count(const QByteArray &ba) const;  
int QByteArray::count(const char *ba) const;  
// 返回字节数组对象中 字符串ch 出现的次数  
int QByteArray::count(char ch) const;
```

- 类型转换
base表示要传入的数是几进制，默认为十进制
f=‘g'表示使用科学计数法
prec表示精度

ok用来判断转换是否成功
```cpp
// 将QByteArray类型的字符串 转换为 char* 类型  
char *QByteArray::data();  
const char *QByteArray::data() const;  
  
// int, short, long, float, double -> QByteArray  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QByteArray &QByteArray::setNum(int n, int base = 10);  
QByteArray &QByteArray::setNum(short n, int base = 10);  
QByteArray &QByteArray::setNum(qlonglong n, int base = 10);  
QByteArray &QByteArray::setNum(float n, char f = 'g', int prec = 6);  
QByteArray &QByteArray::setNum(double n, char f = 'g', int prec = 6);  
[static] QByteArray QByteArray::number(int n, int base = 10);  
[static] QByteArray QByteArray::number(qlonglong n, int base = 10);  
[static] QByteArray QByteArray::number(double n, char f = 'g', int prec = 6);  
  
// QByteArray -> int, short, long, float, double  
int QByteArray::toInt(bool *ok = Q_NULLPTR, int base = 10) const;  
short QByteArray::toShort(bool *ok = Q_NULLPTR, int base = 10) const;  
long QByteArray::toLong(bool *ok = Q_NULLPTR, int base = 10) const;  
float QByteArray::toFloat(bool *ok = Q_NULLPTR) const;  
double QByteArray::toDouble(bool *ok = Q_NULLPTR) const;  
  
// std::string -> QByteArray  
[static] QByteArray QByteArray::fromStdString(const std::string &str);  
// QByteArray -> std::string  
std::string QByteArray::toStdString() const;  
  
// 所有字符转换为大写  
QByteArray QByteArray::toUpper() const;  
// 所有字符转换为小写  
QByteArray QByteArray::toLower() const;
```

## QString

QString也是封装了字符串, 但是内部的编码为`utf8`, UTF-8属于Unicode字符集, `它固定使用多个字节（window为2字节, linux为3字节）来表示一个字符`，这样可以将世界上几乎所有语言的常用字符收录其中。

- 构造函数
```cpp
// 构造一个空字符串对象  
QString::QString();  
// 将 char* 字符串 转换为 QString 类型  
QString::QString(const char *str);  
// 将 QByteArray 转换为 QString 类型  
QString::QString(const QByteArray &ba);  
// 其他重载的同名构造函数可参考Qt帮助文档, 此处略
```
QByteArray里面就是char* 类型，但QString虽然提供的构造函数可以对char* 进行封装，但里面不是普通的char* 而是被处理过的char*

- 数据操作
```cpp
// 尾部追加数据  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QString &QString::append(const QString &str);  
QString &QString::append(const char *str);  
QString &QString::append(const QByteArray &ba);  
void QString::push_back(const QString &other);  
  
// 头部添加数据  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QString &QString::prepend(const QString &str);  
QString &QString::prepend(const char *str);  
QString &QString::prepend(const QByteArray &ba);  
void QString::push_front(const QString &other);  
  
// 插入数据, 将 str 插入到字符串第 position 个字符的位置(从0开始)  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QString &QString::insert(int position, const QString &str);  
QString &QString::insert(int position, const char *str);  
QString &QString::insert(int position, const QByteArray &str);  
  
// 删除数据  
// 从大字符串中删除len个字符, 从第pos个字符的位置开始删除  
QString &QString::remove(int position, int n);  
  
// 从字符串的尾部删除 n 个字符  
void QString::chop(int n);  
// 从字节串的 position 位置将字符串截断 (前边部分留下, 后边部分被删除)  
void QString::truncate(int position);  
// 将对象中的数据清空, 使其为null  
void QString::clear();  
  
// 字符串替换  
// 将字节数组中的 子字符串 before 替换为 after  
// 参数 cs 为是否区分大小写, 默认区分大小写  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QString &QString::replace(const QString &before, const QString &after, Qt::CaseSensitivity cs = Qt::CaseSensitive);
```

- 子字符串查找和判断
QString在进行字符串处理的时候多了cs参数用来区分大小写，QByteArray虽然有同名函数但不区分大小写
```cpp
// 参数 cs 为是否区分大小写, 默认区分大小写  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
  
// 判断字符串中是否包含子字符串 str, 包含返回true, 否则返回false  
bool QString::contains(const QString &str, Qt::CaseSensitivity cs = Qt::CaseSensitive) const;  
  
// 判断字符串是否以字符串 ba 开始, 是返回true, 不是返回false  
bool QString::startsWith(const QString &s, Qt::CaseSensitivity cs = Qt::CaseSensitive) const;  
  
// 判断字符串是否以字符串 ba 结尾, 是返回true, 不是返回false  
bool QString::endsWith(const QString &s, Qt::CaseSensitivity cs = Qt::CaseSensitive) const;
```

- 遍历
```cpp
// 使用迭代器  
iterator QString::begin();  
iterator QString::end();  
  
// 使用数组的方式进行遍历  
// i的取值范围 0 <= position < size()  
const QChar QString::at(int position) const  
const QChar QString::operator[](int position) const;
```

- 查看字节数
QString中所有的字都算一个字符，中文也算一个字符
QByteArray中一个汉字占三字节
```cpp
// 返回字节数组对象中字符的个数 (字符个数和字节个数是不同的概念)  
int QString::length() const;  
int QString::size() const;  
int QString::count() const;  
  
// 返回字节串对象中 子字符串 str 出现的次数  
// 参数 cs 为是否区分大小写, 默认区分大小写  
int QString::count(const QStringRef &str, Qt::CaseSensitivity cs = Qt::CaseSensitive) const;
```

- 类型转换
```cpp
// 将int, short, long, float, double 转换为 QString 类型  
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QString &QString::setNum(int n, int base = 10);  
QString &QString::setNum(short n, int base = 10);  
QString &QString::setNum(long n, int base = 10);  
QString &QString::setNum(float n, char format = 'g', int precision = 6);  
QString &QString::setNum(double n, char format = 'g', int precision = 6);  
[static] QString QString::number(long n, int base = 10);  
[static] QString QString::number(int n, int base = 10);  
[static] QString QString::number(double n, char format = 'g', int precision = 6);  
  
// 将 QString 转换为 int, short, long, float, double 类型  
int QString::toInt(bool *ok = Q_NULLPTR, int base = 10) const;  
short QString::toShort(bool *ok = Q_NULLPTR, int base = 10) const;  
long QString::toLong(bool *ok = Q_NULLPTR, int base = 10) const  
float QString::toFloat(bool *ok = Q_NULLPTR) const;  
double QString::toDouble(bool *ok = Q_NULLPTR) const;  
  
// 将标准C++中的 std::string 类型 转换为 QString 类型  
[static] QString QString::fromStdString(const std::string &str);  
// 将 QString 转换为 标准C++中的 std::string 类型  
std::string QString::toStdString() const;  
  
// QString -> QByteArray  
// 转换为本地编码, 跟随操作系统  
QByteArray QString::toLocal8Bit() const;  
// 转换为 Latin-1 编码的字符串 不支持中文  
QByteArray QString::toLatin1() const;  
// 转换为 utf8 编码格式的字符串 (常用)  
QByteArray QString::toUtf8() const;  
  
// 所有字符转换为大写  
QString QString::toUpper() const;  
// 所有字符转换为小写  
QString QString::toLower() const;
```

- 字符串格式
```cpp
// 其他重载的同名函数可参考Qt帮助文档, 此处略  
QString QString::arg(const QString &a,   int fieldWidth = 0,   QChar fillChar = QLatin1Char( ' ' )) const;  
QString QString::arg(int a, int fieldWidth = 0,   int base = 10,   QChar fillChar = QLatin1Char( ' ' )) const;  
  
// 示例程序  
int i;                // 假设该变量表示当前文件的编号  
int total;            // 假设该变量表示文件的总个数  
QString fileName;     // 假设该变量表示当前文件的名字  
// 使用以上三个变量拼接一个动态字符串  
QString status = QString("Processing file %1 of %2: %3")  
.arg(i).arg(total).arg(fileName);
```
