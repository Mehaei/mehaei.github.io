---
layout:     post
title:      centosvi设置tab为4个空格和括号自动补全
subtitle:   
date:       2019-03-21
author:     Mehaei
header-img: img/post-bg-os-metro.jpg
catalog: true
tags:
    - python
---
1.打开vim配置文件

vi /etc/vimrc

2.设置tab为4个空格, 在文件末尾添加以下内容

if has( "autocmd" )

filetype plugin indent on

autocmd FileType make set tabstop=8 shiftwidth=8 softtabstop=0 noexpandt ab

endif

set tabstop=4

set shiftwidth=4

set softtabstop=4

set expandtab

3.设置自动补全括号，添加以下内容

noremap ( ()<ESC>i 

inoremap [ []<ESC>i 

inoremap { {}<ESC>i 

inoremap < <><ESC>i

4.保存/etc/vimrc文件即可
