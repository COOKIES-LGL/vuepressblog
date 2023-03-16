
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
