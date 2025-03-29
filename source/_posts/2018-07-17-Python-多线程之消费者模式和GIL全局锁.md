---
layout:     post
title:      Python-多线程之消费者模式和GIL全局锁
subtitle:   
date:       2018-07-17
author:     Mehaei
header-img: img/post-bg-e2e-ux.jpg
catalog: true
tags:
    - python
---
```
# 一对多 一个大厨对多个顾客

import threading
import queue
import time

q = queue.Queue(maxsize=10)

#生产者
def producer(name):
    count = 1
    while True:
        q.put("包子%d"%count)
        print("生产了包子%d"%count)
        count += 1
        time.sleep(0.8)

#消费者
def consumer(name):
    count = 1
    while True:
        print("[%s]取到了[%s]并且吃了它。。。"%(name,q.get()))
        time.sleep(2)

if __name__ == '__main__':
    p  = threading.Thread(target=producer,args=("刘大厨",))
    a = threading.Thread(target=consumer,args=("A",))
    b = threading.Thread(target=consumer,args=("B",))

    p.start()
    a.start()
    b.start()
```

```
# 多对多 多个大厨对多个顾客

import threading
import queue
import time,random
q = queue.Queue(maxsize=10)
count = 1
#生产者
def producer(name):
    global count
    while True:

        # if mutex.acquire():
        #     q.put("包子%d"%count)
        #     print("%s生产了包子%d"%(name,count))
        #     count += 1
        #     time.sleep(random.random()*10)
        #     mutex.release()
        q.put("包子%d" % count)
        print("%s生产了包子%d" % (name, count))
        count += 1
        time.sleep(random.random() * 10)

#消费者
def consumer(name):
    count = 1
    while True:
        print("[%s]取到了[%s]并且吃了它。。。"%(name,q.get()))
        time.sleep(random.random() * 10)

if __name__ == '__main__':

    mutex = threading.Lock()

    p1 = threading.Thread(target=producer,args=("刘大厨",))
    p2 = threading.Thread(target=producer,args=("李大厨",))

    a = threading.Thread(target=consumer,args=("A",))
    b = threading.Thread(target=consumer,args=("B",))
    c = threading.Thread(target=consumer,args=("C",))
    d = threading.Thread(target=consumer,args=("D",))

    p1.start()
    p2.start()
    a.start()
    b.start()
    c.start()
    d.start()
```

```
from threading import Thread
from multiprocessing import Process

import time
#计数
def two_hundred_million():
    start_time = time.time()
    i = 0
    for _ in range(200000000):
        i = i + 1
    end_time = time.time()
    print("Total time:{}".format(end_time - start_time))

#数1亿
def one_hundred_million():
    start_time = time.time()
    i = 0
    for _ in range(100000000):
        i = i + 1
    end_time = time.time()
    print("Total time:{}".format(end_time - start_time))

if __name__ == "__main__":
    #单线程---主线程
    #two_hundred_million() #Total time:19.491114616394043

    #多线程
    # for _ in range(2):
    #     t = Thread(target=one_hundred_million) #Total time:18.768073320388794
    #     t.start()                              #Total time:18.906081438064575

    #多进程
    # for _ in range(2):
    #     p = Process(target=one_hundred_million)  #Total time:11.364650011062622
    #     p.start()                                #Total time:11.398651838302612
```
