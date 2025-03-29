/**
 * 搜索功能实现
 */
document.addEventListener('DOMContentLoaded', function() {
  console.log('初始化搜索功能...');
  
  // 获取搜索相关元素
  const searchToggle = document.getElementById('search-toggle');
  const searchPanel = document.querySelector('.search-panel');
  const searchInput = document.querySelector('.search-input');
  const searchClose = document.querySelector('.search-close');
  const resultsContent = document.querySelector('#search-results');
  const loadingIndicator = document.querySelector('.loading-indicator');
  const noResults = document.querySelector('.no-results');
  const searchBody = document.querySelector('.search-body');
  
  // 检查元素是否存在
  if (!searchToggle) {
    console.error('搜索按钮未找到 #search-toggle');
    return;
  }
  
  if (!searchPanel) {
    console.error('搜索面板未找到 .search-panel');
    return;
  }
  
  console.log('搜索元素已找到，初始化搜索功能');
  
  // 搜索数据缓存
  let searchData = null;
  let loadingTimer = null;
  
  // 打开搜索面板
  searchToggle.addEventListener('click', function() {
    console.log('点击了搜索按钮');
    searchPanel.classList.add('active');
    setTimeout(() => searchInput.focus(), 300);
    document.body.style.overflow = 'hidden';
    
    // 如果没有加载过数据，则加载
    if (!searchData) {
      loadSearchData();
    }
  });
  
  // 关闭搜索面板
  searchClose.addEventListener('click', function() {
    searchPanel.classList.remove('active');
    document.body.style.overflow = '';
  });
  
  // 点击背景关闭搜索面板
  searchPanel.addEventListener('click', function(e) {
    if (e.target === searchPanel) {
      searchPanel.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // ESC 关闭搜索面板
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchPanel.classList.contains('active')) {
      searchPanel.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
  
  // 加载搜索数据
  function loadSearchData() {
    console.log('加载搜索数据...');
    showLoading();
    
    // 添加时间戳避免缓存
    const timestamp = new Date().getTime();
    const searchPath = '/search.json?t=' + timestamp;
    
    fetch(searchPath)
      .then(response => {
        if (!response.ok) {
          throw new Error('HTTP 错误 ' + response.status);
        }
        return response.json();
      })
      .then(data => {
        console.log('搜索数据加载成功，包含', data.length, '条记录');
        searchData = data;
        hideLoading();
        
        // 如果用户已经输入了搜索词，执行搜索
        if (searchInput.value.trim()) {
          performSearch(searchInput.value.trim());
        }
      })
      .catch(error => {
        console.error('搜索数据加载失败:', error);
        hideLoading();
        showNoResults('数据加载失败: ' + error.message);
      });
  }
  
  // 防抖函数
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // 搜索输入事件
  searchInput.addEventListener('input', debounce(function() {
    const query = this.value.trim();
    
    // 清空之前的结果
    clearResults();
    
    if (query.length < 2) {
      showNoResults('请输入至少2个字符进行搜索');
      return;
    }
    
    if (!searchData) {
      showLoading();
      return;
    }
    
    performSearch(query);
  }, 300));
  
  // 获取主题配置
  const maxResults = window.themeConfig?.search?.max_results || 50;

  // 执行搜索
  function performSearch(query) {
    console.log('执行搜索:', query);
    query = query.toLowerCase();
    
    // 清空结果区域
    clearResults();
    
    if (!searchData || searchData.length === 0) {
      showNoResults('未找到相关数据');
      return;
    }
    
    // 过滤匹配的结果，使用更高效的方法
    const results = [];
    const queryWords = query.split(/\s+/);
    
    for (let i = 0; i < searchData.length && results.length < maxResults; i++) {
      const item = searchData[i];
      let matched = false;
      
      // 使用 for 循环替代 some 方法，提高性能
      for (let j = 0; j < queryWords.length; j++) {
        const word = queryWords[j];
        if ((item.title && item.title.toLowerCase().indexOf(word) !== -1) ||
            (item.content && item.content.toLowerCase().indexOf(word) !== -1)) {
          matched = true;
          break;
        }
        
        if (item.tags) {
          for (let k = 0; k < item.tags.length; k++) {
            if (item.tags[k].toLowerCase().indexOf(word) !== -1) {
              matched = true;
              break;
            }
          }
        }
        
        if (matched) break;
        
        if (item.categories) {
          for (let k = 0; k < item.categories.length; k++) {
            if (item.categories[k].toLowerCase().indexOf(word) !== -1) {
              matched = true;
              break;
            }
          }
        }
        
        if (matched) break;
      }
      
      if (matched) {
        results.push(item);
      }
    }
    
    console.log('找到', results.length, '条匹配结果');
    
    // 如果没有找到结果
    if (results.length === 0) {
      showNoResults('未找到与 "' + query + '" 相关的文章');
      return;
    }
    
    // 确保结果容器可见
    resultsContent.style.display = 'block';
    
    // 获取最大结果提示元素
    const maxResultsNotice = document.querySelector('.max-results-notice');
    // 如果搜索结果超过最大显示数量，显示提示信息
    if (maxResultsNotice) {
      if (results.length >= maxResults) {
        maxResultsNotice.style.display = 'block';
      } else {
        maxResultsNotice.style.display = 'none';
      }
    }
    
    // 渲染搜索结果
    results.forEach(item => {
      // 创建结果项
      const resultItem = document.createElement('div');
      resultItem.className = 'result-item';
      
      const resultLink = document.createElement('a');
      resultLink.className = 'result-link';
      resultLink.href = item.url;
      
      // 标题
      const title = document.createElement('div');
      title.className = 'result-title';
      title.innerHTML = highlightText(item.title || '无标题', query);
      resultLink.appendChild(title);
      
      // 元数据
      const meta = document.createElement('div');
      meta.className = 'result-meta';
      
      // 日期
      if (item.date) {
        const date = document.createElement('span');
        date.className = 'result-date';
        date.innerHTML = `<i class="far fa-calendar-alt"></i> ${item.date}`;
        meta.appendChild(date);
      }
      
      // 分类
      if (item.categories && item.categories.length) {
        const categories = document.createElement('span');
        categories.className = 'result-categories';
        categories.innerHTML = `<i class="far fa-folder"></i> ${item.categories.join(', ')}`;
        meta.appendChild(categories);
      }
      
      // 标签
      if (item.tags && item.tags.length) {
        const tags = document.createElement('span');
        tags.className = 'result-tags';
        tags.innerHTML = `<i class="fas fa-tags"></i> ${item.tags.join(', ')}`;
        meta.appendChild(tags);
      }
      
      if (meta.children.length > 0) {
        resultLink.appendChild(meta);
      }
      
      // 内容摘要
      if (item.content) {
        const content = document.createElement('div');
        content.className = 'result-content';
        
        // 尝试查找关键词周围的内容
        const contentLower = item.content.toLowerCase();
        const queryIndex = contentLower.indexOf(query);
        
        if (queryIndex > -1) {
          // 获取关键词前后的一些内容
          const start = Math.max(0, queryIndex - 50);
          const end = Math.min(item.content.length, queryIndex + query.length + 50);
          let contentSnippet = item.content.substring(start, end);
          
          // 如果不是从头开始，添加省略号
          if (start > 0) {
            contentSnippet = '...' + contentSnippet;
          }
          
          // 如果不是到结尾，添加省略号
          if (end < item.content.length) {
            contentSnippet += '...';
          }
          
          content.innerHTML = highlightText(contentSnippet, query);
        } else {
          // 如果没有找到关键词，显示前200个字符
          content.innerHTML = item.content.substring(0, 200) + '...';
        }
        
        resultLink.appendChild(content);
      }
      
      resultItem.appendChild(resultLink);
      resultsContent.appendChild(resultItem);
    });
    
    // 搜索结果调试信息
    console.log('已渲染结果:', resultsContent.children.length);
    console.log('结果容器可见性:', getComputedStyle(resultsContent).display);
    
    // 强制重新计算布局
    searchBody.scrollTop = 0;
  }
  
  // 高亮匹配的文本
  function highlightText(text, query) {
    if (!query || !text) return text;
    
    // 转义特殊字符
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp("(" + escapedQuery + ")", "gi");
    
    return text.replace(regex, '<span class="highlight-match">$1</span>');
  }
  
  // 显示加载状态
  function showLoading() {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'flex';
    }
    
    if (noResults) {
      noResults.style.display = 'none';
    }
    
    if (resultsContent) {
      resultsContent.style.display = 'none';
    }
  }
  
  // 隐藏加载状态
  function hideLoading() {
    if (loadingIndicator) {
      loadingIndicator.style.display = 'none';
    }
  }
  
  // 显示无结果信息
  function showNoResults(message = '未找到相关结果') {
    if (noResults) {
      noResults.textContent = message;
      noResults.style.display = 'block';
      noResults.style.marginTop = '20px';
      noResults.style.textAlign = 'center';
      noResults.style.color = '#666';
      noResults.style.fontSize = '14px';
    }
    
    if (resultsContent) {
      resultsContent.style.display = 'none';
    }
  }
  
  // 清空搜索结果
  function clearResults() {
    if (resultsContent) {
      resultsContent.innerHTML = '';
      resultsContent.style.display = 'none';
    }
    
    if (noResults) {
      noResults.style.display = 'none';
    }
  }
});