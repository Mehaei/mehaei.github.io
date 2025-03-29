---
layout:     post
title:      转tomcat启动报错toolowsettingfor-Xss
subtitle:   
date:       2019-02-18
author:     Mehaei
header-img: img/post-bg-map.jpg
catalog: true
tags:
    - python
---
tomcat启动报错too low setting for -Xss

网上给的答案都是调整Xss参数，其实不是正确的做法，

-Xss：每个线程的Stack大小，-Xss 15120 这使得tomcat每增加一个线程（thread)就会立即消耗15M内存，而最佳值应该是128K,默认值好像是512k. 

具体报错如下

Caused by: java.lang.IllegalStateException: Unable to complete the scan for annotations for web application [] due to a StackOverflowError. Possible root causes include a too low setting for -Xss and illegal cyclic inheritance dependencies. The class hierarchy being processed was [org.bouncycastle.asn1.ASN1EncodableVector->org.bouncycastle.asn1.DEREncodableVector->org.bouncycastle.asn1.ASN1EncodableVector]

因为tomcat启动会去扫描jar包，看错误信息org.bouncycastle.asn1.ASN1EncodableVector，是出在这个类

这个类似出现在bcprov*.jar这个包

所以在tomcat的conf目录里面catalina.properties的文件，

在tomcat.util.scan.DefaultJarScanner.jarsToSkip=里面加上bcprov*.jar过滤

( tomcat.util.scan.DefaultJarScanner.jarsToSkip=\ bcprov*.jar)

启动不会报错了

或者升级tomcat版本（绝对解决）

作者：潇潇吸尘器 来源：CSDN 原文：https://blog.csdn.net/lb89012784/article/details/50820118 版权声明：本文为博主原创文章，转载请附上博文链接！
