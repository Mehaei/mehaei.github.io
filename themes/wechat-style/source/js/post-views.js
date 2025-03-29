/*
 * @Author: 胖胖很瘦
 * @Date: 2025-03-18 16:31:48
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-03-21 15:16:05
 */
/**
 * 基于GitHub Issues的文章访问量统计
 */

(function() {
  'use strict';

  // GitHub仓库信息配置
  const config = {
    owner: '', // GitHub用户名
    repo: '',  // 仓库名
    label: 'post-views' // 用于标记访问量统计issue的标签
  };

  // 访问量数据缓存
  const viewsCache = new Map();

  // 初始化访问量统计
  function initPostViews() {
    // 获取所有文章元素
    const posts = document.querySelectorAll('[data-post-path]');
    if (!posts.length) return;

    // 批量获取访问量数据
    const paths = Array.from(posts).map(post => post.dataset.postPath);
    fetchViewsData(paths).then(data => {
      // 更新显示
      posts.forEach(post => {
        const path = post.dataset.postPath;
        const viewCount = data[path] || 0;
        updateViewCount(post, viewCount);
      });

      // 增加当前页面的访问量
      paths.forEach(path => incrementViewCount(path));
    });
  }

  // 从GitHub Issues获取访问量数据
  async function fetchViewsData(paths) {
    if (!config.owner || !config.repo) return {};

    try {
      const query = `repo:${config.owner}/${config.repo} label:${config.label}`;
      const response = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}`);
      const data = await response.json();

      const viewsData = {};
      data.items.forEach(issue => {
        const path = issue.title;
        const views = parseInt(issue.body.match(/Views: (\d+)/)[1]);
        viewsData[path] = views;
        viewsCache.set(path, views);
      });

      return viewsData;
    } catch (error) {
      console.error('Failed to fetch views data:', error);
      return {};
    }
  }

  // 增加访问量
  async function incrementViewCount(path) {
    if (!config.owner || !config.repo) return;

    try {
      const token = window.GITHUB_TOKEN; // 需要在页面中设置GitHub Token
      if (!token) return;

      const currentViews = viewsCache.get(path) || 0;
      const newViews = currentViews + 1;

      // 查找是否已存在对应的issue
      const query = `repo:${config.owner}/${config.repo} label:${config.label} in:title ${path}`;
      const searchResponse = await fetch(`https://api.github.com/search/issues?q=${encodeURIComponent(query)}`);
      const searchData = await searchResponse.json();

      if (searchData.items.length > 0) {
        // 更新已存在的issue
        const issue = searchData.items[0];
        await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue.number}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            body: `Views: ${newViews}\nLast updated: ${new Date().toISOString()}`
          })
        });
      } else {
        // 创建新的issue
        await fetch(`https://api.github.com/repos/${config.owner}/${config.repo}/issues`, {
          method: 'POST',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            title: path,
            body: `Views: ${newViews}\nLast updated: ${new Date().toISOString()}`,
            labels: [config.label]
          })
        });
      }

      viewsCache.set(path, newViews);
      updateViewCount(document.querySelector(`[data-post-path="${path}"]`), newViews);
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  }

  // 更新访问量显示
  function updateViewCount(element, count) {
    if (!element) return;
    const viewsElement = element.querySelector('.post-views');
    if (viewsElement) {
      viewsElement.textContent = count;
    }
  }

  // 页面加载完成后初始化
  document.addEventListener('DOMContentLoaded', initPostViews);
})();