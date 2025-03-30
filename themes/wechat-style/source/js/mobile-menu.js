/**
 * 移动端菜单交互逻辑
 */

document.addEventListener('DOMContentLoaded', function() {
  // 获取移动菜单按钮和菜单元素
  const mobileToggle = document.getElementById('mobile-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  // 移动菜单切换
  if (mobileToggle && mobileMenu) {
    // 点击汉堡按钮切换菜单显示状态
    mobileToggle.addEventListener('click', function(e) {
      e.stopPropagation(); // 阻止事件冒泡
      mobileMenu.classList.toggle('active');
      
      // 切换汉堡按钮样式
      this.classList.toggle('active');
    });
    
    // 点击菜单项后关闭菜单
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    mobileNavLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
    
    // 点击页面其他区域关闭菜单
    document.addEventListener('click', function(e) {
      if (mobileMenu.classList.contains('active') && 
          !mobileMenu.contains(e.target) && 
          e.target !== mobileToggle && 
          !mobileToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
      }
    });
  }
});