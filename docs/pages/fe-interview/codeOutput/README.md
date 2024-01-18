---
home: false
sidebar: false
---

### 代码输出

``` javascript
var b = 10;
(function b(){
    b = 20;
    console.log(b);
})();
// undefined
// 代码预解析时，会将var b进行变量提升，此时b没有被赋值(b=undefined) (这里有人会说这里明明有个函数表达式呀，为什么没有进入变量提升，因为IIFE自带有词法作用域(我们常理解得作用域))
// 碰到了b = 20，会顺着作用域链寻找是否存在b，发现IIFE作用域中存在b，将IIFE作用域中的b赋值为20(b=20)(因为函数表达式特性，标识符无法被修改，所以这里执行失败)
```
### promise.then的第二个参数写了， promise.catch就不会执行
### async函数中await的new Promise要是没有返回值的话则不执行后面的内容
### .then函数中的参数期待的是函数，如果不是函数的话会发生透传
### .then 返回任意一个非 promise 的值都会被包裹成 promise 对象
### await 里的函数是同步函数则直接执行不会进入微任务队列
### await后面的Promise没有返回值，也就是它的状态始终是pending状态，后面的代码不会执行
### async函数包裹一个普通函数返回值，会返回promise.resolve(返回值)的promise, 如果async包裹的函数没有返回值，async函数.then 会返回一个promise
### race()的作用也是接收一组异步任务，然后并行执行异步任务，只保留取第一个执行完成的异步操作的结果，race、all、allSettle执行时其他的异步方法代码仍在执行，不过执行结果会被抛弃。
### finally是新一层的微任务队列执行
### function的length，就是第一个具有默认值之前的参数个数

``` javascript
Promise.resolve('2')
  .finally(() => {
  	return '我是finally2返回的值'
  })
  .then(res => {
    console.log(res) // 2
  })

Promise.resolve()
  .then(function success (res) {
    throw new Error('error!!!')
  }, function fail1 (err) {
    console.log('fail1', err)
  }).catch(function fail2 (err) {
    console.log('fail2', err) // fail2 Error: error!!!
  })
```

