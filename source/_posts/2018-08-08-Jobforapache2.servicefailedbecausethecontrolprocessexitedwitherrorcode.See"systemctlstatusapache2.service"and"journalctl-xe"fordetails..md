---
layout:     post
title:      Jobforapache2.servicefailedbecausethecontrolprocessexitedwitherrorcode.See"systemctlstatusapache2.service"and"journalctl-xe"fordetails.
subtitle:   
date:       2018-08-08
author:     Mehaei
header-img: img/post-bg-cook.jpg
catalog: true
tags:
    - python
---
**环境：<strong>Ubuntu 16.04.1 + Django  1.11.15 + Apache 2.4.18 + python 3.5**</strong>

**<strong>此篇文章内容提到的第几步，对照以下链接中的步骤**</strong>

**[　　百度云的ubuntu16.04.1部署Apache服务器+Django项目](https://www.cnblogs.com/mswyf/p/9442097.html)**

**将项目搭建到云主机上，第四步重启apache报的错**

**报错信息：**

　　Job for apache2.service failed because the control process exited with error code. See "systemctl status apache2.service" and "journalctl -xe" for details.

**　　按照提示，使用<strong><strong>journalctl -xe打开错误日志**</strong></strong>

**<strong><strong>　　显示如下：**</strong></strong>

```
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit apache2.service has begun starting up.
Aug 08 10:41:17 instance-4xi7rrkf apache2[10930]:  * Starting Apache httpd web server apache2
Aug 08 10:41:17 instance-4xi7rrkf apache2[10930]:  *
Aug 08 10:41:17 instance-4xi7rrkf apache2[10930]:  * The apache2 configtest failed.
Aug 08 10:41:17 instance-4xi7rrkf apache2[10930]: Output of config test was:
Aug 08 10:41:17 instance-4xi7rrkf apache2[10930]: apache2: Syntax error on line 219 of /etc/apache2/apache
Aug 08 10:41:17 instance-4xi7rrkf apache2[10930]: Action 'configtest' failed.
Aug 08 10:41:17 instance-4xi7rrkf apache2[10930]: The Apache error log may have more information.
Aug 08 10:41:17 instance-4xi7rrkf systemd[1]: apache2.service: Control process exited, code=exited status=
Aug 08 10:41:17 instance-4xi7rrkf systemd[1]: Failed to start LSB: Apache2 web server.
-- Subject: Unit apache2.service has failed
-- Defined-By: systemd
-- Support: http://lists.freedesktop.org/mailman/listinfo/systemd-devel
-- 
-- Unit apache2.service has failed.
-- 
-- The result is failed.
Aug 08 10:41:17 instance-4xi7rrkf systemd[1]: apache2.service: Unit entered failed state.
Aug 08 10:41:17 instance-4xi7rrkf systemd[1]: apache2.service: Failed with result 'exit-code'.
Aug 08 10:41:22 instance-4xi7rrkf sshd[10964]: Connection closed by 5.188.218.246 port 34880 [preauth]
```

**　　按照错误提示：说是 /etc/apache2/apache.conf文件的219行配置出错**

**　　打开提示文件，找到第219行：**

　　　　（vim显示行号：按下esc键，输入 （：set nu））　**　**

```
218 # Include the virtual host configurations:
219 IncludeOptional sites-enabled/*.conf
```

**　　将219行的配置文件改为：  tip.conf为第二步的网络配置文件名**

```
218 # Include the virtual host configurations:
219 IncludeOptional sites-enabled/tip.conf
```

**这个时候 apache服务就可以重启了**

**　　赶紧打开网站：**

**　　报错如下：**

　　

```
Internal Server Error
The server encountered an internal error or misconfiguration and was unable to complete your request.
Please contact the server administrator at [no address given] to inform them of the time this error occurred,
and the actions you performed just before this error.
More information about this error may be available in the server error log.
Apache/2.4.18 (Ubuntu) Server at www.py6web.com Port 80
```

**　　**

**查看apache2的错误日志**

**这个时候切换到 ：cd /var/log/apache2**

**就会发现文件夹下多了两个错误日志文件**

```
root@instance-4xi7rrkf:/var/log/apache2# ls
access.log  django-tip-error.log  error.log  other_vhosts_access.log  tip-django.log
```

**打开错误日志，查看错误信息：**

```
[Wed Aug 08 10:49:22.535845 2018] [wsgi:error] [pid 11109:tid 140181583668992] [client 106.121.68.131:64773]     import pymysql
[Wed Aug 08 10:49:22.535881 2018] [wsgi:error] [pid 11109:tid 140181583668992] [client 106.121.68.131:64773] ImportError: No module named 'pymysql'
```

很明显少了个pymysql模块 使用pip3 install pymysql安装后，网站就可以正常访问了（其他同样信息，也执行此操作，最好切换到root用户下）

切换root用户 ：   sudo su
