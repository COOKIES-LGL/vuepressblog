---
home: false
sidebar: false
---

## react 使用笔记

### 技术文档列表

- [React-Hook](./hooks) <span style="color:#bbb; float:right">2022-08-10</span>
- [React 默认属性组件](./default-prop-hoc) <span style="color:#bbb; float:right">2023-08-10</span>
- [React 常用 npm 包](./npm-package) <span style="color:#bbb; float:right">2023-09-10</span>
- [React ssr](./ssr) <span style="color:#bbb; float:right">2023-09-10</span>
- [React Ts 类型](./react-ts) <span style="color:#bbb; float:right">2023-12-10</span>
- [React HOC](./react-hoc) <span style="color:#bbb; float:right">2024-09-10</span>
- [React 19](./react-19) <span style="color:#bbb; float:right">2024-12-10</span>
- [React Schedule](./react-schedule) <span style="color:#bbb; float:right">2023-12-10</span>
- [React 流式渲染](https://zhuanlan.zhihu.com/p/639505410?utm_id=0) <span style="color:#bbb; float:right">2024-02-09</span>
- [React 服务端组件](https://sorrycc.com/why-react-server-components/) <span style="color:#bbb; float:right">2023-12-19</span>
- [Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723) <span style="color:#bbb; float:right">2023-11-10</span>
- [Recoil](https://juejin.cn/post/7259168207055175739) <span style="color:#bbb; float:right">2023-02-11</span>
- [Mobx 概要梳理](https://article.juejin.cn/post/6914179461957025800) <span style="color:#bbb; float:right">2024-02-10</span>
- [React-router 快速入门](https://segmentfault.com/a/1190000014294604) <span style="color:#bbb; float:right">2023-11-10</span>
- [React 思想](https://react.iamkasong.com/preparation/idea.html#react-%E7%90%86%E5%BF%B5) <span style="color:#bbb; float:right">2023-12-10</span>

### Fiber 架构

[React Fiber 架构:关于 Fiber 树的一切](https://zhuanlan.zhihu.com/p/525244896)  
[React Fiber 架构:自底向上盘一盘 Scheduler](https://zhuanlan.zhihu.com/p/538378360)  
[React Fiber 架构:“更新”到底是个啥](https://zhuanlan.zhihu.com/p/546865854)

### 开启 BFCache

BFCache（Back-Forward Cache）是浏览器的一种机制，在 Safari 和 Chrome 中都得到了很好的支持，它利用内存缓存来存储用户访问过的页面状态。  
当用户在浏览器中执行后退或前进操作时，浏览器可以从 BFCache 中快速加载页面，而不是重新请求服务器并重新渲染页面。  
这意味着用户可以瞬间回到之前访问的页面，无需等待页面重新加载。
它不是 HTTP 意义上的“缓存”，不是“磁盘缓存”意义上的“缓存”，而是将解码资源保存在内存中，以便在多个网页之间共享。  
[被忽略的缓存-BFCache](https://cloud.tencent.com/developer/article/2350456?areaId=106001)

### React 渲染性能优化

React 渲染性能优化的三个方向，其实也适用于其他软件开发领域，这三个方向分别是:

- 减少计算的量。 -> 对应到 React 中就是减少渲染的节点 或者 降低组件渲染的复杂度
- 利用缓存。-> 对应到 React 中就是如何避免重新渲染，利用函数式编程的 memo 方式来避免组件重新渲染
- 精确重新计算的范围。 对应到 React 中就是绑定组件和状态关系, 精确判断更新的'时机'和'范围'. 只重新渲染'脏'的组件，或者说降低渲染范围

### React diff

diff 三个假设提升 diff 效率
1、假设一：不同类型的节点元素会有不同的形态
2、假设二：节点不会进行跨父节点移动
3、假设三：用户会给每个子节点提供一个 key，标记它们“是同一个”

- 只有父节点相互复用，才会触发子节点 Diffing，所以跨父节点的移动是铁定 Diffing 不到的
- 复用的条件是 key 和 type 都相同，所以 key 能提升复用率
- Diffing 过程中会把结果（操作时 effectTag 标记 Placement 还是 Update 还是 Deletion）以 Effect 的形式挂到节点上

### MarkDown 使用指南

- [MarkDown](../blog-daily/use-markdown) <span style="color:#bbb; float:right">2021-06-24</span>
