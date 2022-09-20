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
  let symbolField = new Symbol();
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

