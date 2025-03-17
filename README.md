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
   thumbnail: /images/thumbnail.jpg  # 缩略图
   excerpt: 这是文章摘要，会显示在首页
   ---
   ```

3. 使用Markdown语法编写文章内容

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