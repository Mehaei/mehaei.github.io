/* 
 * @Author: 胖胖很瘦
 * @Date: 2025-03-29 12:15:00
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-03-29 12:15:00
 */

// 确保在全局范围内定义函数
(function(window) {
  'use strict';

  // ID 生成工具函数
  function generateIssueId(path) {
    // 移除开头的 / 和结尾的 .html
    let id = path
      .replace(/^\//, '')
      .replace(/\.html$/, '')
      .replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // 使用简单的哈希函数（与服务器端完全相同的算法）
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      const char = id.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(16).substring(0, 50);
  }

  // 将函数暴露到全局作用域
  window.utils = window.utils || {};
  window.utils.generateIssueId = generateIssueId;
})(window); 