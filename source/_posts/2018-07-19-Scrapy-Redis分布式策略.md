---
layout:     post
title:      Scrapy-Redis分布式策略
subtitle:   
date:       2018-07-19
author:     Mehaei
header-img: img/post-bg-os-metro.jpg
catalog: true
tags:
    - python
---
## Scrapy-Redis分布式策略

**原理图：**

<img src="https://images2018.cnblogs.com/blog/1432315/201807/1432315-20180719194025125-407464128.png" alt="" width="778" height="512" />

假设有四台电脑：Windows 10、Mac OS X、Ubuntu 16.04、CentOS 7.2，任意一台电脑都可以作为 Master端 或 Slaver端，比如：

Master端(核心服务器) ：使用 Windows 10，搭建一个Redis数据库，不负责爬取，只负责url指纹判重、Request的分配，以及数据的存储

首先Slaver端从Master端拿任务（Request、url）进行数据抓取，Slaver抓取数据的同时，产生新任务的Request便提交给 Master 处理；

Master端只有一个Redis数据库，负责将未处理的Request去重和任务分配，将处理后的Request加入待爬队列，并且存储爬取的数据。

缺点是，Scrapy-Redis调度的任务是Request对象，里面信息量比较大（不仅包含url，还有callback函数、headers等信息），可能导致的结果就是会降低爬虫速度、而且会占用Redis大量的存储空间，所以如果要保证效率，那么就需要一定硬件水平。

## <a name="t1"></a>环境准备

##### 安装scrapy

```
pip install scrapy
```

##### 安装scrapy-redis

```
pip install scrapy-redis
```

##### 安装redis

[windows版redis软件下载 ](https://pan.baidu.com/s/1iZrbtZdVdld3ZEW6QnQLBg%20) 密码：oopq

##### 创建项目

```
scrapy startproject 项目名称
```

## <a name="t2"></a>拉勾网实战

###### 向原有settings.py文件中添加

```
# url指纹过滤器
DUPEFILTER_CLASS = "scrapy_redis.dupefilter.RFPDupeFilter"

# 调度器
SCHEDULER = "scrapy_redis.scheduler.Scheduler"
# 设置爬虫是否可以中断
SCHEDULER_PERSIST = True

# 设置请求队列类型
# SCHEDULER_QUEUE_CLASS = "scrapy_redis.queue.SpiderPriorityQueue" # 按优先级入队列
# SCHEDULER_QUEUE_CLASS = "scrapy_redis.queue.SpiderQueue" # 按照队列模式先进先出
SCHEDULER_QUEUE_CLASS = "scrapy_redis.queue.SpiderStack" # 按照栈进行请求的调度先进后出

# 配置redis管道文件，权重数字相对最大
ITEM_PIPELINES = {
    'scrapy_redis.pipelines.RedisPipeline': 999, # redis管道文件，自动把数据加载到redis
}

# redis 连接配置
REDIS_HOST = '127.0.0.1'
REDIS_PORT = 6379
REDIS_PARAMS = {
    'password' : '123456', # 密码
    'db' : 1 # 指定使用哪个数据库
}
```

并修改settings.py文件`ROBOTSTXT_OBEY = False`

###### Spider文件

本爬虫实现了将所有爬虫请求获取的数据写入到Redis服务器中

```
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
from scrapy_redis.spiders import RedisCrawlSpider
from scr_redis.items import LaGouItem
import re
import time
from datetime import datetime
from datetime import timedelta

class BaiduSpider(RedisCrawlSpider):   #继承RedisCrawlSpider 类
    name = 'lagou'
    allowed_domains = ['lagou.com']
    # start_urls = ['http://www.baidu.com/']
    redis_key = 'start_url'   #设置redis键名启动

    rules = (
        # Rule(LinkExtractor(allow=r''), callback='parse_item', follow=True),
        # #搜索
        Rule(LinkExtractor(allow=(r'lagou.com/jobs/list_',), tags=('form',), attrs=('action',)), follow=True),
        # #公司招聘
        Rule(LinkExtractor(allow=(r'lagou\.com/gongsi/',), tags=('a',), attrs=('href',)), follow=True),
        # 公司列表
        Rule(LinkExtractor(allow=(r'/gongsi/j\d+\.html',), tags=('a',), attrs=('href',)), follow=True),
        # 校园招聘
        Rule(LinkExtractor(allow=(r'xiaoyuan\.lagou\.com',), tags=('a',), attrs=('href',)), follow=True),
        # 匹配校园分类
        Rule(LinkExtractor(allow=(r'isSchoolJob',), tags=('a',), attrs=('href',)), follow=True),
        # # 详情页
        Rule(LinkExtractor(allow=(r'jobs/\d+\.html',), tags=('a',), attrs=('href',)), callback='parse_item',
             follow=False),
    )

    num_pattern = re.compile(r'\d+') # 提取数字正则
    custom_settings = {
         'DEFAULT_REQUEST_HEADERS' : {
            "Host": "www.lagou.com",
            "Connection": "keep-alive",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36",
            "Content-type": "application/json;charset=utf-8",
            "Accept": "*/*",
            "Referer": "https://www.lagou.com",
            "Accept-Language": "zh-CN,zh;q=0.9",
            "Cookie": "user_trace_token=20171116192426-b45997e2-cac0-11e7-98fd-5254005c3644; LGUID=20171116192426-b4599a6d-cac0-11e7-98fd-5254005c3644; index_location_city=%E5%85%A8%E5%9B%BD; JSESSIONID=ABAAABAAAGFABEFC0E3267F681504E5726030548F107348; _gat=1; X_HTTP_TOKEN=d8b7e352a862bb108b4fd1b63f7d11a7; _gid=GA1.2.1718159851.1510831466; _ga=GA1.2.106845767.1510831466; Hm_lvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1510836765,1510836769,1510837049,1510838482; Hm_lpvt_4233e74dff0ae5bd0a3d81c6ccf756e6=1510839167; LGSID=20171116204415-da8c7971-cacb-11e7-930c-525400f775ce; LGRID=20171116213247-a2658795-cad2-11e7-9360-525400f775ce",
        },
        'COOKIES_ENABLED' : False,
        'CONCURRENT_REQUESTS' : 5,
    }

    def parse_item(self, response):
        item = LaGouItem()
        title = response.css('span.name::text').extract()[0]
        url = response.url
        spans = response.xpath('//dd[@class="job_request"]//span')
        salary = spans[0].css('span::text').extract()[0] #薪资
        city =self.splits(spans[1].css('span::text').extract()[0])#工作城市
        start,end= self.asks(self.splits(spans[2].css('span::text').extract()[0] ))#经验
        edu = self.splits(spans[3].css("span::text").extract()[0] ) #学历
        job_type = spans[4].css('span::text').extract()[0] #工作类型

        label = "-".join(response.xpath('//ul[@class="position-label clearfix"]//li/text()').extract()) #标签
        publish_time =self.times(response.xpath('//p[@class="publish_time"]//text()').extract()[0].strip('\xa0 发布于拉勾网')) #发布时间
        tempy = response.xpath('//dd[@class="job-advantage"]//p/text()').extract()[0]  #在职业诱惑
        discription =''.join([''.join(i.split()) for i in response.xpath('//dd[@class="job_bt"]//div//text()').extract()]) #岗位职责
        addr = '-'.join(response.xpath('//div[@class="work_addr"]//a/text()').extract()[:-1])
        address = ''.join(  ''.join(i.split()) for i in response.xpath('//div[@class="work_addr"]/text()').extract())
        loction= addr+address  #详细工作地址


        #装载数据
        item["title"] = title
        item["url"] = url
        item["salary"] = salary
        item["city"] = city
        item["start"] = start
        item["end"] = end
        item["edu"] = edu
        item["job_type"] = job_type
        item["label"] = label
        item["publish_time"] = publish_time
        item["tempy"] = tempy
        item["discription"] = discription
        item["loction"] = loction
        return item



    #去斜杠
    def splits(self,value):
        result =value.strip('/')
        return result

    def asks(self,value):
        if '不限' in value:
            start = 0
            end = 0
        elif '以下' in value :
            res = self.num_pattern.search(value)
            start  =  res.group()
            end = res.group()
        else:
            res = self.num_pattern.findall(value)
            start  = res[0]
            end = res[1]
        return  start,end
    #统一日期格式
    def times(self,value):
        if ':' in value:
            times=datetime.now().strftime('%Y-%m-%d')
        elif '天前' in value:
            res = self.num_pattern.search(value).group()
            times = (datetime.now() - timedelta(days=int(res))).strftime('%Y-%m-%d')
        else :
            times = value
        return times
```

###### 在项目同级目录下创建main.py文件,用来启用爬虫

```
from scrapy.cmdline import execute
import os
os.chdir('scr_redis/spiders')
# execute('scrapy crawl baidu'.split()) #原启动方式
execute('scrapy runspider lagou.py'.split())
```

item.py文件

```
# -*- coding: utf-8 -*-

# Define here the models for your scraped items
#
# See documentation in:
# https://doc.scrapy.org/en/latest/topics/items.html

import scrapy


class ScrRedisItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    pass

class LaGouItem(scrapy.Item):
    title = scrapy.Field()
    url = scrapy.Field()
    salary = scrapy.Field()
    city = scrapy.Field()
    start = scrapy.Field()
    end = scrapy.Field()
    edu = scrapy.Field()
    job_type = scrapy.Field()
    label = scrapy.Field()
    publish_time = scrapy.Field()
    tempy = scrapy.Field()
    discription = scrapy.Field()
    loction = scrapy.Field()
```

### 在项目目录下创建做持久化保存的文件

本文件实现了将写入redis的数据读取出来保存到mysql数据库

```
# -*- coding: utf-8 -*-
import json
import redis  # pip install redis
import pymysql

def main():
    # 指定redis数据库信息
    rediscli = redis.StrictRedis(host='127.0.0.1', port = 6379,db = 1,password=123456)
    # 指定mysql数据库
    mysqlcli = pymysql.connect(host='127.0.0.1', user='root', passwd='123456', db='neihan', charset='utf8')

    # 无限循环
    while True:
        source, data = rediscli.blpop(["lagou:items"]) # 从redis里提取数据

        item = json.loads(data.decode('utf-8')) # 把 json转字典
        try:
            # 使用execute方法执行SQL INSERT语句
            sql = "insert into lagou(title,url,salary,city,start,end,edu,job_type,label,publish_time,tempy,discription,loction)  values(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)"
            data =[item["title"], item['url'], item["salary"], item["city"], item["start"], item["end"], item["edu"],item["job_type"], item["label"], item["publish_time"], item["tempy"], item["discription"],item["loction"]]
            # 使用cursor()方法获取操作游标
            cur = mysqlcli.cursor()
            cur.execute(sql,data)
            # 提交sql事务
            mysqlcli.commit()
            #关闭本次操作
            cur.close()
            print ("插入 %s" % item['title'])
        except pymysql.Error as e:
            # 插入失败则将主键自增设置为1，否则插入数据失败id也会自增，就会出现主键增长不连续的情况
            cur.execute('alter table haowaiauto_increment=1')
            mysqlcli.rollback() 
            print ("插入错误" ,str(e)) 
if __name__ == '__main__':
     main()
```
