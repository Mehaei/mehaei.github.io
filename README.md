# 微信风格技术博客

这是一个基于Hexo的微信风格技术博客，主题设计模仿微信文章页面的阅读体验，为技术内容创作者提供了一个简洁、美观且用户友好的展示平台。

## 特性

- 💚 微信风格UI：模仿微信公众号文章页面的设计风格
- 📱 响应式设计：完美适配移动端和桌面端
- 🌓 深色模式：支持自动和手动切换深色主题
- 🔍 内置搜索：便捷的站内内容搜索功能
- 📊 数据统计：展示文章阅读量、分类和标签统计
- 💬 评论系统：集成Gitalk评论功能，基于GitHub Issues
- 🚀 性能优化：快速加载和页面渲染
- 📝 Markdown支持：支持丰富的Markdown语法和代码高亮

## 目录结构

```
.
├── _config.yml                # Hexo主配置文件
├── package.json               # 项目依赖配置
├── scaffolds/                 # 模板文件夹
├── source/                    # 存放网站内容的文件夹
│   ├── _posts/                # 博客文章
│   ├── about/                 # 关于页面
│   ├── categories/            # 分类页面
│   ├── tags/                  # 标签页面
│   └── images/                # 图片文件夹
└── themes/                    # 主题文件夹
    └── wechat-style/          # 微信风格主题
```

## 本地开发环境配置

### 前置条件

- [Node.js](https://nodejs.org/) (版本 12.0 或更高)
- [Git](https://git-scm.com/)

### 安装步骤

1. 克隆此仓库到本地：
   ```bash
   git clone https://github.com/yourusername/yourusername.github.io.git
   cd yourusername.github.io
   ```

2. 安装依赖包：
   ```bash
   npm install
   ```

3. 安装Hexo命令行工具（如果尚未安装）：
   ```bash
   npm install -g hexo-cli
   ```

### 本地启动

1. 启动本地开发服务器：
   ```bash
   hexo server
   # 或使用npm脚本
   npm run server
   ```

2. 在浏览器中访问 `http://localhost:4000` 即可预览网站

### 常用命令

```bash
# 创建新文章
hexo new "文章标题"

# 生成静态文件
hexo generate
# 或简写为
hexo g

# 清除缓存和已生成的静态文件
hexo clean

# 部署网站
hexo deploy
# 或简写为
hexo d

# 生成并部署
hexo g -d
```

## 写作指南

1. 创建新文章：
   ```bash
   hexo new "文章标题"
   ```

2. 编辑生成的Markdown文件（位于`source/_posts/`目录）。文件头部的Front-matter格式示例：
   ```yaml
   ---
   title: 文章标题
   date: 2023-01-01 12:00:00
   updated: 2023-01-02 12:00:00
   categories:
     - 分类名称
   tags:
     - 标签1
     - 标签2
   thumbnail: /images/article-dir/thumbnail.jpg  # 缩略图路径
   excerpt: 这是文章摘要，会显示在首页
   ---
   ```

3. 使用Markdown语法编写文章内容

### 图片存储和引用

本博客支持两种图片存储和引用方式：

#### 1. 文章资源文件夹方式

**适用场景**：单篇文章的图片较少，或者希望文章与图片紧密关联

**使用步骤**：
1. 确保 `_config.yml` 中设置了 `post_asset_folder: true`（已配置）
2. 创建新文章后，会自动生成同名文件夹
3. 将图片放入该文件夹
4. 在文章中使用相对路径引用图片

```markdown
![图片描述](图片名.png)
```

**示例**：
- 文章：`source/_posts/python-basics.md`
- 图片：`source/_posts/python-basics/python-basics-1.png`
- 在文章中引用：`![Python安装](python-basics-1.png)`

#### 2. 统一图片目录方式

**适用场景**：图片较多，希望集中管理，或需要在多篇文章中引用相同图片

**使用步骤**：
1. 在 `source/images` 目录下创建与文章同名的子目录
2. 将图片存放在该子目录中
3. 在文章中使用以 `/` 开头的绝对路径引用图片

```markdown
![图片描述](/images/文章目录名/图片名.png)
```

**示例**：
- 文章：`source/_posts/web-dev.md`
- 图片：`source/images/web-dev/web-dev-1.png`
- 在文章中引用：`![网页设计](/images/web-dev/web-dev-1.png)`

### 微信公众号文章导入

本博客提供了微信公众号文章导入工具，可以快速将微信文章导入到博客中。

**使用方法**：

1. 运行导入工具：
   ```bash
   node scripts/import-wechat-articles.js
   ```

2. 按提示输入文章标题、分类、标签和摘要
3. 选择图片存储方式（文章资源文件夹或统一images目录）
4. 粘贴文章内容，完成后输入 `END_OF_CONTENT`
5. 按照提示将图片保存到相应位置

该工具会自动：
- 创建文章文件和必要的目录
- 处理文章内的图片链接，转换为对应格式
- 生成正确的 Front-matter 信息

## 自定义配置

### 主题配置

编辑 `themes/wechat-style/_config.yml` 文件可以自定义主题设置，包括：

- 导航菜单
- 社交媒体链接
- 首页文章展示样式
- 侧边栏小工具
- 微信公众号信息
- 广告位设置
- 评论系统设置

### 网站配置

编辑根目录的 `_config.yml` 文件可以修改Hexo的基本设置，如：

- 网站标题、描述、作者信息
- 网站URL和永久链接格式
- 文章生成和渲染设置
- 部署配置

## 部署到GitHub Pages

1. 修改 `_config.yml` 中的部署配置：
   ```yaml
   deploy:
     type: git
     repo: https://github.com/yourusername/yourusername.github.io.git
     branch: gh-pages  # 或master，取决于你的GitHub Pages设置
   ```

2. 安装部署插件（如果尚未安装）：
   ```bash
   npm install hexo-deployer-git --save
   ```

3. 生成并部署网站：
   ```bash
   hexo clean && hexo deploy
   ```

## 微信公众号配置

1. 将你的微信公众号二维码图片保存到 `source/images/wechat-qrcode.jpg`

2. 编辑 `themes/wechat-style/_config.yml` 文件中的微信公众号配置：
   ```yaml
   wechat_mp:
     enable: true
     qrcode: /images/wechat-qrcode.jpg
     description: '扫码关注「不止于python」公众号'
   ```

## 许可证

[MIT License](LICENSE) 