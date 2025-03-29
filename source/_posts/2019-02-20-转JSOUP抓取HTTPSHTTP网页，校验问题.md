---
layout:     post
title:      转JSOUP抓取HTTPSHTTP网页，校验问题
subtitle:   
date:       2019-02-20
author:     Mehaei
header-img: img/post-bg-YesOrNo.jpg
catalog: true
tags:
    - python
---
针对一般的http请求是不需要的校验的。但是https安全校验过总过不去。最后找到以下方法，终于成功。

```
/**
* 信任任何站点，实现https页面的正常访问
* 
*/

public static void trustEveryone() {
try { 
HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
public boolean verify(String hostname, SSLSession session) {
return true; 
}
}); 

SSLContext context = SSLContext.getInstance("TLS"); 
context.init(null, new X509TrustManager[] { new X509TrustManager() {
public void checkClientTrusted(X509Certificate[] chain, String authType) throws CertificateException {
}

public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {
}

public X509Certificate[] getAcceptedIssuers() {
return new X509Certificate[0]; 
}
} }, new SecureRandom()); 
HttpsURLConnection.setDefaultSSLSocketFactory(context.getSocketFactory());
} catch (Exception e) {
// e.printStackTrace(); 
}
} 
```

以下是引用的类，大家被搞错了。

```
import java.io.UnsupportedEncodingException;
import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.X509TrustManager;
```

然后就是使用了   ，

在需要进行创建请求对象之前加入这个方法就行。

实例：

```
trustEveryone();
Connection conn = HttpConnection2.connect(url);
conn.header("Accept", "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8");
conn.header("Accept-Encoding", "gzip, deflate, br");
conn.header("Accept-Language", "zh-CN,zh;q=0.9");
conn.header("Cache-Control", "max-age=0");
conn.header("Connection", "keep-alive");
conn.header("Host", "blog.maxleap.cn");
conn.header("Upgrade-Insecure-Requests", "1");
conn.header("User-Agent", "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Safari/537.36");
Document doc = null;
```

好了，然后就可以正常访问了。

亲测有效，这是目前我正在使用的方法。

--------------------- 作者：月光下的猪 来源：CSDN 原文：https://blog.csdn.net/shaochong047/article/details/79636142 版权声明：本文为博主原创文章，转载请附上博文链接！
