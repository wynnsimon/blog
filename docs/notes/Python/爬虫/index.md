---
title: 爬虫
createTime: 2025/06/22 11:09:04
permalink: /python/crawler/
---
# urllib

### request

```python
urlopen(url或request)
```
向服务器发送请求
url是目标网址
response响应，回答

```python
urlretrieve(url=url,filename='name.后缀')
```

将网页下载下来，文件以name命名，后缀要符合网址内容的格式
也可以图片地址保存图片
下载视频需要在网页源代码中找视频地址（src是视频地址）
json文件的后缀是.json

```python
Request(url=url,headers=heraders)
```
因为参数顺序问题，不能直接传参，需要关键字传参
urlopen不能存储字典，所以要使用Request
requset请求

#### Handler

```python
HTTPHander()
```
获取handler对象

```python
handler=urllib.request.HTTPHandler(request)
```

```python
ProxyHandler(proxies=proxies)
```
proxies是字典

```python
proxies={’http‘:'IP:PORT'}
```

```python
handler=urllib.request.ProxyHandler(proxies=proxies)
```

```python
build_openner()
```
获取openner对象

```python
openner=urllib.request.build_openner(handler)
response=openner.open(request)
```

### parse

```python
quote('汉字')
```
url链接中不能包含汉字，可将输入的汉字转化为unicode编码（只能对汉字进行操作）

```python
urlencode(data)
```
转化后的data要以关键字参数传入Request中

将字典里的键值对转化为unicode编码用=连接，不同键值对转化的编码用&连接

data
data要是字典的形式
wd=姓名
sex=性别
location=地址

### error

- 错误类型，需要导包，使用异常捕获时也要加上urllib.error.HTTPErroe
- URLError
- HTTPError

## lxml

### etree

```python
parse(‘文件名’)
```
xpath解析本地文件

```python
HTML(content)
```
xpath解析服务器响应数据

 tree

## xpath

### 返回值是一个列表形式的数据

```python
变量.xpath('//body/ul/li[@id=“l1”]/text()')
```

`//`返回所有子孙节点，不考虑层级关系

`/`返回直接子节点

`[@id]`返回所有有id属性的标签

`[@id=“l1”]`返回id=“l1”的标签

`text()`获取标签中的内容

`@class`返回li标签的class的属性值

```python
变量.xpath('//body/ul/li[@id]/@class')
```


`li[contains(@id,"l")]`返回id中包含l的li标签

`li[starts-with(@id,"l")]`返回id值以l开头的标签

### 逻辑运算

- 与

```python
li[@id="l1" and @class="c1"]
```
返回id为l1和class为c1的标签

- 或

```python
//ul/li[@id="l1"] | //ul/li[@id="l2"]
```
返回id为l1或id为l2的标签

### 浏览器中的插件按ctrl+shift+x打开或关闭

- 插件的作用是在浏览器中判断输入的xpath语句是否正确

### result

## jsonpath

### 解析json数据（大部分网站返回的是json数据），只能解析本地文件

### json

```python
load(‘字符’)
```
使用json格式打开字符

```python
load(open(文件))
```
使用json打开文件中的字符
```python
jsonpath(json字符，‘’)
```
返回列表格式的数据，筛选json字符中的数据

## selenium

```python
browser=selenium.webdriver.Chrome('d:\chromedriver\chromerdriver.exe')
```
创建浏览器操作对象（‘盘符:\路径\驱动’）

```python
driver=selenium.webdriver.Chrome(service=Service('d:\chromedriver\chromerdriver.exe'))
```
后面版本使用的方法，原方法会报错，需要导入from selenium.webdriver.chrome.service import Service

如果闪退再写一行代码input()表示需要用户输入才调用

```python
browser.get(url)
```
使用驱动打开网页

```python
content=browser.page_source
```
获取网页源码（相当于response.read().decode）

### 选择元素

需要导入from selenium.webdriver.common.by import By

```python
find_elements
```
以列表形式返回所有属性值对应的元素
若没有符合条件的返回空列表

```python
find_element
```
element少了s，返回第一个属性值对应的元素,若没有符合条件的返回错误

- 根据id

```python
element=browser.find_element(By.ID,'属性值')
```
根据id选择元素，返回id是对应属性值的WebElement对象
一般用来寻找搜索框之类的重要的需要操作的对象

- 根据class（类）
```python
find_element(By.CLASS_NAME,'str')
```

- 根据name属性
```python
find_element(By.NAME,'str')
```

- 根据标签名
```python
find_element(By.TAG_NAME,'标签名')
```

```python
find_element(By.XPATH,'xpath语句')
```
根据xpath语句获取对象

```python
find_element(By.CSS_SELECTOR,'str')
```
使用bs4（beautifulsoup4）的语法获取对象

```python
find_element(By.LINK_TEXT,'有链接的文字')
```
根据网页中有超链接的文字获取对象

### 访问元素信息

获取元素属性

获取元素属性的值
```python
element.get_attribute('属性名')
```

获取元素文本
```python
element.text
```

 获取标签名
```python
element.tag_name
```

### 交互

```python
element.click()
```
点击

```python
send_keys('内容')
```
输入内容,在搜索框中搜索

```python
element.send_keys('龙族\n')
```
通过该element对象对页面的元素进行操作
假如该element对象是搜索框，则表示在该搜索框中搜索龙族，\n表示回车

```python
browser.back()
```
后退

```python
browser.forword()
```
前进

```python
browser.quit()
```
退出

模拟js滚动

```python
js='document.documentElement.scrollTop=100000'
```

```python
browser.execute_script(js)
```

```python
browser.save_screenshot(‘名称.格式’)
```
保存当前界面截图
无界面浏览器也能使用

### handless
配置项都是固定的基本不需要写代码

## 文件的操作
```python
response.read(number)
```
获取响应中的页面源码（返回字节形式的二进制数据）
number决定读取几个字节，默认全读
content内容，包含

```python
response.readline()
```

读取一行

```python
response.readlines()
```

 一行一行的读，全部读取

```python
content.decode('charset')
```
解码，将二进制转化为字符串（默认utf-8）

```python
response.getcode()
```
返回状态码

若是200则正常

```python
response.geturl()
```
返回url地址

```python
response.getheaders()
```
获取状态信息

## 反爬

### UA反爬

请求对象的定制

User Agent用户代理，简称UA
 是一个特殊字符串头，使得服务器能识别客户使用的操作系统及版本，cpu类型，浏览器内核，浏览器渲染引擎，浏览器语言，浏览器插件等信息
将UA打包成一个字典以headers命名，再将headers作为一个参数传入Request

## 常见错误

### 大部分情况不能访问是因为提供的信息不全

重要信息

cookie
 携带登录信息，如果有登录之后的cookie，那么就可以携带cookie进入任何页面
referer
判断当前路径是不是由上一个路径进来的，一般情况用作图片防盗链

### UnicodeDecodeError

 数据采集时进入个人页面，个人信息页面时utf-8还是报错编码错误，因为没有进入到个人信息页面，而是跳转到了登录页面，登录页面不是utf-8而报错

## 不同请求

### get请求
翻页搜索请求的网页不同，需要找出规律再写代码

### post请求
 翻页搜索请求的网页相同，须将formdata中的数据打包到data字典中再写代码
