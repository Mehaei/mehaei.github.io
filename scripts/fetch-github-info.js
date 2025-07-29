/*
 * @Author: 胖胖很瘦
 * @Date: 2025-04-01 10:59:53
 * @LastEditors: 胖胖很瘦
 * @LastEditTime: 2025-07-25 10:10:11
 */
/**
 * 获取GitHub用户信息并保存到_data目录
 */
const https = require('https');
const fs = require('fs');
const path = require('path');

// 确保_data目录存在
const dataDir = path.join(__dirname, '../source/_data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// GitHub API请求选项
const options = {
  hostname: 'api.github.com',
  path: '/users/Mehaei',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js GitHub Info Fetcher'
  }
};

// 获取用户仓库信息的选项
const reposOptions = {
  hostname: 'api.github.com',
  path: '/users/Mehaei/repos',
  method: 'GET',
  headers: {
    'User-Agent': 'Node.js GitHub Info Fetcher'
  }
};

// 获取用户信息和仓库信息
const getUserData = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
        // console.log(data)
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
};

const getReposData = () => {
  return new Promise((resolve, reject) => {
    const req = https.request(reposOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
            // console.log(data)
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });
    req.on('error', reject);
    req.end();
  });
};

// 获取所有数据并保存
Promise.all([getUserData(), getReposData()])
  .then(([githubData, reposData]) => {
    // 计算总star数
    const totalStars = reposData.reduce((sum, repo) => sum + repo.stargazers_count, 0);
    
    // 提取需要的信息
    const outputData = {
      login: githubData.login,
      name: githubData.name,
      avatar_url: githubData.avatar_url,
      html_url: githubData.html_url,
      public_repos: githubData.public_repos,
      followers: githubData.followers,
      following: githubData.following,
      bio: githubData.bio,
      created_at: githubData.created_at,
      stars: totalStars
    };
    
    // 保存到文件
    const outputPath = path.join(dataDir, 'github.json');
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    console.log(`GitHub data saved to ${outputPath}`);
  })
  .catch(error => {
    console.error('Error fetching GitHub data:', error.message);
  });
