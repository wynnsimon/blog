---
title: 9 Widget窗体
createTime: 2025/06/22 10:42:16
permalink: /cpp/qt/9/
---
Qt中常用的窗口类, 主要内容包括: 窗口类的基类QWidget, 对话框基类QDialog, 带菜单栏工具栏状态栏的QMainWindow, 消息对话框QMessageBox, 文件对话框QFileDialog, 字体对话框QFontDialog, 颜色对话框QColorDialog, 输入型对话框QInputDialog, 进度条对话框QProgressDialog, 资源文件。

**setAttribute(Qt::WA_DeleteOnClose)**
虽然qt有对象树机制可以帮助我们进行内存回收,但假设用户在操作页面时在一个父窗口中一直创建子窗口并关闭,但由于父窗口没有关闭,所以子窗口的内存也没有释放,可以调用`setAttribute` 对窗口进行设置在窗口关闭时就释放, 其参数对应的枚举值还有很多

# QWidget
QWidget类是所有窗口类的父类(控件类是也属于窗口类), 并且QWidget类的父类的QObject, 也就意味着所有的窗口类对象只要指定了父对象, 都可以实现内存资源的自动回收。
下面来介绍这个类常用的一些API函数。

QWidget是所有界面组件类的直接或间接父类。
widget组件：所有界面组件的统称，它从操作系统接收鼠标、键盘和其他事件，并在屏幕上显示自己。每个组件都是矩形的，并且按z轴顺序排列（类似图层）。

window:没有嵌入到父组件中的组件。通常，它有一个frame和一个标题栏，可以使用window flags 创建没有这两个装饰的窗口。在Qt中，QMainWindow和QDialog的各种子类是最常见的window类型。
### 设置父对象
```cpp
// 构造函数
QWidget::QWidget(QWidget *parent = nullptr, Qt::WindowFlags f = Qt::WindowFlags());

// 公共成员函数
// 给当前窗口设置父对象
void QWidget::setParent(QWidget *parent);
//设置父对象时改变窗口属性
void QWidget::setParent(QWidget *parent, Qt::WindowFlags f);
// 获取当前窗口的父对象, 没有父对象返回 nullptr
QWidget *QWidget::parentWidget() const;
```

### 窗口位置
```cpp
//------------- 窗口位置 -------------
// 得到相对于当前窗口父窗口的几何信息, 边框也被计算在内
QRect QWidget::frameGeometry() const;
// 得到相对于当前窗口父窗口的几何信息, 不包括边框
const QRect &geometry() const;
// 设置当前窗口的几何信息(位置和尺寸信息), 不包括边框
//x和y就是两个坐标组合就是QPoint，w和h就是宽度和高度两者组合就是QSize。QPoint和QSize组合就是QRect
void setGeometry(int x, int y, int w, int h);
void setGeometry(const QRect &);
    
// 移动窗口, 重新设置窗口的位置
void move(int x, int y);
void move(const QPoint &);
```
示例：
```cpp
// 获取当前窗口的位置信息
void MainWindow::on_positionBtn_clicked(){
    QRect rect = this->frameGeometry();
    qDebug() << "左上角: " << rect.topLeft()
             << "右上角: " << rect.topRight()
             << "左下角: " << rect.bottomLeft()
             << "右下角: " << rect.bottomRight()
             << "宽度: " << rect.width()
             << "高度: " << rect.height();
}

// 重新设置当前窗口的位置以及宽度, 高度
void MainWindow::on_geometryBtn_clicked(){
    int x = 100 + rand() % 500;
    int y = 100 + rand() % 500;
    int width = this->width() + 10;
    int height = this->height() + 10;
    setGeometry(x, y, width, height);
}

// 通过 move() 方法移动窗口
void MainWindow::on_moveBtn_clicked(){
    QRect rect = this->frameGeometry();
    move(rect.topLeft() + QPoint(10, 20));
}
```

### 窗口尺寸
```cpp
//------------- 窗口尺寸 -------------
// 获取当前窗口的尺寸信息
QSize size() const
// 重新设置窗口的尺寸信息
void resize(int w, int h);
void resize(const QSize &);
// 获取当前窗口的最大尺寸信息
QSize maximumSize() const;
// 获取当前窗口的最小尺寸信息
QSize minimumSize() const;
// 设置当前窗口固定的尺寸信息
void QWidget::setFixedSize(const QSize &s);
void QWidget::setFixedSize(int w, int h);
// 设置当前窗口的最大尺寸信息
void setMaximumSize(const QSize &);
void setMaximumSize(int maxw, int maxh);
// 设置当前窗口的最小尺寸信息
void setMinimumSize(const QSize &);
void setMinimumSize(int minw, int minh);


// 获取当前窗口的高度    
int height() const;
// 获取当前窗口的最小高度
int minimumHeight() const;
// 获取当前窗口的最大高度
int maximumHeight() const;
// 给窗口设置固定的高度
void QWidget::setFixedHeight(int h);
// 给窗口设置最大高度
void setMaximumHeight(int maxh);
// 给窗口设置最小高度
void setMinimumHeight(int minh);

// 获取当前窗口的宽度
int width() const;
// 获取当前窗口的最小宽度
int minimumWidth() const;
// 获取当前窗口的最大宽度
int maximumWidth() const;
// 给窗口设置固定宽度
void QWidget::setFixedWidth(int w);
// 给窗口设置最大宽度
void setMaximumWidth(int maxw);
// 给窗口设置最小宽度
void setMinimumWidth(int minw);
```

### 窗口标题和图标
```cpp
//------------- 窗口图标 -------------
// 得到当前窗口的图标
QIcon windowIcon() const;
// 构造图标对象, 参数为图片的路径
QIcon::QIcon(const QString &fileName);
// 设置当前窗口的图标
void setWindowIcon(const QIcon &icon);

//------------- 窗口标题 -------------
// 得到当前窗口的标题
QString windowTitle() const;
// 设置当前窗口的标题
void setWindowTitle(const QString &);
```
### 信号
```cpp
// QWidget::setContextMenuPolicy(Qt::ContextMenuPolicy policy);
// 窗口的右键菜单策略 contextMenuPolicy() 参数设置为 Qt::CustomContextMenu, 按下鼠标右键发射该信号
[signal] void QWidget::customContextMenuRequested(const QPoint &pos);
// 窗口图标发生变化, 发射此信号
[signal] void QWidget::windowIconChanged(const QIcon &icon);
// 窗口标题发生变化, 发射此信号
[signal] void QWidget::windowTitleChanged(const QString &title);
```

### 槽函数
窗口显示
```cpp
//------------- 窗口显示 -------------
// 关闭当前窗口
[slot] bool QWidget::close();
// 隐藏当前窗口
[slot] void QWidget::hide();
// 显示当前创建以及其子窗口
[slot] void QWidget::show();
// 全屏显示当前窗口, 只对windows有效
[slot] void QWidget::showFullScreen();
// 窗口最大化显示, 只对windows有效
[slot] void QWidget::showMaximized();
// 窗口最小化显示, 只对windows有效
[slot] void QWidget::showMinimized();
// 将窗口回复为最大化/最小化之前的状态, 只对windows有效
[slot] void QWidget::showNormal();

//------------- 窗口状态 -------------
// 判断窗口是否可用
bool QWidget::isEnabled() const; // 非槽函数
// 设置窗口是否可用, 不可用窗口无法接收和处理窗口事件
// 参数true->可用, false->不可用
[slot] void QWidget::setEnabled(bool);
// 设置窗口是否可用, 不可用窗口无法接收和处理窗口事件
// 参数true->不可用, false->可用
[slot] void QWidget::setDisabled(bool disable);
// 设置窗口是否可见, 参数为true->可见, false->不可见
[slot] virtual void QWidget::setVisible(bool visible);
```

# QMenu
 可配合QWidget的\[signal] void QWidget::customContextMenuRequested(const QPoint &pos);方法生成右键菜单项，也可以创建菜单

```cpp
//往菜单栏内添加选项，名称为QString类型的name
QAction* addAction(const QString &text);
//对于右键菜单选项常用带参的exec跟踪光标的位置在光标的位置生成菜单
QAction* exec(const QPoint &p,QAction *action=nullptr);
```
# QDialog

对话框分为==模态和非模态==
在模态对话框中对话框存在时无法与其他窗口操作,非模态对话框可以与其他窗口操作
常用exec使QDialog作为模态对话框展示出来（即焦点在QDialog对话框上面），当模态对话框执行中时焦点不可转移到其他对话框，除非关闭模态对话框
常用show函数使窗口以非模态形式展示出来
accept()和reject()会隐藏模态窗口，并分别发射accepted()和rejected()的信号，
对话框类是QWidget类的子类, 处理继承自父类的属性之外, 还有一些自己所特有的属性, 常用的一些API函数如下：
```cpp
// 构造函数
QDialog::QDialog(QWidget *parent = nullptr, Qt::WindowFlags f = Qt::WindowFlags());

// 模态显示窗口
[virtual slot] int QDialog::exec();
// 隐藏模态窗口, 并且解除模态窗口的阻塞, 将 exec() 的返回值设置为 QDialog::Accepted
[virtual slot] void QDialog::accept();
// 隐藏模态窗口, 并且解除模态窗口的阻塞, 将 exec() 的返回值设置为 QDialog::Rejected
[virtual slot] void QDialog::reject();
// 关闭对话框并将其结果代码设置为r。finished()信号将发出r;
// 如果r是QDialog::Accepted 或 QDialog::Rejected，则还将分别发出accept()或Rejected()信号。
[virtual slot] void QDialog::done(int r);

[signal] void QDialog::accepted();
[signal] void QDialog::rejected();
[signal] void QDialog::finished(int result);
```

## 常用使用方法

> [!example] 场景介绍
> 1. 有两个窗口, 主窗口和一个对话框子窗口
> 2. 对话框窗口先显示, 根据用户操作选择是否显示主窗口

#### 关于对话框窗口类的操作
```cpp
// 对话框窗口中三个普通按钮按下之后对应的槽函数
void MyDialog::on_acceptBtn_clicked(){
    this->accept();  // exec()函数返回值为QDialog::Accepted
}

void MyDialog::on_rejectBtn_clicked(){
    this->reject();  // exec()函数返回值为QDialog::Rejected
}

void MyDialog::on_donBtn_clicked(){
    // exec()函数返回值为 done() 的参数, 并根据参数发射出对应的信号
    this->done(666);   
}
```

#### 根据用户针对对话框窗口的按钮操作, 进行相应的逻辑处理。
```cpp
// 创建对话框对象
MyDialog dlg;    
int ret = dlg.exec();
if(ret == QDialog::Accepted){
    qDebug() << "accept button clicked...";
    // 显示主窗口
    MainWindow* w = new MainWindow;
    w->show();
}
else if(ret == QDialog::Rejected){
    qDebug() << "reject button clicked...";
    // 不显示主窗口
    ......
    ......
}
else{
    // ret == 666
    qDebug() << "done button clicked...";
    // 根据需求进行逻辑处理
    ......
    ......
}
```

## QDialog的子类
### QMessageBox
QMessageBox 对话框类是 QDialog 类的子类, 通过这个类可以显示一些简单的提示框, 用于展示警告、错误、问题等信息。关于这个类我们只需要掌握一些静态方法的使用就可以了。
**API - 静态函数**
```cpp
// 显示一个模态对话框, 将参数 text 的信息展示到窗口中
[static] void QMessageBox::about(QWidget *parent, const QString &title, const QString &text);

/*
参数:
- parent: 对话框窗口的父窗口
- title: 对话框窗口的标题
- text: 对话框窗口中显示的提示信息
- buttons: 对话框窗口中显示的按钮(一个或多个)
- defaultButton
    1. defaultButton指定按下Enter键时使用的按钮。
    2. defaultButton必须引用在参数 buttons 中给定的按钮。
    3. 如果defaultButton是QMessageBox::NoButton, QMessageBox会自动选择一个合适的默认值。
*/
// 显示一个信息模态对话框
[static] QMessageBox::StandardButton QMessageBox::information(
           QWidget *parent, const QString &title, 
           const QString &text, 
           QMessageBox::StandardButtons buttons = Ok,
           QMessageBox::StandardButton defaultButton = NoButton);

// 显示一个错误模态对话框默认显示ok选项
[static] QMessageBox::StandardButton QMessageBox::critical(
           QWidget *parent, const QString &title, 
           const QString &text, 
           QMessageBox::StandardButtons buttons = Ok,
           QMessageBox::StandardButton defaultButton = NoButton);

// 显示一个问题模态对话框默认显示Yes和No选项
[static] QMessageBox::StandardButton QMessageBox::question(
           QWidget *parent, const QString &title, 
           const QString &text, 
           QMessageBox::StandardButtons buttons = StandardButtons(Yes | No), 
           QMessageBox::StandardButton defaultButton = NoButton);

// 显示一个警告模态对话框
[static] QMessageBox::StandardButton QMessageBox::warning(
           QWidget *parent, const QString &title, 
           const QString &text, 
           QMessageBox::StandardButtons buttons = Ok,
           QMessageBox::StandardButton defaultButton = NoButton);
```

其中还有enum QMessageBox::StandardButtons枚举值，有很多对话框中显示的选项

### QFileDialog

QFileDialog 对话框类是 QDialog 类的子类, 通过这个类可以选择要打开/保存的文件或者目录。关于这个类我们只需要掌握一些静态方法的使用就可以了。
```cpp
/*
通用参数:
  - parent: 当前对话框窗口的父对象也就是父窗口
  - caption: 当前对话框窗口的标题
  - dir: 当前对话框窗口打开的默认目录
  - options: 当前对话框窗口的一些可选项,枚举类型, 一般不需要进行设置, 使用默认值即可
  - filter: 过滤器, 在对话框中只显示满足条件的文件, 可以指定多个过滤器, 使用 ;; 分隔
    - 样式举例: 
	- Images (*.png *.jpg)
	- Images (*.png *.jpg);;Text files (*.txt)
  - selectedFilter: 如果指定了多个过滤器, 通过该参数指定默认使用哪一个, 不指定默认使用第一个过滤器
*/
// 打开一个目录, 得到这个目录的绝对路径
[static] QString QFileDialog::getExistingDirectory(
                  QWidget *parent = nullptr, 
                  const QString &caption = QString(), 
                  const QString &dir = QString(), 
                  QFileDialog::Options options = ShowDirsOnly);

// 打开一个文件, 得到这个文件的绝对路径
[static] QString QFileDialog::getOpenFileName(
    	          QWidget *parent = nullptr, 
    		  const QString &caption = QString(), 
                  const QString &dir = QString(), 
                  const QString &filter = QString(), 
                  QString *selectedFilter = nullptr, 
                  QFileDialog::Options options = Options());

// 打开多个文件, 得到这多个文件的绝对路径
[static] QStringList QFileDialog::getOpenFileNames(
    	          QWidget *parent = nullptr, 
                  const QString &caption = QString(), 
                  const QString &dir = QString(), 
                  const QString &filter = QString(), 
                  QString *selectedFilter = nullptr, 
                  QFileDialog::Options options = Options());

// 打开一个目录, 使用这个目录来保存指定的文件
[static] QString QFileDialog::getSaveFileName(
    		  QWidget *parent = nullptr, 
                  const QString &caption = QString(), 
                  const QString &dir = QString(), 
                  const QString &filter = QString(), 
                  QString *selectedFilter = nullptr, 
                  QFileDialog::Options options = Options());
```

### QFontDialog

QFontDialog类是QDialog的子类, 通过这个类我们可以得到一个进行字体属性设置的对话框窗口, 和前边介绍的对话框类一样, 我们只需要调用这个类的静态成员函数就可以得到想要的窗口了。

#### QFont 字体类
关于字体的属性信息, 在QT框架中被封装到了一个叫QFont的类中, 下边为大家介绍一下这个类的API, 了解一下关于这个类的使用。
```cpp
// 构造函数
  QFont::QFont();
  /*
  常用第三个构造方法，前两个方法还需要后面调用函数设置
  参数:
    - family: 本地字库中的字体名, 通过 office 等文件软件可以查看
    - pointSize: 字体的字号，默认是-1并不是说字号是-1，而是12
    - weight: 字体的粗细, 有效范围为 0 ~ 99，默认-1是不加粗
    - italic: 字体是否倾斜显示, 默认不倾斜
  */
  QFont(const QFont &font);
  QFont(const QFont &font,const QPaintDevice *pd);
  QFont::QFont(const QString &family, int pointSize = -1, int weight = -1, bool italic = false);
  
  // 设置字体
  void QFont::setFamily(const QString &family);
  // 根据字号设置字体大小
  void QFont::setPointSize(int pointSize);
  // 根据像素设置字体大小
  void QFont::setPixelSize(int pixelSize);
  // 设置字体的粗细程度, 有效范围: 0 ~ 99
  void QFont::setWeight(int weight);
  // 设置字体是否加粗显示
  void QFont::setBold(bool enable);
  // 设置字体是否要倾斜显示
  void QFont::setItalic(bool enable);
  
  // 获取字体相关属性(一般规律: 去掉设置函数的 set 就是获取相关属性对应的函数名)
  QString QFont::family() const;
  bool QFont::italic() const;
  int QFont::pixelSize() const;
  int QFont::pointSize() const;
  bool QFont::bold() const;
  int QFont::weight() const;
```

#### QFontDialog类的静态API
```cpp
/*
参数:
  - ok: 传出参数, 用于判断是否获得了有效字体信息, 指定一个布尔类型变量地址
  - initial: 字体对话框中默认选中并显示该字体信息, 用于对话框的初始化
  - parent: 字体对话框窗口的父对象
  - title: 字体对话框的窗口标题
  - options: 字体对话框选项, 使用默认属性即可, 一般不设置
*/
  [static] QFont QFontDialog::getFont(
		bool *ok, const QFont &initial, 
		QWidget *parent = nullptr, const QString &title = QString(), 
		QFontDialog::FontDialogOptions options = FontDialogOptions());
  
  [static] QFont QFontDialog::getFont(bool *ok, QWidget *parent = nullptr);
```
示例：
```cpp
void MainWindow::on_fontdlg_clicked()
{
#if 1
    // 方式1
    bool ok;
    QFont ft = QFontDialog::getFont(
                &ok, QFont("微软雅黑", 12, QFont::Bold), this, "选择字体");
    qDebug() << "ok value is: " << ok;
#else
    // 方式2
    QFont ft = QFontDialog::getFont(NULL);
#endif
    // 将选择的字体设置给当前窗口对象
    this->setFont(ft);
}
```

**QWidget窗口字体设置**
```cpp
//得到当前窗口使用的字体
const QWidget::QFont& font()const;
//给当前窗口设置字体（只对当前窗口生效）
void QWidget::setFont(const QFont&);
```

**QApplication类字体设置**
```cpp
//得到当前应用程序对象使用的字体
[static] QFont QApplication::font();
//给当前应用程序对象设置字体，作用于当前应用程序的所有窗口
[static] void QApplication::setFont(const& font,const char* className=nullptr);
```

### QColorDialog

QColorDialog类是QDialog的子类, 通过这个类我们可以得到一个选择颜色的对话框窗口, 和前边介绍的对话框类一样, 我们只需要调用这个类的静态成员函数就可以得到想要的窗口了。

#### QColor颜色类
关于颜色的属性信息, 在QT框架中被封装到了一个叫QColor的类中, 下边为大家介绍一下这个类的API, 了解一下关于这个类的使用。
各种颜色都是基于红, 绿, 蓝这三种颜色调配而成的, 并且颜色还可以进行透明度设置, 默认是不透明的。

```cpp
// 构造函数
/*
值都是0~255
	r：红色
	g：绿色
	b：蓝色
	a：透明度alpha
	Qt::GlobalColor是一个枚举值，每个值都对应一个颜色
*/
QColor::QColor(Qt::GlobalColor color);
QColor::QColor(int r, int g, int b, int a = ...);
QColor::QColor();

// 参数设置 red, green, blue, alpha, 取值范围都是 0-255
void QColor::setRed(int red);		// 红色
void QColor::setGreen(int green);	// 绿色
void QColor::setBlue(int blue);	// 蓝色
void QColor::setAlpha(int alpha);	// 透明度, 默认不透明(255)
void QColor::setRgb(int r, int g, int b, int a = 255);//可以一次性把rgba设置进去

//获取对应rgba的数值
int QColor::red() const;
int QColor::green() const;
int QColor::blue() const;
int QColor::alpha() const;
//getRgb()函数的参数都是传出参数
void QColor::getRgb(int *r, int *g, int *b, int *a = nullptr) const;
```

#### QColorDialog静态API函数
```cpp
  // 弹出颜色选择对话框, 并返回选中的颜色信息
/*
参数:
    - initial: 对话框中默认选中的颜色, 用于窗口初始化
    - parent: 给对话框窗口指定父对象
    - title: 对话框窗口的标题
    - options: 颜色对话框窗口选项, 使用默认属性即可, 一般不需要设置
*/
  [static] QColor QColorDialog::getColor(
		const QColor &initial = Qt::white, 
		QWidget *parent = nullptr, const QString &title = QString(), 
		QColorDialog::ColorDialogOptions options = ColorDialogOptions());
```

###  QInputDialog

QInputDialog类是QDialog的子类, 通过这个类我们可以得到一个输入对话框窗口, 根据实际需求我们可以在这个输入窗口中输入整形, 浮点型, 字符串类型的数据, 并且还可以显示下拉菜单供使用者选择。

API - 静态函数
```cpp
/*
参数:
  - parent: 对话框窗口的父窗口
  - title: 对话框窗口显示的标题信息
  - label: 对话框窗口中显示的文本信息(用于描述对话框的功能)
  - value: 对话框窗口中显示的浮点值, 默认为 0
  - min: 对话框窗口支持显示的最小数值
  - max: 对话框窗口支持显示的最大数值
  - decimals: 浮点数的精度, 数值为几就保留浮点数后几位默认保留小数点以后1位
  - step: 步长, 通过对话框提供的按钮调节数值每次增长/递减的量
  - ok: 传出参数, 用于判断是否得到了有效数据, 一般不会使用该参数
  - flags: 对话框窗口的窗口属性, 使用默认值即可
  - items: 字符串列表, 用于初始化窗口中的下拉菜单, 每个字符串对应一个菜单项
  - current: 通过菜单项的索引指定显示下拉菜单中的哪个菜单项, 默认显示第一个(编号为0)
  - editable: 设置菜单项上的文本信息是否可以进行编辑, 默认为true, 即可以编辑
  - inputMethodHints: 设置显示模式, 默认没有指定任何特殊显示格式, 显示普通文本字符串
    - 如果有特殊需求, 可以参数帮助文档进行相关设置
  - text: 指定显示到多行输入框中的文本信息, 默认是空字符串
*/
// 得到一个可以输入浮点数的对话框窗口, 返回对话框窗口中输入的浮点数
[static] double QInputDialog::getDouble(
    		QWidget *parent, const QString &title, 
    		const QString &label, double value = 0, 
    		double min = -2147483647, double max = 2147483647, 
    		int decimals = 1, bool *ok = nullptr, 
    		Qt::WindowFlags flags = Qt::WindowFlags());

// 得到一个可以输入整形数的对话框窗口, 返回对话框窗口中输入的整形数
[static] int QInputDialog::getInt(
    		QWidget *parent, const QString &title, 
    		const QString &label, int value = 0, 
    		int min = -2147483647, int max = 2147483647, 
    		int step = 1, bool *ok = nullptr, 
    		Qt::WindowFlags flags = Qt::WindowFlags());

// 得到一个带下来菜单的对话框窗口, 返回选择的菜单项上边的文本信息
[static] QString QInputDialog::getItem(
    		QWidget *parent, const QString &title, 
    		const QString &label, const QStringList &items, 
    		int current = 0, bool editable = true, bool *ok = nullptr, 
    		Qt::WindowFlags flags = Qt::WindowFlags(), 
    		Qt::InputMethodHints inputMethodHints = Qt::ImhNone);

// 得到一个可以输入多行数据的对话框窗口, 返回用户在窗口中输入的文本信息
[static] QString QInputDialog::getMultiLineText(
    		QWidget *parent, const QString &title, const QString &label, 
    		const QString &text = QString(), bool *ok = nullptr, 
    		Qt::WindowFlags flags = Qt::WindowFlags(), 
    		Qt::InputMethodHints inputMethodHints = Qt::ImhNone);

// 得到一个可以输入单行信息的对话框窗口, 返回用户在窗口中输入的文本信息
/*
  - mode: 指定单行编辑框中数据的反馈模式, 是一个 QLineEdit::EchoMode 类型的枚举值
    - QLineEdit::Normal: 显示输入的字符。这是默认值
    - QLineEdit::NoEcho: 不要展示任何东西。这可能适用于连密码长度都应该保密的密码。
    - QLineEdit::Password: 显示与平台相关的密码掩码字符，而不是实际输入的字符。
    - QLineEdit::PasswordEchoOnEdit: 在编辑时按输入显示字符，否则按密码显示字符。
*/
[static] QString QInputDialog::getText(
    		QWidget *parent, const QString &title, const QString &label,
    		QLineEdit::EchoMode mode = QLineEdit::Normal, 
    		const QString &text = QString(), bool *ok = nullptr, 
    		Qt::WindowFlags flags = Qt::WindowFlags(), 
    		Qt::InputMethodHints inputMethodHints = Qt::ImhNone);
```

### QProgressDialog进度条对话框

QProgressDialog类是QDialog的子类, 通过这个类我们可以得到一个带进度条的对话框窗口, 这种类型的对话框窗口一般常用于文件拷贝、数据传输等实时交互的场景中。

常用API
```cpp
// 构造函数
/*
参数:
  - labelText: 对话框中显示的提示信息
  - cancelButtonText: 取消按钮上显示的文本信息
  - minimum: 进度条最小值
  - maximum: 进度条最大值
  - parent: 当前窗口的父对象
  - f: 当前进度窗口的flag属性, 使用默认属性即可, 无需设置
*/
QProgressDialog::QProgressDialog(
	QWidget *parent = nullptr, 
	Qt::WindowFlags f = Qt::WindowFlags());

QProgressDialog::QProgressDialog(
	const QString &labelText, const QString &cancelButtonText, 
	int minimum, int maximum, QWidget *parent = nullptr,
	Qt::WindowFlags f = Qt::WindowFlags());


// 设置取消按钮显示的文本信息
[slot] void QProgressDialog::setCancelButtonText(const QString &cancelButtonText);

// 公共成员函数和槽函数
QString QProgressDialog::labelText() const;
void QProgressDialog::setLabelText(const QString &text);

// 得到进度条最小值
int QProgressDialog::minimum() const;
// 设置进度条最小值
void QProgressDialog::setMinimum(int minimum);

// 得到进度条最大值
int QProgressDialog::maximum() const;
// 设置进度条最大值
void QProgressDialog::setMaximum(int maximum);

// 设置进度条范围(最大和最小值)
[slot] void QProgressDialog::setRange(int minimum, int maximum);

// 得到进度条当前的值
int QProgressDialog::value() const;
// 设置进度条当前的值
void QProgressDialog::setValue(int progress);


bool QProgressDialog::autoReset() const;
// 当value() = maximum()时，进程对话框是否调用reset()，此属性默认为true。
void QProgressDialog::setAutoReset(bool reset);


bool QProgressDialog::autoClose() const;
// 当value() = maximum()时，进程对话框是否调用reset()并且隐藏，此属性默认为true。
void QProgressDialog::setAutoClose(bool close);

// 判断用户是否按下了取消键, 按下了返回true, 否则返回false
bool wasCanceled() const;


// 重置进度条
// 重置进度对话框。wascancelled()变为true，直到进程对话框被重置。进度对话框被隐藏。
[slot] void QProgressDialog::cancel();
// 重置进度对话框。如果autoClose()为真，进程对话框将隐藏。
[slot] void QProgressDialog::reset();   

// 信号
// 当单击cancel按钮时，将发出此信号。默认情况下，它连接到cancel()槽。
[signal] void QProgressDialog::canceled();

// 设置窗口的显示状态(模态, 非模态)
/*
参数:
	Qt::NonModal  -> 非模态
	Qt::WindowModal	-> 模态, 阻塞父窗口
	Qt::ApplicationModal -> 模态, 阻塞应用程序中的所有窗口
*/
void QWidget::setWindowModality(Qt::WindowModality windowModality);
```

# QMainWindow
QMainWindow是标准基础窗口中结构最复杂的窗口, 其组成如下:

- 提供了菜单栏, 工具栏, 状态栏, 停靠窗口
- 菜单栏：只能有一个, 位于窗口的最上方
- 工具栏：可以有多个, 默认提供了一个, 窗口的上下左右都可以停靠
- 状态栏：只能有一个, 位于窗口最下方
- 停靠窗口（浮动窗口）： 可以有多个, 默认没有提供, 窗口的上下左右都可以停靠

## 菜单栏
关于顶级菜单可以直接在UI窗口中双击, 直接输入文本信息即可, 对应子菜单项也可以通过先双击在输入的方式完成添加, 但是这种方式不支持中文的输入。

一般情况下, 我们都是先在外面创建出QAction对象, 然后再将其拖拽到某个菜单下边, 这样子菜单项的添加就完成了。

```cpp
// 给菜单栏添加菜单
QAction *QMenuBar::addMenu(QMenu *menu);
QMenu *QMenuBar::addMenu(const QString &title);
QMenu *QMenuBar::addMenu(const QIcon &icon, const QString &title);

// 给菜单对象添加菜单项(QAction)
QAction *QMenu::addAction(const QString &text);
QAction *QMenu::addAction(const QIcon &icon, const QString &text);

// 添加分割线
QAction *QMenu::addSeparator();

// 点击QAction对象发出该信号
[signal] void QAction::triggered(bool checked = false);
```

## 工具栏

添加工具按钮
方式1：先创建QAction对象, 然后拖拽到工具栏中, 和添加菜单项的方式相同
方式2：如果不通过UI界面直接操作，那么就需要调用相关的API函数了
```cpp
// 在QMainWindow窗口中添加工具栏
void QMainWindow::addToolBar(Qt::ToolBarArea area, QToolBar *toolbar);
void QMainWindow::addToolBar(QToolBar *toolbar);
QToolBar *QMainWindow::addToolBar(const QString &title);

// 将Qt控件放到工具栏中
// 工具栏类: QToolBar
// 添加的对象只要是QWidget或者启子类都可以被添加
QAction *QToolBar::addWidget(QWidget *widget);

// 添加QAction对象
QAction *QToolBar::addAction(const QString &text);
QAction *QToolBar::addAction(const QIcon &icon, const QString &text);

// 添加分隔线
QAction *QToolBar::addSeparator()
```

## 状态栏
一般情况下, 需要在状态栏中添加某些控件, 显示某些属性, 使用最多的就是添加标签 QLabel
```cpp
// 类型: QStatusBar
void QStatusBar::addWidget(QWidget *widget, int stretch = 0);

[slot] void QStatusBar::clearMessage();
[slot] void QStatusBar::showMessage(const QString &message, int timeout = 0);
```

## 停靠窗口
停靠窗口可以通过鼠标拖动停靠到窗口的上、下、左、右，或者浮动在窗口上方。如果需要这种类型的窗口必须手动添加，如果在非QMainWindow类型的窗口中添加了停靠窗口, 那么这个窗口是不能移动和浮动的。
浮动窗口在工具栏中， 直接将其拖拽到UI界面上即可。
停靠窗口也有一个属性面板, 我们可以在其对应属性面板中直接进行设置和修改相关属性。
