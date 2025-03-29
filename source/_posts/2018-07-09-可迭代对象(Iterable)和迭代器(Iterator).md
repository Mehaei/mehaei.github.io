---
layout:     post
title:      可迭代对象(Iterable)和迭代器(Iterator)
subtitle:   
date:       2018-07-09
author:     Mehaei
header-img: img/post-bg-hacker.jpg
catalog: true
tags:
    - python
---
** 迭代是访问集合元素的一种方式。**

迭代器是一个可以记住遍历的位置的对象。

迭代器对象从集合的第一 个元素开始访问，直到所有的元素被访问完结束。迭代器只能往前不会后退。

**1. 可迭代对象 以直接作用于 for 循环的数据类型有以下几种：**

　　一类是集合数据类型，如 list 、 tuple 、 dict 、 set 、 str 等；

　　一类是 generator ，包括生成器和带 yield 的generator function。

**这些可以直接作用于 for 循环的对象统称为可迭代对象： Iterable** 。

**2. 判断是否可以迭代 可以使用 isinstance() 判断一个对象是否是 Iterable 对象：**

```
from collections import Iterableprint(isinstance([],Iterable)) # 列表  Trueprint(isinstance((),Iterable)) # 元组 Trueprint(isinstance({},Iterable)) # 字典  Trueprint(isinstance('meng',Iterable)) #字符串  Trueprint(isinstance((x for x in range(5)),Iterable)) #生成器  True
```

结果为:都为True, 说明容器和生成器都是可迭代对象

**3. 迭代器：**

```
from collections import Iterator

print(isinstance([],Iterator))  # 列表  False
print(isinstance((),Iterator))  # 元组  False
print(isinstance({},Iterator))  # 字典  False
print(isinstance('meng',Iterator))  # 字符串  False
print(isinstance((x for x in range(5)),Iterator)) # 生成器  True
```

由此结果可以看出：容器只是可迭代对象，并不是迭代器

**4. iter()函数：**

生成器都是 Iterator 对象，但 list 、 dict 、 str 虽然是 Iterable ，却不是 Iterator 。 把 list 、 dict 、 str 等 Iterable 变成 Iterator 可以使用 iter() 函数：

```
print(isinstance(iter([]),Iterator))  # 列表  True
```

**总结：**

　　凡是可作用于 for 循环的对象都是 Iterable 类型；

　　凡是可作用于 next() 函数的对象都是 Iterator 类型

　　集合数据类型如 list 、 dict 、 str 等是 Iterable 但不是 Iterator ，不过可以通过 iter() 函数获得一个
