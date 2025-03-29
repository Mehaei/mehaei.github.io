---
layout:     post
title:      Pythonjson数据写入csvjsonexcel文件
subtitle:   
date:       2019-10-11
author:     Mehaei
header-img: img/post-bg-mma-5.jpg
catalog: true
tags:
    - python
---
# 一.写入

写入csv和json, 可以使用csv这个包写, 我这里没有使用, 并且把写csv和json的写到一起了

具体的代码就不解释了

```
def write_file(file_name, items, file_type="json", mode="a+", csv_separ=",", is_close=True, is_count=True):
    """
    file_name: file path or file name, example: ./data/test.csv or test or test.csv
    items: data list, example: [{},{}]
    file_type: csv or json, default json
    mode: write mode, default a+
    csv_separ: if file_type is csv, choose csv separ, default ,
    is_close: write items, close file, default close
    is_count: count write file num
    """ 
    if not file_name.endswith(file_type):
        file_name = "%s.%s" % (file_name, file_type)

    if not isinstance(items, (tuple, list)):
        items = [items]
    
    is_exists = True
    if not os.path.exists(file_name):
        is_exists = False

    file = open(file_name, mode)
    write_count = 0
    for item in items:
        if (file_type == "csv") and (not is_exists):
            file.write(csv_separ.join(item.keys()) + "\n")
            is_exists = True

        if file_type == "csv":
            try:
                value_list = [re.sub(r"[\r\t\n\s]+", "", str(v)) for v in item.values()]
                file.write(csv_separ.join(value_list) + "\n")
            except Exception as e:
                print(item)
        elif file_type == "json":
            file.write(json.dumps(item, ensure_ascii=False) + "\n")
        write_count += 1
    if is_close:
        file.close()

    if is_count:
        data_dir, data_file_name = os.path.split(file_pname)
        with open("%s/%s.csv" % (data_dir, "count"), "a+") as f:
            f.write("%s,%s\n" % (data_file_name, write_count))
    return write_count
```

# 二. 使用pandas写入excel文件

1. 安装pandas 和 openpyxl 模块

```
pip3 install pandas openpyxl
```

2. 写入excel文件

```
def write_xlsx(file_name, data, sheet_name="reviews", is_count=True):
    """
    file_name: file path, example: /data/test.xlsx
    data: data list, example: [{}, {}]
    sheet_name: sheet name, dafault: reviews,
    is_count: count write file num
    """
    excelWriter = pd.ExcelWriter(file_name)
    datas = pd.DataFrame(data=list(data))
    datas.to_excel(excelWriter, sheet_name=sheet_name, engine="openpyxl", index=False)
    excelWriter.save()
    excelWriter.close()
    if is_count:
        data_dir, data_file_name = os.path.split(file_pname)
            with open("%s/%s.csv" % (data_dir, "count"), "a+") as f:
                f.write("%s,%s\n" % (data_file_name, write_count))
    return len(data)
```

# 3. 报错

一般的情况下, 只需要将模块更新到最新版即可

如有问题欢迎交流
