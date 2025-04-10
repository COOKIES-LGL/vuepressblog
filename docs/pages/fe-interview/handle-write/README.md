---
home: false
sidebar: true
---

### 手写 Call

```javascript
Function.prototype.myCall = function (context) {
  if (typeof this !== "function") {
    throw new Error("Error Call");
  }
  let args = [...arguments].slice(1);
  let symbolField = new Symbol();
  let result = null;
  context = context | window;
  context[symbolField] = this;
  result = context[symbolField](...args);
  delete context[symbolField];
  return result;
};
```

### 手写 Apply

```javascript
Function.prototype.myApply = function (context) {
  if (typeof this !== "function") {
    throw new Error("Error Call");
  }
  let symbolField = new Symbol();
  let result = null;
  context = context | window;
  context[symbolField] = this;
  if (arguments[1]) {
    result = context[symbolField](...arguments[1]);
  } else {
    result = context[symbolField]();
  }
  delete context[symbolField];
  return result;
};
```

### 手写 Bind

```javascript
Function.prototype.myBind = function (context) {
  if (typeof this !== "function") {
    throw new Error("Error Call");
  }
  let args = [...arguments].slice(1);
  context = context | window;
  let fn = this;
  return function Fn() {
    return fn.apply(this instanceof Fn ? this : context, args.concat(...arguments));
  };
};
```

### 手写深度克隆

```javascript
function deepClone(oldObject, map = new WeakMap()) {
  if (map.has(oldObject)) return map.get(oldObject);
  let newObject = Array.isArray(oldObject) ? [] : {};
  // 一、拷贝基本数据类型
  // 判断是否为基本数据类型
  const oldObjectType = typeof oldObject;
  if (oldObjectType !== "object") {
    newObject = oldObject;
  }
  // 六、拷贝函数
  if (oldObjectType === "[object Function]") {
    newObject = oldObject;
  }

  // 六、拷贝数组
  if (Array.isArray(obj)) {
    return obj.map((item) => deepClone(item));
  }
  // 七、拷贝值为symbol类型的数据
  if (oldObjectType === "[object Symbol]") {
    newObject = Symbol(oldObject.description);
  }

  // 八、拷贝时间类型
  if (oldObjectType === "[object Date]") {
    newObject = new Date(oldObject);
  }
  map.set(oldObject, newObject);
  for (const key in oldObject) {
    if (oldObject.hasOwnProperty(key)) {
      newObject[key] = deepClone(oldObject[key], map);
    }
  }
  return newObject;
}
```

**方式二**

```js
// WeakMap是JavaScript中的一种内置数据结构，它是一种特殊的映射（Map），用于存储键值对
// 与普通的Map不同，WeakMap的键必须是对象
function deepClone(obj, hash = new WeakMap()) {
  // 如果是null 或者 undefined 不进行拷贝操作
  if (obj === null) return obj;

  const oldObjectType = typeof obj;
  if (oldObjectType === "[object Symbol]") {
    return Symbol(oldObject.description);
  }
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 判断是否是对象，不是对象（普通值或者是函数）不需要拷贝
  if (typeof obj !== "object") return obj;
  // 是对象的话要进行深拷贝
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // 找到的是所属原型上的constructor,而原型上的constructor指向的是当前类本身
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
```

### 手写 new

首先创一个新的空对象。
根据原型链，设置空对象的 **proto** 为构造函数的 prototype。
构造函数的 this 指向这个对象，执行构造函数的代码（为这个新对象添加属性）。
判断函数的返回值类型，如果是引用类型，就返回这个引用类型的对象。

```javascript
function myNew(context) {
  const obj = new Object();
  obj.__proto__ = context.prototype;
  const res = context.apply(obj, [...arguments].slice(1));
  return typeof res === "object" ? res : obj;
}
```

### 手写 reduce

```javascript
Array.prototype.reduce = function (cb, initialValue) {
  const arr = this;
  let total = initialValue || arr[0];
  // 有初始值的话从0遍历，否则从1遍历
  for (let i = initialValue ? 0 : 1; i < arr.length; i++) {
    total = cb(total, arr[i], i, arr);
  }
  return total;
};
```

### compose 函数

```javascript
let compose = function () {
  let args = [].slice.call(arguments);
  return function (x) {
    return args.reduceRight((res, cb) => {
      return cb(res);
    }, x);
  };
};
let add = (X) => X + 10;
let multiply = (y) => y * 10;
let calculate = compose(multiply, add);
console.log(calculate(10)); // 200
```

### 斐波那次

```javascript
function fibonacci (n) {
 if ( n <= 1 ) {return 1};
 return fibonacci(n - 1) + fibonacci(n - 2);
}
// 尾递归
function fibonacci(n, ac1=1,ac2=1){
  if(n<=1){return ac2}
 return fibonacci(n-1, ac2, ac1 + ac2)
}
// 闭包缓存实现
var fn = (function () {
  var arr = [0, 1, 1];
  return function (n) {
      var a = arr[n];
      if (a) {
        return a;
      } else {
        return arr[n] = fn(n-1) + fn(n-2);
      }
  }
})()；

```

```javascript
// 函数柯里化指的是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。
function curry(fn, args) {
  // 获取函数需要的参数长度
  let length = fn.length;
  args = args || [];
  return function() {
    let subArgs = args.slice(0);
    // 拼接得到现有的所有参数
    for (let i = 0; i < arguments.length; i++) {
      subArgs.push(arguments[i]);
    }
    // 判断参数的长度是否已经满足函数所需参数的长度
    if (subArgs.length >= length) {
      // 如果满足，执行函数
      return fn.apply(this, subArgs);
    } else {
      // 如果不满足，递归返回科里化的函数，等待参数的传入
      return curry.call(this, fn, subArgs);
    }
  };
}
​
// es6 实现
function curry(fn, ...args) {
  return fn.length <= args.length ? fn(...args) : curry.bind(null, fn, ...args);
}
```

### 有序数组原地去重

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) {
    return 0;
  }
  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return nums;
}
// 示例用法
const nums = [1, 1, 2, 2, 2, 3, 4, 4, 5];
removeDuplicates(nums);
```

### 数组扁平化

```javascript
function flat(arr, depth = 1) {
  if (depth > 0) {
    // 以下代码还可以简化，不过为了可读性，还是....
    return arr.reduce((pre, cur) => {
      return pre.concat(Array.isArray(cur) ? flat(cur, depth - 1) : cur);
    }, []);
  }
  return arr.slice();
}
```

### typeof

```javascript
const mytypeof = function (obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
};
console.log(mytypeof("123"));
```

### instanceof

```javascript
const myinstanceof = (fn, Fn) => {
  let p = fn.__proto__;
  while (p) {
    if (p === Fn.prototype) {
      return true; //实例的原型等于构造函数的原型对象,即A是B的实例
    }
    p = p.__proto__; //顺着原型链查找
  }
  return false;
};
console.log(myinstanceof(Function, Function));
```

### LRU 缓存

实现思路

1. 设定缓存的最大数据量 maxSize
2. 数据按照最近访问时间进行排序，最近访问的数据放在最后
3. 访问时若数据存在则将数据移动到最后
   添加数据时：

- 数据存在，则移动到最后
- 不存在，若队列中数据量已到最大值，删除第一个数据，再添加新数据；否则直接添加新数据

```javascript
class LRU {
  queue = new Map();
  constructor(capacity = 10) {
    // 设置容量
    this.capacity = capacity;
  }
  // 获取数据
  get(key) {
    if (this.queue.has(key)) {
      const value = this.queue.get(key);
      this.queue.delete(key);
      this.queue.set(key, value);
      return value;
    }
    return undefined;
  }
  // 添加数据， 如果存在则移动位置；若数据已经满了，删除第一个元素后再添加
  put(key, value) {
    if (this.queue.has(key)) {
      this.queue.delete(key);
      this.queue.set(key, value);
      return;
    }
    if (this.queue.size >= this.capacity) {
      this.removeFirstItem();
    }
    this.queue.set(key, value);
  }
  // 删除第一个元素
  removeFirstItem() {
    if (this.queue.size) {
      this.queue.delete(this.queue.keys().next().value);
    }
  }
  // 删除数据
  remove(key) {
    if (this.queue.has(key)) {
      this.queue.delete(key);
    }
  }
}
```

### 防抖节流

```javascript
// 防抖
function debounce(callback, delay) {
  var t = null;
  return function () {
    t && clearTimeout(t);
    t = setTimeout(callback, delay);
  };
}
window.onscroll = debounce(function () {
  console.log("调用了一次");
}, 500);

// 节流;
function throttle(callback, duration) {
  var lastTime = Date.now();
  return function () {
    var now = Date.now();
    if (now - lastTime > duration) {
      callback();
      lastTime = now;
    }
  };
}
window.onscroll = throttle(function () {
  console.log("调用了一次");
}, 500);
```

### promise.all、 promise.race

```javascript
// promise.race
Promise.prototype.all = (arr) => {
  console.log("my all called");
  let result = new Array(arr.length);
  let counter = 0; //注意这里通过一个变量取保存它的成功的数量
  return new Promise((resolve, reject) => {
    arr.forEach(async (item, index) => {
      let i = index;
      Promise.resolve(item)
        .then((value) => {
          result[i] = value;
          counter++;
          if (counter === arr.length) {
            //通过counter变量比较，而不是直接通过result.length去判断
            resolve(result);
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
};
```

```javascript
// promise.race
Promise.prototype.race = function (arr) {
  return new Promise((resolve, reject) => {
    arr.forEach((item, i) => {
      Promise.resolve(item).then(
        (val) => {
          resolve(val);
        },
        (err) => {
          reject(err);
        }
      );
    });
  });
};
```

### javascript 寄生组合式继承

```javascript
//定义父对象
function Father(name, age) {
  this.name = name;
  this.age = age;
}
Father.prototype = {
  getName: function () {
    alert(this.name);
  },
  getAge: function () {
    alert(this.age);
  },
};
//定义子对象
function Son(sex, name, age) {
  this.sex = sex;
  Father.call(this, name, age); //继承Father的属性, 此处是一份副本
}
//extend(子对象, 父对象)
function extend(suberClass, superClass) {
  var object = function (o) {
    var F = function () {};
    F.prototype = o;
    return new F();
  }; //object作用就是拷贝一份父对象
  suberClass.prototype = object(superClass.prototype);
  suberClass.prototype.constructor = suberClass; //强制constructor指向suberClass
}
extend(Son, Father); //执行函数
//继续为子类添加其它方法
Son.prototype.getSex = function () {
  alert(this.sex);
};
//定义一个相同的方法, 屏蔽父对象的同名方法
Son.prototype.getName = function (name) {
  alert((this.name = name));
};
new Son("male", "jack").getName("tom"); //'tom'
new Father("jack").getName(); //'jack'
```

### 手写 promise.finally

```javascript
Promise.prototype.finally = function (callback) {
  const P = this.constructor;
  return this.then(
    (value) => P.resolve(callback()).then(() => value),
    (reason) =>
      P.resolve(callback()).then(() => {
        throw reason;
      })
  );
};
```

### 限制并发池子

```typescript
async function sendRequest(requestList, limits, callback) {
  // 维护一个promise队列
  const promises = [];
  // 当前的并发池,用Set结构方便删除
  const pool = new Set(); // set也是Iterable<any>[]类型，因此可以放入到race里
  // 开始并发执行所有的任务
  for (let request of requestList) {
    // 开始执行前，先await 判断 当前的并发任务是否超过限制
    if (pool.size >= limits) {
      // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行
      await Promise.race(pool).catch((err) => err);
    }
    const promise = request(); // 拿到promise
    // 删除请求结束后，从pool里面移除
    const cb = () => {
      pool.delete(promise);
    };
    // 注册下then的任务
    promise.then(cb, cb);
    pool.add(promise);
    promises.push(promise);
  }
  // 等最后一个for await 结束，这里是属于最后一个 await 后面的 微任务
  // 注意这里其实是在微任务当中了，当前的promises里面是能确保所有的promise都在其中(前提是await那里命中了if)
  Promise.allSettled(promises).then(callback, callback);
}
// 总结一下要点：

// 利用race的特性可以找到 并发任务 里最快结束的请求
// 利用for await 可以保证for结构体下面的代码是最后await 后的微任务，而在最后一个微任务下，可以保证所有的promise已经存入promises里（如果没命中任何一个await，即限制并发数>任务数的时候，虽然不是在微任务当中，也可以保证所有的promise都在里面），最后利用allSettled，等待所有的promise状态转变后，调用回调函数
// 并发任务池 用Set结构存储，可以通过指针来删除对应的任务，通过闭包引用该指针从而达到 动态控制并发池数目
// for await 结构体里，其实await下面，包括结构体外 都是属于微任务（前提是有一个await里面的if被命中），至于这个微任务什么时候被加入微任务队列，要看请求的那里的在什么时候开始标记（resolve/reject ）
// for await 里其实 已经在此轮宏任务当中并发执行了，await后面的代码被挂起来，等前一个promise转变状态-->移出pool-->将下一个promise捞起加入pool当中 -->下一个await等待最快的promise，如此往复。
```

### 使用 Promise 实现：限制异步操作的并发个数，并尽可能快的完成全部

```javascript
function limitLoad(urls, handler, limit) {
  let sequence = [].concat(urls); // 复制urls
  // 这一步是为了初始化 promises 这个"容器"
  let promises = sequence.splice(0, limit).map((url, index) => {
    return handler(url).then(() => {
      // 返回下标是为了知道数组中是哪一项最先完成
      return index;
    });
  });
  // 注意这里要将整个变量过程返回，这样得到的就是一个Promise，可以在外面链式调用
  return sequence
    .reduce((pCollect, url) => {
      return pCollect
        .then(() => {
          return Promise.race(promises); // 返回已经完成的下标
        })
        .then((fastestIndex) => {
          // 获取到已经完成的下标
          // 将"容器"内已经完成的那一项替换
          promises[fastestIndex] = handler(url).then(() => {
            return fastestIndex; // 要继续将这个下标返回，以便下一次变量
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }, Promise.resolve()) // 初始化传入
    .then(() => {
      // 最后三个用.all来调用
      return Promise.all(promises);
    });
}
limitLoad(urls, loadImg, 3)
  .then((res) => {
    console.log("图片全部加载完毕");
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });
```

### 实现可以限制最大并发数的 promise.all

```javascript
function multiRequest(urls = [], maxNum) {
  // 请求总数量
  const sum = urls.length;
  // 根据请求数量创建一个数组来保存请求的结果
  const result = new Array(sum).fill(false);
  // 当前完成的数量
  let count = 0;

  return new Promise((resolve, reject) => {
    // 请求maxNum个
    while (count < maxNum) {
      next();
    }
    function next() {
      let current = count++;
      // 处理边界条件
      if (current >= sum) {
        // 请求全部完成就将promise置为成功状态, 然后将result作为promise值返回
        !result.includes(false) && resolve(result);
        return;
      }
      const url = urls[current];
      console.log(`开始 ${current}`, new Date().toLocaleString());
      fetch(url)
        .then((res) => {
          // 保存请求结果
          result[current] = res;
          console.log(`完成 ${current}`, new Date().toLocaleString());
          // 请求没有全部完成, 就递归
          if (current < sum) {
            next();
          }
        })
        .catch((err) => {
          console.log(`结束 ${current}`, new Date().toLocaleString());
          result[current] = err;
          // 请求没有全部完成, 就递归
          if (current < sum) {
            next();
          }
        });
    }
  });
}

const url = `https://www.baidu.com/s?wd=javascript`;
const urls = new Array(100).fill(url);

(async () => {
  const res = await multiRequest(urls, 10);
  console.log(res);
})();
```

### 图片预加载限制请求数量

```javascript
// 总任务
function loadImages(list) {
  const pageSize = 5;
  const pageNum = 0;
  const totalNum = list.length;
  return new Promise((resolve, reject) => {
    function run() {
      Promise.all(generateTasks(list, pageSize, pageNum)).then(() => {
        pageNum++;
        const hasLength = pageSize * pageNum;
        if (totalNum > hasLength) {
          run();
        } else {
          resolve(true);
        }
      });
    }
    run();
  });
}

// 子任务
function generateTasks(list, pageSize, pageNum) {
  const promiseArr = [];
  const start = pageNum * pageSize;
  const end = (pageNum + 1) * pageSize - 1;
  for (let i = start; i < end; i++) {
    const p = new Promise((resolve, reject) => {
      const img = new Image();
      img.src = list[i];
      img.onload = img.onerror = resolve;
    });
    promiseArr.push(p);
  }
  return promiseArr;
}
```

### 单点登录 前端实现

SSO 的工作原理

- 用户访问应用：用户尝试访问一个需要认证的应用或服务。
- 重定向到认证服务：如果用户尚未登录，应用会将用户重定向到一个集中的认证服务（通常是 SSO 提供者）。
- 用户认证：用户在认证服务中输入用户名和密码进行认证。
- 发放令牌：认证成功后，认证服务会生成一个令牌（Token），并将其返回给用户和应用。
- 访问应用：用户携带令牌访问应用，应用验证令牌的有效性后，允许用户访问资源。
- 令牌续期和注销：令牌通常具有有效期，过期后用户需要重新认证或续期。用户注销时，所有相关的令牌都会被无效化。

### 同父域的单点登录可以通过 cookie 或者 sessionStorage 实现

### 跨域单点登录

```javascript
// 获取 token
var token = result.data.token;
// 动态创建一个不可见的iframe，在iframe中加载一个跨域HTML
var iframe = document.createElement("iframe");
iframe.src = "http://app1.com/localstorage.html";
document.body.append(iframe);
// 使用postMessage()方法将token传递给iframe
setTimeout(function () {
  iframe.contentWindow.postMessage(token, "http://app1.com");
}, 4000);
setTimeout(function () {
  iframe.remove();
}, 6000);

// 在这个iframe所加载的HTML中绑定一个事件监听器，当事件被触发时，把接收到的token数据写入localStorage
window.addEventListener(
  "message",
  function (event) {
    localStorage.setItem("token", event.data);
  },
  false
);
```

### 手写 lodash 常用方法

#### keyBy

```javascript
// Output: {
//   "1": {
//     "id": 1,
//     "name": "月"
//   },
//   "2": {
//     "id": 2,
//     "name": "shan"
//   }
// }
keyBy(
  [
    { id: 1, name: "月" },
    { id: 2, name: "shan" },
  ],
  (x) => x.id
);
function keyBy(list, by) {
  return list.reduce((acc, x) => {
    acc[by(x)] = x;
    return acc;
  }, {});
}
```

#### lodashGet

```javascript
function lodashGet(object, path, defaultValue) {
  let obj = object;
  if (typeof path === "string") {
    const reg = /[^\[\]""''.]+/g;
    path = path.match(reg);
  }
  for (let key of path) {
    if (!obj) {
      return defaultValue;
    }
    obj = obj[key];
  }
  return obj;
}
const object = { a: [{ b: { c: 3 } }] };
console.log(get(object, 'a[0]["b"]["c"]'));
const object = { a: [{ b: { c: 3 } }] };
//=> 3
get(object, "a[0].b.c");
//=> 3
get(object, 'a[0]["b"]["c"]');
//=> 10086
get(object, "a[100].b.c", 10086);
```

### 实现 Compile 函数

```js
function compile(template) {
  const regex = /\{\{([^}]+)\}\}/g;
  return function (data) {
    return template.replace(regex, (match, path) => {
      const keys = path.trim().split(".");
      return keys.reduce((obj, key) => obj?.[key], data) || "";
    });
  };
}

// 使用示例
const template = "Hello, {{user.name}}! Age: {{age}}";
const render = compile(template);
console.log(render({ user: { name: "Alice" }, age: 25 }));
// 输出: "Hello, Alice! Age: 25"
```

### lodash get 函数实现

正则表达式 /$(\d+)$/g 会匹配字符串中的 ‌ 方括号包裹的数字，[数字] 转换为 .数字（如 `` → .0

```js
function myGet(obj, path, defaultValue) {
  // 统一处理路径格式：将字符串路径转为数组（如 'a.b.c' → ['a', 'b', '0', 'c']）
  const pathArray = Array.isArray(path)
    ? path
    : path
        .replace(/$(\d+)$/g, ".$1")
        .split(".")
        .filter(Boolean);

  let result = obj;
  for (const key of pathArray) {
    // 若中途遇到 null/undefined 或非对象，返回默认值
    if (result == null || typeof result !== "object") {
      return defaultValue;
    }
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
}
```

### 树形菜单渲染

输出可交互的树形菜单，点击父节点时切换子节点的显示状态。

```js
const treeData = [
  {
    id: 1,
    parent_id: 0,
    name: "北京",
    children: [
      {
        id: 3,
        parent_id: 1,
        name: "海淀区",
        children: [],
      },
      {
        id: 4,
        parent_id: 1,
        name: "朝阳区",
        children: [],
      },
    ],
  },
];
// 递归创建树节点
function createTreeNode(node, parentElement) {
  const div = document.createElement("div");
  div.className = "tree-node";
  div.textContent = node.name;

  // 点击事件：切换子节点显隐
  div.onclick = function () {
    const childrenDiv = parentElement.querySelector(".children");
    if (childrenDiv) {
      childrenDiv.style.display = childrenDiv.style.display === "none" ? "block" : "none";
    }
  };

  parentElement.appendChild(div);

  // 递归处理子节点
  if (node.children?.length) {
    const childrenDiv = document.createElement("div");
    childrenDiv.className = "children";
    node.children.forEach((child) => createTreeNode(child, childrenDiv));
    parentElement.appendChild(childrenDiv);
  }
}

// 渲染根节点
const treeElement = document.getElementById("tree");
treeData.forEach((node) => createTreeNode(node, treeElement));
```
