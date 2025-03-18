---
home: false
---

- [React Schedule 核心流程图](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/493c087e2fd64e1a8c552f16927192f6~tplv-k3u1fbpfcp-watermark.image?) <span style="color:#bbb; float:right">2023-12-19</span>
- [React Schedule 核心](https://juejin.cn/post/7208222652619800613#heading-5) <span style="color:#bbb; float:right">2023-12-10</span>
- [Schedule 核心流程图](https://zhuanlan.zhihu.com/p/450267610?utm_id=0) <span style="color:#bbb; float:right">2023-12-12</span>

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

### React 渲染性能优化的三个方向

- `减少计算的量` 对应到 React 中就是减少渲染的节点 或者 降低组件渲染的复杂度。

- `利用缓存` 对应到 React 中就是如何避免重新渲染，利用函数式编程的 memo 方式来避免组件重新渲染。

- `精确重新计算的范围` 对应到 React 中就是绑定组件和状态关系, 精确判断更新的'时机'和'范围'. 只重新渲染'脏'的组件，或者说降低渲染范围,不要滥用 Context。
