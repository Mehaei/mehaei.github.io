/*
 * @Author: 胖胖很瘦
 * @Date: 2025-03-27 16:52:15
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-03-30 19:33:37
 */
/**
 * 搜索功能实现 - 性能优化版
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
  // 获取最大结果提示元素
  const maxResultsNotice = document.querySelector('.max-results-notice');
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
  
  // 打开搜索面板 - 添加硬件加速和过渡优化
  searchToggle.addEventListener('click', function() {
    console.log('点击了搜索按钮');
    // 添加硬件加速
    searchPanel.style.willChange = 'transform';
    
    // 使用requestAnimationFrame确保在下一帧渲染前添加active类
    requestAnimationFrame(() => {
      searchPanel.classList.add('active');
      setTimeout(() => searchInput.focus(), 100); // 减少延迟时间
    });
    
    document.body.style.overflow = 'hidden';
    
    // 如果没有加载过数据，则加载
    if (!searchData) {
      loadSearchData();
    } else {
      // 如果已经有数据，预热搜索结果容器
      resultsContent.style.willChange = 'contents';
    }
  });
  
  // 关闭搜索面板 - 优化过渡效果
  searchClose.addEventListener('click', function() {
    searchPanel.classList.remove('active');
    document.body.style.overflow = '';
    
    // 清空搜索输入框和结果
    resetSearchPanel();

    // 动画完成后重置硬件加速相关属性
    setTimeout(() => {
      searchPanel.style.willChange = 'auto';
      if (resultsContent) {
        resultsContent.style.willChange = 'auto';
      }
    }, 100); // 与CSS过渡时间匹配
  });
  
  // 点击背景关闭搜索面板
  searchPanel.addEventListener('click', function(e) {
    if (e.target === searchPanel) {
      searchPanel.classList.remove('active');
      document.body.style.overflow = '';
      
      // 清空搜索输入框和结果
      resetSearchPanel();

    }
  });
  
  // ESC 关闭搜索面板
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && searchPanel.classList.contains('active')) {
      searchPanel.classList.remove('active');
      document.body.style.overflow = '';
      // 清空搜索输入框和结果
      resetSearchPanel();
    }
  });
  
  // 恢复搜索面板初始状态
  function resetSearchPanel() {
    searchInput.value = '';
    noResults.style.display = 'none';
    resultsContent.style.display = 'none';
    maxResultsNotice.style.display = 'none';
  }

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

  // 执行搜索 - 性能优化版
  function performSearch(query) {
    console.log('执行搜索:', query);
    query = query.toLowerCase();
    
    // 清空结果区域
    clearResults();
    
    if (!searchData || searchData.length === 0) {
      showNoResults('未找到相关数据');
      return;
    }
    
    // 显示加载状态
    showLoading();
    
    // 使用setTimeout和requestAnimationFrame将搜索操作推迟到下一个事件循环，避免阻塞UI
    setTimeout(() => {
      requestAnimationFrame(() => {
        // 过滤匹配的结果，使用更高效的方法
        const results = [];
        const queryWords = query.split(/\s+/);
        
        // 预先缓存toLowerCase结果以提高性能
        const searchCache = searchData.map(item => ({
          original: item,
          title: item.title ? item.title.toLowerCase() : '',
          content: item.content ? item.content.toLowerCase() : '',
          tags: item.tags ? item.tags.map(tag => tag.toLowerCase()) : [],
          categories: item.categories ? item.categories.map(cat => cat.toLowerCase()) : []
        }));
        
        for (let i = 0; i < searchCache.length && results.length < maxResults; i++) {
          const cache = searchCache[i];
          const item = cache.original;
          let matched = false;
          
          // 使用 for 循环替代 some 方法，提高性能
          for (let j = 0; j < queryWords.length; j++) {
            const word = queryWords[j];
            if ((cache.title && cache.title.indexOf(word) !== -1) ||
                (cache.content && cache.content.indexOf(word) !== -1)) {
              matched = true;
              break;
            }
            
            if (cache.tags && cache.tags.length) {
              for (let k = 0; k < cache.tags.length; k++) {
                if (cache.tags[k].indexOf(word) !== -1) {
                  matched = true;
                  break;
                }
              }
            }
            
            if (matched) break;
            
            if (cache.categories && cache.categories.length) {
              for (let k = 0; k < cache.categories.length; k++) {
                if (cache.categories[k].indexOf(word) !== -1) {
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
        
        // 隐藏加载状态
        hideLoading();
        
        // 如果没有找到结果
        if (results.length === 0) {
          showNoResults('未找到与 "' + query + '" 相关的文章');
          maxResultsNotice.style.display = 'none';
          return;
        }
        
        // 确保结果容器可见
        resultsContent.style.display = 'block';
        console.log(maxResultsNotice)
        console.log(maxResults)
        console.log(results.length)
        // 如果搜索结果超过最大显示数量，显示提示信息
        if (maxResultsNotice) {
          if (results.length >= maxResults) {
            maxResultsNotice.style.display = 'block';
          } else {
            maxResultsNotice.style.display = 'none';
          }
        }
        
        // 使用DocumentFragment批量处理DOM操作，减少重排重绘
        const fragment = document.createDocumentFragment();
        
        // 分批渲染结果，避免长时间阻塞UI
        const batchSize = 10; // 每批处理的结果数量
        let currentIndex = 0;
        
        function renderBatch() {
          const endIndex = Math.min(currentIndex + batchSize, results.length);
          
          for (let i = currentIndex; i < endIndex; i++) {
            const item = results[i];
            
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
            fragment.appendChild(resultItem);
          }
          
          // 更新当前索引
          currentIndex = endIndex;
          
          // 如果还有更多结果需要渲染，安排下一批
          if (currentIndex < results.length) {
            // 使用requestAnimationFrame确保在下一帧渲染
            requestAnimationFrame(renderBatch);
          } else {
            // 所有批次都已渲染完成，将片段添加到DOM
            resultsContent.appendChild(fragment);
            
            // 搜索结果调试信息
            console.log('已渲染结果:', resultsContent.children.length);
            console.log('结果容器可见性:', getComputedStyle(resultsContent).display);
            
            // 强制重新计算布局
            searchBody.scrollTop = 0;
          }
        }
        
        // 开始第一批渲染
        renderBatch();
      });
    }, 0);
  }
  
  // 高亮匹配的文本 - 优化版
  function highlightText(text, query) {
    if (!query || !text) return text;
    
    // 转义特殊字符
    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    
    // 对于多个搜索词，分别高亮
    const words = query.split(/\s+/).map(word => 
      word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    );
    
    let result = text;
    
    // 使用单一正则表达式匹配所有词，提高性能
    if (words.length > 1) {
      const combinedRegex = new RegExp("(" + words.join("|\\b") + ")", "gi");
      result = text.replace(combinedRegex, '<span class="highlight-match">$1</span>');
    } else {
      // 单词搜索使用简单正则
      const regex = new RegExp("(" + escapedQuery + ")", "gi");
      result = text.replace(regex, '<span class="highlight-match">$1</span>');
    }
    
    return result;
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