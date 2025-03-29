---
layout:     post
title:      windows下git的使用方法（码云）
subtitle:   
date:       2018-07-04
author:     Mehaei
header-img: img/post-bg-desk.jpg
catalog: true
tags:
    - python
---
**这表文章主要是用了可视化操作：**

**　　使用命令行操作：https://www.cnblogs.com/mswyf/p/9370238.html**

**一.安装<strong>Git Bash**</strong>　

# 为了在windows下使用Git，我们需要安装msysGit这个客户端工具，它可以让我们用CMD或者GUI的方式使用Git。

**1.下载**

# 　　2.18.0版本下载：https://git-scm.com/download/

**　　2.8.2版本下载 ：https://www.jb51.net/softs/460912.html#download**

**2.安装**

**　**　我安装的是2.8.2的版本

　　下载后，打开程序开始安装，下一步->下一步->都是默认的就行了

**3.验证安装是否成功**

　　安装完成后有 Git Bash和Git GUI 2种使用git的方式：

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709183826711-1715729190.png" alt="" />

　　启动Git Bash，是一个类似linux的命令窗口，能够使用linux命令，这意味着安装成功了。

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709183959263-1269462083.png" alt="" />

以下所有内容使用命令号同样可以实现：

使用命令行，请移步：[windows下Git的使用教程（github）](https://www.cnblogs.com/mswyf/p/9370238.html)

**二.安装TortoiseGit**

**　1.下载**

　　TortoiseGit下载地址：https://download.tortoisegit.org/tgit/1.8.7.0/

　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709184952360-1820379930.png" alt="" />

　**　2.安装**

　　　　同样安装没什么特别的设置，随便几张安装图

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709185211811-689852658.png" alt="" width="317" height="246" /><img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709185220124-519584616.png" alt="" width="319" height="248" /><img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709185230338-1059287219.png" alt="" width="319" height="248" />

**3.配置：**

　　安装所需的软件，下面我们就要设置一些东西了.

　　(1) 在开始菜单-所有程序-TortoiseGit打开Puttygen。

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709185238970-1224318831.png" alt="" />

　　(2)生成秘钥，关于git的秘钥我也不是很清楚，大家可以看做是git在pc的一种标识，生成之后记得保存一下秘钥，这样每次提交过获取的时候会自动加载秘钥。

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709185245200-1864583212.png" alt="" width="410" height="397" />

　　(3)添加秘钥，打开github，点击左上部的设置，进入设置页面后，点击SSH Keys添加key，这边key的内容是上面生成key的内容，这边需要注意的是key不是保存key文件的内容，如果添加key文件的内容会报格式错误

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709192923167-1229441507.png" alt="" width="420" height="406" />

　　(4) 将秘钥添加到码云的shh秘钥中，并新建项目

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709194843387-1669042485.png" alt="" width="613" height="343" />　　　　　　　　　　　　　　　　　　　　　　　　　  　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709194850068-1553310278.png" alt="" width="592" height="291" />

　　　　新建项目

　　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709193534635-644274556.png" alt="" />                         

　　 并将新创建的ssh地址复制下来

　　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709193640072-1654496685.png" alt="" />

　　（5）打开TortoiseGit的Settings，我们首先要设置上面安装msysGit的目录和中文设置。

　　　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709193815770-2030759958.png" alt="" />

　　　（7）下面我们就开始使用TortoiseGit进行项目操作了，首先新建文件夹test右击-git克隆，秘钥是第三步生成的秘钥文件

　　　　

　　　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709200922230-1104511546.png" alt="" width="807" height="504" />

　　（8）克隆成功后，我们就可以看到版本库的文件，当然现在是空的。TortoiseGit版本控制的时候会像svn一样有图标显示，如果你在文件夹或文件前面没发现的　话，莫惊慌，重启下电脑即可。

　　（9）下面我们新建个文件提交到git上，首先我们需要先add。

　　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709193946199-158413636.png" alt="" />

　　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709194045060-438149.png" alt="" width="450" height="434" />

　　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709194053515-165244780.png" alt="" />

11，我们打开码云选择创建的test版本库，就可以看到我们刚才提交的文件了，获取的话直接拉取（Pull）。

　

**4.可能出现的问题：**

　1,到第七步的时候可能右击找不到GIT clone这个选项，重启一下即可解决

　2.克隆报错：error: cannot spawn "C:\Program Files\TortoiseGit\bin\TortoisePlink.exe": No such file or directory  fatal: unable to fork

　　　　　　

　　4.去除版本控制：有一次我使用git，在桌面的时候不小心克隆了下，然后整个桌面的文件都出现了git图标，看起来很是烦人，然后就在TortoiseGit上面找怎么去除版本控制，但是怎么也找不到，最后居然无耻的发现删除隐藏文件夹.git就可以了，真是傻的不能再傻了。

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709194253114-1977486948.png" alt="" />

　5.tortoisegit记住密码：我们每次在推送文件的时候总是需要输入用户名和密码，很是麻烦，解决方式是打开隐藏文件夹.git下的config文件，在后面加上[credential] helper = store，下次推送的时候就会记住密码了。

　6.git提交空文件夹：因为git是文件版本控制，空文件默认会被忽略掉，这个我在网上找了一种方案：

　　　　Another way to make a directory stay empty (in the repo) is to create a .gitignore inside that directory that contains two lines:

　　　　在空目录下创建.gitignore文件。

　　　　文件内写入如下代码，可以排除空目录下所有文件被跟踪： 

```
`　　　　# Ignore everything in this directory 　　　　* 　　　　# Except this file !.gitignore `
```

[ ](http://www.cnblogs.com/jinzhao/archive/2012/03/21/2410156.html)

　　7，解决冲突和添加忽略文件：比如vs项目中一些临时文件我们并不想提交到git中，有时候获取冲突了，我们直接右击文件-解决冲突，可以忽略此文件或此文件类型的扩展名的文件，点忽略后，会在git项目的根目录下生成.gitignore文件（隐藏文件），打开后会发现，里面是我们刚才设置忽略文件的目录，当然你也可以直接对文件进行编辑。

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180709194322396-1080234889.png" alt="" />

　　以上内容参考：

　　　　https://blog.csdn.net/aitangyong/article/details/51473584

　　　　https://www.cnblogs.com/wangchuanyang/p/6273025.html

　　　　https://blog.csdn.net/erickhuang1989/article/details/41907983
