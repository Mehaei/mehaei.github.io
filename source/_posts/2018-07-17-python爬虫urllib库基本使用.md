---
layout:     post
title:      python爬虫urllib库基本使用
subtitle:   
date:       2018-07-17
author:     Mehaei
header-img: img/post-bg-iWatch.jpg
catalog: true
categories:
    - 爬虫技术
tags:
    - python
---
### 以下内容均为python3.6.*代码

学习爬虫，首先有学会使用urllib库，这个库可以方便的使我们解析网页的内容，本篇讲一下它的基本用法

### <a name="t1"></a>解析网页

```
#导入urllib
from urllib import request
 
# 明确url
base_url = 'http://www.baidu.com/'
# 发起一个http请求,返回一个类文件对象
response = request.urlopen(base_url)
# 获取网页内容
html = response.read().decode('utf-8')
 
#将网页写入文件当中
with open('baidu.html','w',encoding='utf-8') as f:
    f.write(html)
```

### 构造请求

有些网站通过获取浏览器信息判断是否是机器在操作 因此我们需要构造请求头

```
#导入模块
from urllib import request
base_url = 'http://www.xicidaili.com/'
# 构造请求头
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
}
 
# 构造请求对象
req = request.Request(base_url,headers=headers)
 
# 发起请求
response = request.urlopen(req)
# 获取网页内容
html = response.read().decode()
 
#打印获取的页面代码
print(html)
```

### get请求传输数据

提交表单经常用到的就是post发送或者get发送。区别在于后者对于提交的内容会直接显示到url上。那么下面让我们尝试实现他们

```
from urllib import request,parse
import random
 
 
#get要带的值
qs = {
    'wd' : '妹子',
    'a' : 1
}
#将携带的值转换为浏览器识别的值
qs = parse.urlencode(qs)
#拼接url
base_url = 'http://www.baidu.com/s?' + qs
#定义一个头列表用来随机获取
ua_list = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36'
]
 
 
# 构造请求头
headers = {
    # 随机构造user-agent
    'User-Agent': random.choice(ua_list)
}
 
 
# 构造请求对象
req = request.Request(base_url,headers=headers)
 
 
# 发起请求
response = request.urlopen(req)
 
 
# 获取请求内容
html = response.read().decode()html = response.read().decode()
```

### post请求传输数据

```
 
from urllib import request,parse
            
base_url = 'http://fanyi.baidu.com/sug'
 
# 构造请求表单数据
form = {
    'kw' : "一只羊"
}
 
#将携带的值转换为浏览器识别的值    
form = parse.urlencode(form)
 
 
# 构建post请求 ,如果指定data参数 ，则请求是post请求
req = request.Request(base_url,data=bytes(form,encoding='utf-8'))
 
# 发起http post请求
response = request.urlopen(req)
 
# 获取响应内容(json)
data= response.read().decode()
```

这样就模拟了简单的登录，当然，大部分网站是无法这样轻易的就登录的，但这段代码是模拟登录的核心
