---
layout:     post
title:      Centos不重启修改ulimit参数
subtitle:   
date:       2019-10-09
author:     Mehaei
header-img: img/post-bg-rwd.jpg
catalog: true
tags:
    - python
---
## 1. 查看limits.conf文件

```
cat /etc/security/limits.conf
```

## 2. 打开编辑limits.conf文件

```
sudo vim /etc/security/limits.conf
```

## 3. 插入以下内容

```
* hard nofile 999999
* soft nofile 999999
* soft nproc 10240
* hard nproc 10240
* hard stack 102400
* soft stack 102400
```

## 4. 查看确认是否修改成功 

```
ulimit -a
```

此时, 不出意外的话, 你的系统就在没重启的情况下, 已经修改了
