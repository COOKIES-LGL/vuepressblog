---
title: SSR与流式渲染
---

## 什么是 SSR？

SSR —— Server Side Render 即在用户请求页面时，页面的后台服务直接返回已经填充好数据的完整 HTML。

## 什么是流式渲染？

流式渲染 —— Stream Render 即在页面的后台服务返回完整 HTML 时以**数据流 (Stream)** 的方式返回数据，让后台服务可根据需要分批 (chunk) 返回数据，浏览器也能够按照接收到的分块数据分别解析、渲染 HTML，而无需等整个 HTML 完全载入。

## 浏览器渲染过程的关键特性

在开始探索 SSR 原理之前，我们需要先了解以下几个浏览器渲染的关键特性，这几个特性对 SSR 至关重要 (如对浏览器渲染的完整过程感兴趣可参考 [MDN 文章](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E9%A2%84%E5%8A%A0%E8%BD%BD%E6%89%AB%E6%8F%8F%E5%99%A8)或[像素的一生 (视频)](https://www.bilibili.com/video/av35265997?from=search&seid=13293252626118480917))：

1. 浏览器收到 HTML 数据的第一块，它就可以开始解析收到的信息并尝试进行渲染，而不会等待整个 HTML 文件完成下载
2. 浏览器通过预加载扫描器在后台并行下载或执行静态资源，不必等到 HTML 解析器解析到对外部资源的引用再来请求它
3. 默认情况下，浏览器遇到 JS 脚本会暂停 DOM 解析，等待 JS 下载完成后立即执行，但可以在 `script` 标签上添加 `defer` 属性不再阻塞 DOM 解析，而是并行下载 JS 并将 JS 的执行实际延迟到 DOM 完成渲染之后 (即 `DOMContentLoaded` 事件之前)

## CSR 到 SSR 改变了什么？

在 CSR 模式下，用户请求到的是一个空白的 HTML 文件，当 JS 下载完成且 DOM 构建完成后开始执行 JS，JS 首先会渲染一次 React 组件，完成后触发 React Component DidMount 事件，此时 JS 开始请求后端接口，并在接口请求成功后触发  React Component DidUpdate 事件将用户数据渲染到页面上，此时，用户可见真实的首屏内容，并且可与页面进行交互。因此用户看到首屏内容同时依赖 HTML 文件下载、JS 下载和执行、接口请求数据几个步骤。

在 SSR 模式下，用户请求页面后，服务端会在内网调用后端接口，然后直接运行服务本地的 JS 文件将用户首屏内容填充到 HTML 中返回给用户，当用户接收到 HTML 后，浏览器渲染并下载 JS 资源，此时用户可见首屏内容，等待 JS 下载完成后，JS 运行，将已有的 DOM 节点与 React Component 进行绑定并触发 React Component DidMount 事件 (此过程称为 [hydate](https://reactjs.org/docs/react-dom.html#hydrate))，由于服务端已经调用过后端接口了，不再需要浏览器环境下请求接口，因此可直接与页面进行交互。

从整个流程看，SSR 页面性能的提升主要在以下几点：

1. SSR 不依赖远程下载 JS 文件，可以直出 HTML 可缩短首屏时间减少用户等待
2. SSR 内网接口调用相比用户公网环境调用 RT 更短，网络更稳定 (从线上真实数据看，以批发为例 HTTP 接口内网调用[均值为 110ms，95线为 308ms](https://monitor.xxx.net/server/transaction-new?end_time=1631503796000&ip=10.22.155.101&service=mobile-wholesale-ssr-activity&serviceIndexPath=transaction&time_range=1d#5324084ba447c0d94ce59f4e37b09774))
3. 由于 SSR 模式下 React 可以直接使用 Node 准备好的数据进行 hydate，比 CSR 模式下少一次 Update (这次 Update 会渲染首屏 DOM)

因此，SSR 模式下主要提升点在首屏时间，对可交互时间提升有限。

:::tip CSR 与 SSR 在代码层面的差异
- SSR 环境下不会执行包括 `useEffect` `useLayoutEffect` 在内的副作用 hooks
- SSR 环境下不会执行 `componentDidMount` 生命周期
- SSR 环境是静态渲染 —— 即不会有任何 update state 发生，因此也不会执行 `componentDidUpdate` 或类似的生命周期
- SSR 环境在 Nodejs runtime 执行，不会有 `window`、`document` 等 BOM 或 DOM API，在 Node 环境下运行这些代码会导致**渲染出错**，请确保正确使用 BOM 和 DOM
- 当 SSR 失败，页面会自动降级到 CSR 渲染，此时 框架 传递给页面组件的 fetch 状态一开始为 `pending`，然后更新为 `resolved`，换句话说，框架也是通过 state 异步传递接口数据的，因此使用接口数据请做好判空校验，最佳实践请查看[发送请求](/docs/usage/fetch)
:::

## 从 SSR 到 Stream SSR

首屏的提升效果是非常显著的，但我们希望尽可能提升可交互时间。从上文的分析可见，在 SSR 模式下，可交互时间受到 JS 下载、首屏 DOM 渲染两重因素影响。因此，**提升可交互时间核心关键即优化 JS 下载和首屏 DOM 渲染。**

### 优化 JS 加载耗时

优化 JS 加载有两个方向，一是提前 JS 加载时机、更早的开始下载资源，二是减小 JS 体积大小。

#### 1\. 提前 JS 加载时机

我们简单分析可以知道: 1\. 每个页面都有自己的 JS/CSS 文件，这些 JS/CSS 不受用户、接口数据、DOM 内容等影响; 2\. JS 执行依赖 DOM 构建，JS 下载不依赖。而在 SSR 模式下，浏览器下载 JS/CSS 文件却需要等待服务端请求后端填充好数据返回给浏览器之后才能开始，那么我们是否可以前置 JS/CSS 下载不再让它受服务端填充数据影响呢？

答案是可以的，依据上面介绍的[浏览器的渲染过程关键特性](#浏览器渲染过程的关键特性)，浏览器边加载边解析渲染 HTML (除非过程中遇到阻塞的 JS 脚本执行)，因此我们将 HTTP 传输数据从完整的字符串传输改为 Stream 传输，在服务接收到请求后直接将包含 JS/CSS 标签的 head 部分优先返回给浏览器，此时 JS 标签会包含 `defer` 属性，浏览器接收到 head 标签内容后开始下载 JS/CSS 文件，与此同时，服务端填充用户数据再将剩下的 body 部分返回给浏览器并关闭 HTTP 链接，
**此过程将 HTML 分为多个 chunk 分别传输给浏览器，即 `Stream SSR`**。这样，**实现了浏览器 JS/CSS 下载解析、服务端填充数据并行执行，JS 加载时机得以提前。**

#### 2\. 减小 JS 体积

通过上一步的方案后我们优化了 JS 的下载时机，但真实线上网络环境复杂，大体积的 JS bundle 大小依然会拖垮我们的可交互时间，因此，我们通过 webpack bundle analyzer 分析了当前业务 JS 依赖，看是否有优化空间：

我们发现当前打包方案存在几个问题：

1. CLI 主动的将依赖拆封为多个 js 文件导致部分依赖被重复打包
2. 部分公共包和业务都存在冗余依赖、重复依赖、过度依赖、循环依赖等问题
3. 部分项目错误使用 lodash 因此无法有效利用 tree-shaking (构建工具提供的一项基于模块分析将未使用到的代码清理以减小包体积的技术)
4. 部分依赖存在多个版本导致重复依赖
5. 业务代码本身有优化空间

最终我们通过优化打包策略 (针对1) 、优化公共包依赖 (针对2) 、推动业务改造 (针对3、4、5)，最终所有项目 JS 体积都至少减小了 600k。

### 优化首屏 DOM 渲染耗时

首屏 DOM 渲染包含浏览器下载 HTML、解析 HTML、构建 DOM&CSSOM、调用 [Skia](https://skia.org/) 图像绘制引擎绘制页面，在整个过程中，HTML 字节数量都与上述步骤强相关。因此，**减少首屏 HTML 字节数量 (即首屏 HTML 体积) 是优化首屏 DOM 渲染耗时的核心手段**。

商家移动端将页面 HTML size 指标阈值制定为 100K 以下。为此，框架提供了 [useLazyLoad Hooks](/docs/api/useLazyLoad) 和[ LazyLoad 懒加载组件 ](/docs/api/useLazyLoad)共业务方使用，延迟非首屏内容渲染。同时在团队内多次分享，宣导长列表页面优化手段。

## 总结

在经历上述优化后，最终实现了Stream SSR。**该 Stream SSR 方案当前社区内没有任何一个 SSR 框架实现，目前仅有 C 端 通过该方案优化 T16 性能。**











