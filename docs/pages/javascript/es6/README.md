### Symbol使用技巧

::: tip
symbol 作为对象的属性无法通过.运算符获取,需要使用[symbol]
全局共享Symbol
let a = Symbol.for("a")
let b = Symbol.for("a")
a === b // true
Symbol.keyFor(a) 可以通过变量名查询该变量名对应的Symbol是否在全局注册表中
:::

::: tip
我们还可以通过更改内置Symbol值对应的方法来达到更改外部方法作用的效果。
class demo {
    static [Symbol.hasInstance](item) {
        return item === "恶霸"
    }
}
"恶霸" instanceof demo // true
Symbol.hasInstance对应的外部方法是instanceof，这个大家熟悉吧，经常用于判断类型。而在上面的代码片段中，我创建了一个demo类，并重写了Symbol.hasInstance，所以其对应的instanceof行为也会发生改变，其内部的机制是这样的：当我们调用instanceof方法的时候，内部对应调用Symbol.hasInstance对应的方法即return item === "恶霸"
:::

### flatMap
使用这个内置方法代替filter and map
``` javascript
const arr1 = [1, 2, 1];

const result = arr1.flatMap((num) => (num === 2 ? [2, 2] : 1));

console.log(result);
// Expected output: Array [1, 2, 2, 1]

```

### WeakMap 弱引用的只是键名，而不是键值。键值依然是正常引用
``` javascript
const wm = new WeakMap();
let key = {};
let obj = {foo: 1};

wm.set(key, obj);
obj = null;
wm.get(key)
// Object {foo: 1}
```

### 输出结果

```
Promise.resolve().then(() => {
    return Promise.resolve(4);
})
```
核心就是会比正常的return一个非Promise的值时，多两个微任务.then().then()

### class类无法遍历它实例原型链上的属性和方法

### new.target

``` javascript
// new.target属性允许你检测函数或构造方法是否是通过new运算符被调用的
function Foo() {
  if (!new.target) throw "Foo() must be called with new";
  console.log("Foo instantiated with new");
}

Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new"
```
