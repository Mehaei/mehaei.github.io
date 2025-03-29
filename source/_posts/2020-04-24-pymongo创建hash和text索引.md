---
layout:     post
title:      pymongo创建hash和text索引
subtitle:   
date:       2020-04-24
author:     Mehaei
header-img: img/post-bg-mma-1.jpg
catalog: true
tags:
    - Python
---
# 来源于

「[不止于python](http://mp.weixin.qq.com/s?__biz=MzUyMzk3OTYyMQ==&mid=100000201&idx=1&sn=f6e13bcb154c95b654bce9ccca1025e4&chksm=7a351fc34d4296d55f04396ec06447002fd31c7c87f2a2269f25f383e79c38e0722e71fc6628#rd)」

# 报错中.......

在使用pymongo创建基础索引, 出现以下错误

```
pymongo.errors.OperationFailure: WiredTigerIndex::insert: key too large to index, failing
```

代码如下:

```
import pymongo
​
user_col = pymongo.MongoClient()["test"]["t"]
user_col.create_index("description")
user_col.insert_one({"age": 18, "description": "tests"*260})
```

# google原因.......

这个是因为在MongoDB中，从2.6开始，索引项的总大小(根据BSON类型可能包括结构开销)必须小于1024字节。就是要建立的索引字段的值特别大, 超过了1024字节, 对于比较大的值建立索引, 建立的索引也会非常大, 效率也会很慢, 占用更大的RAM空间, 所以不建议对较大的创建普通索引

[关于mongo官方文档关于index key的限制](https://docs.mongodb.com/manual/reference/limits/#Index-Key-Limit)

# 解决中......

## 最简单方法

最简单也是最难的方法:

        想办法减少字段值的大小, 不超过1024字节

## 改变mongo配置

选择其一即可

### 1. 使用以下命令启动mongod

```
mongod --setParameter failIndexKeyTooLong=false
```

### 2. 在mongo中执行

```
db.getSiblingDB('admin').runCommand( { setParameter: 1, failIndexKeyTooLong: false } )
```

## 创建hash索引

### 建立hash索引

[创建hash索引官方文档](https://docs.mongodb.com/manual/core/index-hashed/)

```
Collection.create_index([("description", pymongo.HASHED)])
```

 例:将创建索引改为

```
user_col.create_index([("description", pymongo.HASHED)])
```

进入mongo, 查看索引如下

```
> use test
switched to db test
> db.user.getIndexes()
```

```
[
    {
        "v": 2,
        "key": {
            "_id": 1
        },
        "name": "_id_",
        "ns": "test.user"
    },
    {
        "v": 2,
        "key": {
            "description": "hashed"
        },
        "name": "description_hashed",
        "ns": "test.user"
    }
]
```

### 创建text索引

注意 : text索引一个集合只能创建一个, 再次创建会报错

[创建text索引官方文档](https://docs.mongodb.com/manual/core/index-text/)

```
Collection.create_index([("description", pymongo.TEXT)])
```

只需要将pymongo.HASHED 改为 pymongo.TEXT 就可以了

```
user_col.create_index([("description", pymongo.TEXT)])
```

再次查看db.user.getIndexes(), 会多出一个text索引:

```
{
    "v": 2,
    "key": {
        "_fts": "text",
        "_ftsx": 1
    },
    "name": "description_text",
    "ns": "test.user",
    "weights": {
        "description": 1
    },
    "default_language": "english",
    "language_override": "language",
    "textIndexVersion": 3
}
```

到这里这个错误就被愉快的解决了, 有问题欢迎留言哦!
