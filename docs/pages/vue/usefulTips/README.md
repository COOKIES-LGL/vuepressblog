### vue data 里初始值为 undefined 的值，不会做响应式处理

```javascript
export default class AddAddress extends Vue {
  private address: Object; // 没赋值的话默认为undefined，undefined不会做响应式处理，后续的变更不会触发页面的更新
  private address: Object = null; // 需要响应式的话需要赋一个初始值，比如null
}
```

### null 值不会触发 prop 的 default 逻辑

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

```vue
<script ts>
const app = createApp(App);
app.config.errorHandler = (err) => {
  alert(err);
};
</script>
```

```vue
Vue.config.errorHandler = (err) => {   alert(err); };
```

像 Bugsnag 和 Rollbar 这样的错误跟踪服务，可以钩住这些处理程序来记录错误，但你也可以用它们来更优雅地处理错误，以获得更好的用户体验。
例如，如果一个错误未被处理，应用程序不会直接崩溃，你可以显示一个完整的错误屏幕，让用户刷新或尝试其他东西。  
在 Vue3 中，错误处理程序只能处理  template  和  watcher  错误，  
但是  Vue2 的错误处理程序可以捕获几乎所有错误。这两个版本中的警告处理程序只在开发阶段有效。

### 妙用 hook 事件

如果想监听子组件的生命周期时，可以像下面例子中这么做：

```vue
<template>
  <child @hook:mounted="removeLoading" />
</template>

这样的写法可以用于处理加载第三方的初始化过程稍漫长的子组件时，我们可以加loading动画，等到子组件加载完毕，到了mounted生命周期时，把loading动画移除。
初次之外hook还有一个常用的写法，在一个需要轮询更新数据的组件上，我们通常在created里开启定时器，然后在beforeDestroy上清除定时器。而通过hook,开启和销毁定时器的逻辑我们都可以在created里实现：
<script>
export default {
  created() {
    const timer = setInterval(() => {
      // 更新逻辑
    }, 1000);
    // 通过$once和hook监听实例自身的beforeDestroy，触发该生命周期时清除定时器
    this.$once("hook:beforeDestroy", () => {
      clearInterval(timer);
    });
  },
};
</script>
```

```javascript
const broadcast = function (componentName, eventName, ...params) {
  let children = this.$children;
  children.forEach((child) => {
    let name = child.$options.name;
    if (name === componentName) {
      child.$emit(eventName, ...params);
    } else {
      broadcast.call(child, componentName, eventName, ...params);
    }
  });
};

const dispatch = function (componentName, eventName, ...params) {
  let parent = this.$parent || this.$root;
  let name = parent.$options.name;
  while (parent && componentName !== name) {
    parent = parent.$parent;
    if (parent) {
      name = parent.$options.name;
    }
  }
  if (parent) {
    parent.$emit(eventName, ...params);
  }
};

export default {
  methods: {
    dispatch(componentName, eventName, ...params) {
      dispatch.call(this, componentName, eventName, ...params);
    },
    broadcast(componentName, eventName, ...params) {
      broadcast.call(this, componentName, eventName, ...params);
    },
  },
};
```

### 妙用 自定义指令

#### v-loading

```vue
<!-- 定义loading 组件 -->
<template>
  <div class="loadingcssbox">
    <img src="../../assets/loading.gif" />
  </div>
</template>
```

```ts
// 定义指令
import Vue from "vue";
//引入加载动画组件
import LoadingCom from "./LoadingCom.vue";
const loadingDirectiive = {
  inserted(el, bing) {
    // el ==>表示被绑定了指令的那个元素，这个el是一个原生的js对象。
    // bing ==> 指令相关的信息
    // 得到一个组件的构造函数
    const loadingCtor = Vue.extend(LoadingCom);
    // 得到实例loadingComp
    const loadingComp = new loadingCtor();
    // 获取实例的html
    const htmlLoading = loadingComp.$mount().$el;
    // 将html放在el的实例上面去
    el.myHtml = htmlLoading;
    if (bing.value) {
      appendHtml(el);
    }
  },
  update(el, bing) {
    // bing.value 是v-loading绑定的那个值； true 要显示加载动画
    //新值 bing.value与旧值bing.oldValue是否相等
    if (bing.value !== bing.oldValue) {
      bing.value ? appendHtml(el) : removeHtml(el);
    }
  },
};

function appendHtml(el) {
  el.appendChild(el.myHtml);
}

function removeHtml(el) {
  el.removeChild(el.myHtml);
}
export default loadingDirectiive;
```

```typescript
// 注册
import loadingDirectiive from "./components/loading/loading";
Vue.directive("loading", loadingDirectiive);
```

```vue
<!--使用-->
<template>
  <div class="box">
    <ListCom :listArr="listArr" v-loading="isLoadFlag"></ListCom>
  </div>
</template>
```

### 动态 Watch

**使用场景**
假设你现在有一个价格 price，在这个价格变化后需要执行一段逻辑。而这个价格是通过后端接口拿到数据后初始化的，而没初始化之前，我是不需要执行这段逻辑的，这时候如果用静态 watch，肯定会让 watch 执行一次，如果在 watch 执行中有一些副作用，那就还要多加一些逻辑判断，而且这次执行是毫无意义的，应当避免它执行，这时候用动态 watch 就再合适不过

```js
export default {      
  data() {          
    return {            
      a: 1,            
      unWatch: null,        
    }    
  },      
  mounted() {    
    this.a = await fetch('./xxx');     
    this.unWatch = this.$watch(this.a, (newVal, oldVal) => {          
        console.log('watch执行', oldVal, newVal);        
    }, {            
      immediate: true,        
    })    
  }
  beforeDestroy() {          
    if (this.unWatch) { // 主动销毁watch            
      this.unWatch();              
      this.unWatch = null;        
    }    
  }  
}
```

### Vue 父子组件生命周期执行顺序

- 挂载阶段
  父 beforeCreate → 父 created → 父 beforeMount →  
  子 beforeCreate → 子 created → 子 beforeMount → 子 mounted →  
  父 mounted
- 更新阶段
  父 beforeUpdate → 子 beforeUpdate → 子 updated → 父 updated
- 销毁阶段
  父 beforeDestroy → 子 beforeDestroy → 子 destroyed → 父 destroyed

### Vue.util.defineReactive

vue 提供了一个工具函数 defineReactive,可以把一个数据变成响应式的，也就是数据变化了会刷新页面

### Vue diff 算法的详细讲解

[vue 的 diff 算法原理](https://www.cnblogs.com/wangtong111/p/11198393.html)
