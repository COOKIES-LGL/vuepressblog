---
home: false
---

### React Compiler

这个编译器将你的 React 代码转换成纯 JavaScript，提升性能，并且免去手动优化的麻烦。
使用 useCallback、useMemo 和 memo 进行手动优化的日子已经结束。新的编译器会在后台优化你的代码，因此你可以专注于编写清晰优雅的 React 组件

### 传递 ref 无需 forwardRef

不再需要 forwardRef，refs 现在像普通的 props 一样传递

```jsx
function Child({ innerRef }) {
  return <input ref={innerRef} />;
}
```

### use() Hook

```jsx
import React, { use } from "react";
async function fetchData() {
  const response = await fetch("https://api.example.com/data"); // 用于获取数据的函数
  return response.json();
}
const DataFetchingComponent = () => {
  const data = use(fetchData()); // `use()` 会在 promise 解析之前挂起组件
  return <pre>数据:{JSON.stringify(data, null, 2)}</pre>;
};

export default DataFetchingComponent;
```

### Directives 新的实现方式

使用 use client 和 use server 来声明客户端或服务器端组件

### useOptimistic() 提升用户体验

对于实时应用，useOptimistic() Hook 非常有用。它允许乐观更新，使你的应用感觉更流畅，通过立即更新 UI 并在后台与服务器同步来提升用户体验。

### Server Components 的稳定支持

Server Components 提供了一种全新的组件渲染模式，在服务器上提前渲染，减少了客户端的渲染负担

### 引入了更简洁的 Context 写法

直接使用`<Context>`代替`<Context.Provider>`

```jsx
const ThemeContext = createContext("");
function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```

### Async 脚本和资源预加载支持

为`<script>`标签添加了异步加载支持，同时优化了资源的预加载和预初始化功能。允许在组件内部声明脚本，并由 React 自动去重

```jsx
import { preinit, preload } from "react-dom";
function MyComponent() {
  preinit("https://example.com/script.js", { as: "script" });
  preload("https://example.com/font.woff", { as: "font" });
}
```

### 原生支持文档元数据

引入了对`<title>`、`<meta>`和`<link>`等文档元数据标签的原生支持。这些标签可直接在组件中声明，React 会自动将它们提升至`<head>`，
并确保与服务端渲染和客户端渲染兼容.

```jsx
function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <title>{post.title}</title>
      <meta name="author" content={post.author} />
    </article>
  );
}
```

### 样式表优先级管理

增强了样式表的加载管理，通过指定 precedence 属性，可以动态调整样式表的插入顺序，确保正确的样式覆盖。

```jsx
function Component() {
  return (
    <div>
      <link rel="stylesheet" href="styles.css" precedence="high" />
      <p>Styled Content</p>
    </div>
  );
}
```
