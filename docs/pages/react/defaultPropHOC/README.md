
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

``` js
const f = useCallback((node) => {},[]);
<div ref ={f} />
// 的方法来感知dom变化
```

### react render 函数简写

``` javascript
function render(vnode, container) {
    console.log("vnode", vnode); // 虚拟DOM对象
    // vnode _> node
    const node = createNode(vnode, container);
    container.appendChild(node);
}

// 创建真实DOM节点
function createNode(vnode, parentNode) {
    let node = null;
    const {type, props} = vnode;
    if (type === TEXT) {
        node = document.createTextNode("");
    } else if (typeof type === "string") {
        node = document.createElement(type);
    } else if (typeof type === "function") {
        node = type.isReactComponent
            ? updateClassComponent(vnode, parentNode)
        : updateFunctionComponent(vnode, parentNode);
    } else {
        node = document.createDocumentFragment();
    }
    reconcileChildren(props.children, node);
    updateNode(node, props);
    return node;
}

// 遍历下子vnode，然后把子vnode->真实DOM节点，再插入父node中
function reconcileChildren(children, node) {
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        if (Array.isArray(child)) {
            for (let j = 0; j < child.length; j++) {
                render(child[j], node);
            }
        } else {
            render(child, node);
        }
    }
}
function updateNode(node, nextVal) {
    Object.keys(nextVal)
        .filter(k => k !== "children")
        .forEach(k => {
        if (k.slice(0, 2) === "on") {
            let eventName = k.slice(2).toLocaleLowerCase();
            node.addEventListener(eventName, nextVal[k]);
        } else {
            node[k] = nextVal[k];
        }
    });
}

// 返回真实dom节点
// 执行函数
function updateFunctionComponent(vnode, parentNode) {
    const {type, props} = vnode;
    let vnode = type(props);
    const node = createNode(vnode, parentNode);
    return node;
}

// 返回真实dom节点
// 先实例化，再执行render函数
function updateClassComponent(vnode, parentNode) {
    const {type, props} = vnode;
    let cmp = new type(props);
    const vnode = cmp.render();
    const node = createNode(vnode, parentNode);
    return node;
}
export default {
    render
};
```
