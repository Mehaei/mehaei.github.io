/* Remove executable HTML from Markdown before it is written to the static site. */
function sanitize(html) {
  return String(html || '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<(?:iframe|object|embed|base)\b[^>]*>[\s\S]*?<\/(?:iframe|object|embed)\s*>/gi, '')
    .replace(/<(?:iframe|object|embed|base)\b[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    .replace(/\s(href|src)\s*=\s*(["'])\s*javascript:[\s\S]*?\2/gi, ' $1="#"');
}

hexo.extend.filter.register('after_post_render', function (data) {
  data.content = sanitize(data.content);
  data.excerpt = sanitize(data.excerpt);
  return data;
});
