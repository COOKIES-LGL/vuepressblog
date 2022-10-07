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
  fn = this;
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
    result = [];
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
根据原型链，设置空对象的 __proto__ 为构造函数的 prototype 。
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

### promise.all
``` javascript
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
