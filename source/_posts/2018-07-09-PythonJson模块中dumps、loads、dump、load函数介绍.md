---
layout:     post
title:      PythonJson模块中dumps、loads、dump、load函数介绍
subtitle:   
date:       2018-07-09
author:     Mehaei
header-img: img/post-bg-keybord.jpg
catalog: true
categories: Python编程
tags:
    - python
---
**1、json.dumps()**

```
import json

name = {'a': 'zhangsan', 'b': 'lisi', 'c': 'mawu', 'd': 'zhaoliu'}

jsDumps = json.dumps(name)

print(name,'类型为:%s'%type(name))
print(jsDumps,'类型为:%s'%type(jsDumps))
```

结果为

```
{'a': 'zhangsan', 'b': 'lisi', 'c': 'mawu', 'd': 'zhaoliu'} 类型为:<class 'dict'>
{"a": "zhangsan", "b": "lisi", "c": "mawu", "d": "zhaoliu"} 类型为:<class 'str'>
```

**2、json.dump()**

json.dump()用于将dict类型的数据转成str，并写入到json文件中。下面两种方法都可以将数据写入json文件

```
import json
nameList = {'a': 'zhangsan', 'b': 'lisi', 'c': 'mawu', 'd': 'zhaoliu'}

fileName = ('./namejson.json')

# 方法 1 #现将字典转为字符串，在写入文件中
jsObj = json.dumps(nameList)
with open(fileName, "w",encoding='utf-8') as f: 　　f.write(jsObj) 　　f.close()# 方法 2 # 直接写入文件中 格式：json.dump(字典或列表，打开文件,ensure_ascii=False) 关闭ascii转码json.dump(nameList, open(fileName, "w",encoding='utf-8'),ensure_ascii=False)
```

**3、json.loads()**

json.loads()用于将str类型的数据转成dict。

```
import json

name = {'a': 'zhangsan', 'b': 'lisi', 'c': 'mawu', 'd': 'zhaoliu'}

jsDumps = json.dumps(name)
jsLoads = json.loads(jsDumps)

print(name,'类型为:%s'%type(name))
print(jsDumps,'类型为:%s'%type(jsDumps))
print(jsLoads,'类型为:%s'%type(jsLoads))
```

结果为

```
{'a': 'zhangsan', 'b': 'lisi', 'c': 'mawu', 'd': 'zhaoliu'} 类型为:<class 'dict'>
{"a": "zhangsan", "b": "lisi", "c": "mawu", "d": "zhaoliu"} 类型为:<class 'str'>
{'a': 'zhangsan', 'b': 'lisi', 'c': 'mawu', 'd': 'zhaoliu'} 类型为:<class 'dict'>
```

**4、json.load()**

json.load()用于从json文件中读取数据。

```
import json

emb_filename = ('./emb_json.json')

jsObj = json.load(open(emb_filename))

print(jsObj)
print(type(jsObj))

for key in jsObj.keys():
    print('key: %s  value: %s' % (key, jsObj.get(key)))
```

结果为

```
{'a': 'zhangsan', 'b': 'lisi', 'c': 'mawu', 'd': 'zhaoliu'}
<class 'dict'>
key: a  value: zhangsan
key: b  value: lisi
key: c  value: mawu
key: d  value: zhaoliu
```
