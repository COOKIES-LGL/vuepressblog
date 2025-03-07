---
home: false
sidebar: false
---

### 代码输出

```javascript
var b = 10;
(function b() {
  b = 20;
  console.log(b);
})();
// undefined
// 代码预解析时，会将var b进行变量提升，此时b没有被赋值(b=undefined) (这里有人会说这里明明有个函数表达式呀，为什么没有进入变量提升，因为IIFE自带有词法作用域(我们常理解得作用域))
// 碰到了b = 20，会顺着作用域链寻找是否存在b，发现IIFE作用域中存在b，将IIFE作用域中的b赋值为20(b=20)(因为函数表达式特性，标识符无法被修改，所以这里执行失败)
```

### promise.then 的第二个参数写了， promise.catch 就不会执行

### async 函数中 await 的 new Promise 要是没有返回值的话则不执行后面的内容

### .then 函数中的参数期待的是函数，如果不是函数的话会发生透传

### .then 返回任意一个非 promise 的值都会被包裹成 promise 对象

### await 里的函数是同步函数则直接执行不会进入微任务队列

### await 后面的 Promise 没有返回值，也就是它的状态始终是 pending 状态，后面的代码不会执行

### async 函数包裹一个普通函数返回值，会返回 promise.resolve(返回值)的 promise, 如果 async 包裹的函数没有返回值，async 函数.then 会返回一个 promise

### race()的作用也是接收一组异步任务，然后并行执行异步任务，只保留取第一个执行完成的异步操作的结果，race、all、allSettle 执行时其他的异步方法代码仍在执行，不过执行结果会被抛弃。

### finally 是新一层的微任务队列执行

### function 的 length，就是第一个具有默认值之前的参数个数

### promise return 一个 pending 的 promise 可以中断后续流程

### async 函数中 await 的 new Promise 要是被 reject 后面的代码不会执行

### .then 函数中的参数期待的是函数，如果不是函数的话会发生透传

```javascript
Promise.resolve("2")
  .finally(() => {
    return "我是finally2返回的值";
  })
  .then((res) => {
    console.log(res); // 2
  });

Promise.resolve()
  .then(
    function success(res) {
      throw new Error("error!!!");
    },
    function fail1(err) {
      console.log("fail1", err);
    }
  )
  .catch(function fail2(err) {
    console.log("fail2", err); // fail2 Error: error!!!
  });
```

### 实现 Promise.all 失败之后依然可以往下执行

```javascript
let p11 = Promise.resolve(1);
let p22 = Promise.resolve(2);
let p33 = Promise.reject("error");
let arr = [p11, p22, p33];

let all = Promise.all(
  arr.map((promise) =>
    promise.catch((e) => {
      console.log("错误信息" + e);
    })
  )
);
all
  .then((res) => {
    console.log("res:");
    console.log(res);
  })
  .catch((err) => {
    console.log("err:");
    console.log(err, "这个不会执行");
  });
```

### 以下输出

```javascript
// example 1
var a={}, b='123', c=123;
a[b]='b';
a[c]='c';
console.log(a[b]); // c
---------------------
// example 2
var a={}, b=Symbol('123'), c=Symbol('123');
a[b]='b';
a[c]='c';
console.log(a[b]); // b
---------------------
// example 3
var a={}, b={key:'123'}, c={key:'456'};
a[b]='b';
a[c]='c';
console.log(a[b]); // c
```

```js
let person = { name: "Lydia" };
const members = [person];
person = null;
console.log(members); // [{ name: "Lydia" }]
```
