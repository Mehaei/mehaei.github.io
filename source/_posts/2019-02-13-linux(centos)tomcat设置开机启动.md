---
layout:     post
title:      linux(centos)tomcat设置开机启动
subtitle:   
date:       2019-02-13
author:     Mehaei
header-img: img/post-bg-os-metro.jpg
catalog: true
tags:
    - python
---
亲测有效

**环境：**

　　centos7

　　apache-tomcat-8.5.37

**设置步骤:**

1、修改/etc/rc.d/rc.local

```
vi /etc/rc.d/rc.local
```

2、添加下面两行脚本，记住是两行，仅仅第二行不行，必须加第一行。　　在/etc/rc.d/rc.local文件最后加上

```
export JAVA_HOME=/usr/lib/jvm/jre-1.8.0
/usr/local/tomcat/bin/startup.sh start
```

说明：/usr/lib/jvm/jre-1.8.0是jdk安装目录(这里是使用yum安装的默认目录)

　　　/usr/local/tomcat 是tomcat安装的目录

3、注意，修改rc.local文件为可执行，如： chmod +x rc.local
