---
title: 11 Buttons按钮
createTime: 2025/06/22 10:42:30
permalink: /cpp/qt/11/
---
# QAbstractButton按钮基类

| 名称           | 作用                    |
| ------------ | --------------------- |
| QPushButton  | 普通按钮                  |
| QToolButton  | 普通按钮，和QPushButton区别很小 |
| QRadioButton | 单选按钮                  |
| QCheckBox    | 带复选框的按钮               |

## QAbstractButtonAPI
### 标题和图标
```cpp
// 参数text的内容显示到按钮上
void QAbstractButton::setText(const QString &text);
// 得到按钮上显示的文本内容, 函数的返回就是
QString QAbstractButton::text() const;

// 得到按钮设置的图标
QIcon icon() const;
// 给按钮设置图标
void setIcon(const QIcon &icon);

// 得到按钮图标大小
QSize iconSize() const
// 设置按钮图标的大小
[slot]void setIconSize(const QSize &size);
```

### 按钮的 Check 属性

对应按钮来说, 一般有三种常见状态, 分别为: Normal, Hover, Pressed。
- Normal: 普通状态, 没有和鼠标做任何接触
- Hover: 悬停状态, 鼠标位于按钮之上, 但是并未按下
- Pressed: 按压状态, 鼠标键在按钮上处于按下状态
默认情况下, 鼠标在按钮上按下, 按钮从 Normal 切换到 Pressed状态, 鼠标释放, 按钮从 Pressed恢复到Normal状态。
当我们给按钮设置了 check 属性之后，情况就有所不同了， 在按钮上释放鼠标键， 按钮依然会处在 Pressed状态, 再次点击按钮, 按钮才能恢复到 Normal 状态。具有check属性的按钮就相当于一个开关, 每点击一次才能实现一次状态的切换。

```cpp
// 判断按钮是否设置了checkable属性, 如果设置了点击按钮, 按钮一直处于选中状态
// 默认这个属性是关闭的, not checkable
bool QAbstractButton::isCheckable() const;
// 设置按钮的checkable属性
// 参数为true: 点击按钮, 按钮被选中, 松开鼠标, 按钮不弹起
// 参数为false: 点击按钮, 按钮被选中, 松开鼠标, 按钮弹起
void QAbstractButton::setCheckable(bool);
   
// 判断按钮是不是被按下的选中状态
bool QAbstractButton::isChecked() const;
// 设置按钮的选中状态: true-选中, false-没选中
// 设置该属性前, 必须先进行 checkable属性的设置
void QAbstractButton::setChecked(bool);
```

### 信号
这些信号都按钮被点击之后发射出来的, 只是在细节上有细微的区别, 其中最常用的是 clicked(), 通过鼠标的不同瞬间状态可以发射出pressed() 和 released() 信号, 如果鼠标设置了 check属性, 一般通过 toggled()信号判断当前按钮是选中状态还是非选中状态。

```cpp
/*
当按钮被激活时(即，当鼠标光标在按钮内时按下然后释放)，当键入快捷键时，或者当click()或animateClick()被调用时，这个信号被发出。值得注意的是，如果调用setDown()、setChecked()或toggle()，则不会触发此信号。
*/
//只要点击一下按钮就会发出信号，如果这个按钮是一个可以被选中的按钮（类似开关），其状态会随参数传递出去，参数默认为false就是未选中状态
[signal] void QAbstractButton::clicked(bool checked = false);
// 在按下按钮的时候发射这个信号
[signal] void QAbstractButton::pressed();
// 在释放这个按钮的时候发射直观信号
[signal] void QAbstractButton::released();
// 每当可检查按钮改变其状态时，就会发出此信号。checked在选中按钮时为true，在未选中按钮时为false。
[signal] void QAbstractButton::toggled(bool checked);
```

### 槽函数
```cpp
// 执行一个动画点击:按钮被立即按下，并在毫秒后释放(默认是100毫秒)。
[slot] void QAbstractButton::animateClick(int msec = 100);
// 执行一次按钮点击, 相当于使用鼠标点击了按钮
[slot] void QAbstractButton::click();

// 根据bool参数设置按钮被按下的状态（打开或取消）
[slot] void QAbstractButton::setChecked(bool);
// 设置按钮上图标大小
[slot]void setIconSize(const QSize &size);
// 切换可检查按钮的状态。 checked <==> unchecked
[slot] void QAbstractButton::toggle();
```
toggle点击是切换状态

## QPushButton
这个类没有信号，只是用它父类的信号够用了
### 常用API
```cpp
// 构造函数
/*
参数:
    - icon: 按钮上显示的图标
    - text: 按钮上显示的标题
    - parent: 按钮的父对象, 可以不指定
*/
QPushButton::QPushButton(const QIcon &icon, const QString &text, QWidget *parent = nullptr);
QPushButton::QPushButton(const QString &text, QWidget *parent = nullptr);
QPushButton::QPushButton(QWidget *parent = nullptr);

// 判断按钮是不是默认按钮
bool isDefault() const;
// 一般在对话框窗口中使用, 将按钮设置为默认按钮, 自动关联 Enter 键 
void setDefault(bool);

/*
将弹出菜单菜单与此按钮关联起来。这将把按钮变成一个菜单按钮，
在某些样式中会在按钮文本的右边产生一个小三角形。
*/
void QPushButton::setMenu(QMenu *menu);

/*
显示(弹出)相关的弹出菜单。如果没有这样的菜单，这个函数什么也不做。
这个函数直到弹出菜单被用户关闭后才返回。
*/
[slot] void QPushButton::showMenu();
```

## QToolButton
这个类也是一个常用按钮类, 使用方法和功能跟QPushButton基本一致, 只不过在对于关联菜单这个功能点上, QToolButton类可以设置弹出的菜单的属性, 以及在显示图标的时候可以设置更多的样式, 可以理解为是一个增强版的QPushButton。

```cpp
///////////////////////////// 构造函数 /////////////////////////////
QToolButton::QToolButton(QWidget *parent = nullptr);

/////////////////////////// 公共成员函数 ///////////////////////////
/*
    1. 将给定的菜单与此工具按钮相关联。
    2. 菜单将根据按钮的弹出模式显示。
    3. 菜单的所有权没有转移到“工具”按钮(不能建立父子关系)
*/
void QToolButton::setMenu(QMenu *menu);
// 返回关联的菜单，如果没有定义菜单，则返回nullptr。
QMenu *QToolButton::menu() const;

/*
弹出菜单的弹出模式是一个枚举类型: QToolButton::ToolButtonPopupMode, 取值如下:
    - QToolButton::DelayedPopup: 
        - 延时弹出, 按压工具按钮一段时间后才能弹出, 比如:浏览器的返回按钮
        - 长按按钮菜单弹出, 但是按钮的 clicked 信号不会被发射
    - QToolButton::MenuButtonPopup: 
        - 在这种模式下，工具按钮会显示一个特殊的箭头，表示有菜单。
	- 当按下按钮的箭头部分时，将显示菜单。按下按钮部分发射 clicked 信号
    - QToolButton::InstantPopup: 
        - 当按下工具按钮时，菜单立即显示出来。
        - 在这种模式下，按钮本身的动作不会被触发(不会发射clicked信号
*/
// 设置弹出菜单的弹出方式
void setPopupMode(QToolButton::ToolButtonPopupMode mode);
// 获取弹出菜单的弹出方式
QToolButton::ToolButtonPopupMode popupMode() const;

/*
QToolButton可以帮助我们在按钮上绘制箭头图标, 是一个枚举类型, 取值如下: 
    - Qt::NoArrow: 没有箭头
    - Qt::UpArrow: 箭头向上
    - Qt::DownArrow: 箭头向下
    - Qt::LeftArrow: 箭头向左
    - Qt::RightArrow: 箭头向右
*/
// 显示一个箭头作为QToolButton的图标。默认情况下，这个属性被设置为Qt::NoArrow。
void setArrowType(Qt::ArrowType type);
// 获取工具按钮上显示的箭头图标样式
Qt::ArrowType arrowType() const;

///////////////////////////// 信号函数 /////////////////////////////
//必须要使用setDEfaultAction()设置一个QAction的对象，不设置QAction类型的对象信号是不会发出来的，当关联一个QAction的对象，点击这个按钮就俩党羽点击了这个按钮上的QAction就能得到这个QAction对象，得到这个对象后可以对里面的数据进行更新
void triggered(QAction *action);

///////////////////////////// 槽函数 /////////////////////////////
// 给按钮关联一个QAction对象, 主要目的是美化按钮
[slot] void QToolButton::setDefaultAction(QAction *action);
// 返回给按钮设置的QAction对象
QAction *QToolButton::defaultAction() const;

/*
图标的显示样式是一个枚举类型->Qt::ToolButtonStyle, 取值如下:
    - Qt::ToolButtonIconOnly: 只有图标, 不显示文本信息
    - Qt::ToolButtonTextOnly: 不显示图标, 只显示文本信息
    - Qt::ToolButtonTextBesideIcon: 文本信息在图标的后边显示
    - Qt::ToolButtonTextUnderIcon: 文本信息在图标的下边显示
    - Qt::ToolButtonFollowStyle: 跟随默认样式(只显示图标)
*/
// 设置的这个属性决定工具按钮是只显示一个图标、只显示文本，还是在图标旁边/下面显示文本。
[slot] void QToolButton::setToolButtonStyle(Qt::ToolButtonStyle style);
// 返回工具按钮设置的图标显示模式
Qt::ToolButtonStyle toolButtonStyle() const;

// 显示相关的弹出菜单。如果没有这样的菜单，这个函数将什么也不做。这个函数直到弹出菜单被用户关闭才会返回。
[slot] void QToolButton::showMenu();
```

## sizePolicy : QSizePolicy
QSizePolicy类用于描述布局中的水平和垂直大小调整策略。它包含两个枚举值垂直其值是枚举类型QSizePolicy::Policy，还包含stretch值

## QRadioButton
一般不会单独使用，而是成组使用
QRadioButton是Qt提供的单选按钮, 一般都是以组的方式来使用(多个按钮中同时只能选中其中一个)。操作这个按钮使用的大部分函数都是从父类继承过来的, 它的父类是QAbstractButton。
关于单选按钮的使用我们还需要注意一点, 如果单选按钮被选中, 再次点击这个按钮选中状态是不能被取消的。
在官方的帮助文档中, 除了构造函数就没有再提供其他可用的 API了
```cpp
// 构造函数
/*
参数:
    - text: 按钮上显示的标题
    - parent: 按钮的父对象
*/
QRadioButton::QRadioButton(const QString &text, QWidget *parent = nullptr);
QRadioButton::QRadioButton(QWidget *parent = nullptr);
```
在同一窗口中, Qt会认为所有的单选按钮都属于同一组, 如果需要多个单选按钮组, 应该将他们放到不同的容器中（QWidget是最简单的容器）。
经常使用Group Box进行分组，Group Box和QWidget最大的区别就是能在左上角给分组命名
如果我们使用鼠标点击了某个单选按钮, 按钮还是会发射出 clicked()信号

## QCheckBox
QCheckBox是Qt中的复选框按钮, 可以单独使用, 也可以以组的方式使用(同一组可以同时选中多个), 当复选按钮被选中, 再次点击之后可以取消选中状态, 这一点和单选按钮是不同的。

### 常用API
我们对复选框按钮操作的时候, 可以设置选中和未选中状态, 并且还可以设置半选中状态, 这种半选中状态一般需要当前复选框按钮下还有子节点, 类似一树状结构。

**公共成员函数**
```cpp
// 构造函数
/*
参数:
    - text: 按钮上显示的文本信息
    - parent: 按钮的父对象
*/
QCheckBox::QCheckBox(const QString &text, QWidget *parent = nullptr);
QCheckBox::QCheckBox(QWidget *parent = nullptr);

// 判断当前复选框是否为三态复选框, 默认情况下为两种状态: 未选中, 选中
bool isTristate() const;
// 设置当前复选框为三态复选框: 未选中, 选中, 半选中。设置半选中状态只能用到此函数
void setTristate(bool y = true);

/*
参数 state, 枚举类型 Qt::CheckState:
    - Qt::Unchecked	      --> 当前复选框没有被选中
    - Qt::PartiallyChecked    --> 当前复选框处于半选中状态, 部分被选中(三态复选框)
    - Qt::Checked	      --> 当前复选框处于选中状态
*/
// 设置复选框按钮的状态
void QCheckBox::setCheckState(Qt::CheckState state);
// 获取当前复选框的状态
Qt::CheckState QCheckBox::checkState() const;
```

**信号**
```cpp
// 当复选框的状态改变时，即当用户选中或取消选中复选框时，他的信号就会发出。
// 参数 state 表示的是复选框的三种状态中某一种, 可参考 Qt::CheckState
//CheckState是一个枚举类型，它包括：
//Qt::Unchecked 没有被选中
//Qt::PartiallyChecked 部分被选中
//Qt::Checked 选中
[signal] void QCheckBox::stateChanged(int state);
```
没有选中框就是空白的，选中了框中就会有一个对号，部分被选中框中是一个小方块这涉及到多层节点
其中子节点只选中了一部分就是部分被选中状态
