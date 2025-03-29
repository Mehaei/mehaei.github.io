---
layout:     post
title:      tornado框架学习及借用有道翻译api做自动翻译页面
subtitle:   
date:       2018-11-23
author:     Mehaei
header-img: img/post-bg-ioses.jpg
catalog: true
tags:
    - python
---
趁着这几天有时间，就简单的学了一下tornado框架，简单做了个自动翻译的页面

仅为自己学习参考，不作其他用途

文件夹目录结构如下：

```
.
├── server.py
├── static
│   └── css
│       └── bootstrap.min.css
└── templates
    └── index.html
```

templates：主要存放html页面文件

页面如下：（可能有点丑）

<img src="https://img2018.cnblogs.com/blog/1432315/201811/1432315-20181123162722283-1933756110.png" alt="" width="779" height="290" />

主要思路是：

本地启动tornado框架服务 - 浏览器访问127.0.0.1:8888(可自定义端口号) - 返回首页页面 - 输入想要翻译的内容 - 点击翻译 - 后台调用有道翻译的api并将结果返回 - 将结果显示在第二个框中

主要解释就放在代码中

服务端代码：

文件server.py

```
#coding=utf-8
import os
import json
import time
import hashlib
import random
import requests
import tornado.ioloop
import tornado.web

# 首次请求直接返回index.html页面
class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index.html")
# 这是下面点击翻译按钮触发的请求类
class EnglineHandler(tornado.web.RequestHandler):　　# 通过get()函数，可以获取get请求的参数，还有post()函数
    def get(self):　　　　 # get_argument()是用来获取get请求的参数
        msg = self.get_argument('msg', 'msw')　　　　 # 调用有道翻译的api，并接受翻译结果
        result = self.req_data(msg)　　　　 # 将结果返回给请求的地方
        self.write(result)

    def req_data(self, kw):　　　　 # 以下是破解和获取有道翻译api的过程
        salt = str(random.randint(1, 10) + time.time() * 1000)
        s = "fanyideskweb%s%ssr_3(QOHT)L2dx#uuGR@r" % (kw, salt)
        sign = self.md5Encode(s)
        youdao_url = "http://fanyi.youdao.com/translate_o?smartresult=dict&smartresult=rule"
        data = {
            "i": kw,
            "from": "AUTO",
            "to": "AUTO",
            "client": "fanyideskweb",
            "salt": salt,
            "sign": sign,
            "keyfrom": "fanyi.web",
        }
        headers={
            "Cookie": "OUTFOX_SEARCH_USER_ID=-536406613@103.255.228.99; JSESSIONID=aaa3-OEP9rPK9_KECL_Cw; OUTFOX_SEARCH_USER_ID_NCOO=1519777863.8355908; ___rl__test__cookies=%s" % str(time.time()*1000),
            "Referer": "http://fanyi.youdao.com/",
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36",
        }
        res = requests.post(youdao_url, headers=headers, data=data).text

        return self.filter_content(res)
　　 # 将但会结果进行处理
    def filter_content(self, value):
        res = json.loads(value)
        result = ''
        result += res.get('translateResult')[0] + '\n\n\n'
        if not res.get('smartResult'):
            return result
        result += '相关内容：\n'
        for data in res.get('smartResult')['entries']:
            result += (data + '\n')
        return result
　　# 将参数加密
    def md5Encode(self,msg):
        m = hashlib.md5()
        m.update(msg.encode('utf-8'))
        return m.hexdigest()
#
if __name__ == "__main__":　　 # 运行tornado服务配置
    settings = {
        "template_path":os.path.join(os.path.dirname(__file__), "templates"),  #模板路径
        "static_path":os.path.join(os.path.dirname(__file__), "static") , #静态文件路径
        "debug":True
    }
    app = tornado.web.Application([
        (r"/", MainHandler),
        (r"/engline", EnglineHandler)
    ], **settings)
    app.listen(8888)
    tornado.ioloop.IOLoop.instance().start()
```

开启命令： 直接运行 python3 server.py，然后打开浏览器就可以看到页面

index.html部分代码：

```
<html>
 
<head>
    <title>fanyi-m</title>
    <link type="text/css" rel="stylesheet" href="/static/css/bootstrap.min.css" />

</head>  

<style type="text/css">
* {
    margin: 0;
    padding: 0;
}
html {
    height: 100%;
}
.buttonc button{
    margin:20px 10px;
}
</style>

<script src="http://runjs.cn//js/sandbox/jquery/jquery-1.8.2.min.js"></script>
 
    <body>
        <nav class="navbar navbar-inverse">
            <ul class="nav navbar-nav">
                <li class="active"><a href="#">Home</a></li>
                <li><a href="#">Link</a></li>
                <li><a href="#">Link</a></li>
            </ul>
        </nav>
        
            
                
                    <textarea id="lineso" class="form-control" rows="8"></textarea>
                
                
                    <button type="button" class="btn btn-default btn-lg active">auto</button>
                    <button onclick="engline()" type="button" class="btn btn-primary btn-lg active">翻译</button>
                
                
                    <textarea id="linest" class="form-control" rows="8"></textarea>
                
            
            
        
    </body>
 
<script>
// 没什么用，主要是美化导航栏的
$('.navbar-nav li').click(function(){
    $(this).addClass('active').siblings().removeClass('active')

})
// 翻译按钮的单击事件
function engline(){
    var oldmsg = $('#lineso').val()　　// 判断输入框是否为空
    if(oldmsg == null || oldmsg == '' || oldmsg == undefined){
        alert('input content Please')
    }else{
    　　//alert(oldmsg)　　　　// 不为空则向该地址，发起ajax的get请求
        $.ajax({
            url:"http://127.0.0.1:8888/engline",
            data : {'msg':oldmsg},
            type : 'GET',
            timeout : 3000,
            success: function(data){
                if(data){
                    $('#linest').val(data)
                }else{
                    alert('not result')
                }
            },
            error: function(XMLHttpRequest, textStatus, errorThrown){
                //查看错误信息
                alert(XMLHttpRequest.status);
                alert(XMLHttpRequest.readyState);
                alert(textStatus);
            }
        })

    };
}

</script>
 
</html>
```

以上内容：仅为个人学习参考，不得用于商业用途
