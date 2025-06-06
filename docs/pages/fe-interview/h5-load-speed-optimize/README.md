## 性能优化清单

### 优化总览

<img :src="$withBase('./pages-assets/performance.png')" class="show-small-in-center">

**_ 经典的 H5 页面加载包含以下过程： _**

- webview 初始化
- html 加载
- HTTP 连接建立
- 请求
- html 解析和渲染
- 解析 html
- css/js
- 渲染
- 解析 js
- 可交互

**_ 各个过程的优化思路可以归纳为四点： _**

- 串行改并行；
- 缓存：最大化利用缓存；
- 过程提前：能提前执行尽可能提前；
- 尽可能缩减每个过程的耗时；

**_ 优化手段 _**
客户端优化

- 预创建：提前创建 WebView
- 预连接：冷启动下提前发起一起请求，预热通道，预创建是前提；
- 预请求：Api 请求与 WebView 初始化、html 加载并行；

**_ 首屏性能优化 _**

::: details
目标：尽快让用户看到首屏主要内容，避免白屏等待
:::

1. ssr 方案

- 服务端
  流式渲染：将 html 从服务端分块输出，能够缩短首字节和首屏时间，html 头部的提前输出能够提前 css/js 等重要资源的加载
  请求并行：首屏依赖的数据接口尽可能并行发出，缩短请求等待时间
  分块渲染：针对首屏依赖的慢请求，让其对应的模块先用骨架输出给客户端展示。待慢请求返回后，再生成内联 js 将真实内容替换骨架。
  减少渲染逻辑：
  非首屏、纯客户端组件只在客户端渲染，如返回顶部、前往 app 等组件
  商品列表组件减少首屏渲染个数，减少数据量
- 客户端
  首屏 css 头部输出，js 在首屏后执行（插入在 html 底部 或 添加 defer 或在下一帧插入执行），避免阻塞页面渲染
  IOS 渲染优化：body 顶部添加空白字符优化渲染、js 下一帧执行优化图片渲染

2. 其他方案

- 客户端预渲染预请求：客户端预载不可见 webview 加载目标页面，待用户真正需要进入时直接展示已加载好的页面内容
- html 强缓存：服务端设置强缓存头，让客户端缓存 html，后续客户端直接取缓存 html 渲染并通过 js 动态更新页面数据。适合首页等场景
- 带图加载：将前置页面加载过的图片资源，直接作为后续页面的头图展示，可利用缓存快速展示。适合商详等场景
- Critical CSS：​Critical CSS​
- 资源 preload：​【资源 Prefetch】端内静态资源预加载 - 高流量页面全覆盖 ​
- JS 分片执行：​JS 分片初始化-接入 ​
- 商品图规范：​ 商品图规范 resizeWidth 统一 ​
- JS 体积优化：​initial js bundle 体积优化 ​

**_ 可交互时间优化 _**

::: details
目标：尽快开始响应用户的操作，避免操作无效
:::

加速 js 加载
cdn
客户端资源包
精简 js 体积
模块懒加载（可依赖 loadable components 提供的能力）
非首屏依赖的 js 模块延迟加载
特定环境、特定条件依赖的 js 模块可选加载，如风控包可仅在非 app 环境或 app 不支持提供风控 token 的版本才加载
大模块精简：preact 替换 react，简单场景移除 mobx
polyfill 动态加载：针对 ua 判断，按需引入 polyfill
部署 es2015 脚本：针对现代浏览器的脚本优化方案
渐进式补水：逐步进行补水，先补水必要的部分（首屏、用户极有可能交互的部分），再根据适当的时机补水其他部分

**_ 交互体验优化 _**

::: details
目标：尽快给用户操作反馈，避免卡顿，包括 tab 流畅切换、滚动不掉帧等
:::

- 图片懒加载：不可见图片进入可视区域才开始加载，避免影响可视区资源加载
- 虚拟列表：不在可视范围的内容使其避免渲染，可优化多 tab+长列表等场景，
- 骨架：异步请求数据未返回之前，可用美丽的骨架进行占位
- 回退缓存：html 快照实现回退定位，
- 视频转.webp 动图：加快加载
- tab 手势横滑

### raf(requestAnimationFrame) 加载 js

[rafScript](./rafScript)

### online 事件触发全局图片重试

[imagesRetryGuard](./imagesRetryGuard)

### DisableTranslate 禁止翻译

[disableTranslate](./disableTranslate)

### preloadLinks 预加载链接

[preloadLinks](./preloadLinks)

### smallScroll 流畅滚动

[smallScroll](./smallScroll)
