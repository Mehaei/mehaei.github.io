document.addEventListener('DOMContentLoaded', function() {
  console.log('Pagination script loaded');
  
  // 获取所有分页组件
  const paginationWrappers = document.querySelectorAll('.pagination-wrapper');
  console.log('Found pagination wrappers:', paginationWrappers.length);
  
  paginationWrappers.forEach((wrapper, index) => {
    const input = wrapper.querySelector('.page-input');
    const button = wrapper.querySelector('.page-jump-btn');
    const base = wrapper.getAttribute('data-base');
    
    console.log(`Pagination #${index+1}:`, { 
      base: base,
      input: input ? 'found' : 'not found',
      button: button ? 'found' : 'not found'
    });
    
    if (input && button) {
      const total = parseInt(input.getAttribute('max') || '1');
      console.log(`Setting up pagination #${index+1} with total pages:`, total);
      
      // 处理按钮点击
      button.addEventListener('click', function() {
        console.log('Jump button clicked');
        handleJump(input, base, total);
      });
      
      // 处理回车键
      input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
          console.log('Enter key pressed in input');
          handleJump(input, base, total);
        }
      });
      
      // 处理输入限制
      input.addEventListener('input', function() {
        let value = parseInt(input.value);
        if (isNaN(value) || value < 1) input.value = 1;
        if (value > total) input.value = total;
      });
    }
  });
});

function handleJump(input, base, total) {
  console.log('Handle jump function called');
  
  if (!input) {
    console.error('Input element is undefined');
    return;
  }
  
  const page = parseInt(input.value);
  console.log('Trying to jump to page:', page);
  
  if (!page || page < 1 || page > total) {
    console.error('Invalid page number:', page);
    return;
  }
  
  if (!base) {
    console.error('Base URL is undefined');
    return;
  }
  
  let url;
  if (page === 1) {
    url = base;
  } else {
    // 确保 base 路径格式正确
    url = base + (base.endsWith('/') ? '' : '/') + 'page/' + page + '/';
  }
  
  console.log('Jumping to URL:', url);
  
  try {
    window.location.href = url;
  } catch (error) {
    console.error('Error during navigation:', error);
  }
} 