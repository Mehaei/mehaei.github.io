---
layout:     post
title:      mac安装报错"usrlocalincludestdint.h:2:10:error:#includenestedtoodeeply"
subtitle:   
date:       2019-05-17
author:     Mehaei
header-img: img/post-bg-miui6.jpg
catalog: true
tags:
    - python
---
报错详细信息

构建错误 - #include嵌套太深

    /usr/local/include/stdint.h:2:10: error: #include nested too deeply

    #include <stddef.h>

             ^

    /usr/local/include/stdint.h:59:11: error: #include nested too deeply

    # include <stdint.h>

              ^

    /usr/local/include/stdint.h:72:11: error: #include nested too deeply

    # include <sys/types.h>

              ^

    /usr/local/include/stdint.h:76:10: error: #include nested too deeply

    #include <limits.h>

             ^

    /usr/local/include/stdint.h:82:11: error: #include nested too deeply

    # include <inttypes.h>

              ^

解决：

 brew unlink libunistring

 brew uninstall libunistring

 sudo rm /usr/local/include/stdint.h

 brew install libunistring

注意：

　　这是python3在安装gevent时，报的错，还有安装找不到gevent版本， 切换成清华源就好了，如下

pip3 install -i https://pypi.tuna.tsinghua.edu.cn/simple gevent==1.2.2
