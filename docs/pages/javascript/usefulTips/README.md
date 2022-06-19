```javascript
// 移除对象中的某个属性
let obj = { x: 45, y: 72, z: 68, p: 98 };

// Longhand
delete obj.x;
delete obj.p;
console.log(obj); // {y: 72, z: 68}

// Shorthand
let { x, p, ...newObj } = obj;
console.log(newObj); // {y: 72, z: 68}
```

```javascript
// 使用 URL 这个对象，URL 接口用于解析，构造，规范化和编码 URLs，用它可以很方便的获取链接上的 query 参数。
const url = new URL(window.location.href);
const paramValue = url.searchParams.get(paramName);
console.log(paramValue);
```

```javascript
// 校验一个元素是否在可视区域内
const callback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // `entry.target` 是 dom 元素
      console.log(`${entry.target.id} is visible`);
    }
  });
};

const options = {
  threshold: 1.0,
};

const observer = new IntersectionObserver(callback, options);

const btn = document.getElementById(btn);
const bottomBtn = document.getElementById(bottom - btn);

observer.observe(btn);
observer.observe(bottomBtn);
```

```javascript
// 监控卡顿的fps 如果浏览器卡顿，无法很好地保证渲染的频率，1s 中 frame 无法达到 60 帧
var lastTime = performance.now();
var frame = 0;
var lastFameTime = performance.now();
var loop = function (time) {
  var now = performance.now();
  var fs = now - lastFameTime;
  lastFameTime = now;
  var fps = Math.round(1000 / fs);
  frame++;
  if (now > 1000 + lastTime) {
    var fps = Math.round((frame * 1000) / (now - lastTime));
    frame = 0;
    lastTime = now;
  }
  window.requestAnimationFrame(loop);
};
```

::: warning
requestAnimationFrame 比起 setTimeout、setInterval 的优势主要有两点：
1、requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。
2、在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的的 cpu，gpu 和内存使用量。
3、requestAnimationFrame 默认返回一个 id，cancelAnimationFrame 只需要传入这个 id 就可以停止了.
:::

### Void

由于 void 总是返回 undefined，而 void 总是计算它旁边的表达式，你有一个非常简洁的方法从函数返回而不返回一个值，但仍然调用一个回调例如：

```javascript
// 返回除 undefined 以外的其他内容会使程序崩溃
function middleware(nextCallback) {
  if(conditionApplies()) {
    return void nextCallback();
  }
}

这让我想到了 void 最重要的通途：它是你程序的安全门。当你的函数总是应该返回 undefined 时，你可以确保始终如此。

button.onclick = () => void doSomething();
```

### 函数劫持, 增强函数

```javascript
// 原始函数
var saveLog = function (log) {
  console.log(`我保存了日志：${log}`);
};

// 1-保存原有函数
var originSaveLog = saveLog;

// 2-改写原有函数
saveLog = function () {
  const args = Array.prototype.slice.call(arguments);
  // 3-在改写后的函数中执行原有函数的逻辑
  originSaveLog.apply(null, args);
  console.log('我要劫持你这个函数，用来做自己的事情');
};

saveLog('test Save Log');
```

### 利用 compositionstart 和 compositionend 可以知道中文输入什么时候开始和结束。

```vue
<template>
  <div id="app">
    <input
      type="text"
      :value="filterText"
      @input="onInput"
      @compositionstart="onCompositionStart"
      @compositionend="onCompositionEnd"
    />
    <ul>
      <li v-for="item in filteredList" :key="item">
        {{ item }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      filterText: '',
      list: [
        'The Wealth of Nations',
        '战争与和平',
        '海底两万里',
        '三国演义',
        '嫌疑人X的献身',
      ],
      lock: false,
    };
  },
  computed: {
    filteredList() {
      if (!this.filterText) {
        return this.list;
      }
      return this.list.filter((item) => item.indexOf(this.filterText) > -1);
    },
  },
  methods: {
    onInput(e) {
      if (!this.lock) {
        this.filterText = e.target.value;
      }
    },
    onCompositionStart() {
      this.lock = true;
    },
    onCompositionEnd(e) {
      this.filterText = e.data;
      this.lock = false;
    },
  },
};
</script>
```

### IntersectionObserver

它可以用来监听元素是否进入了设备的可视区域之内，而不需要频繁的计算来做这个判断。

```javascript
var observer = new IntersectionObserver((changes) => {
  for (const change of changes) {
    console.log(change.time);
    // Timestamp when the change occurred
    // 当可视状态变化时，状态发送改变的时间戳
    // 对比时间为，实例化的时间，
    // 比如，值为1000时，表示在IntersectionObserver实例化的1秒钟之后，触发该元素的可视性变化
    console.log(change.rootBounds);
    // Unclipped area of root
    // 根元素的矩形区域信息，即为getBoundingClientRect方法返回的值
    console.log(change.boundingClientRect);
    // target.boundingClientRect()
    // 目标元素的矩形区域的信息
    console.log(change.intersectionRect);
    // boundingClientRect, clipped by its containing block ancestors,
    // and intersected with rootBounds
    // 目标元素与视口（或根元素）的交叉区域的信息
    console.log(change.intersectionRatio);
    // Ratio of intersectionRect area to boundingClientRect area
    // 目标元素的可见比例，即intersectionRect占boundingClientRect的比例，
    // 完全可见时为1，完全不可见时小于等于0
    console.log(change.target);
    // the Element target
    // 被观察的目标元素，是一个 DOM 节点对象
    // 当前可视区域正在变化的元素
  }
}, {});
// Watch for intersection events on a specific target Element.
// 对元素target添加监听，当target元素变化时，就会触发上述的回调
observer.observe(target);

// Stop watching for intersection events on a specific target Element.
// 移除一个监听，移除之后，target元素的可视区域变化，将不再触发前面的回调函数
observer.unobserve(target);

// Stop observing threshold events on all target elements.
// 停止所有的监听
observer.disconnect();
```
