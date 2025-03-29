---
layout:     post
title:      Selenium+PhantomJS
subtitle:   
date:       2018-07-19
author:     Mehaei
header-img: img/post-bg-mma-5.jpg
catalog: true
tags:
    - python
---
# Selenium

可以从 PyPI 网站[下载 Selenium库](https://pypi.python.org/simple/selenium)，也可以用 第三方管理器 pip用命令安装：

```
pip install selenium==2.48.0 
```

[Selenium 官方参考文档](http://selenium-python.readthedocs.io/index.html)

# <a name="t1"></a>PhantomJS

JavaScript，因为不会展示图形界面，所以运行起来比完整的浏览器要高效。 如果我们把 Selenium 和 PhantomJS 结合在一起，就可以运行一个非常强大的网络爬虫了，这个爬虫可以处理 JavaScrip、Cookie、headers，以及任何我们真实用户需要做的事情。

注意：PhantomJS 只能从它的[官方网站下载](http://phantomjs.org/download.html)。 因为 PhantomJS 是一个功能完善(虽然无界面)的浏览器而非一个 Python 库，所以它不需要像 Python 的其他库一样安装，但我们可以通过Selenium调用PhantomJS来直接使用。 [PhantomJS 官方参考文档](http://phantomjs.org/documentation)

# <a name="t2"></a>快速入门

**简单案例：**

```
# 导入 webdriver
from selenium import webdriver
import time

# 要想调用键盘按键操作需要引入keys包
from selenium.webdriver.common.keys import Keys

# 调用环境变量指定的PhantomJS浏览器创建浏览器对象
driver = webdriver.PhantomJS()

# 如果没有在环境变量指定PhantomJS位置
# driver = webdriver.PhantomJS(executable_path="./phantomjs"))

# get方法会一直等到页面被完全加载，然后才会继续程序，
# 通常测试会在这里选择 time.sleep(2)
driver.get("http://www.baidu.com")

# # 获取页面名为 wrapper的id标签的文本内容
data  =  driver.find_element_by_id("wrapper").text

# 打印数据内容
print(data)

# 打印页面标题 "百度一下，你就知道"
print(driver.title)

# 生成当前页面快照并保存
driver.save_screenshot("index.png")

# id="kw"是百度搜索输入框，输入字符串"长城"
driver.find_element_by_id("kw").send_keys(u"长城")

# id="su"是百度搜索按钮，click() 是模拟点击
driver.find_element_by_id("su").click()

#time.sleep(2)这个时间表示服务器响应时间
# 获取新的页面快照
driver.save_screenshot("长城.png")

# 打印网页渲染后的源代码
# print(driver.page_source)

# 获取当前页面Cookie
print(driver.get_cookies())

# # ctrl+a 全选输入框内容driver.find_element_by_id("kw").send_keys(Keys.CONTROL,'a')  # driver.save_screenshot("长城a.png")

# # ctrl+x 剪切输入框内容
driver.find_element_by_id("kw").send_keys(Keys.CONTROL,'x')

# 输入框重新输入内容
driver.find_element_by_id("kw").send_keys(u"python") driver.save_screenshot("a1.png")

# 模拟Enter回车键
# time.sleep(10) #加个延时，不然可能会报错：
# Element is not currently interactable and may not be manipulated # driver.find_element_by_id("su").send_keys(Keys.RETURN)
#注意：这个地方用回车是没有效果的，因为输入框在表单当中，
# 可以使用表单提交完成请求driver.find_element_by_id("su").submit() time.sleep(2)
driver.save_screenshot("a3.png")
执行效果如下图所示


# # 清除输入框内容driver.find_element_by_id("kw").clear() # #
# # 生成新的页面快照
driver.save_screenshot("ziyi.png")

# 获取当前url
print(driver.current_url)

# 关闭当前页面，如果只有一个页面，会关闭浏览器
# driver.close()

# 关闭浏览器
driver.quit()
```

**结果如下：**

<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180719190639269-401717888.png" alt="" width="529" height="317" />

**页面操作 **Selenium 的 WebDriver提供了各种方法来寻找元素，在百度首页有一个表单输入框：

```
#百度输入框架页面源码
#<input type="text" class="s_ipt" name="wd" id="kw" maxlength="100" autocomplete="off">

# 1.根据id获取标签# time.sleep(2)
element = driver.find_element_by_id("kw")
#获取标签的属性

# 格式：标签.get_attribute("属性名") print(element.get_attribute("type"))#text print(element.get_attribute("class"))#s_ipt

# 2.根据name获取标签标
element = driver.find_element_by_name("wd")

# 3.根据标签名获取标签名
element = driver.find_elements_by_tag_name("input") #返回列表

# 4.通过XPath来匹配
element = driver.find_element_by_xpath("//input[@id='kw']")#返回元素
```

## 定位UI元素 (WebElements)

在一个页面中有很多不同的策略可以定位一个元素。在你的项目中， 你可以选择最合适的方法去查找元素。Selenium提供了下列的方法给你:

**一次查找单个元素:**

```
# 通过ID查找元素
find_element_by_id
# 通过Name查找元素
find_element_by_name
# 通过XPath查找元素
find_element_by_xpath
# 通过链接文本获取超链接
find_element_by_link_text
find_element_by_partial_link_text
# 通过标签名查找元素
find_element_by_tag_name
# 通过Class name 定位元素
find_element_by_class_name
# 通过CSS选择器查找元素
find_element_by_css_selector
```

**一次查找多个元素 (这些方法会返回一个list列表):**

```
find_elements_by_name
find_elements_by_xpath
find_elements_by_link_text
find_elements_by_partial_link_text
find_elements_by_tag_name
find_elements_by_class_name
find_elements_by_css_selector
```

# 可能出现的报错

<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180719192009653-1068619084.png" alt="" width="702" height="192" />

**解决：**

将PhantomJS路径添加到环境变量中 或者在创建浏览器对象是指定Phantomjs路径
