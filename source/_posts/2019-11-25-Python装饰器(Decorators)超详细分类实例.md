---
layout:     post
title:      Python装饰器(Decorators)超详细分类实例
subtitle:   
date:       2019-11-25
author:     Mehaei
header-img: img/post-bg-desk.jpg
catalog: true
tags:
    - python
---
# Python装饰器分类

`Python`

**装饰器函数**: 是指装饰器本身是函数风格的实现; <strong>
函数装饰器</strong>: 是指被装饰的目标对象是函数;(目标对象); <strong>
装饰器类</strong>  : 是指装饰器本身是类风格的实现; <strong>
类装饰器</strong>  : 是指被装饰的目标对象是类;(目标对象);

# 装饰器函数

## 目标对象是函数

### (1)、装饰器无参数

#### A、目标无参数

```
strOldFunctionName = "";
strNewFunctionName = "";
#装饰器无参数:
def decorator(callback): #装饰器函数/外部函数,它接受一个函数对象作为参数(这个函数一般就是目标函数);
    #目标无参数:
    def wrapper():       #闭包函数,用于传递目标函数的所有参数(没有参数);
        strOldFunctionName = callback.__name__;
        print "装饰前的函数名: %s" % strOldFunctionName;
        print "enter {}()".format(callback.__name__);
        callback();      #调用目标函数,执行原有功能;
        print "leave {}()".format(callback.__name__);
        pass;
    return wrapper;      #返回闭包函数对象;
@decorator  #装饰器无参数;
def target():  #目标函数:需要增加功能的函数(没有参数);
    strNewFunctionName = target.__name__;
    print "装饰后的函数名: %s" % strNewFunctionName;
    pass;
target(); #用装饰过的新函数;
print "函数名变化: %s --> %s" % (strOldFunctionName, strNewFunctionName)
```

#### B、目标有参数

```
strOldFunctionName = "";
strNewFunctionName = "";
#装饰器无参数:
def decorator(callback):           #装饰器函数/外部函数,它接受一个函数对象作为参数(这个函数一般就是目标函数);
    #目标有参数:
    def wrapper(*args, **kwargs):  #闭包函数,用于传递目标函数的所有参数(任意参数);
        strOldFunctionName = callback.__name__;
        print "装饰前的函数名: %s" % strOldFunctionName;
        print "enter {}()".format(callback.__name__);
        callback(*args, **kwargs); #调用目标函数,执行原有功能;
        print "leave {}()".format(callback.__name__);
        pass;
    return wrapper;  #返回闭包函数对象;
@decorator #装饰器无参数;
def target0(): #目标函数:需要增加功能的函数(没有参数) ;
    strNewFunctionName = target0.__name__;
    print "装饰后的函数名target0 = %s" % strNewFunctionName;
    pass;
@decorator #装饰器无参数;
def target1(a): #目标函数:需要增加功能的函数(1个参数) ;
    print "a = ", a;
    strNewFunctionName = target1.__name__;
    print "装饰后的函数名target1 = %s" % strNewFunctionName;
    pass;
@decorator #装饰器无参数;
def target2(a, b): #目标函数:需要增加功能的函数(2个参数) ;
    print "a = ", a, ", b = ", b;
    strNewFunctionName = target2.__name__;
    print "装饰后的函数名target2 = %s" % strNewFunctionName;
    pass;
target0();     #调用装饰过的新函数;
target1(6);    #调用装饰过的新函数;
target2(2, 8); #调用装饰过的新函数;
```

### (2)、装饰器有参数

#### A、目标无参数

```
strOldFunctionName = "";
strNewFunctionName = "";
#装饰器有参数:
def decorator(name):       #装饰器函数,参数name可以作为关键字使用(可选的特点);
    def wrapper(callback): #内嵌一级闭包函数wrapper(),用于传递目标函数对象;接受一个函数对象作为参数(这个函数一般就是目标函数);
        #目标无参数:
        def _wrapper(): #二级闭包函数_wrapper()用于传递目标函数的所有参数(没有参数);
            strOldFunctionName = callback.__name__;
            print "装饰前的函数名: %s" % strOldFunctionName;
            print "{name}: enter {func}()".format(name = name, func = callback.__name__); #打印输出:通过关键字模式"{name}"打印,关键字name与format()的name关键字参数相同,func雷同;
            callback(); #调用目标函数,执行原有功能(没有参数);
            print "{name}: leave {func}!".format(name = name, func = callback.__name__);  #打印输出:通过关键字模式"{name}"打印,关键字name与format()的name关键字参数相同,func雷同;
            pass;
        return _wrapper; #在一级闭包函数中返回二级闭包函数对象;
    return wrapper; #在装饰器函数中返回一级闭包函数对象;
#装饰器有参数:
@decorator(name = "SYSTEM")  #装饰目标函数,参数name被用作关键字参数传递(可选参数的特点);
def target(): #目标无参数;
    strNewFunctionName = target.__name__;
    print "装饰后的函数名target = %s" % strNewFunctionName;
    pass;
target(); #调用装饰过的新函数;
```

#### B、目标有参数

```
strOldFunctionName = "";
strNewFunctionName = "";
#装饰器有参数:
def decorator(name):       #装饰器函数,参数name可以作为关键字使用(可选的特点);
    def wrapper(callback): #内嵌一级闭包函数wrapper(),用于传递目标函数对象;接受一个函数对象作为参数(这个函数一般就是目标函数);
        #目标有参数:
        def _wrapper(*args, **kwargs): #二级闭包函数_wrapper()用于传递目标函数的所有参数;
            strOldFunctionName = callback.__name__;
            print "装饰前的函数名: %s" % strOldFunctionName;
            print "{name}: enter {func}()".format(name = name, func = callback.__name__); #打印输出:通过关键字模式"{name}"打印,关键字name与format()的name关键字参数相同,func雷同;
            callback(*args, **kwargs); #调用目标函数,执行原有功能;
            print "{name}: leave {func}!".format(name = name, func = callback.__name__);  #打印输出:通过关键字模式"{name}"打印,关键字name与format()的name关键字参数相同,func雷同;
            pass;
        return _wrapper; #在一级闭包函数中返回二级闭包函数对象;
    return wrapper; #在装饰器函数中返回一级闭包函数对象;
#装饰器有参数:
@decorator(name = 'SYSTEM') #装饰目标函数,参数name被用作关键字参数传递(可选参数的特点);
def target3(a, b, c):
    strNewFunctionName = target3.__name__;
    print "装饰后的函数名target = %s" % strNewFunctionName;
    print "a = %d, b = %d, c = %d" % (a, b, c);
    pass;
#装饰器有参数:
@decorator('PROCESS')       #装饰目标函数,参数name没有被用作关键字参数传递;
def target2(x, y):
    strNewFunctionName = target2.__name__;
    print "装饰后的函数名target = %s" % strNewFunctionName;
    print "x = %d, y = %d" % (x, y);
    pass;
target2(6, 8);    #调用装饰过的新函数;
target3(4, 6, 8); #调用装饰过的新函数;
```

## 目标对象是类

### (1)、装饰器无参数

#### A、目标无参数

```
strOldClassName = "";
strNewClassName = "";
#装饰器无参数:
def decorator(cls): #装饰器,它没有参数,只是接受类对象作为参数(被装饰的目标类);
    #目标无参数:
    def wrapper(): #一级闭包函数,它负责传递类的构造函数需要用到的参数(没有参数);
        strOldClassName = cls.__name__;
        print "装饰前的类名: %s" % strOldClassName;
        print "call {name}.__init__".format(name = cls.__name__);
        objCls = cls(); #调用原始类的构造函数(没有参数);
        return objCls;  #返回新的类对象(被装饰过的目标类对象);
    return wrapper; #返回一级闭包函数对象;
@decorator
class target:
    def __init__(self): #目标无参数;
        strNewClassName = target.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t = target(); #用装饰过的新类创建对象;
t.echo("XXXXXXXXXXXX");
```

#### B、目标有参数

```
strOldClassName = "";
strNewClassName = "";
#装饰器无参数:
def decorator(cls): #装饰器,它没有参数,只是接受类对象作为参数(被装饰的目标类);
    #目标有参数:
    def wrapper(*args, **kwargs): #一级闭包函数,它负责传递类的构造函数需要用到的参数;
        strOldClassName = cls.__name__;
        print "装饰前的类名: %s" % strOldClassName;
        print "call {name}.__init__".format(name = cls.__name__);
        objCls = cls(*args, **kwargs); #调用原始类的构造函数;
        return objCls;  #返回新的类对象(被装饰过的目标类对象);
    return wrapper; #返回一级闭包函数对象;
@decorator
class target1:
    def __init__(self, arg): #目标有参数;
        self.arg = arg;
        print "arg = ", arg;
        strNewClassName = target1.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator
class target2:
    def __init__(self, arg1, arg2): #目标有参数;
        self.arg1 = arg1;
        self.arg2 = arg2;
        print "arg1 = ", self.arg1, ", arg2 = ", self.arg2;
        strNewClassName = target2.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator
class target3:
    def __init__(self): #目标无参数;
        strNewClassName = target3.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t1 = target1(123);      #用装饰过的新类创建对象;
t1.echo("1111111111");
t2 = target2(456, 789); #用装饰过的新类创建对象;
t1.echo("2222222222");
t3 = target3();         #用装饰过的新类创建对象;
t3.echo("3333333333");
```

### (2)、装饰器有参数

#### A、目标无参数

```
strOldClassName = "";
strNewClassName = "";
#装饰器有参数:
def decorator(level = 'INFO'): #装饰器,它需要参数;
    def _wrapper(cls):         #一级闭包函数对象,它接受一个类(被装饰的目标类)对象(类也是对象)作为参数;
        #目标无参数:
        def __wrapper(): #二级闭包函数,它负责传递类的构造函数需要用到的参数(没有参数);
            strOldClassName = cls.__name__;
            print "装饰前的类名: %s" % strOldClassName;
            print "[{level}] call {name}.__init__".format(level = level, name = cls.__name__);
            objCls = cls(); #调用原始类的构造函数(没有参数);
            return objCls;  #返回新的类对象(被装饰过的目标类对象);
        return __wrapper;   #返回二级闭包函数对象;
    return _wrapper; #返回一级闭包函数对象;
@decorator()
class target1:
    def __init__(self): #目标无参数;
        strNewClassName = target1.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator("DEBUG")
class target2:
    def __init__(self): #目标无参数;
        strNewClassName = target2.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator(level = "SYSTEM")
class target3:
    def __init__(self): #目标无参数;
        strNewClassName = target3.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t1 = target1(); #用装饰过的新类创建对象;
t1.echo("AAAAAAAA");
t2 = target2(); #用装饰过的新类创建对象;
t2.echo("BBBBBBBB");
t3 = target3(); #用装饰过的新类创建对象;
t3.echo("CCCCCCCC");
```

#### B、目标有参数

```
strOldClassName = "";
strNewClassName = "";
#装饰器有参数:
def decorator(level = 'INFO'): #装饰器,它需要参数;
    def _wrapper(cls):         #一级闭包函数对象,它接受一个类(被装饰的目标类)对象(类也是对象)作为参数;
        #目标有参数:
        def __wrapper(*args, **kwargs): #二级闭包函数,它负责传递类的构造函数需要用到的参数;
            strOldClassName = cls.__name__;
            print "装饰前的类名: %s" % strOldClassName;
            print "[{level}] call {name}.__init__".format(level = level, name = cls.__name__);
            objCls = cls(*args, **kwargs); #调用原始类的构造函数;
            return objCls;  #返回新的类对象(被装饰过的目标类对象);
        return __wrapper;   #返回二级闭包函数对象;
    return _wrapper; #返回一级闭包函数对象;
@decorator()
class target1:
    def __init__(self, arg):
        self.arg = arg;
        print "arg = ", arg;
        strNewClassName = target1.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator('ERROR')
class target2:
    def __init__(self, arg1, arg2):
        self.arg1 = arg1;
        self.arg2 = arg2;
        print "arg1 = ", self.arg1, ", arg2 = ", self.arg2;
        strNewClassName = target2.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator(level = 'WARN')
class target3:
    def __init__(self):
        strNewClassName = target3.__name__;
        print "装饰后的类名: %s" % strNewClassName;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t1 = target1(123);      #用装饰过的新类创建对象;
t1.echo("1111111111");
t2 = target2(456, 789); #用装饰过的新类创建对象;
t1.echo("2222222222");
t3 = target3();         #用装饰过的新类创建对象;
t3.echo("3333333333");
```

# 装饰器类

**装饰器本身是一个类,通过构造函数__init__()和回调函数__call__()实现装饰器功能**

## 目标对象是函数

### (1)、装饰器无参数

#### A、目标无参数

```
#装饰器无参数:
class decorator:  #装饰器类,它也可以从object继承"class decorator(object)";
    def __init__(self, callback): #在构造函数里面接受callback对象(原始目标函数对象)作为参数;
        self.callback = callback;
        self.__name__ = callback.__name__; #保证被装饰之后函数名字不变;
        pass;
    #目标无参数:
    def __call__(self): #在__call__()函数中传递目标函数对象的所有参数(没有参数);
        print "装饰前的函数名: %s" % self.callback.__name__;
        print "enter {func}()".format(func = self.callback.__name__);
        result = self.callback();
        print "leave {func}()".format(func = self.callback.__name__);
        return result;
@decorator
def target():
    print "装饰后的函数名: %s" % target.__name__;
    pass;
target(); #调用装饰过的新函数;
```

#### B、目标有参数

```
#装饰器无参数:
class decorator:  #装饰器类,它也可以从object继承"class decorator(object)";
    def __init__(self, callback): #在构造函数里面接受callback对象(原始目标函数对象)作为参数;
        self.callback = callback;
        self.__name__ = callback.__name__; #保证被装饰之后函数名字不变;
        pass;
    #目标有参数:
    def __call__(self, *args, **kwargs): #在__call__()函数中传递目标函数对象的所有参数(任意参数);
        print "装饰前的函数名: %s" % self.callback.__name__;
        print "enter {func}()".format(func = self.callback.__name__);
        result = self.callback(*args, **kwargs); #传递任意参数;
        print "leave {func}()".format(func = self.callback.__name__);
        return result;
@decorator
def target0():
    print "装饰后的函数名: %s" % target0.__name__;
    pass;
@decorator
def target1(a, b):
    print "a = %d, b = %d" % (a, b);
    print "装饰后的函数名: %s" % target1.__name__;
    pass;
target0();     #调用装饰过的新函数;
target1(6, 8); #调用装饰过的新函数;
```

### (2)、装饰器有参数

#### A、目标无参数

```
#装饰器有参数:
class decorator:
    def __init__(self, name = 'INFO'): #在装饰器的构造函数中传递装饰器类需要的参数;
        self.name = name;
        pass;
    #目标无参数:
    def __call__(self, callback): #在__call__()函数中接受callback对象(原始目标函数对象)作为参数;
        def wrapper(): #内部闭包函数,给目标函数增加额外的功能(没有参数);
            print "装饰后的函数名: %s" % callback.__name__;
            print "[{name}] enter {func}()".format(name = self.name, func = callback.__name__);
            result = callback();  #调用原始目标函数,没有参数;
            print "[{name}] leave {func}()".format(name = self.name, func = callback.__name__);
            return result;
        return wrapper; #返回新的目标函数对象;
@decorator()
def target0():
    print "装饰后的函数名: %s" % target0.__name__;
    pass;
@decorator('ERROR')
def target1():
    print "装饰后的函数名: %s" % target1.__name__;
    pass;
@decorator(name = 'SYSTEM')
def target2():
    print "装饰后的函数名: %s" % target2.__name__;
    pass;
target0(); #调用装饰过的新函数;
target1(); #调用装饰过的新函数;
target2(); #调用装饰过的新函数;
```

#### B、目标有参数

```
#装饰器有参数:
class decorator:
    def __init__(self, name = 'INFO'): #在装饰器的构造函数中传递装饰器类需要的参数;
        self.name = name;
        pass;
    #目标有参数:
    def __call__(self, callback): #在__call__()函数中接受callback对象(原始目标函数对象)作为参数;
        def wrapper(*args, **kwargs): #内部闭包函数,给目标函数增加额外的功能(任意参数);
            print "装饰后的函数名: %s" % callback.__name__;
            print "[{name}] enter {func}()".format(name = self.name, func = callback.__name__);
            result = callback(*args, **kwargs);  #调用原始目标函数,传递任意参数;
            print "[{name}] leave {func}()".format(name = self.name, func = callback.__name__);
            return result;
        return wrapper; #返回新的目标函数对象;
@decorator()
def target0():
    print "装饰后的函数名: %s" % target0.__name__;
    pass;
@decorator('ERROR')
def target1(a):
    print "装饰后的函数名: %s" % target1.__name__;
    print "a = %d" % (a);
    pass;
@decorator(name = 'SYSTEM')
def target2(x, y):
    print "装饰后的函数名: %s" % target2.__name__;
    print "x = %d, y = %d" % (x, y);
    pass;
target0();     #调用装饰过的新函数;
target1(2);    #调用装饰过的新函数;
target2(6, 8); #调用装饰过的新函数;
```

## 目标对象是类

### (1)、装饰器无参数

#### A、目标无参数

```
#装饰器无参数:
class decorator:
    def __init__(self, cls): #在装饰器的构造函数中传递被装饰类的对象;
        self.cls = cls;
        self.__name__ = cls.__name__; #保证被装饰之后类的名字不变;
        pass;
    #目标无参数:
    def __call__(self): #在__call__()函数中接受callback对象(原始目标函数对象)的所有参数(没有参数);
        print "装饰前的类名: %s" % self.cls.__name__;
        print "enter {func}()".format(func = self.cls.__name__);
        objCls = self.cls();  #调用原始类的构造函数,传递任意参数(没有参数);
        print "leave {func}()".format(func = self.cls.__name__);
        return objCls; #返回新的目标类对象;
@decorator #装饰器无参数;
class target:
    def __init__(self): #目标无参数;
        print "装饰后的类名: %s" % target.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t = target(); #用装饰过的新类创建对象;
```

#### B、目标有参数

```
#装饰器无参数:
class decorator:
    def __init__(self, cls): #在装饰器的构造函数中传递被装饰类的对象;
        self.cls = cls;
        self.__name__ = cls.__name__; #保证被装饰之后类的名字不变;
        pass;
    #目标有参数:
    def __call__(self, *args, **kwargs): #在__call__()函数中接受callback对象(原始目标函数对象)的所有参数(任意参数);
        print "装饰前的类名: %s" % self.cls.__name__;
        print "enter {func}()".format(func = self.cls.__name__);
        objCls = self.cls(*args, **kwargs);  #调用原始类的构造函数,传递任意参数;
        print "leave {func}()".format(func = self.cls.__name__);
        return objCls; #返回新的目标类对象;
@decorator #装饰器无参数;
class target0:
    def __init__(self): #目标无参数;
        print "装饰后的类名: %s" % target0.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator #装饰器无参数;
class target1:
    def __init__(self, arg1, arg2): #目标有参数;
        self.arg1 = arg1;
        self.arg2 = arg2;
        print "arg1 = ", self.arg1, ", arg2 = ", self.arg2;
        print "装饰后的类名: %s" % target1.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator #装饰器无参数;
class target2:
    def __init__(self, arg1): #目标有参数;
        self.arg1 = arg1;
        print "arg1 = ", self.arg1;
        print "装饰后的类名: %s" % target2.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t1 = target0();     #用装饰过的新类创建对象;
t1.echo("AAAAAAAA");
t2 = target1(6, 8); #用装饰过的新类创建对象;
t2.echo("BBBBBBBB");
t3 = target2(9);    #用装饰过的新类创建对象;
t3.echo("CCCCCCCC");
```

### (2)、装饰器有参数

#### A、目标无参数

```
#装饰器有参数:
class decorator:
    def __init__(self, name = 'INFO'): #在装饰器的构造函数中传递装饰器类需要的参数;
        self.name = name;
        pass;
    #目标无参数:
    def __call__(self, cls): #在__call__()函数中接受callback对象(原始目标函数对象)作为参数;
        def wrapper(): #内部闭包函数,给目标类增加额外的功能(没有参数);
            print "装饰前的类名: %s" % cls.__name__;
            print "[{name}] enter {func}()".format(name = self.name, func = cls.__name__);
            objCls = cls();  #调用原始类的构造函数(没有参数);
            print "[{name}] leave {func}()".format(name = self.name, func = cls.__name__);
            return objCls;
        return wrapper; #返回新的目标函数对象;
@decorator()            #装饰器有参数;
class target0:
    def __init__(self): #目标无参数;
        print "装饰后的类名: %s" % target0.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator("DEBUG")     #装饰器有参数;
class target1:
    def __init__(self): #目标无参数;
        print "装饰后的类名: %s" % target1.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator(name = "SYSTEM") #装饰器有参数;
class target2:
    def __init__(self):     #目标无参数;
        print "装饰后的类名: %s" % target2.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t1 = target0(); #用装饰过的新类创建对象;
t1.echo("AAAAAAAA");
t2 = target1(); #用装饰过的新类创建对象;
t2.echo("BBBBBBBB");
t3 = target2(); #用装饰过的新类创建对象;
t3.echo("CCCCCCCC");
```

#### B、目标有参数

```
#装饰器有参数:
class decorator:
    def __init__(self, name = 'INFO'): #在装饰器的构造函数中传递装饰器类需要的参数;
        self.name = name;
        pass;
    #目标有参数:
    def __call__(self, cls): #在__call__()函数中接受callback对象(原始目标函数对象)作为参数;
        def wrapper(*args, **kwargs): #内部闭包函数,给目标类增加额外的功能(任意参数);
            print "装饰前的类名: %s" % cls.__name__;
            print "[{name}] enter {func}()".format(name = self.name, func = cls.__name__);
            objCls = cls(*args, **kwargs);  #调用原始类的构造函数,传递任意参数;
            print "[{name}] leave {func}()".format(name = self.name, func = cls.__name__);
            return objCls;
        return wrapper; #返回新的目标函数对象;
@decorator()            #装饰器有参数;
class target0:
    def __init__(self): #目标无参数;
        print "装饰后的类名: %s" % target0.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator("DEBUG") #装饰器有参数;
class target1:
    def __init__(self, arg1, arg2): #目标有参数;
        self.arg1 = arg1;
        self.arg2 = arg2;
        print "arg1 = ", self.arg1, ", arg2 = ", self.arg2;
        print "装饰后的类名: %s" % target1.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
@decorator(name = "SYSTEM") #装饰器有参数;
class target2:
    def __init__(self, arg1): #目标有参数;
        self.arg1 = arg1;
        print "arg1 = ", self.arg1;
        print "装饰后的类名: %s" % target2.__name__;
        pass;
    def echo(self, msg):
        print "echo: ", msg;
        pass;
t1 = target0();     #用装饰过的新类创建对象;
t1.echo("AAAAAAAA");
t2 = target1(6, 8);   #用装饰过的新类创建对象;
t2.echo("BBBBBBBB");
t3 = target2(9);    #用装饰过的新类创建对象;
t3.echo("CCCCCCCC");
```

# 【备注】

针对装饰器类用于装饰函数的情况,装饰器类还有如下写法:把内嵌的闭包函数定义成装饰器类的成员函数; 
例如:

```
#装饰器有参数:
class decorator:
    def __init__(self, name = 'INFO'): #在装饰器的构造函数中传递装饰器类需要的参数;
        self.name = name;
        pass;
    #目标有参数:
    def __call__(self, callback): #在__call__()函数中接受callback对象(原始目标函数对象)作为参数;
        self.callback = callback;
        return self.wrapper; #返回新的目标函数对象(闭包函数对象);
    #原来的闭包函数被定义为成员函数:
    def wrapper(*args, **kwargs): #内部闭包函数,给目标函数增加额外的功能(任意参数);
        print "装饰后的函数名: %s" % callback.__name__;
        print "[{name}] enter {func}()".format(name = self.name, func = callback.__name__);
        result = self.callback(*args, **kwargs);  #调用原始目标函数,传递任意参数;
        print "[{name}] leave {func}()".format(name = self.name, func = callback.__name__);
        return result;
```

# 【总结】

- [1] @decorator后面不带括号时(也即装饰器无参数时),效果就相当于先定义func或cls,而后执行赋值操作func=decorator(func)或cls=decorator(cls);
- [2] @decorator后面带括号时(也即装饰器有参数时),效果就相当于先定义func或cls,而后执行赋值操作 func=decorator(decoratorArgs)(func)或cls=decorator(decoratorArgs)(cls);
- [3] 如上将func或cls重新赋值后,此时的func或cls也不再是原来定义时的func或cls,而是一个可执行体,你只需要传入参数就可调用,func(args)=>返回值或者输出,cls(args)=>object of cls;
- [4] 最后通过赋值返回的执行体是多样的,可以是闭包,也可以是外部函数;当被装饰的是一个类时,还可以是类内部方法,函数;
- [5] 另外要想真正了解装饰器,一定要了解func.func_code.co_varnames,func.func_defaults,通过它们你可以以func的定义之外,还原func的参数列表;另外关键字参数是因为调用而出现的,而不是因为func的定义,func的定义中的用等号连接的只是有默认值的参数,它们并不一定会成为关键字参数,因为你仍然可以按照位置来传递它们;

# 【转载】

[https://www.zybuluo.com/zengxiankui/note/790708](https://www.zybuluo.com/zengxiankui/note/790708)
