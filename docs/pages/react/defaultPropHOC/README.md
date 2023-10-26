
### 定义默认属性组件

``` javascript
// 定义
import React from "react";

/**
 * 组件默认属性Hoc
 * @param defaultProps 默认属性
 * @returns
 */
export function withDefaultProps<P = {}>(defaultProps?: Partial<P>) {
  return function (Component: any) {
    const WrappedComponent: React.FC<P> = (props) => {
      return React.createElement(Component, {
        ...defaultProps,
        ...props,
      });
    };

    WrappedComponent.displayName = `withDefaultProps(${getDisplayName(
      Component
    )})`;

    return WrappedComponent;
  };
}
```


### 感知dom变化

``` javascript

const f = useCallback((node) => {},[]);

<div ref ={f} />
// 的方法来感知dom变化

```