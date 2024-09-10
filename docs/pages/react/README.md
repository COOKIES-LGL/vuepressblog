---
home: false
sidebar: false
---

## react 使用笔记

### 技术文档列表

- [React-Hook](./hooks) <span style="color:#bbb; float:right">2022-08-10</span>
- [默认属性组件](./defaultPropHOC) <span style="color:#bbb; float:right">2023-08-10</span>
- [React 常用 npm 包](./npmPackage) <span style="color:#bbb; float:right">2023-09-10</span>
- [React ssr](./ssr) <span style="color:#bbb; float:right">2023-09-10</span>
- [React Ts 类型](./react-ts) <span style="color:#bbb; float:right">2023-12-10</span>
- [React Schedule 核心](https://juejin.cn/post/7208222652619800613#heading-5) <span style="color:#bbb; float:right">2023-12-10</span>
- [React 流式渲染](https://zhuanlan.zhihu.com/p/639505410?utm_id=0) <span style="color:#bbb; float:right">2024-02-09</span>
- [React 服务端组件](https://sorrycc.com/why-react-server-components/) <span style="color:#bbb; float:right">2023-12-19</span>
- [Vuex、Flux、Redux、Redux-saga、Dva、MobX](https://zhuanlan.zhihu.com/p/53599723) <span style="color:#bbb; float:right">2023-11-10</span>
- [Recoil](https://juejin.cn/post/7259168207055175739) <span style="color:#bbb; float:right">2023-02-11</span>
- [mobx 概要梳理](https://article.juejin.cn/post/6914179461957025800) <span style="color:#bbb; float:right">2024-02-10</span>
- [React Schedule 核心流程图](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493c087e2fd64e1a8c552f16927192f6~tplv-k3u1fbpfcp-watermark.image?) <span style="color:#bbb; float:right">2023-12-19</span>

- [Schedule 核心流程图](https://zhuanlan.zhihu.com/p/450267610?utm_id=0) <span style="color:#bbb; float:right">2023-12-12</span>
- [React-router 快速入门](https://segmentfault.com/a/1190000014294604) <span style="color:#bbb; float:right">2023-11-10</span>
- [React 思想](https://react.iamkasong.com/preparation/idea.html#react-%E7%90%86%E5%BF%B5) <span style="color:#bbb; float:right">2023-12-10</span>

### React Scheduler 使用 MessageChannel 的原因

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

### 开启 BFCache

BFCache（Back-Forward Cache）是浏览器的一种机制，在 Safari 和 Chrome 中都得到了很好的支持，它利用内存缓存来存储用户访问过的页面状态。  
当用户在浏览器中执行后退或前进操作时，浏览器可以从 BFCache 中快速加载页面，而不是重新请求服务器并重新渲染页面。  
这意味着用户可以瞬间回到之前访问的页面，无需等待页面重新加载。
它不是 HTTP 意义上的“缓存”，不是“磁盘缓存”意义上的“缓存”，而是将解码资源保存在内存中，以便在多个网页之间共享。  
[被忽略的缓存-BFCache](https://cloud.tencent.com/developer/article/2350456?areaId=106001)

### react schedule 原理

```js
const localSetTimeout = typeof setTimeout === "function" ? setTimeout : null;
const localClearTimeout = typeof clearTimeout === "function" ? clearTimeout : null;
const localSetImmediate = typeof setImmediate !== "undefined" ? setImmediate : null;

let startTime; // 记录开始时间
let sum = 0;
const currentIndex = 0; // 当前遍历的索引
const totalCount = 20000000;

const getCurrentTime = () => Date.now();

// 调度应该被中断吗
function shouldYieldToHost() {
  const timeElapsed = getCurrentTime() - startTime;
  // 如果当前时间减去开始时间小于 5ms, 那么继续调度
  if (timeElapsed < 5) {
    return false;
  }
  return true;
}

const performWorkUntilDeadline = () => {
  const currentTime = getCurrentTime();
  startTime = currentTime;
  const hasTimeRemaining = true; // 有剩余时间

  let hasMoreWork = true;
  try {
    // 这里执行的函数就是 flushWork，flushWork 如果返回一个 true 那么表示还有任务
    // 这里的 是 workLoop 循环里 return 的， 如果 return true, 那么表示还有剩余的任务，只是时间用完了，被中断了
    hasMoreWork = flushWork();
  } finally {
    if (hasMoreWork) {
      schedulePerformWorkUntilDeadline();
    } else {
    }
  }
};

let schedulePerformWorkUntilDeadline;
// react 中调度的优先级  setImmediate > MessageChannel > setTimeout
if (typeof localSetImmediate === "function") {
  schedulePerformWorkUntilDeadline = () => {
    localSetImmediate(performWorkUntilDeadline);
  };
} else if (typeof MessageChannel !== "undefined") {
  const channel = new MessageChannel();
  const port = channel.port2;
  channel.port1.onmessage = performWorkUntilDeadline;
  schedulePerformWorkUntilDeadline = () => {
    port.postMessage(null);
  };
} else {
  schedulePerformWorkUntilDeadline = () => {
    localSetTimeout(performWorkUntilDeadline, 0);
  };
}

const flushWork = () => {
  return workLoop();
};

const workLoop = () => {
  while (true) {
    try {
      work();
    } catch (error) {
    } finally {
      if (currentIndex < totalCount) {
        return true;
      } else {
        return false;
      }
    }
  }
};
const work = () => {
  for (let currentIndex = 0; currentIndex < totalCount && !shouldYieldToHost(); currentIndex++) {
    sum += currentIndex;
  }
};
performWorkUntilDeadline();
```

### MarkDown 使用指南

- [MarkDown](../blog-daily/use-markdown) <span style="color:#bbb; float:right">2021-06-24</span>
