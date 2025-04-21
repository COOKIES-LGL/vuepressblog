### 通过枚举值获取下拉 options

```javascript
// 通过枚举值获取下拉options
export const getOptionsFromEnum = (enumParams: object) => {
  if (!enumParams) return [];
  const storeSet = new Set();
  const returnList = Object.entries(enumParams).map((item) => {
    if (storeSet.has(item[1].toString())) {
      return {
        label: item[0],
        value: item[1],
      };
    }
    storeSet.add(item[0].toString());
    return null;
  });
  return returnList.filter((item) => item);
};
```

### URL 这个对象解析路由参数

```javascript
// 使用 URL 这个对象，URL 接口用于解析，构造，规范化和编码 URLs，用它可以很方便的获取链接上的 query 参数。
const url = new URL(window.location.href);
const paramValue = url.searchParams.get(paramName);
console.log(paramValue);
```

### 校验一个元素是否在可视区域

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

### requestAnimationFrame 的优势

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

::: tip
requestAnimationFrame 比起 setTimeout、setInterval 的优势主要有三点：  
1、requestAnimationFrame 会把每一帧中的所有 DOM 操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒 60 帧。  
2、在隐藏或不可见的元素中，requestAnimationFrame 将不会进行重绘或回流，这当然就意味着更少的的 cpu，gpu 和内存使用量。  
3、requestAnimationFrame 默认返回一个 id，cancelAnimationFrame 只需要传入这个 id 就可以停止了.  
:::

### for 循环中多个条件关系

::: tip
for 循环中，当不用&&和||申明多个条件时，默认的是或者关系。
:::

### Void 巧用

由于 void 总是返回 undefined，而 void 总是计算它旁边的表达式，你有一个非常简洁的方法从函数返回而不返回一个值，但仍然调用一个回调例如：

```javascript
// 返回除 undefined 以外的其他内容会使程序崩溃
function middleware(nextCallback) {
  if (conditionApplies()) {
    return void nextCallback();
  }
}
// 这让我想到了 void 最重要的通途：它是你程序的安全门。当你的函数总是应该返回 undefined 时，你可以确保始终如此。
button.onclick = () => void doSomething();
```

### compositionstart 和 compositionend

利用 compositionstart 和 compositionend 可以知道中文输入什么时候开始和结束。

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
  name: "app",
  data() {
    return {
      filterText: "",
      list: ["The Wealth of Nations", "战争与和平", "海底两万里", "三国演义"],
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

### 获取链接中的参数

```javascript
let type = new URLSearchParams(location.search).get("type");
```

### 全屏展示 Dom 元素

- requestFullscreen：系统上以全屏模式显示所选元素，会关闭其他应用程序以及浏览器和系统 UI 元素。
- exitFullscreen：退出全屏模式并切换到正常模式。
  [全屏展示 Dom](https://juejin.cn/post/7133096500753596446#heading-2)

### Event、EventTarget、Node、Document、HTMLElement 的关系

- HTMLElement extends Element

1. Element extends Node ， Document extends Node
2. Node extends EventTarget
3. Event 是发生在 dom 的事件，其中 target 属性为 EventTarget | null
4. Node 有很多 dom 的 API，Document 对 Element 又进行扩充，像 className 就是 Element 特有的，document 有 cookie,domain 之类特有的。
5. 而 HTMLElement 就是扩充自 Element，比 Element 多了 offsetHeight 之类属性。

### 深入 Try Catch

```javascript
try {
  setTimeout(() => {
    throw new Error("test");
  }, 0);
} catch (e) {
  console.error("error");
}
// 这里的错误将无法被捕获，try-catch 只能捕获到当前调用栈中的错误，而 setTimeout 作为一个宏任务将会脱离外层 try-catch 调用栈运行，
// 导致无法被外层 try-catch 所捕获。
```

```javascript
console.log(
  (() => {
    try {
      throw new Error("test");
    } catch (e) {
      return "catch";
    } finally {
      return "finally";
    }
  })()
);
// 打印出 finally.在你想要跳出代码块时：如 try、catch 中存在 return、break 等等语句时，finally 将会霸道的拦截跳出语句，
// 这就导致如果你在 try 或 catch 中存在跳出语句，而在 finally 中同样存在跳出语句，那你的 try、catch 块中的跳出语句将永远无法运行。
```

### 创建不继承 Object.prototype 的对象

我们可以通过使用 Object.create(null) 来解决这个问题，它可以生成一个不继承 Object.prototype 的对象。

### 获取指定长度的随机数组

```javascript
function createData(length) {
  return Array.from({ length }, (val, i) => {
    return ~~(Math.random() * length);
  });
}
createData(100);
// Aray.map() 方法会跳过空项
// (100) [43, 14, 70, 85, 74, 35, 19, 50, 63, 5, 27, 22, 36, 34, 25, 33, 40, 26, ...
```

### 获取拖拽的文件

```javascript
el.addEventListener("drop", (e) => {
  const [file] = e.dataTransfer.files;
  fileData.value = file;
  el.style.borderColor = "#eee";
  e.preventDefault();
});
```

### 根据文件内容判断文件类型

```javascript
// 参考链接 https://www.notion.so/97141a6fb1b54c1795f2be054d1f75d9?v=f3c65f144fc2497a98205683771bda53
//  - JPG：文件头为 FF D8 FF
//  - PNG：文件头为 89 50 4E 47
//  - GIF：文件头为 47 49 46 38
const isGif = async (file: File): Promise<boolean> => {
  const ret = await blobToString(file.slice(0, 4));
  return ret === "47 49 46 38";
};
const blobToString = (blob: Blob): Promise<string> => {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = (reader.result as string)
        .split("")
				// 转化成 asc 码
        .map((v: string) => v.charCodeAt(0))
				// 转化成 16 进制
        .map((v: number) => v.toString(16))
				// 补齐 0
        .map((v: string) => v.padStart(2, "0"))
        .join(" ");
      resolve(result);
    };
    reader.readAsBinaryString(blob); //转化为2进制
    // 还存在readAsArrayBuffer、readAsDataURL、readAsText
  });
};
```

### structuredClone

JavaScript 中有一种原生的方法来做对象的深拷贝? structuredClone 函数，内置在 JavaScript 运行时

```javascript
const calendarEvent = {
  title: "Builder.io Conf",
  date: new Date(123),
  attendees: ["Steve"],
};
const copied = structuredClone(calendarEvent);
```

::: tip
structuredClone 缺点
1、无法拷贝函数、方法、DOM，当拷贝函数、方法、DOM 时，就会抛出异常。  
2、属性描述符、setter 和 getter 属性描述符、setter 和 getter 以及类似的元数据都不能被克隆。例如，对于 getter，结果值被克隆，但 getter 函数本身没有被克隆。  
3、原型链不能被遍历或拷贝。所以如果克隆一个实例 MyClass，克隆的对象将不再是这个类的一个实例（但是这个类的所有有效属性都将被拷贝
:::

### 获取视频真实宽高

```html
<video src="https://www.w3schools.com/html/movie.mp4#t=0.01" controls="controls" id="video"></video>
<script>
  const video = document.getElementById("video");
  video.addEventListener("canplay", function (e) {
    var width = e.target.videoWidth;
    var height = e.target.videoHeight;
    console.log(width, height);
  });
</script>
```

### 随机 key crypto.randomUUID() 浏览器自带

```javascript
id: crypto.randomUUID();
```

### 跳出指定层级循环

```javascript
function test() {
  let baseCount = 5;
  baseWhile: while (baseCount--) {
    let count = 10;
    while (count--) {
      if (count === 5) {
        break baseWhile;
      }
    }
  }
  console.log("test", baseCount);
}
test();

function test2() {
  let baseCount = 5;
  baseWhile: for (baseCount; baseCount > 0; baseCount--) {
    let count = 10;
    while (count--) {
      if (count === 5) {
        continue baseWhile;
      }
    }
  }
  console.log("test", baseCount);
}
test2();
```

### 使用 void 0 替换 undefined

```javascript
void 0 === undefined;
// undefined不是一个关键字，这玩意儿是全局变量的一个属性
```

### void 后加函数

```javascript
// 明确忽略函数返回值
void alert("执行弹窗"); // 明确表示不关心 alert 的返回值
```

### 中文首字母排序

```javascript
["张三", "李四", "王五"].sort((a, b) =>
  a.localeCompare(b, "zh-Hans-CN", { sensitivity: "accent" })
);
```

### 串行执行多个接口

```javascript
const requestAry = [() => api.request1(), () => api.request2(), () => api.request3()];
const finallyPromise = requestAry.reduce(
  (currentPromise, nextRequest) => currentPromise.then(() => nextRequest()),
  Promise.resolve() // 创建一个初始promise，用于链接数组内的promise
);
```

### 获取字符串大小

```javascript
function getStringSizeInBytes(str) {
  // 使用UTF-8编码计算字符串的字节长度
  let totalBytes = new Blob([str]).size;

  // 将字节长度转换为兆字节（MB）
  let sizeInMB = totalBytes / (1024 * 1024);

  // 返回结果
  return sizeInMB;
}

// 示例用法
let myString = "这是一个字符串";
let sizeInMB = getStringSizeInBytes(myString);
console.log(sizeInMB + " MB");
```

### 取消 fetch 请求

```javascript
// 取消fetch
const controller = new AbortController();
void (async function () {
  const response = await fetch("<http://127.0.0.1:3000/api/get>", {
    signal: controller.signal,
  });
  const data = await response.json();
})();

setTimeout(() => {
  controller.abort();
}, 1000);

// 取消axios
const controller = new AbortController();
const API_URL = "<http://127.0.0.1:3000/api/get>";
void (async function () {
  const response = await axios.get(API_URL, {
    signal: controller.signal,
  });
  const { data } = response;
})();
setTimeout(() => {
  controller.abort();
}, 1000);
```

### 字符串比较大小

而当字符串长度大于 1 的时候比较则是逐位进行，因此'5'>'10'进行比较时，首先比较第一位也就是'5'>'1'，  
如果有结果则返回，没有结果则继续比较第二位。所以'5'>'10'的结果与'5'>'1'相同，也是 true。

### 空数组，every 返回 true

```javascript
[].every((item) => item); // true
```

### 清空数组

`arr1.length = 0` 会把引用类型的数组也清空

```javascript
const arr1 = [1, 2, 3];
const arr2 = arr1;
arr1 = [];
// arr2 = [1, 2, 3]
arr1.length = 0;
// arr2 = []
```

### 检测浏览器是否支持 sticky

```typescript
function checkIsSupportSticky() {
  const testNode = document.createElement("div");
  return ["", "-webkit-"].some((prefix) => {
    testNode.style.position = prefix + "sticky";
    return testNode.style.position !== "";
  });
}
```

### requestAnimationFrame 回调函数参数时间

- requestAnimationFrame 回调函数的参数 rafTime 接近一帧的开始时间。
- performance.now()输出的值接近回调函数的开始执行时间。

### 比较 reject / throw

- 如果 Promise 内有异步回调函数，我们就不能在回调函数内使用 throw，因为 catch() 不会识别它，我们将在输出中得到一个错误。
- throw 抛出异常后，函数执行将退出， 而 reject 不会， 后面代码会继续执行。
- reject 需要与 promise 一起使用, 而 throw 可以结果 try/catch 在任意代码中使用。

### jscodeshift

代码自动化重构

```bash
npm install -g jscodeshift
jscodeshift -t transform.js --parser=ts path/to/your/code
# transform.js 脚本文件
# path/to/ 要转换的文件路径
# --parser=ts 使用ts解析器
# --parser=tsx 使用tsx解析器
# babel,babylon,flow,ts,tsx
```

```js
const chalk = require("chalk");
const { log } = console;
// jscodeshift -t ./scripts/format-try-catch.js scripts/test/format-try-catch-test.js
export default function transformer(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  root.find(j.VariableDeclarator);
  return root.toSource();
}
// 奇怪这样输出也会给源文件的返回值添加括号
```

[jscodeshift 仓库](https://github.com/facebook/jscodeshift?tab=readme-ov-file)
[常用脚本](https://github.com/cpojer/js-codemod/tree/master)

### 显示上传图片

```js
function readImage() {
  const fileReader = new FileReader();
  const file = document.getElementById("uploaded-file").files[0];

  if (file) {
    fileReader.readAsDataURL(file);
  }

  fileReader.addEventListener(
    "load",
    () => {
      const result = fileReader.result;
      const resultContainer = document.getElementById("result");
      const img = document.createElement("img");
      img.src = result;
      resultContainer.append(img);
    },
    { once: true }
  );
}
```
