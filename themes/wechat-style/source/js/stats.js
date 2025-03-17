/**
 * 微信风格主题 - 博客统计数据处理脚本
 * 用于在页面加载时显示实时的博客统计信息
 */

(function() {
  'use strict';
  
  // 确保 blogStats 对象存在
  if (typeof window.blogStats === 'undefined') {
    console.error('博客统计数据加载器未定义');
    return;
  }
  
  // DOM 加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    // 初始化各种统计功能
    initPostStats();
    initTotalViews();
    initStatsCharts();
  });
  
  /**
   * 初始化文章统计信息（阅读量、点赞数、评论数）
   */
  function initPostStats() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 更新文章阅读量显示
    const viewCountElements = document.querySelectorAll('[data-post-path]');
    
    viewCountElements.forEach(function(element) {
      const postPath = element.getAttribute('data-post-path');
      
      // 在实际应用中，应该从服务器API获取真实的统计数据
      // 这里使用随机数据进行演示
      let viewCount;
      
      // 为当前文章生成稳定的阅读量（基于路径）
      if (postPath === currentPath) {
        // 当前文章页面，生成更稳定的数据
        const pathHash = hashCode(postPath);
        viewCount = 100 + (pathHash % 900); // 100-999之间
        
        // 增加当前会话的访问记录
        if (!sessionStorage.getItem('viewed_' + postPath)) {
          viewCount += 1;
          sessionStorage.setItem('viewed_' + postPath, 'true');
        }
      } else {
        // 其他文章，如侧边栏中的热门文章列表
        const pathHash = hashCode(postPath);
        viewCount = 50 + (pathHash % 950); // 50-999之间
      }
      
      // 格式化阅读量显示
      if (viewCount > 999) {
        element.textContent = (viewCount / 1000).toFixed(1) + 'k';
      } else {
        element.textContent = viewCount;
      }
    });
  }
  
  /**
   * 初始化总阅读量统计
   */
  function initTotalViews() {
    const totalViewsElement = document.getElementById('total-views');
    if (!totalViewsElement) return;
    
    // 在实际应用中，应该从服务器获取真实的总阅读量
    // 这里使用随机数据进行演示
    const totalViews = Math.floor(10000 + Math.random() * 90000);
    
    // 格式化显示
    if (totalViews > 999999) {
      totalViewsElement.textContent = (totalViews / 1000000).toFixed(1) + 'M';
    } else if (totalViews > 999) {
      totalViewsElement.textContent = (totalViews / 1000).toFixed(1) + 'k';
    } else {
      totalViewsElement.textContent = totalViews;
    }
  }
  
  /**
   * 初始化统计图表
   */
  function initStatsCharts() {
    // 添加监听器，在站点数据加载完成后初始化图表
    document.addEventListener('siteDataLoaded', function(e) {
      const data = e.detail;
      
      if (data) {
        // 初始化分类饼图
        initCategoriesChart(data);
        
        // 初始化月度发布趋势图
        initMonthlyChart(data);
      }
    });
    
    // 如果数据已经加载，直接初始化
    if (window.siteData) {
      initCategoriesChart(window.siteData);
      initMonthlyChart(window.siteData);
    }
  }
  
  /**
   * 初始化分类统计饼图
   */
  function initCategoriesChart(data) {
    const categoriesChartElement = document.getElementById('categories-chart');
    if (!categoriesChartElement || !window.echarts) return;
    
    const chart = echarts.init(categoriesChartElement);
    
    // 获取分类数据
    let categories = [];
    let counts = [];
    
    if (data && data.categories && data.categories.list) {
      // 使用实际数据
      categories = data.categories.list.map(item => item.name);
      counts = data.categories.list.map(item => item.count);
    } else {
      // 使用示例数据
      categories = ['前端', '后端', '算法', '工具', '其他'];
      counts = [25, 20, 15, 10, 5];
    }
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        right: 10,
        top: 'center',
        data: categories,
        textStyle: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
        }
      },
      series: [{
        name: '文章分类',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim(),
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '16',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: categories.map((category, index) => {
          return {
            name: category,
            value: counts[index]
          };
        })
      }]
    };
    
    chart.setOption(option);
    
    // 响应主题变化
    document.addEventListener('themeChanged', function() {
      option.legend.textStyle.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
      option.series[0].itemStyle.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim();
      chart.setOption(option);
    });
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
      chart.resize();
    });
  }
  
  /**
   * 初始化月度发布趋势图
   */
  function initMonthlyChart(data) {
    const monthlyChartElement = document.getElementById('monthly-chart');
    if (!monthlyChartElement || !window.echarts) return;
    
    const chart = echarts.init(monthlyChartElement);
    
    // 获取月度数据
    let months = [];
    let counts = [];
    
    if (data && data.monthlyPosts) {
      // 使用实际数据
      months = data.monthlyPosts.months;
      counts = data.monthlyPosts.counts;
    } else {
      // 使用示例数据
      months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      counts = [5, 7, 3, 9, 12, 6, 8, 10, 5, 7, 4, 6];
    }
    
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
        data: months,
        axisLabel: {
          interval: 1,
          fontSize: 10,
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-light').trim()
        },
        axisLine: {
          lineStyle: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        }
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color-light').trim()
        },
        axisLine: {
          lineStyle: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim()
          }
        },
        splitLine: {
          lineStyle: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim(),
            opacity: 0.3
          }
        }
      },
      series: [{
        name: '文章数',
        type: 'bar',
        data: counts,
        itemStyle: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim()
        }
      }]
    };
    
    chart.setOption(option);
    
    // 响应主题变化
    document.addEventListener('themeChanged', function() {
      option.xAxis.axisLabel.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color-light').trim();
      option.xAxis.axisLine.lineStyle.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
      option.yAxis.axisLabel.color = getComputedStyle(document.documentElement).getPropertyValue('--text-color-light').trim();
      option.yAxis.axisLine.lineStyle.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
      option.yAxis.splitLine.lineStyle.color = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
      option.series[0].itemStyle.color = getComputedStyle(document.documentElement).getPropertyValue('--theme-color').trim();
      chart.setOption(option);
    });
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
      chart.resize();
    });
  }
  
  /**
   * 生成字符串的哈希码，用于生成伪随机但稳定的数据
   */
  function hashCode(str) {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash);
  }
})(); 