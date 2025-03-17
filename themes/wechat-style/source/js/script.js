/**
 * 微信风格技术博客主题脚本
 */

(function() {
  'use strict';
  
  // DOM元素加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initThemeToggle();
    initBackToTop();
    initImageViewer();
    initLoadingBar();
    
    // 如果存在统计图表区域，初始化图表
    if (document.getElementById('stats-chart')) {
      initStatsChart();
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
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(function(codeBlock) {
      // 创建复制按钮
      const copyButton = document.createElement('button');
      copyButton.className = 'copy-button';
      copyButton.textContent = '复制';
      
      // 将按钮添加到代码块
      const pre = codeBlock.parentNode;
      pre.appendChild(copyButton);
      
      // 添加复制功能
      copyButton.addEventListener('click', function() {
        const code = codeBlock.textContent;
        
        navigator.clipboard.writeText(code)
          .then(function() {
            copyButton.textContent = '已复制!';
            
            setTimeout(function() {
              copyButton.textContent = '复制';
            }, 2000);
          })
          .catch(function(err) {
            console.error('无法复制代码: ', err);
            copyButton.textContent = '复制失败';
          });
      });
    });
  }
  
})(); 