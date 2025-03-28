---
layout:     post
title:      PostgreSQL常用基本操作
subtitle:   
date:       2020-06-04
author:     Mehaei
header-img: img/post-bg-debug.png
catalog: true
categories:
    - 数据库
tags:
    - Python
---
# 基本操作

```
# 查看帮助
psql --help


# 进入数据库
psql -U admin -d testdb


# 查看命令
\?


# 列出数据库
\l


# 列出表
\dt



# 选择数据库
\c 数据库
```

# 命令开头符号的区别

执行创建数据库命令(**命令要以分号结尾**)

## **=#**

　　可以正常执行, 创建库 表操作

 

testdb=# create database testdb;

 

 

## **-#**

　　上一个命令没有完成(最后没有加;号 命令行还在等着输入命令), 这种情况下, \? \l等命令还是可以操作的

　　如果最后不加分号, 数据库则无法创建

```
testdb=# create
testdb-# database
testdb-# testdb2
testdb-# ;
# 创建成功
CREATE DATABASE
```

# 常用操作

```
# 新建数据库
create database testdb;

# 删除数据库
drop database testdb;


# 新建数据库表
create table testtable;

# 删除数据库表
drop table testtable;

# 格式化输出查询(使用\x on 或 \x auto)
app=# \x on
Expanded display is on.

app=# \x auto
Expanded display is used automatically.
```
