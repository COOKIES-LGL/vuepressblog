---
home: false
---

### react 内置类型

#### 1. JSX.Element

```ts
declare global {
  namespace JSX {
    interface Element extends React.ReactElement<any, any> {}
  }
}
```

JSX.Element 是 ReactElement 的子类型，它没有增加属性，两者是等价的。也就是说两种类型的变量可以相互赋值。  
JSX.Element 可以通过执行 React.createElement 获得

#### 2. React.ReactElement

```ts
interface ReactElement<
  P = any,
  T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>
> {
  type: T;
  props: P;
  key: Key | null;
}
```

通常情况下，函数组件返回 ReactElement 类型

#### 3、React.ReactNode

```ts
type ReactText = string | number;
type ReactChild = ReactElement | ReactText;

interface ReactNodeArray extends Array<ReactNode> {}
type ReactFragment = {} | ReactNodeArray;
type ReactNode = ReactChild | ReactFragment | ReactPortal | boolean | null | undefined;
```

可以看到，ReactNode 是一个联合类型，它可以是 string、number、ReactElement、null、boolean、ReactNodeArray。  
由此可知。ReactElement 类型的变量可以直接赋值给 ReactNode 类型的变量，但反过来是不行的.  
类组件的 render 成员函数会返回 ReactNode 类型的值.

#### 4、React.CSSProperties

React.CSSProperties 是 React 基于 TypeScript 定义的 CSS 属性类型

```ts
style?: CSSProperties | undefined;
```

### HOC 类型声明

```typescript
React.FC<React.PropsWithChildren<IProps>>
Children: React.ComponentType<any>
```

### Event

常见的 Event 事件对象如下：

- 剪切板事件对象：React.ClipboardEvent<T = Element>
- 拖拽事件对象：React.DragEvent<T = Element>
- 焦点事件对象：React.FocusEvent<T = Element>
- 表单事件对象：React.FormEvent<T = Element>
- Change 事件对象：React.ChangeEvent<T = Element>
- 键盘事件对象：React.KeyboardEvent<T = Element>
- 鼠标事件对象：React.MouseEvent<T = Element, E = NativeMouseEvent>
- 触摸事件对象：React.TouchEvent<T = Element>
- 滚轮事件对象：React.WheelEvent<T = Element>
- 动画事件对象：React.AnimationEvent<T = Element>
- 过渡事件对象：React.TransitionEvent<T = Element>
