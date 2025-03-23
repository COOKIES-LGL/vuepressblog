### 关于 includes 和 indexOf

```javascript
1. 主要用途：判断字符串或者数组中是否存在对应的元素
2. 两者的区别
（1）NaN includes 能匹配到NaN，indexOf不能匹配到NaN
（2）undefined  includes能识别到稀疏数组中的undefined，indexOf不可以
3.字符串和数组中的indexOf方法比较：字符串会进行类型转换，数组会严格匹配（===）
4.字符串和数组中的includes方法比较：字符串会进行类型转换，数组会严格匹配（===）
```

### 内置数组方法的效率

```javascript
splice 操作方法是非常耗时的，每次删除元素之后，需要重排数组中的元素，具有相同副作用的操作方法还有 unshift 和 shift
相比较下，pop 和 push 则是非常快的操作方法，
```

### 字符串编码

```javascript
function base64Encode(str) {
  return btoa(
    encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
      String.fromCharCode("0x" + p1)
    )
  );
}
// btoa()函数可以将字符串编码为Base64格式，而encodeURIComponent()函数则可以将字符串转换为可传输的URI格式。我们还使用了一个正则表达式来将URI格式中的特殊字符进行替换。
```

### Iterator 的作用

::: tip
为各种数据结构，提供一个统一的、简便的访问接口。
ES6 提出了新的遍历命令 for...of 循环，Iterator 接口主要供 for...of 消费。
:::

```javascript
var arr = [1,2,3,4,5];
var arrValue = arr[Symbol.iterator]();
arrValue.next(); // 1
arrValue.next(); // 2
arrValue.next(); // 3
...
```

```javascript
function objectIterator() {
  const keys = Object.keys(this);
  let index = 0;
  return {
    next: () => {
      const done = index >= keys.length;
      const value = done ? undefined : this[keys[index]];
      index++;
      return {
        done,
        value,
      };
    },
  };
}

Object.prototype[Symbol.iterator] = objectIterator;

const obj = {
  key: "1",
  value: "2",
};
for (const iterator of obj) {
  console.log(iterator);
}
```

### Array.protoType.FlatMap

用来实现过滤切格式化处理数组 代替 filter map

```javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const squaredOddNumbers = numbers.flatMap((num) => (num % 2 !== 0 ? [num * num] : []));

console.log(squaredOddNumbers);
// 输出：[1, 9, 25, 49, 81]
```

### 使用 URL URLSearchParams 方式避免 url 参数拼接

```javascript
function constructURL(param) {
  const { category, limit, userId } = param;
  const baseURL = "https://fakestoreapi.com/products";
  const url = new URL(baseURL);
  const params = new URLSearchParams();

  if (category) url.pathname += `/category/${category}`;
  if (limit) params.append("limit", Number(limit).toString());
  if (userId) params.append("userId", Number(userId).toString());

  url.search = params.toString();
  return url.toString();
}
```

### 获取是否文字省略 Ellipsis 生效

```javascript
const checkEllipsis = () => {
  const range = document.createRange();
  range.setStart(box, 0);
  range.setEnd(box, box.childNodes.length);
  let rangeWidth = range.getBoundingClientRect().width;
  let rangeHeight = range.getBoundingClientRect().height;
  const contentWidth = rangeWidth - Math.floor(rangeWidth);
  const { pLeft, pRight } = getPadding(box);
  const horizontalPadding = pLeft + pRight;
  if (rangeWidth + horizontalPadding > box.clientWidth) {
    result.textContent = "存在省略号";
  } else {
    result.textContent = "容器宽度足够，没有省略号了";
  }
};
```

### crypto.getRandomValues() 获取真随机数

```javascript
let array = new Uint32Array(1);
window.crypto.getRandomValues(array);
let randomNum = array[0] % 100;
```

### MessageChannel

MessageChannel 允许我们在不同的浏览上下文，比如 window.open()打开的窗口或者 iframe 等之间建立通信管道，并通过两端的端口（port1 和 port2）发送消息。MessageChannel 以 DOM Event 的形式发送消息，所以它属于异步的宏任务。

```javascript
// a.js
export default function a(port) {
  port.postMessage({ from: 'a', message: 'ping' });
}

// b.js
export default function b(port) {
  port.onmessage = (e) => {
    console.log(e.data); // {from: 'a', message: 'ping'}
  };
}

// index.js
import a from './a.js';
import b from './b.js';

const { port1, port2 } = new MessageChannel();
b(port2);
a(port1);
```

### AbortController

1、AbortController 可以用来终止一个或多个 Web 请求

```javascript
const controller = new AbortController(); // 新建一个AbortController实例
let signal = controller.signal; // signal是AbortController实例的属性

const downloadBtn = document.querySelector(".download");
const abortBtn = document.querySelector(".abort");

downloadBtn.addEventListener("click", fetchVideo);

abortBtn.addEventListener("click", function () {
  controller.abort(); // 调用abort方法
  console.log("Download aborted");
});

function fetchVideo() {
  //...
  fetch(url, { signal })
    .then(function (response) {
      //...
    })
    .catch(function (e) {
      console.error("e", e);
    });
}
```

2、终止事件监听

```javascript
const controller = new AbortController();
function callback(e) {
  document.addEventListener("mousemove", (e) => {}, {
    signal: controller.signal,
  });
}
document.addEventListener("mousedown", callback);
document.addEventListener("mouseup", controller.abort);
```

### 文件分片

```javascript
var reader = new FileReader();
reader.readAsArrayBuffer(file);
reader.addEventListener("load", function (e) {
  //每10M切割一段,这里只做一个切割演示，实际切割需要循环切割，
  var slice = e.target.result.slice(0, 10 * 1024 * 1024);
});
```

### 一次性的事件监听

```js
const handler = function (e) {};
ele.addEventListener("event-name", handler, { once: true });
```

### 检测元素之外的点击

```js
document.addEventListener("click", function (evt) {
  // isClickedOutside 为 true 如果点击的元素在 ele 之外
  const isClickedOutside = !ele.contains(evt.target);
});
```

### Array.from() 参数

`Array.from(arrayLike[, mapFn[, thisArg]])`

```js
// 例：指定 this 对象
const obj = { factor: 2 };
Array.from(
  [1, 2],
  function (x) {
    return x * this.factor;
  },
  obj
); // [2, 4]
```

### setInterval 的修正延迟时间

```js
let lastTime = Date.now();
function loop() {
  const now = Date.now();
  const drift = now - lastTime - 1000; // 误差计算
  console.log(`本次误差：${drift}ms`);
  // 执行业务逻辑（如更新倒计时）
  lastTime = now;
  // 动态调整延迟（1000ms - 误差补偿）
  setTimeout(loop, 1000 - drift);
}
loop(); // 启动循环
```

### Object.is 与 ===

Object.is() 是 JavaScript 中用于精确比较两个值是否相同的方法，与 ===（严格相等运算符）类似，但在处理特殊值（如 NaN 和 -0）时有区别

### Object.create 的应用场景

‌1、共享方法/属性

```js
const carPrototype = {
  drive() {
    console.log("Driving...");
  },
};
const car1 = Object.create(carPrototype);
const car2 = Object.create(carPrototype);
car1.drive(); // 所有实例共享 drive 方法
```

2、定义属性特性 ‌：通过第二个参数 propertiesObject

```js
const obj = Object.create(null, {
  id: { value: 1, writable: false },
  name: { value: "Alice", enumerable: true },
});
```

3、原型链注入

```js
const base = {
  log() {
    console.log("Base log");
  },
};
const extended = Object.create(base, {
  debug: {
    value() {
      console.log("Debug mode");
    },
  },
});
extended.debug(); // 新增方法
```

### toLocaleString

```js
var num = 123456789;
//格式化千分位输出
num.toLocaleString();
//格式化为千分位带$符号输出
num.toLocaleString("en-US", { style: "currency", currency: "USD" });
//格式化为带￥符号输出
num.toLocaleString("zh-Hans-CN", { style: "currency", currency: "CNY" });
```
