/*
 * @Author: 胖胖很瘦
 * @Date: 2025-03-17 13:19:29
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-03-30 19:47:58
 */
/**
 * 微信风格技术博客主题脚本
 */

(function() {
  'use strict';
  
  // DOM元素加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initThemeToggle();
    initSidebarToggle();
    initBackToTop();
    initImageViewer();
    initLoadingBar();
    
    // 初始化代码块功能，使用多次尝试的方式确保成功
    tryInitCodeBlocks();
    
    initReadingProgress();
    initReward();
    initSocialShare();
    
    // 如果存在统计图表区域，初始化图表
    if (document.getElementById('stats-chart')) {
      initStatsChart();
    }
    
    // 计算阅读时间
    calculateReadingTime();
  });
  
  /**
   * 多次尝试初始化代码块功能，确保成功
   */
  let codeBlockInitAttempts = 0;
  const MAX_CODE_BLOCK_ATTEMPTS = 5;

  function tryInitCodeBlocks() {
    codeBlockInitAttempts++;
    
    // 尝试初始化代码块
    const success = initCodeBlocks();
    
    // 如果没有找到代码块且还有尝试次数，则再次尝试
    if (!success && codeBlockInitAttempts < MAX_CODE_BLOCK_ATTEMPTS) {
      console.log(`No code blocks found. Attempt ${codeBlockInitAttempts}/${MAX_CODE_BLOCK_ATTEMPTS}. Retrying in 1 second...`);
      setTimeout(tryInitCodeBlocks, 1000);
    } else if (success) {
      console.log('Code blocks functionality successfully initialized');
    } else {
      console.log('Maximum attempts reached. Could not find any code blocks.');
    }
  }
  
  // 为防止脚本加载顺序问题，再添加一个window加载完成后的检查
  window.addEventListener('load', function() {
    // 检查是否已经初始化了代码块复制功能
    const copyButtons = document.querySelectorAll('.copy-button');
    if (copyButtons.length === 0) {
      console.log('No copy buttons found after page load. Reinitializing code blocks...');
      initCodeBlocks();
    }
  });
  
  /**
   * 初始化移动端菜单
   */
  function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (menuToggle && menu) {
      menuToggle.addEventListener('click', function() {
        menu.classList.toggle('active');
      });
      
      // 点击菜单项后关闭菜单
      const menuItems = document.querySelectorAll('.menu-item a');
      menuItems.forEach(function(item) {
        item.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            menu.classList.remove('active');
          }
        });
      });
      
      // 点击菜单外区域关闭菜单
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.site-nav') && menu.classList.contains('active')) {
          menu.classList.remove('active');
        }
      });
    }
  }
  
  /**
   * 初始化侧边栏切换
   */
  function initSidebarToggle() {
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const mainWrapper = document.querySelector('.main-wrapper');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggleBtn && mainWrapper && sidebar) {
      // 检查本地存储中的侧边栏状态
      const isSidebarHidden = localStorage.getItem('sidebarHidden') === 'true';
      
      if (isSidebarHidden) {
        mainWrapper.classList.add('sidebar-hidden');
      }
      
      sidebarToggleBtn.addEventListener('click', function() {
        mainWrapper.classList.toggle('sidebar-hidden');
        
        // 保存设置到本地存储
        localStorage.setItem('sidebarHidden', mainWrapper.classList.contains('sidebar-hidden'));
      });
    }
  }

  /**
   * 初始化主题切换（亮色/暗色模式）
   */
  function initThemeToggle() {
    const themeToggle = document.querySelector('.theme-toggle');
    
    if (themeToggle) {
      // 检查本地存储中的主题设置
      const isDarkMode = localStorage.getItem('darkMode') === 'true';
      
      if (isDarkMode) {
        document.body.classList.add('dark-mode');
      }
      
      themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // 保存设置到本地存储
        localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
      });
    }
  }
  
  /**
   * 初始化回到顶部按钮
   */
  function initBackToTop() {
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
      // 监听滚动事件，控制按钮显示
      window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
          backToTop.classList.add('show');
        } else {
          backToTop.classList.remove('show');
        }
      });
      
      // 点击回到顶部
      backToTop.addEventListener('click', function() {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }
  
  /**
   * 初始化图片查看器
   */
  function initImageViewer() {
    // 为文章内容中的图片添加点击事件
    const contentImages = document.querySelectorAll('.post-content img');
    
    contentImages.forEach(function(img) {
      img.addEventListener('click', function() {
        // 创建图片查看器
        const overlay = document.createElement('div');
        overlay.className = 'image-viewer-overlay';
        
        const image = document.createElement('img');
        image.src = this.src;
        image.className = 'image-viewer-img';
        
        overlay.appendChild(image);
        document.body.appendChild(overlay);
        
        // 点击关闭
        overlay.addEventListener('click', function() {
          document.body.removeChild(overlay);
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape') {
            if (document.querySelector('.image-viewer-overlay')) {
              document.body.removeChild(overlay);
            }
          }
        });
      });
    });
  }
  
  /**
   * 初始化页面加载进度条
   */
  function initLoadingBar() {
    const loadingBar = document.querySelector('.loading-bar');
    
    if (loadingBar) {
      // 页面加载完成后
      window.addEventListener('load', function() {
        loadingBar.style.width = '100%';
        
        setTimeout(function() {
          loadingBar.style.opacity = '0';
        }, 200);
      });
      
      // 初始状态
      loadingBar.style.width = '80%';
    }
  }
  
  /**
   * 初始化统计图表（使用ECharts）
   */
  function initStatsChart() {
    const chartDom = document.getElementById('stats-chart');
    
    if (chartDom && window.echarts) {
      const myChart = echarts.init(chartDom);
      
      // 这里可以根据实际数据调整
      const option = {
        title: {
          text: '文章分类统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        series: [
          {
            name: '文章分类',
            type: 'pie',
            radius: '65%',
            center: ['50%', '50%'],
            // 示例数据，实际项目中应通过API或后端渲染获取
            data: [
              { value: 10, name: 'JavaScript' },
              { value: 8, name: 'CSS' },
              { value: 12, name: 'HTML' },
              { value: 6, name: 'Python' },
              { value: 4, name: 'Java' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      
      myChart.setOption(option);
      
      // 适应窗口大小变化
      window.addEventListener('resize', function() {
        myChart.resize();
      });
    }
  }
  
  /**
   * 计算文章阅读时间
   */
  function calculateReadingTime() {
    const postContent = document.querySelector('.post-content');
    const readingTimeElement = document.querySelector('.post-reading-time span');
    
    if (postContent && readingTimeElement) {
      const text = postContent.textContent;
      const wordCount = text.trim().split(/\s+/).length;
      const readingTime = Math.ceil(wordCount / 200); // 假设阅读速度为每分钟200字
      
      readingTimeElement.textContent = readingTime + ' 分钟';
    }
  }
  
  /**
   * 初始化代码块功能
   */
  function initCodeBlocks() {
    // 确保在DOM加载完成后执行
    console.log('Initializing code blocks functionality...');
    
    // 如果code-copy.js已经加载，使用它的初始化函数
    if (typeof window.initCodeCopy === 'function') {
      window.initCodeCopy();
      return true;
    }
    
    // 备用逻辑：如果code-copy.js未加载，使用自己的实现
    // 尝试多种选择器找到代码块
    let codeBlocks = document.querySelectorAll('pre code');
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('.highlight code');
    }
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('pre.highlight');
    }
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('pre');
    }
    if (codeBlocks.length === 0) {
      codeBlocks = document.querySelectorAll('.code pre');
    }
    
    console.log('Found ' + codeBlocks.length + ' code blocks');
    
    // 如果没有找到代码块，则无需继续
    if (codeBlocks.length === 0) {
      return false;
    }
    
    // 为每个代码块添加复制按钮
    codeBlocks.forEach(function(codeBlock, index) {
      // 获取父元素
      let pre, code;
      if (codeBlock.tagName.toLowerCase() === 'pre' && codeBlock.querySelector('code')) {
        pre = codeBlock;
        code = codeBlock.querySelector('code');
      } else if (codeBlock.tagName.toLowerCase() === 'code') {
        code = codeBlock;
        pre = codeBlock.parentNode;
      } else {
        pre = codeBlock;
        code = codeBlock; // 在没有code元素的情况下，使用pre元素本身
      }
      
      // 检查是否已经有复制按钮，避免重复添加
      if (pre.querySelector('.copy-button')) {
        return;
      }
      
      // 确保pre有相对定位，以便按钮定位
      if (window.getComputedStyle(pre).position === 'static') {
        pre.style.position = 'relative';
      }
      
      // 创建复制按钮
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button copy-button-float'; // 添加浮动类
      copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
      copyButton.title = '复制代码';
      copyButton.setAttribute('data-index', index);
      
      // 添加按钮到pre元素
      pre.appendChild(copyButton);
      
      // 添加复制功能
      copyButton.addEventListener('click', function(e) {
        // 阻止事件冒泡
        e.stopPropagation();
        
        // 使用code-copy.js中的统一复制功能
        if (window.copyUtils && typeof window.copyUtils.copyCode === 'function') {
          window.copyUtils.copyCode(code, pre, copyButton);
          return;
        }
        
        // 提取代码内容 - 回退逻辑
        let codeText = '';
        
        // 尝试使用全局的extractCodeContent函数
        if (typeof window.extractCodeContent === 'function') {
          if (code) {
            codeText = window.extractCodeContent(code);
          } else if (pre) {
            const codeEl = pre.querySelector('code');
            if (codeEl) {
              codeText = window.extractCodeContent(codeEl);
            } else {
              codeText = window.extractCodeContent(pre);
            }
          }
        } else {
          // 基本的代码提取逻辑作为备选
          if (code) {
            codeText = code.textContent;
          } else if (pre) {
            codeText = pre.textContent;
          }
          
          // 简单的行号清理
          codeText = codeText.replace(/^\s*\d+[\s|:]+/gm, '');
        }
        
        // 清理代码文本，移除可能的按钮文本和多余空白
        codeText = codeText.replace(/复制|copy|\.fa-copy/gi, '');
        
        // 修剪开头和结尾的空白，但保留内部格式
        codeText = codeText.trim();
        
        console.log('Copy button clicked. Copying code...');
        console.log('复制内容：', codeText);
        
        // 使用较新的剪贴板API
        if (navigator.clipboard) {
          navigator.clipboard.writeText(codeText)
            .then(function() {
              console.log('Code copied to clipboard successfully!');
              // 复制成功，改变按钮样式
              copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制';
              copyButton.classList.add('success');
              
              // 显示提示消息
              showToast('代码已复制到剪贴板', 2000, 'success');
              
              // 给代码块添加一个短暂的高亮效果
              pre.style.transition = 'box-shadow 0.3s ease';
              pre.style.boxShadow = '0 0 8px rgba(46, 204, 113, 0.5)';
              
              // 2秒后恢复按钮原样式
              setTimeout(function() {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
                copyButton.classList.remove('success');
                pre.style.boxShadow = '';
              }, 2000);
            })
            .catch(function(err) {
              console.error('复制失败:', err);
              // 复制失败，显示错误信息
              copyButton.innerHTML = '<i class="fas fa-times"></i> 失败';
              copyButton.classList.add('error');
              
              // 显示错误提示
              showToast('复制失败，请重试', 3000, 'error');
              
              // 高亮错误效果
              pre.style.transition = 'box-shadow 0.3s ease';
              pre.style.boxShadow = '0 0 8px rgba(231, 76, 60, 0.5)';
              
              // 2秒后恢复按钮原样式
              setTimeout(function() {
                copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
                copyButton.classList.remove('error');
                pre.style.boxShadow = '';
              }, 2000);
            });
        } else {
          // 备用方法：使用document.execCommand
          const textArea = document.createElement('textarea');
          textArea.value = codeText;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.select();
          
          try {
            const successful = document.execCommand('copy');
            if (successful) {
              console.log('Code copied to clipboard successfully (legacy method)!');
              // 复制成功，改变按钮样式
              copyButton.innerHTML = '<i class="fas fa-check"></i> 已复制';
              copyButton.classList.add('success');
              
              // 显示提示消息
              showToast('代码已复制到剪贴板', 2000, 'success');
              
              // 给代码块添加一个短暂的高亮效果
              pre.style.transition = 'box-shadow 0.3s ease';
              pre.style.boxShadow = '0 0 8px rgba(46, 204, 113, 0.5)';
            } else {
              throw new Error('Copy command was unsuccessful');
            }
          } catch (err) {
            console.error('复制失败:', err);
            // 复制失败，显示错误信息
            copyButton.innerHTML = '<i class="fas fa-times"></i> 失败';
            copyButton.classList.add('error');
            
            // 显示错误提示
            showToast('复制失败，请重试', 3000, 'error');
            
            // 高亮错误效果
            pre.style.transition = 'box-shadow 0.3s ease';
            pre.style.boxShadow = '0 0 8px rgba(231, 76, 60, 0.5)';
          }
          
          document.body.removeChild(textArea);
          
          // 2秒后恢复按钮原样式
          setTimeout(function() {
            copyButton.innerHTML = '<i class="fas fa-copy"></i> 复制';
            copyButton.classList.remove('success');
            copyButton.classList.remove('error');
            pre.style.boxShadow = '';
          }, 2000);
        }
      });
      
      // 鼠标悬停效果
      copyButton.addEventListener('mouseenter', function() {
        copyButton.style.opacity = '1';
      });
      
      copyButton.addEventListener('mouseleave', function() {
        copyButton.style.opacity = '0.7';
      });
    });
    
    // 高亮代码语言显示
    const pres = document.querySelectorAll('pre');
    pres.forEach(function(pre) {
      // 检查是否已经有语言标签，避免重复添加
      if (pre.querySelector('.code-lang-tag')) {
        return;
      }
      
      const code = pre.querySelector('code');
      if (code && code.className) {
        const match = code.className.match(/language-(\w+)/);
        if (match && match[1]) {
          const langTag = document.createElement('div');
          langTag.className = 'code-lang-tag';
          langTag.textContent = match[1];
          pre.appendChild(langTag);
        }
      }
    });
  }
  
  /**
   * 初始化文章阅读进度条
   */
  function initReadingProgress() {
    const progressBar = document.getElementById('reading-progress-bar');
    const postContent = document.querySelector('.post-content');
    
    if (progressBar && postContent) {
      // 计算阅读进度的函数
      function updateReadingProgress() {
        const contentHeight = postContent.offsetHeight;
        const contentTop = postContent.offsetTop;
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // 文章起始位置到达视口顶部时开始计算
        if (scrollPosition >= contentTop) {
          // 计算阅读百分比
          const readingPercentage = Math.min(
            100, 
            ((scrollPosition - contentTop) / (contentHeight - windowHeight)) * 100
          );
          
          // 设置进度条宽度
          progressBar.style.width = `${readingPercentage}%`;
        } else {
          progressBar.style.width = '0';
        }
      }
      
      // 监听滚动事件
      window.addEventListener('scroll', updateReadingProgress);
      window.addEventListener('resize', updateReadingProgress);
      
      // 初始更新一次
      updateReadingProgress();
    }
  }
  
  /**
   * 初始化打赏功能
   */
  function initReward() {
    const rewardButton = document.getElementById('reward-button');
    const rewardPanel = document.getElementById('reward-panel');
    const rewardPanelClose = document.getElementById('reward-panel-close');
    
    if (rewardButton && rewardPanel && rewardPanelClose) {
      // 打开打赏面板
      rewardButton.addEventListener('click', function() {
        rewardPanel.classList.add('active');
        document.body.style.overflow = 'hidden'; // 防止背景滚动
      });
      
      // 关闭打赏面板
      rewardPanelClose.addEventListener('click', function() {
        rewardPanel.classList.remove('active');
        document.body.style.overflow = ''; // 恢复背景滚动
      });
      
      // 点击面板外区域关闭面板
      rewardPanel.addEventListener('click', function(e) {
        if (e.target === rewardPanel) {
          rewardPanel.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
      
      // ESC键关闭面板
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && rewardPanel.classList.contains('active')) {
          rewardPanel.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }
  
  /**
   * 初始化社交分享功能
   */
  function initSocialShare() {
    // 微信分享
    const wechatShareBtn = document.getElementById('share-wechat');
    const wechatSharePanel = document.getElementById('wechat-share-panel');
    const wechatShareClose = document.getElementById('wechat-share-close');
    const qrcodeContainer = document.getElementById('wechat-qrcode');
    
    if (wechatShareBtn && wechatSharePanel) {
      // 加载QRCode库
      const qrcodeScript = document.createElement('script');
      qrcodeScript.src = 'https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js';
      document.head.appendChild(qrcodeScript);
      
      qrcodeScript.onload = function() {
        // 微信分享按钮点击事件
        wechatShareBtn.addEventListener('click', function() {
          // 获取原文链接（如果存在）
          const originalUrl = this.getAttribute('data-original-url');
          // 生成二维码，优先使用原文链接
          if (qrcodeContainer && typeof QRCode !== 'undefined') {
            // 清空已有的二维码
            qrcodeContainer.innerHTML = '';
            
            // 创建新的二维码，优先使用原文链接，如果不存在则使用当前页面URL
            new QRCode(qrcodeContainer, {
              text: originalUrl && originalUrl.trim() ? originalUrl : window.location.href,
              width: 150,
              height: 150,
              colorDark: '#000000',
              colorLight: '#ffffff',
              correctLevel: QRCode.CorrectLevel.H
            });
          }
          
          // 显示微信分享面板
          wechatSharePanel.classList.add('show');
          document.body.style.overflow = 'hidden'; // 防止背景滚动
        });
      };
      
      // 关闭微信分享面板
      if (wechatShareClose) {
        wechatShareClose.addEventListener('click', function() {
          wechatSharePanel.classList.remove('show');
          document.body.style.overflow = ''; // 恢复滚动
        });
        
        // 点击面板外部关闭
        wechatSharePanel.addEventListener('click', function(e) {
          if (e.target === wechatSharePanel) {
            wechatSharePanel.classList.remove('show');
            document.body.style.overflow = '';
          }
        });
        
        // ESC键关闭
        document.addEventListener('keydown', function(e) {
          if (e.key === 'Escape' && wechatSharePanel.classList.contains('show')) {
            wechatSharePanel.classList.remove('show');
            document.body.style.overflow = '';
          }
        });
      }
    }
    
    // 复制链接功能
    const copyLinkBtn = document.getElementById('copy-link');
    
    if (copyLinkBtn) {
      copyLinkBtn.addEventListener('click', function() {
        const url = this.getAttribute('data-url') || window.location.href;
        
        // 创建一个临时输入框
        const tempInput = document.createElement('input');
        tempInput.value = url;
        document.body.appendChild(tempInput);
        
        // 选择并复制文本
        tempInput.select();
        document.execCommand('copy');
        
        // 移除临时输入框
        document.body.removeChild(tempInput);
        
        // 显示复制成功提示
        showToast('链接已复制到剪贴板');
      });
    }
  }
  
  /**
   * 显示提示消息
   * @param {string} message - 提示消息内容
   * @param {number} duration - 显示时间（毫秒）
   * @param {string} type - 消息类型（'success', 'error'或默认）
   */
  function showToast(message, duration = 2000, type = '') {
    // 如果有全局函数可用，使用它
    if (window.copyUtils && typeof window.copyUtils.showToast === 'function') {
      window.copyUtils.showToast(message, duration, type);
      return;
    }
    
    // 备选实现
    // 检查是否已存在toast元素，如果存在则先移除
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }
    
    // 创建新的toast元素
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    
    // 添加类型样式
    if (type === 'success') {
      toast.classList.add('success');
    } else if (type === 'error') {
      toast.classList.add('error');
    }
    
    toast.textContent = message;
    
    // 添加到页面
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);
    
    // 设定自动消失
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
  
})();