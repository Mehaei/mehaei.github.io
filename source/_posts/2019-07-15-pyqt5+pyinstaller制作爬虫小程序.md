---
layout:     post
title:      pyqt5+pyinstaller制作爬虫小程序
subtitle:   
date:       2019-07-15
author:     Mehaei
header-img: img/post-bg-miui-ux.jpg
catalog: true
categories:
    - 爬虫技术
tags:
    - python
---
环境:mac python3.7 pyqt5 pyinstaller

ps: 主要是熟悉pyqt5, 加入了单选框 输入框 文本框 文件夹选择框及日历下拉框

效果图:

<img src="https://img2018.cnblogs.com/blog/1432315/201907/1432315-20190715163800523-177632132.gif" alt="" />

```
# -*- coding: utf-8 -*-
# @Author: Mehaei
# @Date:   2019-07-10 13:02:56
# @Last Modified by:   Mehaei
# @Last Modified time: 2019-07-15 16:43:18
import os
import uuid
import sys
import time
import json
from PyQt5.QtGui import QRegExpValidator, QIntValidator
from PyQt5.QtCore import QDate, QBasicTimer, QRegExp
from PyQt5.QtWidgets import (QWidget, QDesktopWidget, QApplication, 
                            QMessageBox, QPushButton, QLabel, QLineEdit, QGridLayout, QComboBox,
                            QDateTimeEdit, QFileDialog, QProgressBar, QTextEdit)
 
 
from worker import Worker
 
 
class Example(QWidget):
 
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.initUI()
 
    def initUI(self):
 　　　　 # 主窗口大小
        self.resize(500, 400)
        self.center()
        self.cwd = os.getcwd()
 　　　　
        url = QLabel('url')
        proxy = QLabel("proxy")
        count = QLabel("count")
 
        start_time = QLabel("start_time")
        end_time = QLabel("end_time")
 
        data_dir = QLabel("data_dir")
 
        shop_info = QLabel("shop_info")
        self.shopEdit = QTextEdit()
 
 　　　　# 文件选择框
        self.btn_chooseDir = QPushButton(self)
        self.btn_chooseDir.setObjectName("btn_chooseDir")
        self.btn_chooseDir.setText("choose dir")
        self.btn_chooseDir.clicked.connect(self.slot_btn_chooseDir)
 
        # url正则验证 仅限amazon
        url_regex = QRegExp(r'http[s]{0,1}://www.amazon.+')
        url_line_re = QRegExpValidator(self)
        url_line_re.setRegExp(url_regex)
 
        self.urlEdit = QLineEdit()
        self.urlEdit.setPlaceholderText("Please product url")
 
        self.urlEdit.setValidator(url_line_re)
 
        # 下拉框
        self.proxyCom = QComboBox()
        self.proxyCom.addItem("adsl(default)")
        self.proxyCom.addItem("None")
 
        self.countEdit = QLineEdit()
        self.countEdit.setText("100")
        int_limit = QIntValidator(self)
        int_limit.setRange(1, 50000)
        self.countEdit.setValidator(int_limit)
 
        self.startdateEdit = QDateTimeEdit(QDate.currentDate(), self)
        self.startdateEdit.setDisplayFormat("yyyy-MM-dd HH:mm:ss")
        self.startdateEdit.setCalendarPopup(True)
 
        self.startdateEdit.dateChanged.connect(self.get_start_date)
 
        self.enddateEdit = QDateTimeEdit(QDate.currentDate(), self)
        self.enddateEdit.setDisplayFormat("yyyy-MM-dd HH:mm:ss")
        self.enddateEdit.setCalendarPopup(True)
 
        self.enddateEdit.dateChanged.connect(self.get_end_date)
 
        self.shopbtn = QPushButton('Shop', self)
        # self.btn.move(40, 80)
        self.shopbtn.clicked.connect(self.get_shop)
 
        self.reviewbtn = QPushButton('Review', self)
        # self.btn.move(40, 80)
        self.reviewbtn.clicked.connect(self.get_review)
  
        grid = QGridLayout()
        grid.setSpacing(5)
 
        grid.addWidget(url, 1, 0)
        grid.addWidget(self.urlEdit, 1, 1, 1, 4)
 
        grid.addWidget(proxy, 2, 0)
        grid.addWidget(self.proxyCom, 2, 1)
 
        grid.addWidget(count, 2, 2, 1, 2)
        grid.addWidget(self.countEdit, 2, 4)
 
        grid.addWidget(start_time, 3, 0)
        grid.addWidget(self.startdateEdit, 3, 1)
 
        grid.addWidget(end_time, 3, 2, 1, 2)
        grid.addWidget(self.enddateEdit, 3, 4)
 
        grid.addWidget(data_dir, 4, 0)
        grid.addWidget(self.btn_chooseDir, 4, 1)
 
        grid.addWidget(shop_info, 5, 0)
        grid.addWidget(self.shopEdit, 5, 1, 5, 5)
 
        grid.addWidget(self.pbar, 10, 0, 1, 5)
        grid.addWidget(self.shopbtn, 11, 0, 1, 2)
        grid.addWidget(self.reviewbtn, 11, 3, 1, 2)
 
        self.setLayout(grid) 
 
        self.setWindowTitle('Amazon Crawl')
        self.show()
 
    def center(self):
 
        qr = self.frameGeometry()
        cp = QDesktopWidget().availableGeometry().center()
        qr.moveCenter(cp)
        self.move(qr.topLeft())

    def get_start_date(self):
        dateTime = self.startdateEdit.dateTime()

    def get_end_date(self):
        dateTime = self.enddateEdit.dateTime()

    def slot_btn_chooseDir(self):
        self.dir_choose = QFileDialog.getExistingDirectory(self,
                                    "Choose data save dir",
                                    self.cwd) # 起始路径
        if self.dir_choose == "":
            return False
        self.btn_chooseDir.setText(self.dir_choose)

    def warning(self, title, content):
        QMessageBox.warning(self, title, content)

    def get_shop(self):
        try:
            self.dir_choose
        except Exception:
            self.dir_choose = "./data/"

        params = {
            "id": str(uuid.uuid4()).replace("-", ""),
            "url": self.urlEdit.text(),
            "proxy_type": self.proxyCom.currentText(),
            "count": self.countEdit.text(),
            "start_time": self.time_to_time_stamp(self.startdateEdit.text()),
            "end_time": self.time_to_time_stamp(self.enddateEdit.text()),
            "data_save_dir": self.dir_choose
        }
        if not params["url"]:
            self.warning("Url is Null", "Please input product url")
            return False
        self.work = Worker(**params)
        self.shop_detail = self.work.start(shop=True, product_detail=None)
        self.shopEdit.setText(json.dumps(self.shop_detail, indent=4))

    def get_review(self):
        try:
            self.shop_detail
        except Exception as e:
            self.warning("Product info is Null", "Please get product info")
            return False
        self.work.start(shop=False, product_detail=self.shop_detail)
        QMessageBox.information(self,
                                "Review done",
                                "%s review crawl done, count:%s, Save to: %s" % (self.urlEdit.text(), self.amazon.cralwer_data_num, self.amazon.file_data_pname) if self.amazon.cralwer_data_num else "%s review crawl done, count:%s" % (self.urlEdit.text(), self.amazon.cralwer_data_num)
                                )

     def closeEvent(self, event):
        reply = QMessageBox.question(self, 'Message',
                                     "Are you sure to quit?", QMessageBox.Yes |
                                     QMessageBox.No, QMessageBox.No)
        if reply == QMessageBox.Yes:
            event.accept()
        else:
            event.ignore()

    def time_to_time_stamp(self, time_value):
        time_array = time.strptime(time_value, "%Y-%m-%d %H:%M:%S")
        return int(time.mktime(time_array) * 1000)

        
 if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = Example()
    sys.exit(app.exec_())
```

仅个人学习参考, 如有疑问,欢迎交流

--------------------------------
