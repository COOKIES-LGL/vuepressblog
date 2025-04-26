[React-hook 链表构建原理](https://segmentfault.com/a/1190000042799935)

### 埋点 hooks

```javascript
// 定义
export const LogContext = createContext({});

export const useLog = () => {
  /* 定义一些公共参数 */
  const message = useContext(LogContext);
  const listenDOM = useRef(null);

  /* 分清依赖关系 */
  const reportMessage = useCallback(
    (data, type) => {
      if (type === "pv") {
        // 页面浏览量上报
        console.log("组件 pv 上报", message);
      } else if (type === "click") {
        // 点击上报
        console.log("组件 click 上报", message, data);
      }
    },
    [message]
  );

  useEffect(() => {
    const handleClick = (e) => {
      reportMessage(e.target, "click");
    };

    if (listenDOM.current) {
      listenDOM.current.addEventListener("click", handleClick);
    }

    return function () {
      listenDOM.current && listenDOM.current.removeEventListener("click", handleClick);
    };
  }, [reportMessage]);

  return [listenDOM, reportMessage];
};
// 使用
import React, { useState } from "react";
import { LogContext, useLog } from "./hooks/useLog";

const Home = () => {
  const [dom, reportMessage] = useLog();
  return (
    <div>
      {/* 监听内部点击 */}
      <div ref={dom}>
        <button> 按钮 1 (内部点击) </button>
        <button> 按钮 2 (内部点击) </button>
        <button> 按钮 3 (内部点击) </button>
      </div>
      {/* 外部点击 */}
      <button onClick={reportMessage}>外部点击</button>
    </div>
  );
};
// 阻断 useState 的更新效应
const Index = React.memo(Home);

const App = () => {
  const [value, setValue] = useState({});
  return (
    <LogContext.Provider value={value}>
      <Index />
      <button onClick={() => setValue({ cat: "小猫", color: "棕色" })}>点击</button>
    </LogContext.Provider>
  );
};

export default App;
```

### 执行一次

```typescript
export const useExecuteOnce = (fn: () => void, condition: boolean) => {
  const fnRef = useRef(fn);
  fnRef.current = fn;
  const once = useRef(false);
  useEffect(() => {
    if (condition && !once.current) {
      once.current = true;
      return fnRef.current();
    }
  }, [condition]);
};
```

### 更新执行

```typescript
export default function useUpdateEffect(effect: EffectCallback, deps?: DependencyList) {
  const mounted = useRef(false);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
```

### 获取最新数据返回

```typescript
/**
 * resolve 最近一次函数返回结果
 */
const lockThrottleFn = <T extends Function>(fn: T, name = ""): T => {
  let index = 0;
  // @ts-ignore
  return async (...args) => {
    index++;
    const current = index;
    const isCurrent = () => current === index;
    const ret = await fn(...args);
    if (isCurrent()) {
      // 只有一次调用直接Resolve
      return ret;
    } else {
      // eslint-disable-next-line no-console
      IS_DEV
        ? console.log(`${name}: hit throttle lock`)
        : bizErrLogger(`${name} 命中非最新返回结果`);
      return;
    }
  };
};
```

### useEvent 获取地址不变的函数

```typescript
export function usePersistFn<T extends (...args: any[]) => any>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useCallback((...args: any[]) => {
    return fnRef.current?.(...args);
  }, []);
  return persistFn as any as T;
}
```

### 无效 useCallback useMemo

::: tip
只有当前组件的所有属性都被缓存时，才可以使用 useCallback 缓存函数 只有当父组件的所有属性都被缓存时，才可以使用 useMemo 缓存子组件或对象
:::

### useReducer 和 useContext 的结合可以取代 Redux?

::: tip
主要问题 useReducer+useContext 维护的状态还只是一个强耦合于 UI 的状态。这写状态的生命周期完全局限于在函数组件内部，这个状态是在在组件函数作用域内创建的，
和 UI 组件是耦合在一起而没有真正分离。但是有的状态是需要完全独立于 UI 的，需要完全 UI 无关地进行维护，UI 组件只是状态的一个消费者，而不是定义和初始化状态的地方。
Redux 可以做到分离，但 useReducer+useContext 不能。另外 Redux 有 thunk 之类的中间件支持 async action，而 useReducer 没有，还得用其他库。
useContext+useReducer 说白了就是项目很小，只有少部分祖孙组件间需要共享状态时才会使用的一个简易共享方案。真正较复杂的情况那必然还是用 Redux。
:::

### react 父子组件生命周期执行顺序

1、useLayoutEffect‌：是同步执行的，遵循 ‌ 父组件优先 ‌ 的嵌套顺序（父 → 子）‌。
2、‌useEffect‌：是异步执行的，遵循 ‌ 子组件优先 ‌ 的队列顺序（子 → 父）‌。

#### 类组件与函数组件的区别 ‌

1、类组件的 componentDidMount 和 componentDidUpdate 均为父组件优先 ‌。
2、函数组件的 useEffect 为子组件优先，需特别注意两者的差异 ‌。

### 副作用链表 和 hook 链表

##### Hook 链表

是函数组件内部所有 Hook 按调用顺序形成的单向链表 ‌，每个 Hook 节点（如 useState、useEffect）通过 memoizedState 字段保存状态信息，并通过 next 指针指向下一个 Hook
**核心作用**
维护函数组件 ‌ 跨渲染周期的状态一致性 ‌（如 useState 的 state 值）。
确保 Hook 的调用顺序在每次渲染中保持稳定（依赖 Hook 链表的顺序性）

##### 副作用链表 effects

是所有具有副作用的 Hook（如 useEffect、useLayoutEffect、useImperativeHandle）生成的 Effect 对象组成的链表 ‌，通过 fiber.effects 字段存储

**核心作用**
统一管理副作用的 ‌ 创建、更新与销毁 ‌（如 DOM 操作、订阅/取消订阅）；
通过依赖数组（deps）优化副作用的执行频率，避免无效触发

##### 从属关系

Hook 链表是 ‌ 基础数据结构 ‌，用于管理所有 Hook 的状态与调用顺序；
副作用链表是 Hook 链表的衍生结构 ‌，仅包含具有副作用的 Hook 生成的 Effect 对象

##### 生命周期协作 ‌

‌Render 阶段 ‌：
构建 Hook 链表 → 触发副作用 Hook → 生成副作用链表；
‌Commit 阶段 ‌：
遍历副作用链表执行或调度副作用

- update 链表
  作为 updateQueue 的成员存在，单链表结构
- updateQueue 链表
  挂载在 Fiber 节点的 updateQueue 字段，双链表结构

updateQueue 是 Fiber 节点的核心属性，用于管理 ‌ 所有待处理的更新和副作用 ‌。它存储状态更新（Update 对象）

### effects 与 updateQueue 的关系解析 ‌

一、‌ 核心区别 ‌
‌updateQueue 的定位 ‌

‌ 作用 ‌：专门存储组件的 ‌ 状态更新对象（Update）‌，例如 setState 触发的多个更新会合并到队列中进行批量处理 18。
‌ 结构 ‌：采用链表实现的链式队列，包含 pending（待处理更新）和 lanes（优先级通道）等字段 58。
‌effects 的定位 ‌

‌ 作用 ‌：管理 ‌ 副作用对象（Effect）‌，如 useEffect 生成的副作用逻辑、DOM 操作标记（如插入、删除）34。
‌ 结构 ‌：通过 firstEffect、lastEffect、nextEffect 构成链表，记录需在 Commit 阶段执行的副作用 4。
二、‌ 存储位置与协作流程 ‌
‌ 存储位置分离 ‌

updateQueue 是 Fiber 节点的独立属性，专门存放状态更新；
effects 通过链表指针（如 firstEffect）挂载到 Fiber 节点上，与 updateQueue 无直接关联 48。
‌ 协作流程 ‌

‌Render 阶段 ‌：updateQueue 中的 Update 对象被处理，计算新状态；
‌Commit 阶段 ‌：遍历 effects 链表，执行副作用（如 DOM 更新、生命周期钩子）34。
‌ 总结 ‌
‌updateQueue‌：‌ 状态更新队列 ‌，负责批量处理组件状态变更，优化渲染性能 18；
‌effects‌：‌ 副作用链表 ‌，管理需执行的 DOM 操作或副作用逻辑，与状态更新解耦 34。
两者在 Fiber 架构中分工明确，共同保障 React 的高效渲染与更新

### hook 对象 update 链表 与 Fiber updateQueue 的关联 ‌

- 类组件 ‌：类组件的 fiber.updateQueue 直接存储 Update 链表，用于状态更新。
- 函数组件 ‌：函数组件的 fiber.updateQueue ‌ 不存储状态更新 ‌，而是用于管理调度标记。
- 关键区别 ‌：函数组件的状态更新完全由各个 Hook 对象的 queue.pending 独立管理，无需同步到 fiber.updateQueue
