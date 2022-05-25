### 问题 1:vue data 里初始值为 undefined 的值，不会做响应式处理

```javascript
export default class AddAddress extends Vue {
  private address: Object; // 没赋值的话默认为undefined，undefined不会做响应式处理，后续的变更不会触发页面的更新
  private address: Object = null; // 需要响应式的话需要赋一个初始值，比如null
}
```

### 问题 2: null 值不会触发 prop 的 default 逻辑

```javascript
export default class AddAddress extends Vue {
  private address: Object; // 没赋值的话默认为undefined，undefined不会做响应式处理，后续的变更不会触发页面的更新
  private address: Object = null; // 需要响应式的话需要赋一个初始值，比如null
}
```

### 多文件单文件组件

这是**SFC(单文件组件)**的一点已知功能。
可以像常规 HTML 文件一样导入文件：

```Vue
<template src="./template.html"></template>
<script src="./script.js"></script>
<style scoped src="./styles.css"></style>
```

如果你需要分享样式、文件或其他任何东西，这可能会非常方便。

### 处理错误（和警告）的更好方法

我们可以为 Vue 中的错误和警告提供一个自定义处理程序。

```Vue3
<script ts>
</script>
const app = createApp(App);
app.config.errorHandler = (err) => {
  alert(err);
};
```

```Vue2
// Vue 2
Vue.config.errorHandler = (err) => {
  alert(err);
};
```

像 Bugsnag 和 Rollbar 这样的错误跟踪服务，可以钩住这些处理程序来记录错误，但你也可以用它们来更优雅地处理错误，以获得更好的用户体验。
例如，如果一个错误未被处理，应用程序不会直接崩溃，你可以显示一个完整的错误屏幕，让用户刷新或尝试其他东西。
在 Vue3 中，错误处理程序只能处理  template  和  watcher  错误，但是  Vue2 的错误处理程序可以捕获几乎所有错误。这两个版本中的警告处理程序只在开发阶段有效。
