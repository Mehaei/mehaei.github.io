---
layout:     post
title:      mongoerror:connectfailed
subtitle:   
date:       2020-01-07
author:     Mehaei
header-img: img/post-bg-e2e-ux.jpg
catalog: true
tags:
    - Python
---
# 前言

今天遇到一件很头疼的事

mongo在服务器上运行的好好, 然后手贱用了sudo service mongod restart重启一下

更贱的是, 还没有重启完, 又使用了Ctrl + c, 导致再次启动mongo显示connect failed

# 查看日志

输入 mongod

显示如下:

<img src="https://img2018.cnblogs.com/common/1432315/202001/1432315-20200107123422365-1251732591.png" alt="" width="1145" height="262" />

# 错误原因

mongod没有成功启动

提示知道不到数据目录不存在

# 解决办法

## 第一种

创建/data/db文件夹

mkdir /data/db

## 第二种

指定已存在的数据目录

$ mongod --dbpath /data/db

# 指定配置文件后台启动mongo

## 指定配置文件启动

如果不指定再次重启mongo, 还会出现同样的错误

$ mongod --config /etc/mongod.conf

在配置文件中指定, 数据目录即可:

dbPath: /amazon/db/mongodb

## 后台启动

借助nohup即可

$ nohup sudo mongod --config /etc/mongod.conf &

# 其他原因及解决

一般造成这种连接不上的都是因为没有正常启动或者关闭mongo造成的

1.  尝试删除数据目录的mongod.lock文件, 重启

2. 尝试使用mongod --repair修复

3. 查看数据目录的权限, 如果不是mongodb:mongodb使用一下命令修改

sudo chown -R mongodb:mongodb /mongodb_data/

# 补充

以上是本人遇见过的, 如果还不行, 解决思路如下:

1. 查看日志

2. 找到错误原因

3. 根据错误解决问题
