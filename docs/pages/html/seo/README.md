## 前端 SEO 可以进行的优化手段

### 提升站点加载速度

### 使用语义化的标签

### 增加站点内部链接和导航

内链：从自己网站的一个页面指向另外一个页面，通过内链让网站内部形成网状结构，让蜘蛛的广度和深度达到最大化。

外链：在别的网站导入自己网站的链接，通过外链提升网站权重，提高网站流量，同时需要注意外链的质量，低质量的外链反而会影响到本站的排名。

### 标签跳转拦截

a 标签跳转拦截 js 进行页面跳转

### 配置精细的标签

配置精细的 description 和 keyword meta 标签

### OG 标签

可以使用 Open Graph Protocol（OG）标签来提升社交媒体平台上页面的展示效果

```html
<!DOCTYPE html>
<html lang="zh-CN" prefix="og: http://ogp.me/ns#">
  <head>
    <meta charset="UTF-8" />
    <title>页面标题</title>
    <!-- OG标签定义页面信息 -->
    <meta property="og:title" content="页面标题" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://www.example.com/" />
    <meta property="og:image" content="http://www.example.com/image.jpg" />
    <meta property="og:description" content="页面描述" />
    <meta property="og:site_name" content="网站名称" />
    <!-- 其他SEO相关标签 -->
    <meta name="description" content="页面描述" />
    <meta name="keywords" content="关键词1, 关键词2" />
    <!-- 其他移动友好设置、样式文件等 -->
  </head>
  <body>
    <h1>页面主标题</h1>
    <p>页面内容...</p>
    <!-- 页面其他内容 -->
  </body>
</html>
```

### 使用 sitemap

使用 sitemap（站点地图），画一张地图，有目的地引导搜索引擎去发掘我们的网站。  
通常是一个 xml 文件，可以在线上去生成，也可以本地自己项目里生成

###
