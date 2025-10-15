/*
 * @Author: 胖胖很瘦
 * @Date: 2025-03-17 18:04:20
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-07-30 16:09:53
 */
/**
 * 代码块复制功能
 */
(function() {
  'use strict';
  
  // 导出全局函数
  window.copyUtils = {
    initCodeCopy: initCodeCopy,
    extractCodeContent: extractCodeContent,
    showToast: showToast,
    copySuccess: copySuccess,
    copyError: copyError,
    copyCode: copyCode
  };
  
  // 兼容旧的函数命名
  window.initCodeCopy = initCodeCopy;
  window.extractCodeContent = extractCodeContent;

  // 多次尝试初始化，确保代码块被找到
  let initAttempts = 0;
  const MAX_ATTEMPTS = 5;
  
  // 页面加载完成后执行
  document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('article')) {
      // 第一次尝试初始化
      setTimeout(tryInitCodeCopy, 100);
    }
  });

  // 窗口加载完成后执行，确保所有资源都已加载
  window.addEventListener('load', function() {
    if (document.querySelector('article')) {
      // 再次尝试初始化
      setTimeout(tryInitCodeCopy, 500);
    }
  });
  
  /**
   * 尝试初始化代码复制功能，多次尝试确保成功
   */
  function tryInitCodeCopy() {
    initAttempts++;
    const result = initCodeCopy();
    
    // 如果未找到代码块且尚未达到最大尝试次数，则再次尝试
    if (!result && initAttempts < MAX_ATTEMPTS) {
      console.log(`Code blocks not found. Attempt ${initAttempts}/${MAX_ATTEMPTS}. Retrying in 1 second...`);
      setTimeout(tryInitCodeCopy, 1000);
    }
  }
  
  /**
   * 通用的代码复制功能
   * @param {Element} code - 代码元素
   * @param {Element} pre - 代码块父元素
   * @param {Element} button - 复制按钮
   */
  function copyCode(code, pre, button) {
    // 使用专门的函数提取纯代码内容
    let codeText = '';
    
    if (code) {
      codeText = extractCodeContent(code);
    } else if (pre) {
      // 如果没有code元素，尝试从pre提取
      const codeEl = pre.querySelector('code');
      if (codeEl) {
        codeText = extractCodeContent(codeEl);
      } else {
        codeText = extractCodeContent(pre);
      }
    }
    
    // 清理代码文本，移除可能的按钮文本和多余空白
    codeText = codeText.replace(/复制|copy|\.fa-copy/gi, '');
    
    // 修剪开头和结尾的空白，但保留内部格式
    codeText = codeText.trim();
    
    // 日志记录复制内容（调试用）
    console.log('复制内容：', codeText);
    
    // 使用现代浏览器API
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeText)
        .then(function() {
          copySuccess(button, pre);
        })
        .catch(function(err) {
          console.error('复制失败:', err);
          copyError(button, pre);
        });
    } else {
      // 兼容旧版浏览器
      const textarea = document.createElement('textarea');
      textarea.value = codeText;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      
      try {
        if (document.execCommand('copy')) {
          copySuccess(button, pre);
        } else {
          throw new Error('复制命令执行失败');
        }
      } catch (err) {
        console.error('复制失败:', err);
        copyError(button, pre);
      }
      
      document.body.removeChild(textarea);
    }
  }
  
  /**
   * 从代码元素中提取纯代码内容，去除行号
   * @param {Element} codeElement - 代码元素
   * @returns {string} 纯代码内容
   */
  function extractCodeContent(codeElement) {
    if (!codeElement) return '';
    
    // 1. 首先尝试处理特定的代码块结构
    // 检查是否是使用table布局的代码块（常见于highlight.js和prism）
    const codeTable = codeElement.querySelector('table.highlighttable, table.highlight');
    if (codeTable) {
      // 查找不包含行号的代码内容部分
      const codeContentCol = codeTable.querySelector('.code, .highlight, td:not(.gutter):not(.line-numbers)');
      if (codeContentCol) {
        // 从内容列中提取所有代码行
        const codeLines = Array.from(codeContentCol.querySelectorAll('.line, .code-line, div, pre')); 
        if (codeLines.length > 0) {
          return codeLines.map(line => line.textContent || '').join('\n');
        } else {
          return codeContentCol.textContent;
        }
      }
    }
    
    // 2. 检查是否有代码内容专用容器
    const codeContentContainer = codeElement.querySelector('.code-content, .code, .hljs-code');
    if (codeContentContainer) {
      // 查找所有代码行
      const codeLines = Array.from(codeContentContainer.querySelectorAll('.line, .code-line, div, pre'));
      if (codeLines.length > 0) {
        return codeLines.map(line => line.textContent || '').join('\n');
      } else {
        return codeContentContainer.textContent;
      }
    }
    
    // 3. 检查是否有行号容器，尝试通过排除行号得到内容
    const lineNumbersContainer = codeElement.querySelector('.line-numbers, .gutter, .hljs-line-numbers');
    if (lineNumbersContainer) {
      // 查找代码部分容器
      const codeContainer = codeElement.querySelector('.hljs-lines, .code-body, .code');
      if (codeContainer) {
        // 从代码容器中提取所有行
        const codeLines = Array.from(codeContainer.querySelectorAll('.line, div, pre'));
        if (codeLines.length > 0) {
          return codeLines.map(line => line.textContent || '').join('\n');
        } else {
          return codeContainer.textContent;
        }
      } else {
        // 如果找不到代码容器，尝试复制并移除行号容器
        const clone = codeElement.cloneNode(true);
        const numbersToRemove = clone.querySelectorAll('.line-numbers, .gutter, .hljs-line-numbers');
        numbersToRemove.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
        
        // 从剩余内容提取代码
        const lines = Array.from(clone.querySelectorAll('.line, div, pre'));
        if (lines.length > 0) {
          return lines.map(line => line.textContent || '').join('\n');
        } else {
          return clone.textContent;
        }
      }
    }
    
    // 4. 检查代码内容是否带有行号模式 (例如: "1  const x = 1;")
    const text = codeElement.textContent;
    const lines = text.split('\n');
    
    // 检测是否每行都以数字开头
    let hasLineNumbers = lines.length > 1;
    for (let i = 0; i < Math.min(lines.length, 5); i++) {
      if (!/^\s*\d+[\s|:]/.test(lines[i])) {
        hasLineNumbers = false;
        break;
      }
    }
    
    if (hasLineNumbers) {
      // 正则表达式去除每行开头的行号
      return lines.map(line => line.replace(/^\s*\d+[\s|:]+/, '')).join('\n');
    }
    
    // 5. 检查是否有特殊的代码行结构
    const codeLines = codeElement.querySelectorAll('span[data-line], div[data-line-number], .line');
    if (codeLines.length > 0) {
      return Array.from(codeLines).map(line => line.textContent || '').join('\n');
    }
    
    // 6. 如果上述方法都不匹配，提取原始文本，但确保格式正确
    // 分析文本是否包含换行符
    if (text.includes('\n')) {
      return text; // 保留原有格式
    } else {
      // 尝试识别HTML中的换行结构
      const html = codeElement.innerHTML;
      if (html.includes('<br') || html.includes('</div') || html.includes('</pre')) {
        // 通过临时元素将HTML转换为带换行的文本
        const temp = document.createElement('div');
        temp.innerHTML = html.replace(/<br\s*\/?>/gi, '\n').replace(/<\/(div|pre|p|li)>/gi, '\n$&');
        return temp.textContent;
      }
      return text;
    }
  }
  /**
 * detectLanguagePlus(code: string)
 * 高精度语言识别（支持 python, java, html, js, cpp, shell, sql）
 * 可离线运行，无需依赖
 */
function detectLanguagePlus(code, options = {}) {
  if (typeof code !== 'string') code = String(code || '');
  const txt = code;
  const opts = { threshold: 0.001, top: 1, ...options };

  const langs = [
    {
      name: 'python',
      patterns: [
        { r: /\bdef\s+\w+\s*\(/m, w: 3 },
        { r: /\bclass\s+\w+\s*:/m, w: 2 },
        { r: /\bfrom\s+\w+\s+import\b/m, w: 2 },
        { r: /\bimport\s+\w+/m, w: 2 },
        { r: /:\s*$/m, w: 1 },
        { r: /\bprint\s*\(/m, w: 2 },
        { r: /\bself\b/, w: 1 },
      ],
    },
    {
      name: 'java',
      patterns: [
        { r: /\bpublic\s+class\b/, w: 3 },
        { r: /\bSystem\.out\.println\s*\(/, w: 3 },
        { r: /\bimport\s+java\./, w: 2 },
        { r: /\bprivate\s+static\b/, w: 1 },
        { r: /\bpackage\s+[\w.]+;/, w: 1 },
        { r: /\bnew\s+\w+\s*\(/, w: 1 },
      ],
    },
    {
      name: 'html',
      patterns: [
        { r: /<!doctype\s+html>/i, w: 4 },
        { r: /<html\b/i, w: 3 },
        { r: /<head\b/i, w: 2 },
        { r: /<\/body>/i, w: 2 },
        { r: /<\w+(?:\s+[^>]+)?>/m, w: 0.5 },
      ],
    },
    {
      name: 'javascript',
      patterns: [
        { r: /\bconsole\.log\s*\(/, w: 3 },
        { r: /\b(?:var|let|const)\s+\w+/m, w: 2 },
        { r: /\bfunction\s+\w+\s*\(/m, w: 2 },
        { r: /=>\s*{?/, w: 3 },
        { r: /\bmodule\.exports\b/, w: 2 },
        { r: /\bexport\s+(default|const|function|class)\b/, w: 2 },
        { r: /\bdocument\.getElementById\b/, w: 2 },
      ],
    },
    {
      name: 'cpp',
      patterns: [
        { r: /#include\s*<[^>]+>/, w: 3 },
        { r: /\bstd::\w+/, w: 2 },
        { r: /cout\s*<</, w: 3 },
        { r: /\btemplate\s*<.*?>/, w: 2 },
        { r: /\busing\s+namespace\s+std\b/, w: 2 },
        { r: /\bint\s+main\s*\(/, w: 1 },
      ],
    },
    {
      name: 'shell',
      patterns: [
        { r: /^#!\/.*\b(bash|sh|zsh)\b/m, w: 3 },
        { r: /\becho\s+["']?.+["']?/, w: 2 },
        { r: /\b(if|then|fi|elif|do|done|case|esac)\b/, w: 2 },
        { r: /\|\s*\b(grep|awk|sed|cut|sort|uniq|wc)\b/, w: 3 },
        { r: /\b(cd|ls|rm|cp|mv|mkdir|rmdir|chmod|chown|cat|tail|head|ps|kill|sudo|tar|scp|docker|grep)\b/, w: 2 },
        { r: /\$\([^)]+\)|\$\w+/, w: 1 },
      ],
    },
    {
      name: 'sql',
      patterns: [
        { r: /\bSELECT\b.+\bFROM\b/i, w: 3 },
        { r: /\bINSERT\s+INTO\b/i, w: 3 },
        { r: /\bUPDATE\b.+\bSET\b/i, w: 3 },
        { r: /\bDELETE\s+FROM\b/i, w: 3 },
        { r: /\bCREATE\s+(TABLE|VIEW|INDEX)\b/i, w: 2 },
        { r: /\bWHERE\b.+\b(AND|OR)\b/i, w: 1 },
        { r: /;\s*$/m, w: 0.5 },
      ],
    },
  ];

  const results = langs.map((lang) => {
    let score = 0;
    let total = 0;
    for (const p of lang.patterns) {
      total += p.w;
      if (p.r.test(txt)) score += p.w;
    }
    const normalized = total > 0 ? score / total : 0;
    return { language: lang.name, score: normalized };
  });

  results.sort((a, b) => b.score - a.score);
  const best = results[0];
  // console.log(best)

  // if (!best || best.score < opts.threshold) {
  //   return {
  //     language: 'shell',
  //     confidence: best ? Number(best.score.toFixed(3)) : 0,
  //     scores: Object.fromEntries(results.map((r) => [r.language, Number(r.score.toFixed(3))])),
  //   };
  // }

  return {
      language: best.language,
      confidence: Number(best.score.toFixed(3)),
      scores: Object.fromEntries(results.map((r) => [r.language, Number(r.score.toFixed(3))])),
    };
  }


  /**
   * 初始化代码复制功能
   * @returns {boolean} 是否成功找到并处理了代码块
   */
  function initCodeCopy() {
    console.log('初始化代码复制功能...');
    
    // 添加macOS风格窗口样式到代码块上方
    
    // 查找所有代码块
    const codeBlocks = document.querySelectorAll('figure.highlight');
    
    // 为每个代码块添加macOS风格窗口样式
    codeBlocks.forEach((block, index) => {
      // 避免重复添加
      if (block.previousElementSibling?.classList.contains('mac-window-toolbar')) {
        return;
      }
      
      // 创建macOS风格工具栏
      const macToolbar = document.createElement('div');
      macToolbar.className = 'mac-window-toolbar';
      
      // 添加三个按钮（红、黄、绿）
      const redButton = document.createElement('span');
      redButton.className = 'mac-btn mac-close-btn';
      
      const yellowButton = document.createElement('span');
      yellowButton.className = 'mac-btn mac-minimize-btn';
      
      const greenButton = document.createElement('span');
      greenButton.className = 'mac-btn mac-maximize-btn';
      
      // 添加按钮到工具栏
      macToolbar.appendChild(redButton);
      macToolbar.appendChild(yellowButton);
      macToolbar.appendChild(greenButton);
      
      // // 获取代码语言并添加到工具栏
      // let language = 'shell';  // 设置默认语言为 shell
      // const code = block.querySelector('code');
      // if (code && code.className) {
      //   const match = code.className.match(/language-(\w+)/);
      //   if (match && match[1]) {
      //     language = match[1];
      //   }
      // }
      
      // // 添加语言标签
      // const langLabel = document.createElement('span');
      // langLabel.className = 'mac-window-language';
      // langLabel.textContent = language.toUpperCase();
      // macToolbar.appendChild(langLabel);
      
      // 插入到代码块前面
      block.parentNode.insertBefore(macToolbar, block);
    });
    
    // 查找所有代码块（重新查询，包括已添加工具栏的）
    
    codeBlocks.forEach((block, index) => {
      // 避免重复添加
      if (block.nextElementSibling?.classList.contains('code-toolbar')) {
        return;
      }
      let language = block.className.replace("highlight ", "")
      const code = block.textContent || block.innerText;

      if ((code && !language) || (code && language === "plaintext")){
        language = detectLanguagePlus(code).language
      }
      // 创建工具栏
      const toolbar = document.createElement('div');
      toolbar.className = 'code-toolbar';
      
      // 添加语言标签
      const langLabel = document.createElement('span');
      langLabel.className = 'code-language';
      // langLabel.textContent = `代码语言:  ${language}`;
      langLabel.textContent = language.toUpperCase();
      toolbar.appendChild(langLabel);
      
      // // 创建工具按钮组
      // const toolsGroup = document.createElement('div');
      // toolsGroup.className = 'code-tools';
      
      // 创建复制按钮
      const copyButton = document.createElement('a');
      copyButton.className = 'copy-button';
      copyButton.innerHTML = '<i class="fas fa-copy"></i>复制代码';
      copyButton.title = '复制代码到剪贴板';
      
      // 添加复制功能
      copyButton.addEventListener('click', (e) => {
        e.preventDefault();
        const codeElement = block.querySelector('code') || block.querySelector('td.code pre');
        copyCode(codeElement, block, copyButton);
      });
      
      // 组装工具栏
      // toolsGroup.appendChild(copyButton);
      toolbar.appendChild(copyButton);
      
      // 插入到代码块后面
      block.parentNode.insertBefore(toolbar, block.nextSibling);
    });
    
    return codeBlocks.length > 0;
  }
  
  /**
   * 复制成功后的处理
   */
  function copySuccess(button, block) {
    button.innerHTML = '<i class="fas fa-check"></i>已复制';
    button.classList.add('success');
    
    // 显示提示信息
    showToast('代码已复制到剪贴板', 2000, 'success');
    
    // 2秒后恢复
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-copy"></i>复制代码';
      button.classList.remove('success');
    }, 2000);
  }
  
  /**
   * 复制失败后的处理
   */
  function copyError(button, block) {
    button.innerHTML = '<i class="fas fa-times"></i>复制失败';
    button.classList.add('error');
    
    showToast('复制失败，请重试', 3000, 'error');
    
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-copy"></i>复制代码';
      button.classList.remove('error');
    }, 2000);
  }
  
  /**
   * 显示提示消息
   */
  function showToast(message, duration, type) {
    // 移除现有的toast
    const existingToast = document.querySelector('.toast-message');
    if (existingToast) {
      document.body.removeChild(existingToast);
    }
    
    // 创建新的toast
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    
    if (type === 'success') {
      toast.classList.add('success');
    } else if (type === 'error') {
      toast.classList.add('error');
    }
    
    toast.textContent = message;
    document.body.appendChild(toast);
    
    // 显示动画
    setTimeout(function() {
      toast.classList.add('show');
    }, 10);
    
    // 自动消失
    setTimeout(function() {
      toast.classList.remove('show');
      setTimeout(function() {
        if (document.body.contains(toast)) {
          document.body.removeChild(toast);
        }
      }, 300);
    }, duration);
  }
})();