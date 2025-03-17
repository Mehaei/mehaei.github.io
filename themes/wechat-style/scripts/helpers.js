/**
 * 微信风格主题辅助函数
 */

'use strict';

const { join } = require('path');

// 统计脚本助手函数
hexo.extend.helper.register('theme_stats_script', function() {
  return '';
});

// 格式化数字
hexo.extend.helper.register('format_number', function(num) {
  if (!num) return '0';
  
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  } else {
    return num.toString();
  }
});

// 获取文章阅读时间估计
hexo.extend.helper.register('reading_time', function(content) {
  if (!content) return '0';
  
  // 中文字符计数
  const chinesesChars = (content.match(/[\u4e00-\u9fa5]/g) || []).length;
  // 英文单词计数 (简单实现，不够精确)
  const englishWords = (content.replace(/[\u4e00-\u9fa5]/g, '').match(/[a-zA-Z]+/g) || []).length;
  
  // 中文阅读速度：约300字/分钟
  // 英文阅读速度：约200词/分钟
  const readingTime = Math.ceil(chinesesChars / 300 + englishWords / 200);
  
  return readingTime > 0 ? readingTime : 1;
});

// 从路径中获取文件名（不带扩展名）
hexo.extend.helper.register('filename_from_path', function(path) {
  if (!path) return '';
  
  // 移除路径和扩展名
  const filename = path.split('/').pop().split('.').slice(0, -1).join('.');
  return filename;
});

// 生成随机ID
hexo.extend.helper.register('random_id', function(prefix = 'id-') {
  return prefix + Math.random().toString(36).substring(2, 9);
});

// 获取文章特色图片
hexo.extend.helper.register('get_post_thumbnail', function(post) {
  if (!post) return null;
  
  // 优先使用文章中指定的缩略图
  if (post.thumbnail) return post.thumbnail;
  
  // 然后尝试使用文章中的第一张图片
  const content = post.content || '';
  const imgReg = /<img.*?src="(.*?)".*?>/i;
  const matches = content.match(imgReg);
  
  if (matches && matches.length > 1) {
    return matches[1];
  }
  
  // 最后使用默认缩略图
  return this.theme.default_thumbnail || null;
});

// 获取侧边栏小工具配置
hexo.extend.helper.register('get_widget_config', function(widgetName) {
  if (!this.theme.sidebar || !this.theme.sidebar[widgetName]) {
    return { enable: false };
  }
  
  return this.theme.sidebar[widgetName];
});

// 检查文章是否需要显示"阅读更多"按钮
hexo.extend.helper.register('show_read_more', function(post) {
  if (!post) return false;
  
  // 如果文章通过front-matter显式设置了more标记
  if (post.excerpt && post.excerpt.length > 0 && post.more && post.more.length > 0) {
    return true;
  }
  
  // 检查内容是否超过摘要长度限制
  if (post.content && this.theme.index && this.theme.index.excerpt_length) {
    const contentText = post.content.replace(/<[^>]+>/g, '');
    return contentText.length > this.theme.index.excerpt_length;
  }
  
  return false;
});

// 获取摘要
hexo.extend.helper.register('get_excerpt', function(post) {
  if (!post) return '';
  
  // 如果文章设置了摘要
  if (post.excerpt) {
    return post.excerpt;
  }
  
  // 否则从内容中截取
  if (post.content && this.theme.index && this.theme.index.excerpt_length) {
    const contentText = post.content.replace(/<[^>]+>/g, '');
    const limit = parseInt(this.theme.index.excerpt_length);
    
    if (contentText.length <= limit) {
      return contentText;
    } else {
      return contentText.substring(0, limit) + '...';
    }
  }
  
  return '';
}); 