/**
 * 微信风格主题 - 博客统计数据处理脚本
 * 用于在页面加载时显示实时的博客统计信息
 */

(function() {
  'use strict';
  
  // DOM 加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    // 初始化各种统计功能
    initStatsCharts();
  });
  

  
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
    
    if (data && data.monthly && data.monthly.list) {
      // 使用实际数据
      months = data.monthly.list.map(item => item.month);
      counts = data.monthly.list.map(item => item.count);
    } else {
      // 使用示例数据
      months = ['1月', '2月', '3月', '4月', '5月', '6月'];
      counts = [5, 8, 12, 6, 9, 7];
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
      xAxis: [{
        type: 'category',
        data: months,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
          }
        },
        axisLabel: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
        }
      }],
      yAxis: [{
        type: 'value',
        axisLine: {
          lineStyle: {
            color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
          }
        },
        axisLabel: {
          color: getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim()
        }
      }],
      series: [{
        name: '文章数',
        type: 'bar',
        barWidth: '60%',
        data: counts,
        itemStyle: {
          color: '#07C160'
        }
      }]
    };
    
    chart.setOption(option);
    
    // 响应主题变化
    document.addEventListener('themeChanged', function() {
      const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
      option.xAxis[0].axisLine.lineStyle.color = textColor;
      option.xAxis[0].axisLabel.color = textColor;
      option.yAxis[0].axisLine.lineStyle.color = textColor;
      option.yAxis[0].axisLabel.color = textColor;
      chart.setOption(option);
    });
    
    // 响应窗口大小变化
    window.addEventListener('resize', function() {
      chart.resize();
    });
  }
})();