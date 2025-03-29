---
layout:     post
title:      记一次Django报错Reversefor'indextwo'withnoargumentsnotfound.1pattern(s)tried:'$index$'
subtitle:   
date:       2018-11-20
author:     Mehaei
header-img: img/post-bg-ioses.jpg
catalog: true
tags:
    - python
---
启动python manage.py runserver

打开127.0.0.1:8000，报错信息如下：

```
Reverse for 'indextwo' with no arguments not found. 1 pattern(s) tried: ['$index/$']
```

现象：

无论怎么修改views.py 还是urls.py，报错信息始终存在

问题发现：

项目目录结构如下

```
myweb
├── db.sqlite3
├── home
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations
│   │   └── __init__.py
│   ├── models.py
│   ├── tests.py
│   ├── **urls.py**
│   └── views.py
├── manage.py
├── myweb
│   ├── __init__.py
│   ├── settings.py
│   ├── **urls.py**
│   ├── wsgi.py
├── static
│   ├── images
│   │   ├── 55adde120001d34e00410041.png
│   │   ├── 55addf800001ff2e14410118.png
│   │   ├── 55addfcb000189b314410138.png
│   │   ├── background.jpg
│   │   ├── body_back.jpg
│   │   └── title.ico
│   └── jc
│       ├── 55ac9a860001a6c500000000.js
│       ├── 55ac9ea30001ace700000000.js
│       ├── jquery.easing.min.js
│       ├── jquery.fancybox.css
│       ├── sample-style.css
│       ├── scripts.js
│       ├── skin.css
└── templates
    ├── index.html
    ├── index_three.html
    └── index_two.html
```

问题就出现在上面的两个urls.py中

在myweb的文件夹下的urls.py中，代码如下：

```
from django.conf.urls import url, include

urlpatterns = [
    url(r'^$', include('home.urls')),
]
```

在home的文件下的urls.py中，代码如下：

```
from django.conf.urls import url
from .views import HomeHtml

urlpatterns = [
    url(r'^$', HomeHtml().index, name='index'),
    url(r'^index/$', HomeHtml().index_two, name='indextwo'),
    url(r'^content/', HomeHtml().content, name='content'),
    url(r'^showlist/', HomeHtml().showlist, name='showlist')
]
```

解决：

将规则改为如下，项目正常启动，无报错信息

```
from django.conf.urls import url, include

urlpatterns = [
    url(r'^', include('home.urls')),
]
```
