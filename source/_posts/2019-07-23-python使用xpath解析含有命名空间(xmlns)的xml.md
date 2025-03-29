---
layout:     post
title:      python使用xpath解析含有命名空间(xmlns)的xml
subtitle:   
date:       2019-07-23
author:     Mehaei
header-img: img/post-bg-re-vs-ng2.jpg
catalog: true
tags:
    - python
---
解决办法:

from lxml import etree

xml = etree.parse("./cee.xml")

root = xml.getroot()

**<em id="__mceDel"><em id="__mceDel">print(root.xpath(".//i:Reviews", namespaces={"i":"http://www.bazaarvoice.com/xs/PRR/StandardClientFeed/14.7"}))**</em></em>

更多语言参考

[https://stackoverflow.com/questions/40796231/how-does-xpath-deal-with-xml-namespaces](https://stackoverflow.com/questions/40796231/how-does-xpath-deal-with-xml-namespaces)
