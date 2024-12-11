---
home: false
---

### HOC 类型

hoc 主要功能，强化 props ， 控制渲染 ，赋能组件 三个方向
**对于属性代理** HOC,可以：

- 强化 props & 抽离 state。
- 条件渲染，控制渲染，分片渲染，懒加载。
- 劫持事件和生命周期
- ref 控制组件实例
- 添加事件监听器，日志

**对于反向代理** HOC,可以：

- 劫持渲染，操纵渲染树
- 控制/替换生命周期，直接获取组件状态，绑定事件

#### ① 混入 props

```jsx
function classHOC(WrapComponent) {
  return class Idex extends React.Component {
    state = {
      name: "alien",
    };
    componentDidMount() {
      console.log("HOC");
    }
    render() {
      return <WrapComponent {...this.props} {...this.state} />;
    }
  };
}
function Index(props) {
  const { name } = props;
  useEffect(() => {
    console.log("index");
  }, []);
  return <div>hello,world , my name is {name}</div>;
}

export default classHOC(Index);
```

#### ② 抽离 state 控制更新

```jsx
function classHOC(WrapComponent) {
  return class Idex extends React.Component {
    constructor() {
      super();
      this.state = {
        name: "alien",
      };
    }
    changeName(name) {
      this.setState({ name });
    }
    render() {
      return (
        <WrapComponent {...this.props} {...this.state} changeName={this.changeName.bind(this)} />
      );
    }
  };
}
function Index(props) {
  const [value, setValue] = useState(null);
  const { name, changeName } = props;
  return (
    <div>
      <div> hello,world , my name is {name}</div>
      改变name <input onChange={(e) => setValue(e.target.value)} />
      <button onClick={() => changeName(value)}>确定</button>
    </div>
  );
}

export default classHOC(Index);
```

#### ③ 进阶：异步组件(懒加载)

```jsx
/* 路由懒加载HOC */
export default function AsyncRouter(loadRouter) {
  return class Content extends React.Component {
    state = { Component: null };
    componentDidMount() {
      if (this.state.Component) return;
      loadRouter()
        .then((module) => module.default)
        .then((Component) => this.setState({ Component }));
    }
    render() {
      const { Component } = this.state;
      return Component ? <Component {...this.props} /> : null;
    }
  };
}
```

#### ④ 反向继承 ： 渲染劫持

```jsx
const HOC = (WrapComponent) =>
  class Index extends WrapComponent {
    render() {
      if (this.props.visible) {
        return super.render();
      } else {
        return <div>暂无数据</div>;
      }
    }
  };
```

#### ⑤ 劫持生命周期，事件函数

```jsx
function HOC(Component) {
  const proDidMount = Component.prototype.componentDidMount;
  Component.prototype.componentDidMount = function () {
    console.log("劫持生命周期：componentDidMount");
    proDidMount.call(this);
  };
  return class wrapComponent extends React.Component {
    render() {
      return <Component {...this.props} />;
    }
  };
}
@HOC
class Index extends React.Component {
  componentDidMount() {
    console.log("———didMounted———");
  }
  render() {
    return <div>hello,world</div>;
  }
}
```

#### ⑥ 组件内的事件监听

```jsx
function ClickHoc(Component) {
  return function Wrap(props) {
    const dom = useRef(null);
    useEffect(() => {
      const handerClick = () => console.log("发生点击事件");
      dom.current.addEventListener("click", handerClick);
      return () => dom.current.removeEventListener("click", handerClick);
    }, []);
    return (
      <div ref={dom}>
        <Component {...props} />
      </div>
    );
  };
}

@ClickHoc
class Index extends React.Component {
  render() {
    return (
      <div className="index">
        <p>hello，world</p>
        <button>组件内部点击</button>
      </div>
    );
  }
}
export default () => {
  return (
    <div className="box">
      <Index />
      <button>组件外部点击</button>
    </div>
  );
};
```

#### ⑦ 添加额外生命周期

```jsx
function Hoc(Component) {
  return class WrapComponent extends React.Component {
    constructor() {
      super();
      this.node = null;
    }
    UNSAFE_componentWillReceiveProps(nextprops) {
      if (nextprops.number !== this.props.number) {
        this.node.handerNumberChange && this.node.handerNumberChange.call(this.node);
      }
    }
    render() {
      return <Component {...this.props} ref={(node) => (this.node = node)} />;
    }
  };
}
@Hoc
class Index extends React.Component {
  handerNumberChange() {
    /* 监听 number 改变 */
  }
  render() {
    return <div>hello,world</div>;
  }
}
```

### ReactDOM.createPortal

ReactDOM.createPortal 是 React 提供的一个 API，它允许你将子节点渲染到父组件以外的 DOM 节点中。这个特性在处理模态框、悬浮框、提示框等特殊类型的 UI 元素时非常有用，因为这些元素通常需要在视觉上脱离其逻辑上的父组件，但仍然要保持与 React 应用的状态管理一致。

```tsx
import ReactDOM from "react-dom";
ReactDOM.createPortal(child, container);
```

```tsx
// 弹窗组件 render 实现
import React from "react";
import { render } from "react-dom";

class Popup extends React.Component {
  constructor() {
    super();
    this.state = { count: 0 };
  }

  render() {
    return (
      <div>
        <p>Popup count: {this.state.count}</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>Increment</button>
      </div>
    );
  }
}

// 创建全局的DOM节点用于Portal渲染
const modalRoot = document.createElement("div");
document.body.appendChild(modalRoot);

// 渲染Popup组件到全局的DOM节点
render(<Popup />, modalRoot);
```
