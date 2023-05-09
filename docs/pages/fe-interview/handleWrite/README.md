---
home: false
sidebar: true
---

### 手写Call 
``` javascript

Function.prototype.myCall = function(context) {
  if(typeof this !== 'function') {
    throw new Error('Error Call');
  }
  let args = [...arguments].slice(1);
  let symbolField = new Symbol();
  let result = null;
  context = context | window;
  context[symbolField] = this;
  result = context[symbolField](...args);
  delete context[symbolField];
  return result;
}

```

### 手写Apply 
``` javascript

Function.prototype.myApply = function(context) {
  if(typeof this !== 'function') {
    throw new Error('Error Call');
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
}

```

### 手写Bind 
``` javascript

Function.prototype.myBind = function(context) {
  if(typeof this !== 'function') {
    throw new Error('Error Call');
  }
  let args = [...arguments].slice(1);
  context = context | window;
  let fn = this;
  return function Fn() {
    return fn.apply(
      this instanceof Fn ? this : context,
      args.concat(...arguments)
    )
  };
}

```

### 手写深度克隆

``` javascript

function deepClone(object = {}, map = new map()) {
  if (typeof object !== 'object') {
    return object;
  }
  if (map.get(object)) {
    return map.get(object);
  }
  let result = {};
  if (Array.isArray(object) || Object.prototype.toString(obj) === "[object Array]") {
    result = [...object];
  }
  map.set(object, result);
  for (let item in object) {
    if (object.hasOwnProperty(item)) {
      result[item] = deepClone(object[item], map);
    }
  }
  return result;
}

```

### 手写new
首先创一个新的空对象。
根据原型链，设置空对象的 __proto__ 为构造函数的 prototype。
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

### 手写reduce

``` javascript
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
``` javascript
let compose = function () {
    let args = [].slice.call(arguments);
    return function (x) {
        return args.reduceRight((res,cb) => {
           return cb(res); 
        },x)
    }
}
let add = (X) => X + 10;
let multiply = (y) => y * 10;
let calculate = compose(multiply, add);
console.log(calculate(10)); // 200
```
``` javascript
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
``` javascript
// 函数柯里化
//普通函数
function add(a, b, c) {
  return a + b + c;
}
add(1,2,3) //6
 
//手动柯里化后的函数,其参数可以逐步单个传入,得到相同结果。
function _add(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        }
    }
}
 
_add(1)(2)(3);//6

```
### 数组扁平化
``` javascript
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
``` javascript
const mytypeof=function(obj){
  return Object.prototype.toString.call(obj).slice(8,-1).toLowerCase();
}
console.log(mytypeof('123')); 
```

### instanceof

``` javascript
const myinstanceof=(fn,Fn)=>{
    let p=fn.__proto__;
    while(p){
        if(p===Fn.prototype){
            return true;//实例的原型等于构造函数的原型对象,即A是B的实例
        }
        p=p.__proto__;//顺着原型链查找
    }
    return false;
}
console.log(myinstanceof(Function,Function))

```
### LRU缓存
实现思路
1. 设定缓存的最大数据量maxSize
2. 数据按照最近访问时间进行排序，最近访问的数据放在最后
3. 访问时若数据存在则将数据移动到最后
添加数据时：
- 数据存在，则移动到最后
- 不存在，若队列中数据量已到最大值，删除第一个数据，再添加新数据；否则直接添加新数据
``` javascript
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
``` javascript
// 防抖
function debounce (callback,delay) {
    var t = null;
    return function () {
        clearTimeout(t);
        t = setTimeout(callback,delay);
    }
}
window.onscroll = debounce(function(){
    console.log("调用了一次");
},500)

// 节流;
function throttle (callback,duration){
    var lastTime = new Date().getTime();
    return function () {
        var now = new Date().getTime();
        if(now - lastTime > duration){
            callback();
            lastTime = now;
        }
    }
}
window.onscroll = throttle(function(){
    console.log("调用了一次");
},500)
```

### promise.all、 promise.race
``` javascript
// promise.race
Promise.prototype.all = (arr) => {
  console.log('my all called');
  let result = new Array(arr.length);
  let counter = 0;//注意这里通过一个变量取保存它的成功的数量
  return new Promise((resolve, reject) => {
      arr.forEach(async (item, index) => {
          let i = index;
          Promise.resolve(item).then(value => {
            result[i] = value;
            counter++;
            if (counter === arr.length) {
              //通过conter变量比较，而不是直接通过result.length去判断
              resolve(result);
            }
          }).catch(err => {
            reject(err)
          })
      })
  });
}
```

``` javascript
// promise.race
Promise.prototype.race=function(arr){
    return new Promise((resolve,reject)=>{
        arr.forEach((item,i) => {
            Promise.resolve(item).then(val=>{
                resolve(val)
            },err=>{
                reject(err)
            })
        });
    })
}
```
### promise.finally
``` javascript
Promise.prototype.myFinally = function(cb) {//cb就是要共同执行的逻辑
    return this.then(//谁调用finally，this就是谁
        value => Promise.resolve(cb()),//不管调用finally的promise是什么状态都会执行这个cb
        error =>//不管调用finally的promise是什么状态都会执行这个cb
        Promise.resolve(cb())
    );
};
```

### javascript 寄生组合式继承

``` javascript
//定义父对象
function Father(name, age){
    this.name = name;
    this.age = age;
}
Father.prototype = {
    getName: function(){
        alert(this.name);
    },
    getAge: function(){
        alert(this.age);
    }
}
//定义子对象
function Son(sex, name, age){
  this.sex = sex;
  Father.call(this, name, age); //继承Father的属性, 此处是一份副本
}
//extend(子对象, 父对象)
function extend(suberClass, superClass){
  var object = function(o){
      var F = function(){};
      F.prototype = o;
      return new F();
  }; //object作用就是拷贝一份父对象
  suberClass.prototype = object(superClass.prototype);
  suberClass.prototype.constructor = suberClass; //强制constructor指向suberClass
}
extend(Son, Father); //执行函数
//继续为子类添加其它方法
Son.prototype.getSex = function(){
  alert(this.sex);
}
//定义一个相同的方法, 屏蔽父对象的同名方法
Son.prototype.getName = function(name){
  alert(this.name = name);
}
new Son('male', 'jack').getName('tom'); //'tom'
new Father('jack').getName(); //'jack'
```


### 限制并发池子
``` typescript
async function sendRequest(requestList,limits,callback){

    // 维护一个promise队列

    const promises = []

    // 当前的并发池,用Set结构方便删除

    const pool = new Set() // set也是Iterable<any>[]类型，因此可以放入到race里

    // 开始并发执行所有的任务

    for(let request of requestList){

        // 开始执行前，先await 判断 当前的并发任务是否超过限制

        if(pool.size >= limits){

            // 这里因为没有try catch ，所以要捕获一下错误，不然影响下面微任务的执行


            await Promise.race(pool)

            .catch(err=>err)

        }

        const promise = request()// 拿到promise

        // 删除请求结束后，从pool里面移除

        const cb = ()=>{

            pool.delete(promise)

        }

        // 注册下then的任务

        promise.then(cb,cb)

        pool.add(promise)

        promises.push(promise)

    }

    // 等最后一个for await 结束，这里是属于最后一个 await 后面的 微任务

    // 注意这里其实是在微任务当中了，当前的promises里面是能确保所有的promise都在其中(前提是await那里命中了if)


    Promise.allSettled(promises).then(callback,callback)

}
// 总结一下要点：

// 利用race的特性可以找到 并发任务 里最快结束的请求
// 利用for await 可以保证for结构体下面的代码是最后await 后的微任务，而在最后一个微任务下，可以保证所有的promise已经存入promises里（如果没命中任何一个await，即限制并发数>任务数的时候，虽然不是在微任务当中，也可以保证所有的promise都在里面），最后利用allSettled，等待所有的promise状态转变后，调用回调函数
// 并发任务池 用Set结构存储，可以通过指针来删除对应的任务，通过闭包引用该指针从而达到 动态控制并发池数目
// for await 结构体里，其实await下面，包括结构体外 都是属于微任务（前提是有一个await里面的if被命中），至于这个微任务什么时候被加入微任务队列，要看请求的那里的在什么时候开始标记（resolve/reject ）
// for await 里其实 已经在此轮宏任务当中并发执行了，await后面的代码被挂起来，等前一个promise转变状态-->移出pool-->将下一个promise捞起加入pool当中 -->下一个await等待最快的promise，如此往复。

```
