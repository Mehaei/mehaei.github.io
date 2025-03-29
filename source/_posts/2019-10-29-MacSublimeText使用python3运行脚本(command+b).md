---
layout:     post
title:      MacSublimeText使用python3运行脚本(command+b)
subtitle:   
date:       2019-10-29
author:     Mehaei
header-img: img/post-bg-hacker.jpg
catalog: true
tags:
    - python
---
默认安装好sublime, 使用快捷键command+b的时候, 会使用python2版本运行

下面就改为用python3运行, 也可以python2运行

<img src="https://img2018.cnblogs.com/blog/1432315/201910/1432315-20191029175404949-244590784.jpg" alt="" />

# 一. 新建文件

**Sublime Text -> Preferences -> Browse Packages**

**# 也可以直接vi打开哦: **

**<img src="https://img2018.cnblogs.com/blog/1432315/201910/1432315-20191029175901814-487052450.jpg" alt="" />**

```
vi ~/Library/Application\ Support/Sublime\ Text\ 3/Packages/User/Python3.sublime-build
```

<img src="https://img2018.cnblogs.com/blog/1432315/201910/1432315-20191029174843272-799559187.png" alt="" />

打开后新建文件, 命名为: **Python3.sublime-build**

# 二. 添加配置内容

复制以下内容, 添加到文件中

{% raw %}
```
{ 
   "cmd": ["python3安装路径", "-u", "$file"], 
   "file_regex": "^[ ]*File \"(...*?)\", line ([0-9]*)", 
   "selector": "source.python",　　"env": {"PYTHONIOENCODING": "utf8"}}
```
{% endraw %}

# env不添加可能会报错UnicodeEncodeError

# 三. 更改执行脚本选项

然后就会发现在**Tools-> Build System**选项中多了一个Python3

<img src="https://img2018.cnblogs.com/blog/1432315/201910/1432315-20191029175107683-912874247.png" alt="" />

到这里就可以快乐的使用Python3运行脚本了, 当然也可以用Python2, 😁

<img src="https://img2018.cnblogs.com/blog/1432315/201910/1432315-20191029175234308-515507217.jpg" alt="" />
