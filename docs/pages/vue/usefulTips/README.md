### 问题1:vue data里初始值为undefined的值，不会做响应式处理
``` javascript
export default class AddAddress extends Vue {
  private address: Object; // 没赋值的话默认为undefined，undefined不会做响应式处理，后续的变更不会触发页面的更新
  private address: Object = null; // 需要响应式的话需要赋一个初始值，比如null
}
```

### 问题2: null值不会触发prop的default逻辑

``` javascript
export default class AddAddress extends Vue {
  private address: Object; // 没赋值的话默认为undefined，undefined不会做响应式处理，后续的变更不会触发页面的更新
  private address: Object = null; // 需要响应式的话需要赋一个初始值，比如null
}
```