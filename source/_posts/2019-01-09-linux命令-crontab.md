---
layout:     post
title:      linux命令-crontab
subtitle:   
date:       2019-01-09
author:     Mehaei
header-img: img/post-bg-iWatch.jpg
catalog: true
tags:
    - python
---
**一.安装**

　　**yum install crontabs**

 

**二.基本使用**

　　1.crontab -e:创建任务，进入编辑 

　　**格式：**

**　　基本格式 :**

　　

　　*　　*　　*　　*　　*　　command

　　分　时　日　月　周　命令

　　

　　例：00 00 * * * python /home/meng/mongo_dump/main_work.py    每天的00:00执行main_work.py文件

　　　　1、每分钟执行一次            

　　　　　　*  *  *  *  * 

 

　　　　2、每隔一小时执行一次        

　　　　　　00  *  *  *  *  or * */1 * * *  (/表示频率)

 

　　　　3、每小时的15和30分各执行一次 

　　　　　　15,45 * * * * （,表示并列）

 

　　　　4、在每天上午 8- 11时中间每小时 15 ，45分各执行一次

　　　　　　15,45 8-11 * * * command （-表示范围）

 

　　　　5、每个星期一的上午8点到11点的第3和第15分钟执行

　　　　　　3,15 8-11 * * 1 command

 

　　　　6、每隔两天的上午8点到11点的第3和第15分钟执行

　　　　　　3,15 8-11 */2 * * command

 

 

　　**其他命令：**

　　　　crontab file [-u user]-用指定的文件替代目前的crontab。

 

　　　　crontab-[-u user]-用标准输入替代目前的crontab.

 

　　　　crontab-1[user]-列出用户目前的crontab.

 

　　　　crontab-e[user]-编辑用户目前的crontab.

 

　　　　crontab-d[user]-删除用户目前的crontab.

 

　　　　crontab-c dir- 指定crontab的目录。 

 

 

　　**服务操作说明：**

 

　　　　/sbin/service crond start //启动服务

 

　　　　/sbin/service crond stop //关闭服务

 

　　　　/sbin/service crond restart //重启服务

 

　　　　/sbin/service crond reload //重新载入配置

 

　　**查看crontab服务状态：**

 

　　　　service crond status

 

　　**手动启动crontab服务：**

 

　　　　service crond start

 

　　**查看crontab服务是否已设置为开机启动，执行命令：**

 

　　　　ntsysv

 

　　**加入开机自动启动：**

 

　　　　chkconfig level 35 crond on
