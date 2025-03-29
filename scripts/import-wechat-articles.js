/*
 * @Author: 胖胖很瘦
 * @Date: 2025-03-17 16:39:01
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-03-17 18:05:40
 */
/**
 * 微信公众号文章导入工具
 * 使用方法: node scripts/import-wechat-articles.js
 * 
 * 注意：此脚本设计为手动执行，而非随 Hexo 自动加载
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { promisify } = require('util');
const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// 创建命令行交互界面
function createInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// Promise化问题函数
function question(rl, query) {
  return new Promise(resolve => {
    rl.question(query, answer => {
      resolve(answer);
    });
  });
}

// 生成文件名（将标题转换为合法的文件名）
function generateFilename(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '') // 保留中文、英文、数字和空格
    .replace(/\s+/g, '-') // 空格替换为连字符
    .replace(/[\u4e00-\u9fa5]/g, char => encodeURIComponent(char)) // 对中文进行编码
    .substring(0, 100); // 限制长度
}

// 处理导入的主函数
async function importWechatArticle() {
  const rl = createInterface();
  
  try {
    console.log('\n=== 微信公众号文章导入工具 ===\n');
    
    // 获取文章信息
    const title = await question(rl, '输入文章标题: ');
    const filename = generateFilename(title);
    
    const category = await question(rl, '输入文章分类: ');
    const tagsInput = await question(rl, '输入文章标签 (用逗号分隔): ');
    const excerpt = await question(rl, '输入文章摘要: ');
    
    // 选择图片存储模式
    const imageStorageMode = await question(rl, '选择图片存储模式 (1: 文章资源文件夹, 2: 统一images目录) [默认:2]: ');
    const useImagesDir = imageStorageMode !== '1';
    
    console.log('\n现在请粘贴文章内容 (Markdown格式)...');
    console.log('粘贴完成后，请在新行输入 "END_OF_CONTENT" 并按回车结束输入\n');
    
    // 收集文章内容
    let content = '';
    rl.on('line', async (line) => {
      if (line.trim() === 'END_OF_CONTENT') {
        // 创建文章文件和资源目录
        const postDir = path.join(process.cwd(), 'source', '_posts');
        const postPath = path.join(postDir, `${filename}.md`);
        
        // 图片目录路径
        let imageDir;
        if (useImagesDir) {
          // 使用统一的 images 目录
          imageDir = path.join(process.cwd(), 'source', 'images', filename);
        } else {
          // 使用文章资源文件夹
          imageDir = path.join(postDir, filename);
        }
        
        // 确保目录存在
        if (!fs.existsSync(postDir)) {
          await mkdir(postDir, { recursive: true });
        }
        
        if (!fs.existsSync(imageDir)) {
          await mkdir(imageDir, { recursive: true });
        }
        
        // 构建Front-matter
        const date = new Date().toISOString().split('T')[0];
        const tagList = tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);
        
        const frontMatter = [
          '---',
          `title: ${title}`,
          `date: ${date}`,
          `updated: ${date}`,
          'categories:',
          `  - ${category}`,
          'tags:'
        ];
        
        tagList.forEach(tag => {
          frontMatter.push(`  - ${tag}`);
        });
        
        // 设置缩略图路径
        let thumbnailPath;
        if (useImagesDir) {
          thumbnailPath = `/images/${filename}/${filename}.png`;
        } else {
          thumbnailPath = `${filename}.png`;
        }
        
        frontMatter.push(`thumbnail: ${thumbnailPath}`);
        frontMatter.push(`excerpt: ${excerpt}`);
        frontMatter.push('---');
        frontMatter.push('');
        
        // 处理内容中的图片链接
        let processedContent = content.replace(
          /!\[(.*?)\]\((https?:\/\/.*?)\)/g, 
          (match, alt, url) => {
            const imageIndex = content.split(match).slice(0, -1).join(match).split('![').length;
            
            // 根据存储模式设置图片路径
            if (useImagesDir) {
              return `![${alt}](/images/${filename}/${filename}-${imageIndex}.png)`;
            } else {
              return `![${alt}](${filename}-${imageIndex}.png)`;
            }
          }
        );
        
        // 写入文件
        await writeFile(postPath, [...frontMatter, processedContent].join('\n'));
        
        console.log('\n=== 文章导入完成 ===');
        console.log(`文章已创建: ${postPath}`);
        
        // 图片保存提示
        if (useImagesDir) {
          console.log(`请将缩略图保存为: ${imageDir}/${filename}.png`);
          console.log(`文章中的图片请按顺序保存为: `);
          console.log(`  ${imageDir}/${filename}-1.png`);
          console.log(`  ${imageDir}/${filename}-2.png`);
          console.log(`  ... 以此类推`);
        } else {
          console.log(`请将缩略图保存为: ${imageDir}/${filename}.png`);
          console.log(`文章中的图片请按顺序保存为: `);
          console.log(`  ${imageDir}/${filename}-1.png`);
          console.log(`  ${imageDir}/${filename}-2.png`);
          console.log(`  ... 以此类推`);
        }
        
        console.log('\n完成后，运行 hexo clean && hexo server 查看效果');
        
        rl.close();
      } else {
        content += line + '\n';
      }
    });
  } catch (error) {
    console.error('导入过程中出错:', error);
    rl.close();
  }
}

// 只有在直接执行脚本时才运行导入功能，如果是被Hexo加载则不执行
if (require.main === module) {
  importWechatArticle();
}

// 导出函数，但不自动执行
module.exports = {
  importWechatArticle
}; 