/**
 * Hexo 博客统计数据生成插件
 * 该脚本会在博客生成过程中收集统计数据并生成JSON文件
 */

'use strict';

const fs = require('fs');
const path = require('path');

// 生成分类页面
hexo.extend.generator.register('category_pages', function(locals) {
  const results = [];
  
  // 为每个分类生成独立页面
  locals.categories.forEach(category => {
    const posts = category.posts.sort('-date');
    results.push({
      path: `categories/${category.name}/index.html`,
      data: {
        title: `${category.name} - 分类`,
        category: category.name,
        posts: posts,
        layout: 'category'
      }
    });
  });
  
  return results;
});

// 收集博客统计数据并生成JSON文件
hexo.extend.generator.register('stats', function(locals) {
  // 计算基础统计数据
  const stats = {
    posts: {
      total: locals.posts.length,
      totalWords: 0
    },
    categories: {
      total: locals.categories.length,
      list: []
    },
    tags: {
      total: locals.tags.length,
      list: []
    },
    monthlyPosts: getMonthlyPostCounts(locals.posts)
  };

  // 收集分类数据
  locals.categories.forEach(category => {
    stats.categories.list.push({
      name: category.name,
      count: category.posts.length,
      path: category.path
    });
  });

  // 收集标签数据
  locals.tags.forEach(tag => {
    stats.tags.list.push({
      name: tag.name,
      count: tag.posts.length,
      path: tag.path
    });
  });

  // 计算总字数
  locals.posts.forEach(post => {
    // 估算文章字数，移除HTML标签和空格
    const content = post.content.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
    stats.posts.totalWords += content.length;
  });

  // 相关数据写入到数据文件
  return {
    path: 'site-stats.json',
    data: JSON.stringify(stats)
  };
});

// 注入统计数据到模板
hexo.extend.filter.register('template_locals', function(locals) {
  try {
    // 读取统计数据并注入到模板变量中
    const statsPath = path.join(hexo.public_dir, 'site-stats.json');
    
    // 如果文件存在，读取并解析
    if (fs.existsSync(statsPath)) {
      const statsData = JSON.parse(fs.readFileSync(statsPath, 'utf8'));
      locals.site_stats = statsData;
    }
  } catch (e) {
    console.error('Error injecting stats to templates:', e);
  }
  
  return locals;
});

// 注入统计JavaScript到页面头部
hexo.extend.injector.register('head_end', function() {
  return `<script>
    window.siteData = window.siteData || {};
    fetch('/site-stats.json')
      .then(response => response.json())
      .then(data => {
        window.siteData = data;
        // 触发自定义事件通知数据已加载
        document.dispatchEvent(new CustomEvent('siteDataLoaded', { detail: data }));
      })
      .catch(error => console.error('Failed to load site stats:', error));
  </script>`;
});

/**
 * 获取每月发布文章数量
 * @param {Array} posts 文章列表
 * @return {Object} 月度文章统计
 */
function getMonthlyPostCounts(posts) {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
  const counts = Array(12).fill(0);
  
  // 当前年份
  const currentYear = new Date().getFullYear();
  
  // 统计当前年度每月的文章数
  posts.forEach(post => {
    const date = new Date(post.date);
    if (date.getFullYear() === currentYear) {
      counts[date.getMonth()]++;
    }
  });
  
  return {
    months: months,
    counts: counts
  };
}