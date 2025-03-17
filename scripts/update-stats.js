/*
 * @Author: 胖胖不胖
 * @Date: 2025-03-17 13:37:34
 * @LastEditors: 胖胖不胖
 * @LastEditTime: 2025-03-17 14:52:20
 */
/**
 * Hexo博客统计数据更新脚本
 * 功能：在博客生成时自动更新统计数据
 * 包括：文章总数、分类总数、标签总数、总字数、阅读时间等
 */

const fs = require('fs');
const path = require('path');

/**
 * 计算中文字符数和估算阅读时间
 * @param {string} content - 文章内容
 * @return {object} - 返回字数和阅读时间
 */
function countChineseChars(content) {
  if (!content) return { count: 0, readingTime: 0 };
  
  // 移除 HTML 标签
  const plainText = content.replace(/<[^>]+>/g, '');
  
  // 计算中文字符
  const chineseChars = plainText.match(/[\u4e00-\u9fa5]/g) || [];
  const chineseCount = chineseChars.length;
  
  // 计算非中文字符（按半个中文字符计算）
  const nonChineseCount = plainText.replace(/[\u4e00-\u9fa5]/g, '').length / 2;
  
  // 总字数
  const totalCount = chineseCount + nonChineseCount;
  
  // 估算阅读时间（以每分钟阅读 300 字计算）
  const readingTime = Math.ceil(totalCount / 300);
  
  return {
    count: Math.round(totalCount),
    readingTime: readingTime > 0 ? readingTime : 1 // 至少 1 分钟
  };
}

// 注册一个在生成前执行的过滤器
hexo.extend.filter.register('before_generate', function() {
  const hexo = this;
  const config = hexo.config;
  
  // 避免频繁更新统计数据 - 添加时间检查
  // 检查数据文件是否存在且是否在今天已经更新过
  const dataDir = path.join(hexo.source_dir, '_data');
  const statsFile = path.join(dataDir, 'stats.json');
  
  // 判断是否需要更新数据
  let needUpdate = true;
  if (fs.existsSync(statsFile)) {
    try {
      const stats = fs.statSync(statsFile);
      const lastModified = new Date(stats.mtime);
      const now = new Date();
      
      // 如果是同一天，则不更新
      if (lastModified.toDateString() === now.toDateString()) {
        hexo.log.debug('今日已更新过统计数据，跳过本次更新');
        return; // 跳过本次更新
      }
    } catch (e) {
      // 发生错误，继续执行更新
      hexo.log.error('检查统计数据文件时出错：', e);
    }
  }
  
  const postsData = [];
  const categoriesData = [];
  const tagsData = [];
  
  let totalWordCount = 0;
  let totalReadingTime = 0;
  let totalVisits = 0; // 这个数据可能需要从其他来源获取
  
  // 确保 _data 目录存在
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  // 处理所有文章
  hexo.locals.get('posts').forEach(post => {
    // 计算字数和阅读时间
    const { count, readingTime } = countChineseChars(post.content);
    totalWordCount += count;
    totalReadingTime += readingTime;
    
    // 收集文章数据（可用于热门文章等）
    postsData.push({
      title: post.title,
      path: post.path,
      date: post.date.format('YYYY-MM-DD'),
      categories: post.categories.data.map(cat => cat.name),
      tags: post.tags.data.map(tag => tag.name),
      wordCount: count,
      readingTime: readingTime
    });
  });
  
  // 处理分类数据
  hexo.locals.get('categories').forEach(category => {
    categoriesData.push({
      name: category.name,
      count: category.posts.length,
      path: category.path
    });
  });
  
  // 处理标签数据
  hexo.locals.get('tags').forEach(tag => {
    tagsData.push({
      name: tag.name,
      count: tag.posts.length,
      path: tag.path
    });
  });
  
  // 按文章数量排序
  categoriesData.sort((a, b) => b.count - a.count);
  tagsData.sort((a, b) => b.count - a.count);
  
  // 构建统计数据
  const statsData = {
    totalPosts: hexo.locals.get('posts').length,
    totalCategories: hexo.locals.get('categories').length,
    totalTags: hexo.locals.get('tags').length,
    totalWordCount: totalWordCount,
    totalReadingTime: totalReadingTime,
    totalVisits: totalVisits,
    lastUpdated: new Date().toISOString(),
    categoryStats: categoriesData,
    tagStats: tagsData,
    recentPosts: postsData.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10)
  };
  
  // 保存统计数据到文件
  try {
    fs.writeFileSync(
      path.join(dataDir, 'stats.json'),
      JSON.stringify(statsData, null, 2)
    );
    hexo.log.info('博客统计数据已更新');
  } catch (err) {
    hexo.log.error('保存统计数据失败：', err);
  }
});

// 将脚本作为插件导出
module.exports = {
  name: 'hexo-stats-updater'
}; 