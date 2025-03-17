/**
 * 微信风格主题 - 博客统计数据生成器
 * 
 * 此脚本会在Hexo生成过程中运行，收集博客的统计信息并生成JSON文件
 * 供前端JavaScript读取，以便在各页面上显示实时更新的统计数据
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 在Hexo生成之后执行
hexo.extend.generator.register('theme_stats', function(locals) {
  const config = hexo.config;
  const theme = hexo.theme.config;
  
  // 收集统计数据
  const stats = {
    site: {
      posts: locals.posts.length,
      categories: locals.categories.length,
      tags: locals.tags.length,
      last_updated: new Date().toISOString()
    },
    categories: locals.categories.map(category => ({
      name: category.name,
      slug: category.slug,
      count: category.posts.length,
      path: category.path
    })).sort((a, b) => b.count - a.count),
    tags: locals.tags.map(tag => ({
      name: tag.name,
      slug: tag.slug,
      count: tag.posts.length,
      path: tag.path
    })).sort((a, b) => b.count - a.count),
    recent_posts: locals.posts.sort('-date').limit(5).map(post => ({
      title: post.title,
      path: post.path,
      date: post.date.format('YYYY-MM-DD'),
      categories: post.categories.map(cat => ({
        name: cat.name,
        path: cat.path
      })),
      tags: post.tags.map(tag => ({
        name: tag.name,
        path: tag.path
      }))
    }))
  };
  
  // 添加文章分类统计数据（用于图表）
  const categoryStats = {};
  locals.posts.forEach(post => {
    post.categories.forEach(category => {
      const categoryName = category.name;
      if (!categoryStats[categoryName]) {
        categoryStats[categoryName] = 0;
      }
      categoryStats[categoryName]++;
    });
  });
  
  // 转换为ECharts需要的格式
  stats.category_chart_data = Object.keys(categoryStats).map(name => ({
    name: name,
    value: categoryStats[name]
  })).sort((a, b) => b.value - a.value);
  
  // 添加按月份统计的文章数据
  const monthlyStats = {};
  locals.posts.forEach(post => {
    const yearMonth = post.date.format('YYYY-MM');
    if (!monthlyStats[yearMonth]) {
      monthlyStats[yearMonth] = 0;
    }
    monthlyStats[yearMonth]++;
  });
  
  // 转换为时间序列数据
  stats.monthly_chart_data = Object.keys(monthlyStats)
    .sort()
    .map(yearMonth => ({
      date: yearMonth,
      count: monthlyStats[yearMonth]
    }));
  
  // 生成JSON文件
  return {
    path: 'data/blog-stats.json',
    data: JSON.stringify(stats)
  };
});

// 在after_generate钩子中创建文章阅读计数器的初始文件（如果不存在）
hexo.extend.filter.register('after_generate', function() {
  const publicDir = hexo.public_dir;
  const viewsFilePath = path.join(publicDir, 'data/post-views.json');
  const viewsDir = path.dirname(viewsFilePath);
  
  // 确保目录存在
  if (!fs.existsSync(viewsDir)) {
    fs.mkdirSync(viewsDir, { recursive: true });
  }
  
  // 如果文件不存在，创建一个空的阅读计数器文件
  if (!fs.existsSync(viewsFilePath)) {
    const initialData = {};
    
    // 为每篇文章添加初始计数
    hexo.locals.get('posts').forEach(post => {
      const postPath = post.path.replace(/\/$/, ''); // 移除尾部斜杠
      initialData[postPath] = Math.floor(Math.random() * 100) + 50; // 初始随机数据（演示用）
    });
    
    fs.writeFileSync(viewsFilePath, JSON.stringify(initialData, null, 2));
  }
});

// 为主题添加辅助函数，方便在模板中使用
hexo.extend.helper.register('theme_stats_script', function() {
  return `<script>
    window.blogStats = {
      loadStats: function() {
        return fetch('/data/blog-stats.json')
          .then(response => response.json())
          .catch(error => {
            console.error('加载博客统计数据失败:', error);
            return {
              site: {
                posts: 0,
                categories: 0,
                tags: 0
              }
            };
          });
      },
      
      loadPostViews: function() {
        return fetch('/data/post-views.json')
          .then(response => response.json())
          .catch(error => {
            console.error('加载文章阅读数据失败:', error);
            return {};
          });
      },
      
      updatePostViews: function(path) {
        if (!path) return Promise.resolve();
        
        // 注意：这里只是前端模拟，实际项目中应该有后端API记录阅读量
        return this.loadPostViews()
          .then(views => {
            const normalizedPath = path.replace(/\/$/, '');
            if (!views[normalizedPath]) {
              views[normalizedPath] = 0;
            }
            views[normalizedPath]++;
            
            // 在真实环境中，这里应该调用API更新阅读量
            // 为了演示，我们只在控制台输出
            console.log('文章阅读量更新:', normalizedPath, views[normalizedPath]);
            
            return views[normalizedPath];
          });
      }
    };
  </script>`;
}); 