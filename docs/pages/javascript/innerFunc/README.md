``` javascript
关于includes和indexOf的学习笔记：
1. 主要用途：判断字符串或者数组中是否存在对应的元素
2. 两者的区别
（1）NaN includes 能匹配到NaN，indexOf不能匹配到NaN
（2）undefined  includes能识别到稀疏数组中的undefined，indexOf不可以
3.字符串和数组中的indexOf方法比较：字符串会进行类型转换，数组会严格匹配（===）
4.字符串和数组中的includes方法比较：字符串会进行类型转换，数组会严格匹配（===）

```

``` javascript
splice 操作方法是非常耗时的，每次删除元素之后，需要重排数组中的元素，具有相同副作用的操作方法还有 unshift 和 shift 
相比较下，pop 和 push 则是非常快的操作方法，
```

``` javascript
function base64Encode(str) {
  return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1)));
}
// btoa()函数可以将字符串编码为Base64格式，而encodeURIComponent()函数则可以将字符串转换为可传输的URI格式。我们还使用了一个正则表达式来将URI格式中的特殊字符进行替换。
```

###
::: tip
Iterator 的作用
为各种数据结构，提供一个统一的、简便的访问接口。
ES6提出了新的遍历命令for...of循环，Iterator 接口主要供for...of消费。
:::

``` javascript
var arr = [1,2,3,4,5];
var arrValue = arr[Symbol.iterator]();
arrValue.next(); // 1
arrValue.next(); // 2
arrValue.next(); // 3
...
```

``` javascript
function objectIterator() {
  const keys = Object.keys(this)
  let index = 0
  return {
    next: () => {
      const done = index >= keys.length
      const value = done ? undefined : this[keys[index]]
      index++
      return {
        done,
        value
      }
    }
  }
}

Object.prototype[Symbol.iterator] = objectIterator

const obj = {
  key: '1',
  value: '2'
}

for (const iterator of obj) {
  console.log(iterator)
}
```

### Array.protoType.FlatMap
用来实现过滤切格式化处理数组

``` javascript
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const squaredOddNumbers = numbers.flatMap(num => 
    num % 2 !== 0 ? [num * num] : []
);

console.log(squaredOddNumbers);
// 输出：[1, 9, 25, 49, 81]
```

### 使用URL URLSearchParams 方式避免url参数拼接

``` javascript
function constructURL(param) {
  const { category, limit, userId } = param;
  const baseURL = "https://fakestoreapi.com/products";
  const url = new URL(baseURL);
  const params = new URLSearchParams();

  if (category) url.pathname += `/category/${category}`;
  if (limit) params.append('limit', Number(limit).toString());
  if (userId) params.append('userId', Number(userId).toString());

  url.search = params.toString();
  return url.toString();
}

```

### 获取是否文字省略Ellipsis生效

``` javascript

const checkEllipsis = () => {
  const range = document.createRange();
  range.setStart(box, 0)
  range.setEnd(box, box.childNodes.length)
  let rangeWidth = range.getBoundingClientRect().width
  let rangeHeight = range.getBoundingClientRect().height
  const contentWidth = rangeWidth - Math.floor(rangeWidth)
  const { pLeft, pRight } = getPadding(box)
  const horizontalPadding = pLeft + pRight
  if (rangeWidth + horizontalPadding > box.clientWidth) {
    result.textContent = '存在省略号'
  } else {
    result.textContent = '容器宽度足够，没有省略号了'
  }
}

```

### crypto.getRandomValues() 获取真随机数

``` javascript
let array = new Uint32Array(1);
window.crypto.getRandomValues(array);
let randomNum = array[0] % 100;

```

### MessageChannel 

MessageChannel允许我们在不同的浏览上下文，比如window.open()打开的窗口或者iframe等之间建立通信管道，并通过两端的端口（port1和port2）发送消息。MessageChannel以DOM Event的形式发送消息，所以它属于异步的宏任务。

``` javascript
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
