---
layout:     post
title:      docker--centos镜像安装tomcatjdk1.8mysql部署javaweb项目
subtitle:   
date:       2019-02-12
author:     Mehaei
header-img: img/post-bg-unix-linux.jpg
catalog: true
tags:
    - python
---
一.下载centos7标准镜像及安装mysql5.7

二.安装jdk

1.查询可用jdk版本

```
yum search java|grep jdk
```

2.根据搜索到的jdk进行安装

```
yum install java-1.8.0-openjdk
```

3.查看是否安装成功和版本

```
java -version
```

三.安装tomcat

从官网下载tomcat的tar包，下载文件为apache-tomcat-8.5.37.tar.gz

1.使用docker cp命令将tar拷贝到容器中

```
docker cp /apache-tomcat-8.5.37.tar.gz mycontainer:/usr/local/
```

2.启动容器,并将容器的8080端口映射到宿主机的8888端口

```
docker run -d -p 8888:8080 --name 容器名（自定义） --privileged -it (已有镜像名):(镜像标签) /usr/sbin/init
```

3.进入已经启动的容器

```
docker exec -it mycentos /bin/bash
```

4.进入到/usr/local目录下，执行解压tar操作

```
tar -zxvf apache-tomcat-8.5.37.tar.gz
```

5.将解压完的文件夹重命名

```
mv apache-tomcat-8.5.37.tar.gz tomcat
```

6.进行到tomcat/bin目录下 执行

```
./startup.sh  启动tomcat
```

打开本机浏览器输入localhost:8888

出现tomcat的欢迎界面则tomcat安装成功

如果没有出现请查看端口映射是否和本地有冲突，或重新安装tomcat

7.再次使用docker cp命令将本地的java web项目的war包拷贝到容器tomacat的webapps目录下

```
docker cp /java_web.war mycentos:/usr/local/tomcat/webapps/
```

8.进入容器的tomcat目录下执行

```
./bin/shutdown.sh
./bin/startup.sh
```

tomcat会自动解压war

本地打开浏览器，访问

[http://localhost:8888/java_web/](http://localhost:8888/java_web/)

如果能展示项目的登录页面或首页则项目部署 到此完成

如果不能，请查看tomcat/logs/catalina.out日志文件 和 localhost.当前日期.log 根据日志解决错误

常见的错误有：

```
Caused by: java.lang.IllegalStateException: Unable to complete the scan for annotations for web application [/diaowen] due to a StackOverflowError. Possible root causes include a too low setting for -Xss and illegal cyclic inheritance dependencies. The class hierarchy being processed was [org.bouncycastle.asn1.ASN1EncodableVector->org.bouncycastle.asn1.DEREncodableVector->org.bouncycastle.asn1.ASN1EncodableVector]
```

解决：

修改tomcat内存

```
vi /usr/local/tomcat/bin/catalina.sh
```

在"if [ $have_tty -eq 1 ]; then"之后增加 

```
JAVA_OPTS="-server -Xms256m -Xmx1024m -XX:PermSize=128m -XX:MaxPermSize=256m"
```

保存并重启tomcat

如有疑问 请联系博主
