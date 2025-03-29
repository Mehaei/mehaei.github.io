---
layout:     post
title:      windows下Git的使用教程（github）
subtitle:   
date:       2018-07-26
author:     Mehaei
header-img: img/post-bg-unix-linux.jpg
catalog: true
categories:
    - 开发工具
tags:
    - python
---
**这表文章主要是用命令操作：**

**　　使用可视化软件操作：https://www.cnblogs.com/mswyf/p/9261859.html**

**一.下载安装Git Bash**

**　　**下载安装：https://www.cnblogs.com/mswyf/p/9261859.html

**二.注册****github远程仓库的账号，这里就不多说了，输入用户名，邮箱密码注册就行**

**　　**注册地址：[https://github.com/](https://github.com/)

**三.创建新项目**

**1.**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726090153567-957214773.png" alt="" width="590" height="176" />**

**2.**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726090204359-1163249557.png" alt="" width="555" height="399" />**

**3.**

　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726090420794-1551885621.png" alt="" width="596" height="281" />

4.

　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726090449459-1085613830.png" alt="" width="570" height="329" />

**四.打开安装好的Git Bash，开始工作**

　　1.配置gitbash和github的通信协议 ，输入ssh-keygen t rsa C 邮箱地址 然后一直按回车回车回车回车。。。。箭头指向的邮箱填写我当时填的是和github上写的邮箱一致。 

　　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726091253142-1132109107.png" alt="" />

　　2.**然后你就可以根据上图提示信息打开文件目录，找到那个文件，用文本方式打开.pub文件。直接全选复制。**

**　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726091819545-1670738918.png" alt="" width="597" height="133" />**

**五.添加ssh密匙**

**　　**将本机的ssh秘钥添加到个人账户中，打开github自己的主页Settings->SSH->newSSHkey  步骤如下图：

**　　1.**

**　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726093001047-165784277.png" alt="" />**

**　　2.**

**　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726093056110-2094399205.png" alt="" width="564" height="304" />**

**　　3.**

**　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726093120867-1850175443.png" alt="" width="529" height="305" />**

**六.验证ssh设置！**

**　　　　输入命令：ssh T git@github.com，会出现yes or no，就输入yes，回车。 **

## 　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726093500670-1598727493.png" alt="" width="547" height="172" />

**七.配置gitbash的用户名和邮箱：**

　　git config --global user.name 用户名

　　git config --global user.email 邮箱 

　　使用github上的用户名和邮箱。 

　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726093906652-510545361.png" alt="" />

**配置了这么多，终于可以办大事了，将你刚刚在github上创建的project和本地联系起来**

**　　大概流程，就是先在本地找个空的文件夹，然后用gitbash初始化一下这个文件夹的信息，使他变成一个类似于可以被管理的仓库，然后再从远程仓库github上pull上面的东西下来这个文件夹，然后自己修改好了，再push回去远程github，就这么简单**

**1.创建文件夹**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726094441822-1400201723.png" alt="" width="606" height="145" />**

**2.用git bash打开并切换到此文件夹下，使用git init初始化文件夹**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726095141688-1056022171.png" alt="" width="603" height="245" />**

**3.建立与远程仓库的链接**

**　　命令：git remote add origin 你的git地址**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726095548800-893287807.png" alt="" /> **

**　　git项目地址**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726095633479-101481823.png" alt="" width="517" height="284" />**

**4.拉取远程仓库文件****命令： **

**　　****git pull 你的git地址**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726100350010-944495064.png" alt="" width="490" height="236" />**

**　　此时，文件夹中就多了个文件夹，就表示拉取成功了**

**5.在本地仓库中添加文件，直接新建就行**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726100701064-243991784.png" alt="" width="488" height="185" />　　**

**6.将文件添加到缓冲区add，提交文件commit**

**　　　git add .     将所有改变的文件添加到缓冲区**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726101754967-1223848470.png" alt="" width="511" height="294" />　　**

**　　git commit -m '提交说明'**

**　　<strong><img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726102302444-941378819.png" alt="" />**</strong>

**　　**

**7.将本地仓库上传到github上，地址就是拉取的地址**

**　　git push '项目git地址'**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726102326530-721137049.png" alt="" />**

**8.此时，再次到github个人主页上就可以看到上传的文件了**

**　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726102406796-1888416535.png" alt="" width="646" height="287" />**

**　　**

**以后如果想修改，或添加文件还是一样的流程**

**如果使用码云，请参考：******https://www.cnblogs.com/mswyf/p/9261859.html****

**在补充点git的常用命令：**

**常用命令源地址：https://www.cnblogs.com/zhaoxinran/p/7994325.html**

**=======================****基本操作========================**

- **git init** 　　在需要的地方建立一个版本库（也就是仓库）
- **ls -ah    **可以看默认隐藏的文件
- **git add filename** 将文件加入暂存区
- **git commit -m ** 将暂存区的内容提交到当前分支
- **git status**  查看当前仓库状态
- **git diff** 查看修改内容
- ======================版本回退========================
- **git log **查看历史版本记录
- **git log --pretty=oneline** 查看历史版本记录精简版
- **git reset hard HEAD**
<ul>
- HEAD 是当前版本
- HEAD^是上一个版本
- HEAD^^是上上个版本
- HEAD~100是回退100个后的版本
- 一般是HEAD 789790890(版本号)






- 1.有---将自己的密钥id_rsa.pub粘贴
- 2.没有的话打开git bash 创建 ssh-keygen -t rsa -Cemail,一路回车创建，不用设置密码






- 1.第一步 在网站上创建远程仓库，
- github
- 






**　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180726103245686-1003732326.png" alt="" width="688" height="546" />**

<ul>
- coding.net的全是中文，大家一般都能根据提示操作进行，我就不提示了。





- **先创建本地仓库后连接远程仓库**                         
<ul>
- **git remote add origin url(****托管平台地址例如Github/coding.net  这种方法适用于)**





- **git clone url**(仓库地址,同上)




