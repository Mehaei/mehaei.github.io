---
layout:     post
title:      docker--(MACubuntucentos)安装
subtitle:   
date:       2019-02-12
author:     Mehaei
header-img: img/post-bg-map.jpg
catalog: true
tags:
    - python
---
# MacOS

## 安装

**1.homebrew安装(需要mac密码)**

```
brew cask install docker
```

**2.手动下载安装**

　　如果需要手动下载，请点击以下链接下载 [Stable](https://download.docker.com/mac/stable/Docker.dmg) 或 [Edge](https://download.docker.com/mac/edge/Docker.dmg) 版本的 Docker for Mac。

　　(1).安装完成后 都会出现一个小鲸鱼的图标

　　(2).点击运行 输入mac密码即可

　　(3).第一次打开会看到安装成功的界面，点击got it 可以关闭这个窗口

　　**终端查看docker版本**

```
msw@bogon:~$ docker --version
Docker version 18.09.1, build 4c52b90
```

## 镜像加速

鉴于国内网络问题，后续拉取 Docker 镜像十分缓慢，我们可以需要配置加速器来解决，我使用的是网易的镜像地址：http://hub-mirror.c.163.com。

在任务栏点击 Docker for mac 应用图标 -> Perferences... -> Daemon -> Registry mirrors。在列表中填写加速器地址即可。修改完成之后，点击 Apply & Restart 按钮，Docker 就会重启并应用配置的镜像地址了。

<img src="https://img2018.cnblogs.com/blog/1432315/201902/1432315-20190212112419845-917308132.png" alt="" />

之后我们可以通过 docker info 来查看是否配置成功。

```
$ docker info
...
Registry Mirrors:
 http://hub-mirror.c.163.com
Live Restore Enabled: false
```

# ubuntu

## 安装docker

```
$ curl -s https://get.docker.com/ | sudo sh
```

## 安装 docker composer

```
sudo curl -L https://github.com/docker/compose/releases/download/1.18.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
```

## 安装 docker composer 自动补全命令

```
curl -L https://raw.githubusercontent.com/docker/compose/1.8.0/contrib/completion/bash/docker-compose > /etc/bash_completion.d/docker-compose
```

# centos

##  yum安装docker

```
安装docker
```

```
sudo yum install -y yum-utils device-mapper-persistent-data lvm2
```

```
添加软件源信息：
sudo yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
更新 yum 缓存：

sudo yum makecache fast
安装 Docker-ce：
sudo yum -y install docker-ce
启动 Docker 后台服务
sudo systemctl start docker

安装docker-compose
yum -y install epel-release
```

##  pip安装docker

```
安装pip
yum -y install python-pip


更新pip
pip install --upgrade pip
# 国内原加速
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple  --upgrade pip


安装docker-compose
pip install docker-compose
# 国内原加速
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple  docker-compose


查看docker-compose版本信息

docker-compose --version

# 报错: uninstall requests error
sudo pip install --upgrade --force-reinstall pip==9.0.3
```

## 或者直接

```
yum install docker
```

同样输入--version查看版本和是否安装成功
