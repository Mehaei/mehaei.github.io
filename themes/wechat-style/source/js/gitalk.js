/*
 * @Author: 胖胖很瘦
 * @Date: 2025-03-18 14:38:00
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-07-29 17:40:44
 */
/**
 * 微信风格主题 - Gitalk评论组件初始化脚本
 */

(function() {
  'use strict';

  // 评论计数功能
  function initCommentCounts() {
    const commentCountElements = document.querySelectorAll('.post-comments');
    if (!commentCountElements.length) return;

    const { owner, repo } = window.gitalkConfig || {};
    if (!owner || !repo) {
      console.error('Gitalk configuration is missing');
      return;
    }

    // 批量获取评论数量
    async function fetchCommentCounts() {
      try {
        const postIds = Array.from(commentCountElements).map(el => {
          const postPath = el.getAttribute('data-post-id');
          const id = postPath ? window.utils.generateIssueId(postPath) : null;

          return id;
        }).filter(Boolean);

        if (!postIds.length) return;
        

        // 构建 GitHub API 请求 URL
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/issues?labels=Gitalk&state=all`;
        
        // 发起请求
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('Failed to fetch comment counts');
        
        const issues = await response.json();
        
        // 更新每篇文章的评论数量
        commentCountElements.forEach(element => {
          const postPath = element.getAttribute('data-post-id');
          if (!postPath) return;
          
          const issueId = window.utils.generateIssueId(postPath);
          const issue = issues.find(issue => issue.title.endsWith(`<${issueId}>`));
          const commentCount = issue ? issue.comments : 0;
          // 更新显示
          const countSpan = element.querySelector('.comment-count');
          if (countSpan) {
            countSpan.textContent = commentCount;
          }
          
          // 如果有评论，添加高亮类
          if (commentCount > 0) {
            element.classList.add('has-comments');
          }
        });
        
      } catch (error) {
        console.error('Error fetching comment counts:', error);
      }
    }

    // 执行获取评论数量
    fetchCommentCounts();
  }

  // Gitalk 初始化功能
  function initGitalk() {
    const gitalkContainer = document.getElementById('gitalk-container');
    if (!gitalkContainer) return;
    var title = document.title;
    try {
      var title = document.getElementsByClassName("post-title")[0].textContent
    } catch (error) {
      
    }
    const path = decodeURI(window.location.pathname).slice(1);
    const issueId = window.utils.generateIssueId(path);


    const gitalk = new Gitalk({
      clientID: window.gitalkConfig.clientID,
      clientSecret: window.gitalkConfig.clientSecret,
      repo: window.gitalkConfig.repo,
      owner: window.gitalkConfig.owner,
      admin: Array.isArray(window.gitalkConfig.admin) ? window.gitalkConfig.admin : [window.gitalkConfig.admin],
      id: issueId,
      title: `${title}<${issueId}>`,
      body: `## ${title}\n\n原始路径: ${decodeURI(window.location.href)}`,
      distractionFreeMode: window.gitalkConfig.distractionFreeMode || false,
      createIssueManually: false,
      perPage: 20,
      pagerDirection: 'last'
    });

    gitalk.render('gitalk-container');

    // 监听错误事件
    gitalkContainer.addEventListener('gitalk:error', function(e) {
      const error = e.detail.error;
      let errorMessage = '评论加载失败';
      
      if (error.response) {
        errorMessage += `: ${error.response.status} - ${error.response.statusText}`;
        console.error('Gitalk error details:', error.response);
      } else {
        errorMessage += `: ${error.message}`;
      }
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'gitalk-error';
      errorDiv.style.color = '#ff4757';
      errorDiv.style.padding = '10px';
      errorDiv.style.marginTop = '10px';
      errorDiv.style.backgroundColor = '#ffe6e6';
      errorDiv.style.borderRadius = '4px';
      errorDiv.textContent = errorMessage;
      
      gitalkContainer.appendChild(errorDiv);
    });
  }

  // DOM加载完成后执行初始化
  document.addEventListener('DOMContentLoaded', function() {
    // 总是初始化评论计数
    initCommentCounts();
    // 只在文章页面初始化 Gitalk
    initGitalk();
  });
})();