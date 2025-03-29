/**
 * 网站统计数据初始化
 */
window.siteData = {
  totalPosts: <%= site.posts.length %>,
  totalCategories: <%= site.categories.length %>,
  totalTags: <%= site.tags.length %>
};