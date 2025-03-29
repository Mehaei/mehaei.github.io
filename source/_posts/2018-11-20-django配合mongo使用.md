---
layout:     post
title:      django配合mongo使用
subtitle:   
date:       2018-11-20
author:     Mehaei
header-img: img/post-bg-ios9-web.jpg
catalog: true
tags:
    - python
---
# 环境

```
django 1.11.16
mongoengine 0.16.0
```

# 安装mongoengine库

```
pip install mongoengine
```

# 修改配置文件

```
# settings.py
# Database
# https://docs.djangoproject.com/en/1.11/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': None,
        # 'ENGINE': 'django.db.backends.sqlite3',
        # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

from mongoengine import connect
connect('test')
```

# 修改models.py文件

```
#models.py
import mongoengine

# Create your models here.


class TextModel(mongoengine.Document):
    name = mongoengine.StringField(max_length=30)
    content = mongoengine.StringField(max_length=255)
```

# 修改views.py文件

```
# views.py
from models import TextModel


class HomeHtml(object):
    def __init__(self):
        # 实例化模型对象
        self.text = TextModel.objects()

    def create_data(self, request):
        name = request.POST['name']
        content = request.POST['content']
        # 插入新数据
        self.text.create(name=name, content=content)
        return HttpResponse('SUCESS')

    def show_data(self, request):
        # 查询数据库中所有数据
        conlist = self.text.filter()
        return render(request, 'index_three.html', {"conlist": conlist})
    
    def update_data(self, request):
        # 修改数据
        self.text.filter(name='test').first().update(name='testt')
        return render(request, 'index.html')

    def dele_data(self, request):
        # 删除数据
        self.text.filter(name='test').first().delete()
        return render(request, 'index.html')    
```

到这里就可以在框架中正常使用mongo了
