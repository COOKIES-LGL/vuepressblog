### RouterLink

```vue
<template>
  <a :href="'#' + to">
    <slot />
  </a>
</template>

<script setup>
defineProps({
  to: {
    type: String,
    required: true, // 该值必须传
  },
});
</script>
```

### RouterView

```vue
<template>
  <component :is="component"></component>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "../myRouter/index.js";

const router = useRouter(); // 在当前组件注入router类

console.log(router);
const component = computed(() => {
  // 数组映射关系
  const route = router.routes.find((route) => {
    return route.path === router.current.value;
  });
  return route ? route.component : null;
});
</script>
```

```javascript
import RouterLink from "./RouterLink.vue";
import RouterView from "./RouterView.vue";
import { inject, ref } from "vue";

const ROUTER_KEY = "_router_";

function useRouter() {
  // hooks高阶函数
  return inject(ROUTER_KEY); // 提供路由实例对象
}

function createRouter(options) {
  // 创建路由实例对象，有push，go等方法
  return new Router(options);
}

function createWebHashHistory() {
  // hash模式
  function bindEvents(fn) {
    window.addEventListener("hashchange", fn); // 只要hash变了， fn就会触发
  }
  return {
    bindEvents,
    url: window.location.hash.slice(1) || "/",
  };
}

class Router {
  // es6写构造函数
  constructor(options) {
    this.history = options.history;
    this.routes = options.routes;
    this.current = ref(this.history.url); // 当前路径

    this.history.bindEvents(() => {
      this.current.value = window.location.hash.slice(1);
    });
  }
  install(app) {
    // 所有能被vue use掉的
    app.provide(ROUTER_KEY, this); // 类中，所有的this都指向类

    // 注册全局组件
    app.component("router-link", RouterLink);
    app.component("router-view", RouterView);
  }
}

export { createRouter, createWebHashHistory, useRouter };
```
