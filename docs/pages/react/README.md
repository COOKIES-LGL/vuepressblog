---
home: false
---
## react使用笔记
### 技术文档列表
* [React-Hook](./hooks)  <span style="color:#bbb; float:right">2022-08-10</span>
* [默认属性组件](./defaultPropHOC)  <span style="color:#bbb; float:right">2023-08-10</span>
* [React常用npm包](./npmPackage)  <span style="color:#bbb; float:right">2023-09-10</span>
* [React Schedule 核心](https://juejin.cn/post/7208222652619800613#heading-5)
* [React 流式渲染](https://zhuanlan.zhihu.com/p/639505410?utm_id=0)
* [React 服务端组件](https://sorrycc.com/why-react-server-components/)
* [Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723)
* [Recoil](https://juejin.cn/post/7259168207055175739)
* [mobx概要梳理](https://article.juejin.cn/post/6914179461957025800)
* [React Schedule 核心流程图](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493c087e2fd64e1a8c552f16927192f6~tplv-k3u1fbpfcp-watermark.image?)

* [Schedule 核心流程图](https://zhuanlan.zhihu.com/p/450267610?utm_id=0)
* [React-router快速入门](https://segmentfault.com/a/1190000014294604)

### 服务端组件和 SSR 有哪些不同
::: tip
在使用 SSR 时，你需要先在服务端完成 HTML 的渲染，然后再将该 HTML 发送到客户端。然后此过程只会发生在页面的初次访问时（也就是初始化加载的时候）。至此之后，你的 React 应用在数据更新展示等行为表现上和常规的 React 应用没有任何区别。在展示更新之后的数据时，都是要么从客户端发送一个网络请求，要么页面整体刷新，但不管采用哪种方式，都会导致组件的二次渲染和状态丢失，从而影响性能和客户体验。
相对而言，在使用服务端组件时，你的组件在服务端完成渲染，然后通过自定义的协议发送到客户端（如下图）。React 拿到数据时，将新的 UI 整体的合并到客户端 UI 树里面，此过程不会对客户端其他状态产生影响。此过程可以无限次数的执行。React 通过整体 UI 模块更新的方式，达到保持客户端状态的目的，极大的增强了用户体验。
:::

### next.js 水合失败的原因
- HTML 元素错误嵌套导致
- 变量在服务端和客户端的取值不一致渲染了不同的html。
- 组件涉及倒计时和时间戳相关的要格外留意，可以统一使用服务端时间或者服务端不渲染。
- 时区不匹配，服务器上创建一个日期与客户端的不匹配。
- 还有随机key，有些弹窗会配置随机key 由 uuid生成

### React Scheduler使用MessageChannel的原因
:::tip
React Scheduler 使用 MessageChannel 的原因为：生成宏任务，实现：    
将主线程还给浏览器，以便浏览器更新页面。  
浏览器更新页面后继续执行未完成的任务。   

为什么不使用微任务呢？  
微任务将在页面更新前全部执行完，所以达不到「将主线程还给浏览器」的目的。

为什么不使用 setTimeout(fn, 0) 呢？
递归的 setTimeout() 调用会使调用间隔变为 4ms，导致浪费了 4ms。  

为什么不使用 rAF() 呢？  
如果上次任务调度不是 rAF() 触发的，将导致在当前帧更新前进行两次任务调度。  
页面更新的时间不确定，如果浏览器间隔了 10ms 才更新页面，那么这 10ms 就浪费了。  
:::

### 开启BFCache

BFCache（Back-Forward Cache）是浏览器的一种机制，在 Safari 和 Chrome 中都得到了很好的支持，它利用内存缓存来存储用户访问过的页面状态。  
当用户在浏览器中执行后退或前进操作时，浏览器可以从 BFCache 中快速加载页面，而不是重新请求服务器并重新渲染页面。  
这意味着用户可以瞬间回到之前访问的页面，无需等待页面重新加载。
它不是 HTTP 意义上的“缓存”，不是“磁盘缓存”意义上的“缓存”，而是将解码资源保存在内存中，以便在多个网页之间共享。  
[被忽略的缓存-BFCache](https://cloud.tencent.com/developer/article/2350456?areaId=106001)

### MarkDown使用指南
*  [MarkDown](../blog-daily/use-markdown)  <span style="color:#bbb; float:right">2021-06-24</span>
