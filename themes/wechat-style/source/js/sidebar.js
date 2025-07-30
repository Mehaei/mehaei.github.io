/**
 * 侧边栏功能
 */
(function() {
  document.addEventListener('DOMContentLoaded', function() {
    initSidebarStatistics();
    initMonthlyChart();
    initSidebarToggle();
    initViewCounts();
  });

  /**
   * 初始化侧边栏统计数据
   */
  function initSidebarStatistics() {
    // 更新文章总数
    const totalPostsElement = document.getElementById('total-posts');
    if (totalPostsElement) {
      // 从页面数据获取或使用预设值
      const totalPosts = window.siteData?.totalPosts || document.querySelectorAll('.post-item').length;
      totalPostsElement.textContent = totalPosts;
    }

    // 更新分类总数
    const totalCategoriesElement = document.getElementById('total-categories');
    if (totalCategoriesElement) {
      // 从页面数据获取或使用预设值
      const totalCategories = window.siteData?.totalCategories || document.querySelectorAll('.category-item').length;
      totalCategoriesElement.textContent = totalCategories;
    }

    // 更新标签总数
    const totalTagsElement = document.getElementById('total-tags');
    if (totalTagsElement) {
      // 从页面数据获取或使用预设值
      const totalTags = window.siteData?.totalTags || document.querySelectorAll('.tag-item').length;
      totalTagsElement.textContent = totalTags;
    }
  }

  /**
   * 初始化月度文章发布图表
   */
  function initMonthlyChart() {
    const monthlyChartElement = document.getElementById('monthly-chart');
    if (!monthlyChartElement || !window.echarts) return;

    const chart = echarts.init(monthlyChartElement);
    
    // 这里使用示例数据，实际使用时应从服务器获取
    const monthlyData = {
      months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
      counts: [5, 7, 3, 9, 12, 6, 8, 10, 5, 7, 4, 6]
    };

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: monthlyData.months,
        axisLabel: {
          interval: 1,
          fontSize: 10
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [{
        name: '文章数',
        type: 'bar',
        data: monthlyData.counts,
        itemStyle: {
          color: '#07c160'
        }
      }]
    };

    chart.setOption(option);
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
      chart.resize();
    });
  }

  /**
   * 初始化侧边栏折叠功能（在移动设备上）
   */
  function initSidebarToggle() {
    console.log("初始化侧边栏折叠功能（在移动设备上）")
    const sidebarToggleButton = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.querySelector('.sidebar');
    console.log("sidebarToggleButton: ", sidebarToggleButton)
    console.log("sidebar: ", sidebar)
    if (!sidebarToggleButton || !sidebar) return;
    
    sidebarToggleButton.addEventListener('click', function() {
      console.log("点击侧边栏折叠按钮")
      sidebar.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-opened');
    });
    
    // 点击外部关闭侧边栏
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 992 && 
          sidebar.classList.contains('sidebar-open') && 
          !sidebar.contains(e.target) && 
          e.target !== sidebarToggleButton) {
        sidebar.classList.remove('sidebar-open');
        document.body.classList.remove('sidebar-opened');
      }
    });
  }

  /**
   * 初始化文章浏览量显示
   */
  function initViewCounts() {
    // 在实际应用中，应从后端API获取真实的浏览量数据
    // 这里使用随机数据进行演示
    document.querySelectorAll('.hot-post-views [data-post-path]').forEach(function(element) {
      const min = 10;
      const max = 9999;
      const viewCount = Math.floor(Math.random() * (max - min + 1)) + min;
      
      // 格式化数字
      if (viewCount > 999) {
        element.textContent = (viewCount / 1000).toFixed(1) + 'k';
      } else {
        element.textContent = viewCount;
      }
    });
  }

  /**
   * 搜索功能
   */
  function initSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('sidebar-search-input');
    const searchButton = document.getElementById('sidebar-search-button');
    
    if (!searchForm || !searchInput || !searchButton) return;
    
    searchForm.addEventListener('submit', function(e) {
      e.preventDefault();
      performSearch(searchInput.value.trim());
    });
    
    searchButton.addEventListener('click', function() {
      performSearch(searchInput.value.trim());
    });
  }
  
  /**
   * 执行搜索
   * @param {string} keyword - 搜索关键词
   */
  function performSearch(keyword) {
    if (!keyword) return;
    
    // 对于本地搜索，可以跳转到搜索结果页面
    // 实际使用时可能需要整合第三方搜索或自定义搜索功能
    window.location.href = '/search/?q=' + encodeURIComponent(keyword);
  }
})(); 