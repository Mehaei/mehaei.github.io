---
layout:     post
title:      docker--在centos镜像安装mysql
subtitle:   
date:       2019-02-12
author:     Mehaei
header-img: img/post-bg-miui6.jpg
catalog: true
tags:
    - python
---
一.安装centos镜像

**1.拉取最新版本centos镜像（拉取centos7 则使用centos:7即可**）

```
docker pull centos:lasted
```

**2.查看已有镜像**

```
docker images
```

**3.运行镜像（请看下文提到的大坑）**

```
docker run -d --name container_name -it centos:7 /bin/bash
```

　　-d ： 后台运行（返回容器id）

　　--name ： 给容器起别名

　　container_name : 自定义容器名

　　-i : 以交互式模式运行容器 通常与-t同时使用

　　-t ： 为容器重新分配一个伪输入终端

　　centos : 镜像名

　　7 : 镜像标签

　　/bin/bash : 在容器内执行/bin/bash命令

更多参数详解请见：[菜鸟教程](http://www.runoob.com/docker/docker-run-command.html)

**4. 进入运行中的容器**

```
docker exec -it container_name /bin/bash
```

大坑：

centos有个比较大的坑，在docker中通过systemctl 启动服务的时候总是 会报错

```
Failed to get D-Bus connection: Operation not permitted
```

解决办法：运行镜像时添加--privileged, 如下

```
docker run -d --name container_name --privileged -it image_name:tag /usr/sbin/init
```

这样就可以解决这样的报错

二. 在centos容器中安装mysql

**1.安装wget**

```
yum install -y wget
```

**2.安装MySQL官方的 Yum Repository**

```
wget -i -c http://dev.mysql.com/get/mysql57-community-release-el7-10.noarch.rpm
yum -y install mysql57-community-release-el7-10.noarch.rpm
```

**3.安装mysql5.7**

```
yum install -y mysql-server
```

**4.启动mysql**

```
systemctl start mysqld.service
```

**5.查看mysql运行状态**

```
systemctl status mysqld.service
```

**6.查看初始root密码**

```
grep "password" /var/log/mysqld.log
```

<img src="https://img2018.cnblogs.com/blog/1432315/201902/1432315-20190212121000500-570433809.png" alt="" />

**7.修改root密码**

　　获得初始密码后，第一件事就是要重新设置root密码，否则什么事情也做不了，因为MySQL强制要求必须重新设置root密码。

　　**(1).进入mysql数据库**

```
mysql -u root -p
```

　　**(2).修改root密码**

```
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';
```

**8.修改密码报错及解决**

(1). 报错

密码设置过于简单，会报错，要求是必须含有数字，小写或大写字母，特殊字符：

<img src="https://img2018.cnblogs.com/blog/1432315/201902/1432315-20190212121133963-2101328946.png" alt="" />

(2).解决

如果是安装用于测试，不需要设置太复杂的密码，则需要设置：

　　修改validate_password_policy参数的值

```
mysql> set global validate_password_policy=0;
```

　　修改validate_password_length参数的值

```
set global validate_password_length=1;
```

　　设置后，重新设置root密码就不会提示密码安全不符合要求的提示了。

**9.开启远程访问**

默认安装后，MySQL禁止远程连接，所以需要打开该权限。

```
mysql> GRANT ALL ON *.* TO root@'%' IDENTIFIED BY '123456' WITH GRANT OPTION;
mysql> FLUSH PRIVILEGES;
```

查看MySQL版本

```
mysql> select version();
```

原文连接：[Docker安装CentOS7及MySQL5.7](https://blog.csdn.net/jason19905/article/details/81366202)

```

```

```

```

` `
