
## 前端SEO 可以进行的优化手段

### 提升站点加载速度

### 使用语义化的标签

### 增加站点内部链接和导航

### 配置精细的description和keyword meta标签

### 可以使用Open Graph Protocol（OG）标签来提升社交媒体平台上页面的展示效果

``` html
<!DOCTYPE html>
<html lang="zh-CN" prefix="og: http://ogp.me/ns#">
<head>
    <meta charset="UTF-8">
    <title>页面标题</title>
    <!-- OG标签定义页面信息 -->
    <meta property="og:title" content="页面标题" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="http://www.example.com/" />
    <meta property="og:image" content="http://www.example.com/image.jpg" />
    <meta property="og:description" content="页面描述" />
    <meta property="og:site_name" content="网站名称" />
    <!-- 其他SEO相关标签 -->
    <meta name="description" content="页面描述">
    <meta name="keywords" content="关键词1, 关键词2">
    <!-- 其他移动友好设置、样式文件等 -->
</head>
<body>
    <h1>页面主标题</h1>
    <p>页面内容...</p>
    <!-- 页面其他内容 -->
</body>
</html>
```

### 使用sitemap

使用sitemap（站点地图），画一张地图，有目的地引导搜索引擎去发掘我们的网站。通常是一个xml文件，可以在线上去生成，也可以本地自己项目里生成
