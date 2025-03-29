---
layout:     post
title:      记一次python的任务调度模块apscheduler只在首次执行任务的情况
subtitle:   
date:       2018-11-23
author:     Mehaei
header-img: img/post-bg-ioses.jpg
catalog: true
tags:
    - python
---
最近需要写个日更新的程序，用time.sleep()不能很好的控制任务的执行时间

于是，就使用了python的任务调度模块apscheduler,这个模块功能真的是很强大

具体的就不多讲了

将任务程序都设置好，之后，任务只在第一天执行，后面两天都没有执行

通过仔细检查log之后，发现了异常

正常的本次运行完，下次的任务执行时间log为：

```
144 - 2018-11-23 01:12:10,230 - INFO - Job "SubmitData (trigger: interval[1 day, 0:00:00], next run at: 2018-11-24 01:00:00 CST)" executed successfully
```

而没有执行任务的log为：

```
2018-11-22 00:00:04,084 base.py[line:120] run_job WARNING Run time of job "start (trigger: interval[1 day, 0:00:00], next run at: 2018-11-23 00:00:01 CST)" was missed by 0:00:03.061840
```

这个log的意思是：距离下次运行时间，错过了3秒，所有第二次就没有执行任务

解决方法：

```
scheduler.add_job(start, 'interval', days=1, coalesce=True, misfire_grace_time=3600, start_date='2018-11-23 00:00:01', end_date='2019-12-30 11:59:59')
```

在add_job()中添加参数：

misfire_grace_time: 主要就是为了解决这个was missed by 这个报错，添加允许容错的时间，单位为：s

coalesce：如果系统因某些原因没有执行任务，导致任务累计，为True则只运行最后一次，为False 则累计的任务全部跑一遍
