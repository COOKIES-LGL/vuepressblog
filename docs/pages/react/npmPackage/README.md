## 常见的 react npm 包

### React-to-Print

CSS 与 React-to-Print：实现页面打印的完美方案
React-to-Print 是一个为 React 组件提供打印功能的第三方库，它提供了

```js
<PrintComponents />
```

组件，可以通过这个组件很方便地实现页面打印。
[参考链接](https://www.python100.com/html/57535.html)

### react-joyride

新手引导开源库
[react-joyride](https://github.com/gilbarbara/react-joyride)

### Hoist-Non-React-Statics

它允许我们在不破坏组件结构的情况下，将非 React 静态方法提升到高阶组件（HOC）中，从而实现代码复用和性能优化

```ts
import hoistNonReactStatic from "hoist-non-react-statics";

function myHoc(WrappedComponent: React.ComponentType<any>) {
  const EnhancedComponent = (props: any) => <WrappedComponent {...props} />;

  // 提升非React特定的静态方法
  hoistNonReactStatic(EnhancedComponent, WrappedComponent);

  return EnhancedComponent;
}
```

[Hoist-Non-React-Statics](https://github.com/mridgway/hoist-non-react-statics#readme)
