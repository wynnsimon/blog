---
title: 1 简介
createTime: 2025/06/22 10:38:34
permalink: /cpp/qt/
---
解决clion中qdebug不输出内容的方法
在调试配置->环境变量中添加以下代码

```cpp
QT_ASSUME_STDERR_HAS_CONSOLE=1
```

```cpp
int main(int argc,char* argv[])
```
argc：命令行变量的数量
argv：命令行变量的数组

```cpp
return QApplication::exec();
```
exec()是一个while循环，退出条件是点击关闭窗口。

==方法规律==
Qt中如果想要获取属性信息使用属性名的方法，如果要设置属性使用set+属性名
r+属性名获取属性的引用
进行操作的方法使用一般现代时的是无返回值，使用过去时的是有返回值的
这是Qt中API函数的特点
如果set+属性名的函数参数是只有一个布尔类型，把函数改为is+属性名就是这个属性的判定函数，如果不是布尔类型，把set去掉使用属性名调用函数的返回值就能显示这个属性处于什么状态
属性面板中的属性优先级低于代码中的属性

界面组件：

| 组件名                      | 作用                                                                   |
| ------------------------ | -------------------------------------------------------------------- |
| Layouts                  | 布局                                                                   |
| Spacers                  | 弹簧，也用于布局                                                             |
| Buttons                  | 按钮                                                                   |
| Item Views（Model-Based）  | 视图控件（需要依赖一些模型），模型在Qt中主要用来存储数据的，主要目的是实现数据和显示的分离，经常用于数据量比较大的地方，主要用于数据库 |
| Item Widgets（Item-Based） | 对Item Views的简化，简单好用，缺点是不能实现视图和数据的分离                                  |
| Containers               | 容器相关的窗口                                                              |
| Input Widgets            | 输入类型的窗口                                                              |
| Display Widgets          | 展示使用的窗口                                                              |


## Qt中的模块
Qt类库里大量的类根据功能分为各种模块，这些模块又分为以下几大类：
- Qt 基本模块（Qt Essentials)：提供了 Qt 在所有平台上的基本功能。
- Qt 附加模块（Qt Add-Ons)：实现一些特定功能的提供附加价值的模块。
- 增值模块（Value-AddModules)：单独发布的提供额外价值的模块或工具。
- 技术预览模块（Technology Preview Modules）：一些处于开发阶段，但是可以作为技术预览使用的模块。
- Qt 工具（Qt Tools)：帮助应用程序开发的一些工具。

==Qt的主要模块==


# QApplication应用程序类

在同名的头文件中
用于控制窗口的输入

### exec()阻塞函数
调用这个函数程序并不会退出，程序进入事件循环

# 窗口类


qt有三个窗口类：QWidget、QDialog、QMainWindow

## QWidget
所有窗口类的基类
```cpp
MainWindow::MainWindow(QWidget *parent): QMainWindow(parent), ui(new Ui::MainWindow){
    ui->setupUi(this);

#if 0
    //一般在qt的构造函数中进行初始化操作（窗口、数据……）
    //显示当前窗口的时候，显示另外一个窗口TestWidget
    //创建窗口对象，没有给w对象指定父对象，就需要调用w的show()方法，而且弹出的w窗口是独立的
    TestWidget* w=new TestWidget;
    w->show();
#else
    //创建窗口对象，给w指定父对象
    //explicit TestWidget(QWidget* parent=null)
    //内嵌到父对象的窗口，不需要show()方法里面的元素就随父窗口一起弹出
    //这个时候子窗口就没有边框了
    TestWidget* w=new TestWidget(this);
#endif
}
```

## QDialog
```cpp
#if 0
//非模态
    //创建对话框窗口
    TestDialog* dlg=new TestDialog(this);//对话框窗口不管是指定父对象还是不指定父对象都不会内嵌到主窗口中
    dlg->show();//所以要show()方法才能显示
#else
//模态
    TestDialog* dlg=new TestDialog(this);
    //模态
    dlg->exec();
    //在取消阻塞模态对话框主窗口才会被构建出来，因为主窗口构造函数还没构造完成，阻塞在了当前位置
    //模态对话框在阻塞的时候是不能进行焦点切换的
    //模态对话框会阻塞程序的执行，不取消阻塞当前的窗口无法点击其他窗口

#endif
```

## QMainWindow

QMainWindow中菜单栏（menubar）和状态栏（statusbar）只能有一个，但工具栏（toolbar）可以有很多个

## Qt的坐标体系

==Qt的坐标原点在窗口的左上角，x轴向右递增，y轴向下递增==

内嵌的子窗口的坐标体系是它父窗口的坐标系

## QPushButton
```cpp
MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);

    this->move(10,10);

    //创建一个按钮，让这个按钮作为当前创建的子控件
    QPushButton* btna=new QPushButton(this);
    //移动按钮的位置
    btna->move(10,10);
    //给按钮设置固定的大小
    btna->setFixedSize(200,200);

    //创建第二个按钮
    QPushButton* btnb=new QPushButton(btna);//作为btna的子窗口
    //移动按钮的位置
    btnb->move(10,10);
    //给按钮设置固定的大小
    btnb->setFixedSize(100,100);

    //创建第二个按钮
    QPushButton* btnc=new QPushButton(btnb);//作为btnb的子窗口
    //移动按钮的位置
    btnc->move(10,10);
    //给按钮设置固定的大小
    btnc->setFixedSize(50,50);
}
```

## Qt的内存回收机制

在Qt中创建对象的时候会提供一个 `Parent对象指针`（可以查看类的构造函数），下面来解释这个parent到底是干什么的。

QObject是以对象树的形式组织起来的。`当你创建一个QObject对象时，会看到QObject的构造函数接收一个QObject指针作为参数，这个参数就是 parent，也就是父对象指针`。这相当于，在创建QObject对象时，可以提供一个其父对象，我们创建的这个QObject对象会自动添加到其父对象的children()列表。当父对象析构的时候，这个列表中的所有对象也会被析构。（注意，`这里的父对象并不是继承意义上的父类！`）

QWidget是能够在屏幕上显示的一切组件的父类。QWidget继承自QObject，因此也继承了这种对象树关系。一个孩子自动地成为父组件的一个子组件。因此，它会显示在父组件的坐标系统中，被父组件的边界剪裁。例如，当用户关闭一个对话框的时候，应用程序将其删除，那么，我们希望属于这个对话框的按钮、图标等应该一起被删除。事实就是如此，因为这些都是对话框的子组件。

Qt 引入对象树的概念，在一定程度上解决了内存问题。

- 当一个QObject对象在堆上创建的时候，Qt 会同时为其创建一个对象树。不过，对象树中对象的顺序是没有定义的。这意味着，销毁这些对象的顺序也是未定义的。
    
- 任何对象树中的 QObject对象 delete 的时候，如果这个对象有 parent，则自动将其从 parent 的children()列表中删除；如果有孩子，则自动 delete 每一个孩子。Qt 保证没有QObject会被 delete 两次，这是由析构顺序决定的。

综上所述, 我们可以得到一个结论: `Qt中有内存回收机制, 但是不是所有被new出的对象被自动回收, 满足条件才可以回收`, 如果想要在Qt中实现内存的自动回收, 需要满足以下两个条件:

- 创建的对象必须是QObject类的子类(间接子类也可以)
    
    - QObject类是没有父类的, Qt中有很大一部分类都是从这个类派生出去的
        
        - Qt中使用频率很高的窗口类和控件都是 QObject 的直接或间接的子类
        - 其他的类可以自己查阅Qt帮助文档
- 创建出的类对象, 必须要指定其父对象是谁, 一般情况下有两种操作方式:
```cpp
// 方式1: 通过构造函数  
// parent: 当前窗口的父对象, 找构造函数中的 parent 参数即可  
QWidget::QWidget(QWidget *parent = Q_NULLPTR, Qt::WindowFlags f = Qt::WindowFlags());  
QTimer::QTimer(QObject *parent = nullptr);  
  
// 方式2: 通过setParent()方法  
// 假设这个控件没有在构造的时候指定符对象, 可以调用QWidget的api指定父窗口对象  
void QWidget::setParent(QWidget *parent);  
void QObject::setParent(QObject *parent);
```
