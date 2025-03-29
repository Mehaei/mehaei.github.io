---
layout:     post
title:      python爬虫_简单使用百度OCR解析验证码
subtitle:   
date:       2018-07-24
author:     Mehaei
header-img: img/post-bg-mma-4.jpg
catalog: true
tags:
    - python
---
**[百度技术文档](https://link.zhihu.com/?target=https%3A//ai.baidu.com/docs%23/OCR-API/top)**

**首先要注册百度云账号：**

在首页，找到**图像识别**，**创建应用**，选择相应的功能，创建

<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180724184731327-1320980786.png" alt="" />

**安装接口模块：**

```
pip install baidu-aip
```

**简单识别一：**

简单图形验证码：

图片：<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180724183721395-1187814475.jpg" alt="" />

```
from aip import AipOcr

 # 你的 APPID AK SK
APP_ID = '你的APPID'
API_KEY = '你的AK'
SECRET_KEY = '你的SK'

client = AipOcr(APP_ID, API_KEY, SECRET_KEY)

# 读取图片
def get_file_content(filePath):
    with open(filePath, 'rb') as fp:
        return fp.read()
# 测试文件也可以写路径
image = get_file_content('test.jpg')

#  调用通用文字识别, 图片参数为本地图片
result = client.basicGeneral(image)

# 定义参数变量
options = {
    # 定义图像方向
        'detect_direction' : 'true',
    # 识别语言类型，默认为'CHN_ENG'中英文混合
        'language_type' : 'CHN_ENG',
}

# 调用通用文字识别接口
results = client.basicGeneral(image,options)
print(results)
# 遍历取出图片解析的内容
# for word in result['words_result']:
#     print(word['words'])
try:
    code = results['words_result'][0]['words']
except:
    code = '验证码匹配失败'

print(code)
```

结果为：

```
{'log_id': **************, 'direction': 0, 'words_result_num': 1, 'words_result': [{'words': '526'}]}
526
```

**返回数据的参数详解:**

输出结果中,各字段分别代表：

- log_id : 唯一的log id，用于定位问题
- direction : 图像方向，传入参数时定义为true表示检测，0表示正向，1表示逆时针90度，2表示逆时针180度，3表示逆时针270度，-1表示未定义。
- words_result_num : 识别的结果数，即word_result的元素个数
- word_result : 定义和识别元素数组
- words : 识别出的字符串

**二.很明显结果不太正确，（部分代码可能和官网不太一样，因为在python3中有些模块被替代了）然后就继续在百度技术文档中寻找答案，于是又找到了一个方案（其余的功能调用方法相同）**

代码如下：

```
# 第一步：获取百度access_token
import urllib, sys
from urllib import request
import ssl

# client_id 为官网获取的AK， client_secret 为官网获取的SK
host = 'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=【你的API_KEY】&client_secret=【你的SECRET_KEY】'
requests = request.Request(host)
requests.add_header('Content-Type', 'application/json; charset=UTF-8')
response = request.urlopen(requests)
content = response.read()
# 获取返回的数据
if (content):
    print(content)

# 第二步 通用文字识别（高精度版）识别
# 与百度技术文档上的部分代码不同，在python3中urllib2和urllib合并成了urllib
import base64
from urllib import request,parse
import json

access_token = '第一步获取的token'
url = 'https://aip.baidubce.com/rest/2.0/ocr/v1/accurate_basic?access_token=' + access_token
# 二进制方式打开图文件
f = open(r'test.jpg', 'rb')
# 参数image：图像base64编码
img = base64.b64encode(f.read())
params = {"image": img}
# 将图像转化为可携带的参数
params = parse.urlencode(params)
# 构造请求对象
requests = request.Request(url, bytes(params, encoding='utf-8'))
# 添加请求头
requests.add_header('Content-Type', 'application/x-www-form-urlencoded')
#发起请求
response = request.urlopen(requests)
# 读取返回的内容并解码
content = response.read().decode('utf-8')
# 将数据转换为字典
res = json.loads(content)

try:
    # 尝试从数据中获取图片解析的结果，如果没有则证明没有解析成功
    code = res['words_result'][0]['words']
except:
    code = '验证码匹配失败'

print(code)
```

结果为：

```
5526
```

对于特别复杂的图片，需要经过处理才能识别，使用PIL和Tesseract-OCR

```
from PIL import Image
import subprocess
def cleanFile(filePath, newFilePath):
    image = Image.open(filePath)
    # 对图片进行阈值过滤,然后保存
    image = image.point(lambda x: 0 if x<143 else 255)
    image.save(newFilePath)
    # 调用系统的tesseract命令对图片进行OCR识别  可以使用绝对路径，也可将程序添加到系统环境变量中
    subprocess.call(['C:\\Program Files (x86)\\Tesseract-OCR\\tesseract', newFilePath, "output"])
    # 打开文件读取结果
    with open("output.txt", 'r') as f:
        print(f.read())

cleanFile("text.jpg", "text2clean.png")
```

但是呢，不知道为什么识别率太低了，求大神指教

使用云打码识别，识别率会高很多，但也是有代价的，就是需要花钱，但是挺便宜的

　　[https://www.cnblogs.com/mswei/p/9392530.html](https://www.cnblogs.com/mswei/p/9392530.html)
