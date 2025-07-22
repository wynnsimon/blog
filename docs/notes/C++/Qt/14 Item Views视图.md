---
title: 14 Item Views视图
createTime: 2025/06/22 10:43:10
permalink: /cpp/qt/14/
---
Item Views 组件是用于显示和编辑大量数据的强大工具集。这些组件允许你以表格、列表、树状等方式呈现数据，并提供了丰富的功能和灵活性。
Item View组件都继承自QAbstractItemModel
见的 Qt Item Views 组件：
1. QTableView：QTableView 是用于显示表格数据的组件。它提供了类似于电子表格的界面，支持排序、过滤、编辑等功能。
2. QListView：QListView 是用于显示列表数据的组件。它以垂直或水平的方式显示项目，并可通过设置不同的视图模式进行定制。
3. QTreeView：QTreeView 是用于显示树状数据的组件。它以层次结构的方式显示数据，并支持展开和折叠节点、排序、过滤等功能。
4. QTableWidget：QTableWidget 是 QTableView 的子类，它提供了一个方便的方式来显示和编辑简单的表格数据。相比于 QTableView，QTableWidget 更易于使用，但功能相对较少。
5. QTreeWidget：QTreeWidget 是 QTreeView 的子类，它提供了一个方便的方式来显示和编辑简单的树状数据。类似于 QTableWidget，QTreeWidget 更易于使用，但功能相对较少。
6. QStandardItemModel：QStandardItemModel 是一个可用于提供数据给 Item Views 组件的模型类。它提供了灵活的接口来管理和操作数据，包括插入、删除、修改等操作。

### 常见接口
**1.QAbstractItemModel：**  
```cpp
rowCount(): 返回模型中的行数。
columnCount(): 返回模型中的列数。
data(): 返回给定索引处的数据。
setData(): 设置给定索引处的数据。
headerData(): 返回给定行或列的标头数据。
index(): 返回给定行和列的模型索引。
parent(): 返回给定索引的父索引。
```
**2.QTableView**  
```cpp
insertRows(): 插入行。
removeRows(): 删除行。
insertColumns(): 插入列。
removeColumns(): 删除列。
sort(): 对模型数据进行排序。
```
**3.QListView 专用**  
```cpp
insertRows(): 插入行。
removeRows(): 删除行。
sort(): 对模型数据进行排序。
```
**4.QAbstractItemView：**  
```cpp
setModel(): 关联数据模型。
setSelectionModel(): 关联选择模型。
setIndexWidget(): 在指定索引处设置自定义小部件。
currentIndex(): 返回当前选择的模型索引。
selectedIndexes(): 返回所有选定的模型索引。
scrollTo(): 滚动到指定索引处。
edit(): 编辑指定索引处的单元格。
```

# Item Widgets简单视图
QListWidget     List Widget     列表单元控件  
QTreeWidget     Tree Widget     树形单元控件  
QTableWidget     Table Widget     表格单元控件

**一、ListWidget控件**  
    1.控件位置：Item Widget->ListWidget  
    2.控件介绍：ListWidget继承自QListView类，基于Item的列表控件。  
    3.控件属性设置选项：

        （1）name：该控件对应源代码内的名称  
        （2）font：设置该表格内部的字体  
        （3）count：保持项目的数目  
        （4）currentRow：保持当前项目的行  
        （5）sortingEnabled：是否对item排序

    4.常用成员函数：

        （1）QListWidget：：QListWidget（QWidget *parent = 0）

        构造父对象为parent的ListWidget

        （2）void QListWidget：：addItem（QListWidgetItem *item）

        添加项目item

        （3）void QListWidget：：addItem（const QString &label）

        添加一个新的项目，在新添加的项目中添加label标签

        （4）void QListWidget：：addItems（const QStringList &labels）

        添加一列项目

        （5）void QListWidget：：clear（）[slot]

        清除该ListWidget中的所有项目

        （6）QListWidgetItem *QListWidget：：currentItem（）const

        返回当前活动的项目

        （7）void QListWidget：：editItem（QListWidgetItem *item）

        如果项目item是可编辑的，开始编辑项目item

        （8）QList<QListWidgetItem *>QListWidget：：findItems（const QString &text，Qt：：MatchFlags flags）const

        查找匹配字符串text的项目，并返回查找结果

        （9）void QListWidget：：insertItem（int row，QListWidgetItem * item）

        在行row处插入项目item

        （10）void QListWidget：：insertItem（int row，const QString &label）

        这是一个重载函数，功能同（9），在行row处插入标签为label的新项目

        （11）void QListWidget：：insertItem（int row，const QStringList &labels）

        在行row处插入一列项目

        （12）QListWidgetItem *QListWidget：：item（int row）const

        返回行row处的项目，如果行row处没有项目则返回0

        （13）QListWidgetItem *QListWidget：：itemAt（const QPoint &p）const

        返回点p处的项目

        （14）QListWidgetItem *QListWidget：：itemAt（int row，int y）const

        返回坐标（x，y）处的项目

        （15）QWidget *QListWidget：：itemWidget（QListWidgetItem *item）const

        返回项目item处显示的控件

        （16）QListWidgetItem *QListWidget：：takeItem（int row）

        移除行row处的项目，并返回项目控件

        （17）void QListWidget：：removeItemWidget（QListWidgetItem *item）

        移除项目item处的控件

        （18）int QListWidget：：row（const QListWidgetItem *item）cosnt

        返回项目item所在的行

        （19）QList<QListWidgetItem*> QListWidget：：selectedItems（）const

        返回所有被选中的项目的控件

        （20）void QListWidget：：setcurrentItem（QListWidgetItem *item）

        设置项目item为当前项目

        （21）void QListWidget：：setItemWidget（QListWidgetItem *item，QWidget *widget）

        设置控件widget为项目item的显示控件

        （22）void QListWidget：：setItemWidget（QListWidgetItem *item，QWidget *widget）

        （23）void QListWidget：：sortItems（Qt：：SortOrder order = Qt：：AscendingOrder）

        把项目按照order进行排序

    **二、TreeWidget控件**  
    1.控件位置：Item Widget->TreeWidget  
    2.控件介绍：树形单元控件，继承自QTreeView类，是树形视图使用预定义的模型，他也是基于模型/视图结构的控件，为方便开发人员使用树形视图，可以使用这个控件来创建简单地树形结构列表  
    3.控件属性设置选项：

        （1）name：同上  
        （2）font：同上  
        （3）columnCount：保存该TreeWidget的列数

    4.常用成员函数

        （1）QTreeWidget：：QTreeWidget（QWidget *parent = 0）

        构造一个父对象为parent的TreeWidget

        （2）void QTreeWidget：：addTopLevelItem（QTreeWidgetItem * item）

        在该TreeWidget中追加item为顶级项目

        （3）void QTreeWidget：：addTopLevelItems（const QList<QTreeWidgetItem*> &items）

        把items中的项目作为顶级项目追加到该TreeWidget中

        （4）void QTreeWidget：：clear（）[slot]

        清除该TreeWidget中的所有项目

        （5）void QTreeWidget：：collapseItem（const QTreeWidgetItem *item）[slot]

        折叠项目item

        （6）int QTreeWidget：：currentColumn（）const

        返回当前活动列

        （7）QTreeWidgetItem *QTreeWidget：：currentItem（）const

        返回当前活动项目

        （8）void QTreeWidget：：editItem（QTreeWidgetItem *item，int column = 0）

        如果列column的item是可编辑的，开始编辑

        （9）void QTreeWidget：：expandItem（const QTreeWidgetItem *item）[slot]

        展开项目

        （10）QList<QTreeWidgetItem*> QTreeWidget：：findItems（const QString &text，Qt：：MatchFlags flags，int column = 0）const

        查找匹配字符串的text的项目，并返回查找结果

        （11）QTreeWidgetItem *QTreeWidget：：headerItem（）const

        返回头项目

        （12）QModelIndex QTreeWidget：：indexFromItem（QTreeWidgetItem *item，int column = 0）const [protected]

        返回列column的项目item模型索引

        （13）int QTreeWidget：：indexOfTopLevelItem（QTreeWidgetItem *item）const

        返回顶级项目item的模型索引，如果item不存在返回-1

        （14）int QTreeWidget：：sortColumn（）const  
        返回排序的列

        （15）void QTreeWidget：：sortItems（int column，Qt：：SortOrder order）

        对列column的项目按照order进行排序

        （16）QTreeWidgetItem *QTreeWidget：：itemAbove（const QTreeWidgetItem *item）const

        返回item的上一个项目

        （17）QTreeWidgetItem *QTreeWidget：：itemAt（const QPoint &p） const

        返回点p处的项目

        （18）QTreeWidgetItem *QTreeWidget：：itemAt（int x，int y）const

        返回坐标（x，y）处的项目

        （19）void QTreeWidget：：setItemWidget（QTreeWidgetItem *item，int column，QWidget *widget）

        设置控件widget为项目item的显示控件，项目item在列column中

        （20）QTreeWidgetItem *QTreeWidget：：itemBelow（const QTreeWidgetItem *item）const

        返回item的下一个项目

        （21）QWidget *QTreeWidget：：itemWidget（QTreeWidgetItem *item，int column）const

        返回列column中的项目item显示控件

        （22）void QTreeWidget：：removeItemWidget（QTreeWidgetItem *item，int column）

        移除列column中的项目item的显示控件

        （23）QList<QTreeWidgetItem *> QTreeWidget：：selectItems（）const

        返回所有选中状态的项目

        （24）void QTreeWidget：：setCurrentItem（QTreeWidgetItem *item）

        设置item为当前项目

        （25）void QTreeWidget：：setCurrentItem（QTreeWidgetItem *item，int column）

        设置列column的项目item为当前项目

        （26）void QTreeWidget；：setHeaderItem（QTreeWidgetItem *item）

        设置item为该TreeWidget的头项目

        （27）void QTreeWidget：：setHeaderLabel（const QString &label）

        设置label为头标题

        （28）QTreeWidgetItem *QTreeWidget：：topLevelItem（int index）cosnt

        返回所有index的顶级项目

    **三、TableWidget控件**  
    1.控件位置：Item Widget->Table Widget  
    2.控件介绍：表格单元控件  
    3.控件属性设置选项：

        （1）name：同上  
        （2）font：同上  
        （3）columnCount：保存列的数目  
        （4）rowCount：保存行的数目

        4.常用成员函数

        （1）QTableWidget：：QTableWidget（QWidget * parent = 0）

        构造一个父对象为parent的TableWidget

        （2）QTableWidget：：QTableWidget（int rows，int columns，QWidget *parent = 0）

        构造一个rows行，columns列，父对象为parent的TableWidget控件

        （3）QWidget *QTableWidget：：cellWidget（int row，int column）const

        返回行row，列column的单元格处的控件

        （4）void QTableWidget：：clear（）[slot]

        删除该TreeWidget中的所有项目

        （5）void QTableWidget：：clearContents（）[slot]

        删除该TreeWidget中除了header外的所有项目

        （6）int QTableWidget：：column（const QTableWidgetItem *item）const

        返回项目item所在的列

        （7）int QTableWidget：：currentColumn（）const

        返回当前活动的列

        （8）QTableWidgetItem *QTableWidget：：currentItem（）const

        返回当前活动的项目

        （9）int QTableWidget：：currentRow（）const

        返回当前活动的行

        （10）void QTableWidget：：editItem（QTableWidgetItem *item）

        如果item是可编辑的，开始编辑item

        （11）QList<QTableWidgetItem *> QTableWidget：：findItems（const QString &text，Qt：：MatchFlags flags）const

        查找匹配字符串text的项目，并返回查找结果

        （12）void QTableWidget：：insertColumn（int column）[slot]

        在列column处插入新列

        （13）void QTableWidget：：insertRow（int row）[slot]

        在行row处插入新行

        （14）QTableWidgetItem *QTableWidget：：item（int row，int column）const

        返回行row、列column处的项目

        （15）QTableWidgetItem *QTableWidget：：itemAt（const QPoint &point）const

        返回点point处的项目

        （16）QTableWidgetItem *QTableWidget：：itemAt（int ax，int ay）const

        返回坐标（ax，ay）处的项目

        （17）void QTableWidget：：removeCellWidget（int row，int column）

        移除行row、列column单元格处的显示控件

        （18）void QTableWidget：：removeColumn（int column）[slot]

        移除列column

        （19）void QTableWidget：：removerRow（int row）[slot]

        移除行row

        （20）int QTableWidget：：row（const QTableWidgetItem *item）cosnt

        返回item的行

        （21）QList<QTableWidgetItem *> QTableWidget：：selectedItems（）

        返回所有选中状态的项目

        （22）void QTableWidget：：setCellWidget（int row，int column，QWidget *widget）

        设置行row、列column处的显示控件为widget。

        （23）void QTableWidget：：setCurrentCell（int row，int column）

        设置行row，列column处的单元格为当前活动单元格

        （24）void QTableWidget：：setCurrentItem（QTableWidgetItem *item）

        设置项目item为当前活动项目

        （25）void QTableWidget：：setHorizontalHeaderItem（int column，QTableWidgetItem *item）

        设置项目item为列column的水平头项目，功能同setVerticalHeaderItem（）

        （26）void QTableWidget：：setHorizontalHeaderLabels（const QStringList *labels）

        设置水平标题为labels，功能同setVerticalHeaderLabels（）

        （27）void QTableWidget：：setItem（int row，int column，QTableWidgetItem *item）

        设置行row、列column的单元格的项目为item

        （28）void QTableWidget：：sortItems（int column，Qt：：SortOrder order = Qt：：AscendingOrder）

        对列column按照order进行排序

        （29）QTableWidgetItem *QTableWidget：：takeHorizonalHeaderItem（int column）

        移除列column的水平头项目，功能同takeVerticalHeaderItem（）

        （30）QTableWidgetItem *QTableWidget：：takeItem（int row，int column）

        移除行row、列column单元格处的项目

        （31）QTableWidgetItem *QTableWidget：：verticalHeaderItem（int row）const

        返回行row的垂直头项目

