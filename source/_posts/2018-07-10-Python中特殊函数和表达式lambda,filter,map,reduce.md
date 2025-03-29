---
layout:     post
title:      Python中特殊函数和表达式lambda,filter,map,reduce
subtitle:   
date:       2018-07-10
author:     Mehaei
header-img: img/post-bg-mma-6.jpg
catalog: true
tags:
    - python
---
**1.lambda:使用lambda表达式可以定义一个匿名函数**

　　lambda表达式是一种简洁格式的函数。该表达式不是正常的函数结构，而是属于表达式的类型

　　（1）基本格式：

```
lambda 参数,参数...：函数功能代码
如：lambda x,y:x + y    获取2个值的和的lambda函数
```

　　例：

```
#方式1.声明一个简单的lambda表达式
mylamb = lambda x,y:x+y
#调用函数
result = mylamb(4,5)
print(result)
```

　　（2）带分支格式:

```
lambda 参数,参数... :值1  if 条件表达式  else 值2
如：lambda sex : '有胡子' if sex == 'man' else '没胡子'
```

　　例：

```
#方式2.声明一个带有分支的lambda表达式
mylamb= lambda sex : '有胡子' if sex == 'man' else '没胡子'
#调用函数
result = mylamb('woman')
print(result)
```

　　（3）调用函数格式：

```
lambda 参数,参数...:其他函数(...)
如：lambda x:type(x)
```

　　例：

```
#方式3.声明一个调用函数的lambda表达式
mylamb = lambda x:type(x)
#调用函数
result = mylamb('拾元')
print(result)
```

**2.filter()对于序列中的元素进行筛选，最终获取符合条件的序列**

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180710225403954-722729640.png" alt="" width="369" height="163" />

　　例：filter(处理函数，可迭代对象) 

```
　　　　#filter第一个参数为空，将获取原来序列
```

```
def findTrue(num):
    if num > 0:
        return True
    else:
        return False
nums = [1,2,3,-2,-3,-1,3]
result = filter(findTrue,nums)
for i in result:
    print(i)
print(result)
```

　　结果为：

```
1
2
3
3
<filter object at 0x0000000001DC6CF8>
```

**3.map():遍历序列，对序列中每个元素进行操作，最终获取新的序列。**

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180710232623696-178404533.png" alt="" width="423" height="180" />

　　例1： map(处理函数，可迭代对象，可迭代对象，...)

```
li = [11, 22, 33]
new_list = map(lambda a: a + 100, li)
for i in new_list:
    print(i)
print(new_list)
```

　　结果为：

```
111
122
133
<map object at 0x0000000001E05588>
```

　　例2： 

```
li = [11, 22, 33]
sl = [1, 2, 3]
new_list = map(lambda a, b: a + b, li, sl)
for i in new_list:
    print(i)
print(new_list)
```

　　结果为：

```
12
24
36
<map object at 0x0000000001DF6A20>
```

**4.reduce()内建函数是一个二元操作函数**

**　　**用来将一个数据集合（链表，元组等）中的所有数据进行function函数操作：用传给reduce()的函数 function()（必须是一个二元操作函数）对数据集合中的第1，2个数据进行操作，得到的结果再与第三个数据使用function()函数运算。如此迭代，直到最后得到一个结果。

　　　　<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180710233128654-1731669882.png" alt="" width="392" height="195" />

　　例：格式：reduce(function, iterable[, initializer]),返回值是一个单值.

def add(x,y):    　　return x+ysum = reduce(add,[1,2,3,4,5,6,7,8,9,10])print(sum)

# 结果为：55

```
注:在python 3.0.0.0以后, reduce已经不在built-in function里了, 要用它就得from functools import reduce。
```

　　例2：

```
l = []
def add(x,y):
　　l.append((x,y))
　　end = x + y
　　return end
sum = reduce(add,[1,2,3,4,5,6,7,8,9,10])
print(sum)
print(l)
```

　　结果为：

```
55
[(1, 2), (3, 3), (6, 4), (10, 5), (15, 6), (21, 7), (28, 8), (36, 9), (45, 10)]
```

　　reduce(function(),data) 函数对作为其参数的函数function()是有要求的,**要求这个函数function()能接受两个参数**。第一个参数的值是前期计算积累的值,而第二个参数的值是 reduce() 函数参数中的data序列的下一个元素。其实 reduce 函数中还有第三个可选的参数初始值,如果这个参数为空则初始值默认为序列的第一个元素,所以上面可以看到第一次调用这个函数是以序列的第一个和第二个元素作为参数的。最终,最后一次调用返回的值作为 reduce 函数的返回值。

```

```
