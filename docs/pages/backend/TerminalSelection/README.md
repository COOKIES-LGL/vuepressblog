---
sideBar: false
---

## 常见技术选型对照

### 日志管理系统

Logan 和 Sentry 都是流行的日志管理系统

Logan 是由美团点评集团推出的大前端日志系统，旨在提供高效的日志收集、存储、上报以及可视化展示服务。它支持 iOS、Android、Web 等多个平台，并提供了端上日志收集存储、Web SDK、后端日志存储分析 Server 以及日志分析平台 LoganSite 等多个组件。
**跨平台支持、高效稳定、可视化界面**

Sentry 是一个现代化的实时事件日志监控、记录和聚合平台。它能够捕捉到 stack trace、stack locals、preceding events 和引发异常的 commit 号等信息，帮助开发者快速发现和解决错误。
**实时监控、丰富的上下文信息、自动合并重复问题**

### Clarity 网站业务埋点分析

[Clarity](https://clarity.microsoft.com/)

- 用户会话重放：记录用户的操作过程，支持回放以分析用户行为。
- 热力图：可视化用户的点击和滚动行为，帮助优化页面布局。
- 点击地图：显示用户在页面上的点击位置，分析用户兴趣点。
- 性能分析：提供页面加载时间和渲染性能数据。
- 隐私保护：数据匿名化处理，不追踪个人敏感信息

### 网站性能分析

[PageSpeed](https://pagespeed.web.dev/)
Google 家的 PageSpeed Insights，可以用来分析前端网页性能。  
[LightHouse](https://developer.chrome.com/docs/lighthouse/overview/)
Google 出品的提高网页质量工具，包括但不限于分析网页性能、SEO、可访问性等。
