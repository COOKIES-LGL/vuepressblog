
### rel属性详解

#### rel="alternate"

* alternate 是交替、替换，标识链接有替换内容
```HTML
<!-- 可以用来告知 SEO、屏幕阅读器有 H5 端 -->
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.xxx.com/" />
<!-- rel="alternate" 定义网站的替换样式 -->
<link href="default.css" rel="stylesheet" type="text/css" title="默认">
<link href="red.css" rel="alternate stylesheet" type="text/css" title="红色">
<link href="green.css" rel="alternate stylesheet" type="text/css" title="绿色">
<!-- 上述 3 个 css 文件均会加载，但 red.css 和 green.css 的优先级为 Lowest, 即在空闲时加载，不会影响页面性能
使用时，切换 disabled 即可，例如要启用红色的皮肤样式，其他的设置 disabled 为 true，红色的设置 disabled 为 false（注意 disabled 为 DOM 属性，link 标签上没有这个属性） -->
<script>
document.querySelector('link[href="red.css"]').disabled = false;
</script>
```

#### rel="canonica"

``` HTML
<link rel="canonical" href="https://edu.51cto.com" />
指定规范网页，用在 link 中; 告知搜索引擎，以哪个地址为规范版本，降低其他地址的抓取频率
比如你的站点可以通过多个域名访问、或者既有移动端又有 PC 端，这时候就能设定你想要的地址为搜索引擎优化抓取
```

#### rel="nofollow"

禁止搜索引擎追踪，一般不重要的链接设置，防止搜索引擎爬取从而降低主要内容的权重
比如首页，应该只保留列表页，详情页，友链的链接追踪；对于如logo回到首页，一些不重要的链接进入登录后的页面等，均需要设置 nofollow

#### DNS 优化
rel="dns-prefetch" DNS 预读取
rel="preconnect" DNS 预链接
rel="preload" 强制浏览器提前加载资源 优先级为 high
rel="prefetch" 资源预拉取 优先级为 low
rel="prerender" 预渲染

``` HTML
<meta http-equiv="x-dns-prefetch-control" content="on"> 
<link rel="preconnect" href="https://xxx.com/"> 
<link rel="dns-prefetch" href="https://xxx.com/"> 
<link rel="preload" href="https://xxx.com/"> 
<link rel="prefetch" href="https://xxx.com/"> 
```

#### 防盗链
rel="noreferrer"
rel="noopener"

