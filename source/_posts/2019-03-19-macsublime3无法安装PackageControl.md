---
layout:     post
title:      macsublime3无法安装PackageControl
subtitle:   
date:       2019-03-19
author:     Mehaei
header-img: img/post-bg-alibaba.jpg
catalog: true
tags:
    - python
---
一.在线安装

1.打开sublime，Ctrl+` 打开控制台， 输入

```
import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)

```

2.注意：由于网络问题，在线安装一般不会成功

二.离线安装

1.下载<tt>[Package Control.sublime-package](https://packagecontrol.io/Package%20Control.sublime-package)</tt> 安装包

　　如果不能访问请[点击此连接](https://pan.baidu.com/s/1-gQsNPbIq_euQEaCSQ2Lnw%20) 密码:zxw7

2.找到sublime安装目录下的Installed Packages，将下载好的安装包放到该目录下

　　mac的sublime安装目录默认为 /Users/{用户名}/Library/Application Support/Sublime Text 3/

3.重启sublime, 安装成功

三报错

报错信息

```
Package Control: Error downloading channel. URL error [Errno 65] 
No route to host downloading https://packagecontrol.io/channel_v3.json
```

`打开 : Preferences` > `Package Settings` > `Package Control` > `Settings - User`

<img src="https://img2018.cnblogs.com/blog/1432315/201903/1432315-20190321150518967-1007580360.png" alt="" />

<img src="https://img2018.cnblogs.com/blog/1432315/201903/1432315-20190321150646096-1225359392.png" alt="" />

重启sublime， 完美解决 

如有问题 欢迎交流
