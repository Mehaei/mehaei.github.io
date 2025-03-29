---
layout:     post
title:      生成器(generator)
subtitle:   
date:       2018-07-09
author:     Mehaei
header-img: img/post-bg-ios9-web.jpg
catalog: true
tags:
    - python
---
**1. 什么是生成器 **

　　通过列表生成式，我们可以直接创建一个列表。但是，受到内存限制，列表容量肯定是有限的。而且， 创建一个包含100万个元素的列表，不仅占用很大的存储空间，如果我们仅仅需要访问前面几个元素，那后 面绝大多数元素占用的空间都白白浪费了。所以，如果列表元素可以按照某种算法推算出来，那我们是否 可以在循环的过程中不断推算出后续的元素呢？这样就不必创建完整的list，从而节省大量的空间。

**在 Python中，这种一边循环一边计算的机制，称为生成器：generator。**

**2. 创建生成器方法1 **

要创建一个生成器，有很多种方法。第一种方法很简单，只要把一个列表生成式的 [ ] 改成 ( )

```
#列表生成式（列表推导式）
l = [i for i in range(0,10,2)]
print(l)
# 生成器
g = (i for i in range(0,10,2))
print(g)
```

结果为：

```
[0, 2, 4, 6, 8]
<generator object <genexpr> at 0x00000000029B2BF8>
```

创建 L 和 G 的区别仅在于最外层的 [ ] 和 ( ) ， L 是一个列表，而 G 是一个生成器。我们可以直接打印 出L的每一个元素，但我们怎么打印出G的每一个元素呢？如果要一个一个打印出来，可以通过** next()** 函数 获得生成器的下一个返回值：

```
print(next(g)) # 0print(next(g)) # 2print(next(g)) # 4print(next(g)) # 6print(next(g)) # 8print(next(g)) # StopIteration
```

生成器保存的是算法，每次调用 next(G) ，就计算出 G 的下一个元素的值，直到计算到最后一个元素， 没有更多的元素时，抛出 StopIteration 的异常。

可以使用 for循环取出每个元素，这样就不会报错,

```
for i in g: # g是一个生成器，可以直接循环
    print(i)
```

结果为： 这样也不用担心会取不到值而报错

```
0
2
4
6
8
```

**3.创建生成器方法2**

generator非常强大。如果推算的算法比较复杂，用类似列表生成式的 for 循环无法实现的时候，还可以 用函数来实现。

比如，著名的斐波拉契数列（Fibonacci），除第一个和第二个数外，任意一个数都可由前两个数相加 得到： 1, 1, 2, 3, 5, 8, 13, 21, 34, ... 斐波拉契数列用列表生成式写不出来，但是，用函数把它打印出来却很容易：

```
def fib(times):
    a = 0
    b = 1
    n = 1
    while n<=times:
        print(b)
        a,b = b,a+b
        n+=1
fib(7)
```

结果为：

```
1
1
2
3
5
```

仔细观察，可以看出，fib函数实际上是定义了斐波拉契数列的推算规则，可以从第一个元素开始，推算 出后续任意的元素，这种逻辑其实非常类似generator。 也就是说，上面的函数和generator仅一步之遥。要把fib函数变成generator，只需要把print(b)改为yield b就 可以了：

```
#生成器写法
def fib(times):
    a = 0
    b = 1
    n = 1
    while n<=times:
        #print(b)
        yield b
        a,b = b,a+b
        n+=1
    return "done!"
```

简单地讲，yield 的作用就是把一个函数变成一个 generator，带有 yield 的函数不再是一个普 通函数，Python 解释器会将其视为一个 generator，调用 fab(5) 不会执行 fab 函数，而是返回一 个 iterable 对象！在 for 循环执行时，每次循环都会执行 fab 函数内部的代码，执行到 yield b 时，fab 函数就返回一个迭代值，下次迭代时，代码从 yield b 的下一条语句继续执行，而函数的 本地变量看起来和上次中断执行前是完全一样的，于是函数继续执行，直到再次遇到 yield。 同样的，把函数改成generator后，我们基本上从来不会用 next() 来获取下一个返回值，而是直接使用 for 循环来迭代：

```
for i in F:
    print(i) #结果与上面相同
```

但是用for循环调用generator时，发现拿不到generator的return语句的返回值。如果想要拿到返回值， 必须捕获StopIteration错误，返回值包含在StopIteration的value中：

```
while True:
    try:
        print(next(F))
    except StopIteration as e:
        print("生成器返回值：%s"%e.value)
        break
```

**总结：**

生成器是这样一个函数，它记住上一次返回时在函数体中的位置。

对生成器函数的第二次（或第 n 次） 调用跳转至该函数中间，而上次调用的所有局部变量都保持不变。

生成器不仅记住了它数据状态；生成器还记住了它在流控制构造（在命令式编程中，这种构造不只 是数据值）中的位置。

** 生成器的特点：**

1. 节约内存

2. 迭代到下一次的调用时，所使用的参数都是第一次所保留下的，即是说，在整个所有函数调用的参 数都是第一次所调用时保留的，而不是新创建的
