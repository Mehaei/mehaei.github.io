---
layout:     post
title:      Scrapy框架——CrawlSpider类爬虫案例
subtitle:   
date:       2018-07-19
author:     Mehaei
header-img: img/post-bg-mma-2.jpg
catalog: true
tags:
    - python
---
### Scrapy--CrawlSpider

此案例采用的是CrawlSpider类实现爬虫。

它是Spider的派生类，Spider类的设计原则是只爬取start_url列表中的网页，而CrawlSpider类定义了一些规则(rule)来提供跟进link的方便的机制，从爬取的网页中获取link并继续爬取的工作更适合。如爬取大型招聘网站

创建项目

```
 scrapy startproject tencent #创建项目
```

创建模板

```
scrapy genspider crawl -t tencent 'hr.tencent.com'    #tencent为爬虫名称 hr.tencent.com为限制域
```

创建完会模板后会生成一个tencent.py的文件   

```
# -*- coding: utf-8 -*-
import scrapy
from scrapy.linkextractors import LinkExtractor
from scrapy.spiders import CrawlSpider, Rule
 
 
class TencentSpider(CrawlSpider):
    name = 'tencent'
    allowed_domains = ['tencent.com']
    start_urls = ['http://tencent.com/']
 
    rules = (
        Rule(LinkExtractor(allow=r'Items/'), callback='parse_item', follow=True),
    )
 
    def parse_item(self, response):
        i = {}
        #i['domain_id'] = response.xpath('//input[@id="sid"]/@value').extract()
        #i['name'] = response.xpath('//div[@id="name"]').extract()
        #i['description'] = response.xpath('//div[@id="description"]').extract()
        return i
```

##### rules

在rules中包含一个或多个Rule对象，每个Rule对爬取网站的动作定义了特定操作。如果多个rule匹配了相同的链接，则根据规则在本集合中被定义的顺序，第一个会被使用。

参数介绍：LinkExtractor：是一个Link Extractor对象，用于定义需要提取的链接。

#### item文件

```
import scrapy
    
    class TencentItem(scrapy.Item):
        # 职位
        name = scrapy.Field()
        # 详情链接
        positionlink = scrapy.Field()
        #职位类别
        positiontype = scrapy.Field()
        # 人数
        peoplenum = scrapy.Field()
        # 工作地点
        worklocation = scrapy.Field()
        # 发布时间
        publish = scrapy.Field()
 
```

#### pipeline文件

```
import json
    class TencentPipeline(object):
    
        def __init__(self):
            self.filename = open("tencent.json", "w")
        def process_item(self, item, spider):
            text = json.dumps(dict(item), ensure_ascii = False)  + ",\n"
            self.filename.write(text.encode("utf-8"))
            return item
        def close_spider(self, spider):
            self.filename.close()
 
```

#### setting文件

```
BOT_NAME = 'tencent'
    
    SPIDER_MODULES = ['tencent.spiders']
    NEWSPIDER_MODULE = 'tencent.spiders'
    LOG_FILE = 'tenlog.log'
    LOG_LEVEL = 'DEBUG'
    LOG_ENCODING = 'utf-8'
    
    ROBOTSTXT_OBEY = True
    
    DEFAULT_REQUEST_HEADERS = {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    #   'Accept-Language': 'en',
    }
    
    
    ITEM_PIPELINES = {
       'tencent.pipelines.TencentPipeline': 300,
    }
 
```

#### spider文件

```
# -*- coding: utf-8 -*-
    import scrapy
    # 导入链接匹配规则类，用来提取符合规则的链接
    from scrapy.linkextractors import LinkExtractor
    from scrapy.spiders import CrawlSpider, Rule
    from tencent.items import TencentItem
    
    class TenecntSpider(CrawlSpider):
        name = 'tencent1'
        # 可选，加上会有一个爬去的范围
        allowed_domains = ['hr.tencent.com']
        start_urls = ['http://hr.tencent.com/position.php?&start=0#a']
        # response中提取 链接的匹配规则，得出是符合的链接
        pagelink = LinkExtractor(allow=('start=\d+'))
    
        print (pagelink)
        # 可以写多个rule规则
        rules = [
            # follow = True需要跟进的时候加上这句。
            # 有callback的时候就有follow
            # 只要符合匹配规则，在rule中都会发送请求，同是调用回调函数处理响应
            # rule就是批量处理请求
            Rule(pagelink, callback='parse_item', follow=True),
        ]
    
        # 不能写parse方法，因为源码中已经有了，回覆盖导致程序不能跑
        def parse_item(self, response):
            for each in response.xpath("//tr[@class='even'] | //tr[@class='odd']"):
                # 把数据保存在创建的对象中，用字典的形式
    
                item = TencentItem()
                # 职位
                # each.xpath('./td[1]/a/text()')返回的是列表，extract转为unicode字符串，[0]取第一个
                item['name'] = each.xpath('./td[1]/a/text()').extract()[0]
                # 详情链接
                item['positionlink'] = each.xpath('./td[1]/a/@href').extract()[0]
                # 职位类别
                item['positiontype'] = each.xpath("./td[2]/text()").extract()[0]
                # 人数
                item['peoplenum'] = each.xpath('./td[3]/text()').extract()[0]
                # 工作地点
                item['worklocation'] = each.xpath('./td[4]/text()').extract()[0]
                # 发布时间
                item['publish'] = each.xpath('./td[5]/text()').extract()[0]
    
                # 把数据交给管道文件
                yield item
 
```

这个样就实现了一个简单的CrawlSpider类爬虫
