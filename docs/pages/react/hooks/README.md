
[React-hook链表构建原理](https://segmentfault.com/a/1190000042799935)

### 埋点hooks

``` javascript
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
      listenDOM.current &&
        listenDOM.current.removeEventListener("click", handleClick);
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
      <button onClick={() => setValue({ cat: "小猫", color: "棕色" })}>
        点击
      </button>
    </LogContext.Provider>
  );
};

export default App;
```

### 执行一次

``` typescript
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
``` typescript
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
``` typescript
/**
 * reolsve 最近一次函数返回结果
 */
const lockThrottleFn = <T extends Function>(fn: T, name = ''): T => {
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
            IS_DEV ? console.log(`${name}: hit throttle lock`) : bizErrLogger(`${name} 命中非最新返回结果`);
            return;
        }
    };
};

```

### useEvent 获取地址不变的函数
``` typescript
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
只有当前组件的所有属性都被缓存时，才可以使用useCallback缓存函数 只有当父组件的所有属性都被缓存时，才可以使用useMemo缓存子组件或对象
:::

### HOC 类型声明
``` typescript
React.FC<React.PropsWithChildren<IProps>>
Children: React.ComponentType<any>
```

### useReducer和useContext的结合可以取代Redux?
::: tip
主要问题useReducer+useContext维护的状态还只是一个强耦合于UI的状态。这写状态的生命周期完全局限于在函数组件内部，这个状态是在在组件函数作用域内创建的，
和UI组件是耦合在一起而没有真正分离。但是有的状态是需要完全独立于UI的，需要完全UI无关地进行维护，UI组件只是状态的一个消费者，而不是定义和初始化状态的地方。
Redux可以做到分离，但useReducer+useContext不能。另外Redux有thunk之类的中间件支持async  action，而useReducer没有，还得用其他库。
useContext+useReducer说白了就是项目很小，只有少部分祖孙组件间需要共享状态时才会使用的一个简易共享方案。真正较复杂的情况那必然还是用Redux。
:::
