---
layout:     post
title:      annotations导入报错
subtitle:   
date:       2021-04-16
author:     Mehaei
header-img: img/post-bg-miui-ux.jpg
catalog: true
tags:
    - Python
---
## 转自

　　「 [不止于python](https://mp.weixin.qq.com/s/4iYHhkp_KQex3t93IKNaOw) 」

## 相关环境版本

```python
python 3.7.10
fastapi 0.63.0
Cython 0.29.22
```

## 报错文件

```
# main.py
from __future__ import annotations
......# code
```

## 报错信息

```
main.py:1:23: future feature annotations is not defined
Traceback (most recent call last):
  File "/usr/local/lib/python3.7/dist-packages/Cython/Build/Dependencies.py", line 1249, in cythonize_one_helper
    return cythonize_one(*m)
  File "/usr/local/lib/python3.7/dist-packages/Cython/Build/Dependencies.py", line 1225, in cythonize_one
    raise CompileError(None, pyx_file)` `
```

```
Traceback (most recent call last):
  File "/usr/lib/python3.5/py_compile.py", line 125, in compile
    _optimize=optimize)
  File "<frozen importlib._bootstrap_external>", line 735, in source_to_code
  File "<frozen importlib._bootstrap>", line 222, in _call_with_frames_removed
  File "./prog.py", line 1
    from __future__ import annotations
    ^
SyntaxError: future feature annotations is not defined

During handling of the above exception, another exception occurred:
```

## 报错原因

1. 使用Cython版本过低

　　https://github.com/cython/cython/issues/2950#issuecomment-679136993

2. 使用python3.7以下版本   　报错: https://stackoverflow.com/questions/52889746/cant-import-annotations-from-future/52890129

　　　根据PEP-563在py3.7中才能使用

## 报错解决

```
pip3.7 install Cython==3.0a1
```

2.使用python3.7以上版本

## 相关链接

https://github.com/cython/cython/issues/2950

https://stackoverflow.com/questions/52889746/cant-import-annotations-from-future/52890129

https://www.python.org/dev/peps/pep-0563/#enabling-the-future-behavior-in-python-3-7
