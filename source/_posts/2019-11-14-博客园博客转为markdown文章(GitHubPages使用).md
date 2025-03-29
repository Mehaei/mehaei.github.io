---
layout:     post
title:      博客园博客转为markdown文章(GitHubPages使用)
subtitle:   
date:       2019-11-14
author:     Mehaei
header-img: img/post-bg-coffee.jpeg
catalog: true
tags:
    - python
---
前不久参照大神的博客, 使用 [GitHub Pages](https://pages.github.com/) + [jekyll](http://jekyll.com.cn/) 搭建了个人博客,  [点击这里查看](https://www.mehaei.com/)

[快速搭建个人博客](https://www.mehaei.com/2017/02/06/%E5%BF%AB%E9%80%9F%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/) 点击这里

博客搭建完成了, 所有的一切准备就绪, 但是还有一个重要的问题需要解决

那就是文章怎么办, 如果还没有写, 那还好一篇篇的写就好了, 但是如果已经有了好多博客了, 但是在别的平台, 不能再一片片倒过来吧, 并且还要markdown格式

那么, 重点来了, 看完下面这篇文章就可以轻松的将博客园的所有博客转为markdown文章

# 导出博客园所有的博客数据

这里使用博客园自带的数据备份功能就好

登录博客, 点击我的博客 --> 管理 --> 备份

<img src="https://img2018.cnblogs.com/common/1432315/201911/1432315-20191114122950031-645946055.png" alt="" width="515" height="327" />

(为了减少对网站性能的影响，麻烦您在工作日18:00之后、8点之前或周六、周日进行备份。)

选择导出博客的范围即可得到一个xml的博客数据文件

# 下载转换必备模块

克隆转换的代码, 这里我自己写了一份, 不过主要用的是大神写好的模块, 我只是稍微封装了一下

关注公众号 [**不止于python**] 回复 [**xmlTomd**] 即可获取完整代码

# 开始转换数据格式

启动转换程序

启动方式:

```
python3 xmlTomd.py ./xml_data/new.xml /user/new.xml new.xml
```

**## 后面路径可以跟三种: 1. 文件相对路径 2. 文件绝对路径 3. 直接写文件名(必须放到xml_data文件夹下)**

稍等片刻, 即可在md_data文件夹中查看转换完成的markdown版博客

# 将md数据放入github项目

将md_data文件夹下的md博客放入到自己的github pages项目中

更新自己的项目, 即可在github pages看到自己的博客了 

<img src="https://img2018.cnblogs.com/common/1432315/201911/1432315-20191114141348255-1378058933.jpg" alt="" /> 

到这里就万事大吉了

如有问题, 记的留言哦! 
