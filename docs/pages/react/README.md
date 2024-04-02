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
* [React Schedule 核心流程图](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493c087e2fd64e1a8c552f16927192f6~tplv-k3u1fbpfcp-watermark.image?)

* [Schedule 核心流程图](https://zhuanlan.zhihu.com/p/450267610?utm_id=0)
* [React-router快速入门](https://segmentfault.com/a/1190000014294604)

### 服务端组件和 SSR 有哪些不同
::: tip
在使用 SSR 时，你需要先在服务端完成 HTML 的渲染，然后再将该 HTML 发送到客户端。然后此过程只会发生在页面的初次访问时（也就是初始化加载的时候）。至此之后，你的 React 应用在数据更新展示等行为表现上和常规的 React 应用没有任何区别。在展示更新之后的数据时，都是要么从客户端发送一个网络请求，要么页面整体刷新，但不管采用哪种方式，都会导致组件的二次渲染和状态丢失，从而影响性能和客户体验。
相对而言，在使用服务端组件时，你的组件在服务端完成渲染，然后通过自定义的协议发送到客户端（如下图）。React 拿到数据时，将新的 UI 整体的合并到客户端 UI 树里面，此过程不会对客户端其他状态产生影响。此过程可以无限次数的执行。React 通过整体 UI 模块更新的方式，达到保持客户端状态的目的，极大的增强了用户体验。
:::

### MarkDown使用指南
*  [MarkDown](../blog-daily/use-markdown)  <span style="color:#bbb; float:right">2021-06-24</span>
