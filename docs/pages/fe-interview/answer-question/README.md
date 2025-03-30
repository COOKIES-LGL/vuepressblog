---
home: false
sidebar: false
---

### 为啥使用 img gif 做埋点

- img 兼容性好
- 无需挂载到页面上，反复操作 dom
- img 的加载不会阻塞 html 的解析，但 img 加载后并不渲染，它需要等待 Render Tree 生成完后才和 Render Tree 一起渲染出来
- 注：通常埋点上报会使用 gif 图，合法的 GIF 只需要 43 个字节

### 为什么 Vue 不需要 Fiber

响应式系统：Vue 的依赖追踪机制已实现高效更新，无需通过 Fiber 的复杂调度解决性能问题。
同步更新足够高效：在大多数场景下，Vue 的同步批量更新不会导致主线程卡顿（除非组件树异常复杂）。
设计取舍：Vue 选择简化开发者体验，通过编译时优化（如静态提升）和运行时优化（如 Proxy 响应式）规避性能瓶颈。
<img :src="$withBase('./images/daily-blog/vue-diff-react1.png')" class="show-in-center">

### 跨域知识点

跨域并不是请求发不出去，请求能发出去，服务端能收到请求并正常返回结果，只是结果被浏览器拦截了
OPTIONS 请求次数过多也会损耗性能，所以要尽量减少 OPTIONS 请求，可以让服务器在请求返回头部添加

```js
Access-Control-Max-Age: Number // 数字 单位是秒
```

### 为啥 React 在 componentDidCatch 上报错误

- getDerivedStateFromError 在渲染阶段被调用，返回组建 state，用于渲染备用 UI
- componentDidCatch 在提交阶段执行，进行错误上报。
- React 通过 getDerivedStateFromError 和 componentDidCatch 的分离设计，实现了错误处理中状态更新与副作用执行的解耦，既保证了渲染阶段的稳定性。

### common.js 和 es6 中模块引入的区别

- 1、CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- 2、CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- 3、CommonJs 是单个值导出，ES6 Module 可以导出多个
- 4、CommonJs 是动态语法可以写在判断里，ES6 Module 静态语法只能写在顶层
- 5、CommonJs 的 this 是当前模块，ES6 Module 的 this 是 undefined
