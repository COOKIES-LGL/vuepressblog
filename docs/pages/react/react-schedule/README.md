---
home: false
---

- [React Schedule 核心](https://juejin.cn/post/7208222652619800613#heading-5) <span style="color:#bbb; float:right">2023-12-10</span>
- [Schedule 核心流程图](https://zhuanlan.zhihu.com/p/450267610?utm_id=0) <span style="color:#bbb; float:right">2023-12-12</span>

### React Scheduler 使用 MessageChannel 的原因

::: tip
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

### react 更新遍历

react 遍历是分内外两层循环，深度优先遍历，
Fiber 树是边创建边遍历的，每个节点都经历了「创建、Diffing、收集副作用（要改哪些节点）」的过程。其中，创建、Diffing 要自上而下，因为有父才有子；收集副作用要自下而上最终收集到根节点
：：：tip
整个遍历由 performUnitOfWork 发起，为深度优先遍历
从根节点开始，循环调 beginWork 向下爬树（黄色箭头，每个箭头表示一次调用）
到达叶子节点（beginWork 爬不下去）后，调 completeUnitOfWork 向上爬到下一个未遍历过的节点，也就是第一个出现的祖先兄弟节点（绿色箭头，每个箭头表示一次调用）
：：：
beginWork 负责创建、Diffing，completeUnitOfWork 负责收集副作用

- requestAnimationFrame 的作用：
  对齐浏览器渲染周期，优化任务执行时机；
  提供时间切片的时间基准。
- MessageChannel 的作用：
  通过宏任务分片实现任务中断与恢复,在浏览器事件循环中插入任务分片，确保主线程能及时响应高优先级事件

#### shouldYieldToHost 计算逻辑

‌1、帧时间阈值设定 ‌
浏览器每帧的渲染周期通常为 16.6ms（对应 60Hz 刷新率），React 默认将每帧的 ‌ 允许执行时间 ‌ 设置为 5ms，剩余时间预留给浏览器渲染和其他任务。
通过 requestAnimationFrame 获取当前帧的起始时间 frameTime，并计算截止时间 deadline = frameTime + 5ms57。

‌2、实时时间对比 ‌
在任务执行过程中，通过 performance.now() 或 Date.now() 获取当前时间 currentTime。
若 currentTime >= deadline，表示当前帧的可用时间已耗尽，shouldYieldToHost 返回 true，触发任务中断 15。

二、‌ 优先级影响中断阈值 ‌
不同优先级的差异 ‌
React 定义了多种任务优先级（如 ImmediatePriority、UserBlockingPriority 等），不同优先级对应不同的时间切片阈值。
高优先级任务可能允许更长的执行时间（如 10ms）；
低优先级任务可能被严格限制（如 3ms）
