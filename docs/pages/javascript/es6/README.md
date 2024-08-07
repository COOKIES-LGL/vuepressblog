### Symbol使用技巧

::: tip 
symbol 作为对象的属性无法通过.运算符获取,需要使用[symbol]
全局共享Symbol
``` javascript
let a = Symbol.for("a")
let b = Symbol.for("a")
a === b // true
Symbol.keyFor(a) // 可以通过变量名查询该变量名对应的Symbol是否在全局注册表中
```
:::

::: tip
我们还可以通过更改内置Symbol值对应的方法来达到更改外部方法作用的效果。
``` js
class demo {
    static [Symbol.hasInstance](item) {
        return item === "恶霸"
    }
}
"恶霸" instanceof demo // true
```
Symbol.hasInstance对应的外部方法是instanceof，这个大家熟悉吧，经常用于判断类型。而在上面的代码片段中，我创建了一个demo类，并重写了Symbol.hasInstance，所以其对应的instanceof行为也会发生改变，其内部的机制是这样的：当我们调用instanceof方法的时候，内部对应调用Symbol.hasInstance对应的方法即return item === "恶霸"
:::

### flatMap
只能增加数组元素不能减少
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

### WeakSet与Set的差异

- 对于WeakSet实例，若调用了add()方法时传入了非对象的参数，则会抛出错误。如果在has()或者delete()方法中传入了非对象的参数则会返回false；
- Weak Set不可迭代，因此不能用于for-of循环；
- Weak Set 无法暴露出任何迭代器（例如 keys() 与 values() 方法） ，因此没有任何编程手段可用于判断 Weak Set 的内容；
- Weak Set没有forEach()方法；
- Weak Set没有size属性；

### WeakMap与Map的差异

- WeakMap的键必须是对象，值可以是任意类型
- 可以使用has()方法来检查Weak Map中是否存在某一个键值对，使用delete()方法可以删除一个键值对。
- clear() 方法不存在，
- Weak Map 只为它们的内容提供了很小的可见度，因此你不能使用 forEach() 方法、size 属性或 clear() 方法来管理其中的项
- 这是因为没必要对键进行枚举, 并且枚举 Weak Map 也是不可能的

### 输出结果

``` javascript
Promise.resolve().then(() => {
    return Promise.resolve(4);
})
```
核心就是会比正常的return一个非Promise的值时，多两个微任务.then().then()

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


### for await 异步迭代器

``` js
async function* myAsyncIterator() {
  yield 1;
  await new Promise(resolve => setTimeout(resolve, 1000));
  yield 2;
  yield 3;
}

async function main() {
  for await (let value of myAsyncIterator()) {
    console.log(value);
  }
}
main();
```

### FileReader

如果想要读取Blob或者文件对象并转化为其他格式的数据，可以借助FileReader对象的API进行操作

- FileReader.readAsText(Blob)：将Blob转化为文本字符串
- FileReader.readAsArrayBuffer(Blob)：将Blob转为ArrayBuffer格式数据
- FileReader.readAsDataURL(): 将Blob转化为Base64格式的Data URL


### 迭代对象获取迭代器
``` js
const iterator = iterable[Symbol.iterator](); // 获取迭代器
const value = iterator.next(); // 获取元素内容/每次调用获取下一个
value.done; // bool 是否迭代完毕
``` 

### Promise.race特殊特性
当使用空的可迭代对象，调用 Promise.race API 时，将会返回一个永远处于 pending 状态的 Promise 对象

### class类无法遍历它实例原型链上的属性和方法

### class类相关
#### 抽象类
***特点**
- 抽象类不能被直接实例化，即不能使用 new 关键字创建抽象类的实例。抽象类主要用于作为其他类的基类，提供通用的属性和方法的框架，但不能独立存在。
- 抽象类中可以包含抽象方法，这些方法没有具体的实现，而是要求子类必须提供具体的实现。抽象方法使用 abstract 关键字标记。
- 抽象类可以被其他类继承，子类必须实现抽象类中的所有抽象方法，否则子类也必须声明为抽象类。
#### 非抽象类
**特点**
- 可以被实例化：非抽象类可以被直接实例化，使用 new 关键字可以创建非抽象类的对象。
- 具体方法：非抽象类中可以包含具体的方法实现，而不仅限于抽象方法。这些方法可以被继承或直接调用。
- 继承：非抽象类可以被其他类继承，子类可以选择性地覆盖或扩展父类中的方法。
#### 非抽象类继承非抽象类
当一个非抽象类继承另一个非抽象类时，子类会继承父类的属性和方法，并且子类可以选择性地覆盖或扩展父类的方法。
``` js
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    makeSound() {
        console.log("Some generic sound");
    }
}
// 子类继承父类
class Dog extends Animal {
    makeSound() {      // 可以覆盖父类的方法
        console.log("Woof! Woof!");
    }
    greetOwner() {     // 可以扩展父类的方法
        console.log(`Hello, owner! My name is ${this.name}.`);
    }
}
```
#### 非抽象类继承抽象类
当一个非抽象类继承抽象类时，子类必须提供抽象类中定义的抽象方法的具体实现。抽象类中的抽象方法是没有具体实现的方法，而是由子类去实现。
``` js
// 抽象类
abstract class Shape {
    abstract draw(): void; // 抽象方法
    area() {
        console.log("Calculating area...");
    }
}
// 非抽象类继承抽象类
class Circle extends Shape {
    radius: number;
    constructor(radius: number) {
        super(); // 调用父类的构造函数
        this.radius = radius;
    }
    draw() { // 实现抽象方法
        console.log("Drawing a circle");
    }
    calculateArea() {  // 可以扩展父类的方法
        console.log(`Area`);
    }
}
```
#### 抽象类是继承抽象类
抽象类是可以继承抽象类的。这种继承关系允许在类的层次结构中建立一种更高层次的抽象，并要求子类实现更具体的行为。
``` js
// 抽象类
abstract class Animal {
    abstract makeSound(): void; // 抽象方法
    move() {
        console.log("Animal is moving...");
    }
}
// 另一个抽象类继承抽象类
abstract class Bird extends Animal {
    abstract fly(): void; // 抽象方法
    chirp() {
        console.log("Chirp chirp!");
    }
}
// 具体的子类实现抽象类中的抽象方法
class Sparrow extends Bird {
    makeSound() {
        console.log("Sparrow is making sound");
    }
    fly() {
        console.log("Sparrow is flying");
    }
}
```

#### 接口继承接口
接口可以通过 extends 关键字来继承其他接口，从而形成接口继承接口的关系。
``` js
// 定义一个基础接口
interface Shape {
  color: string;
}
// 定义继承自 Shape 接口的新接口
interface Square extends Shape {
  sideLength: number;
}
// 使用新接口
let square: Square = {
  color: "red",
  sideLength: 10,
};
```

#### 接口继承类
接口是不能直接继承类的。类可以作为接口的一部分，从而实现接口继承类,这意味着你可以定义一个接口，它包含了类的实例部分的成员，然后其他类可以实现这个接口。
``` js
abstract class AbstractParent {
    abstract abstractFunc():string
}
 // 接口继承类
interface IExample extends AbstractParent{
    name:string
    age:number
}
```
::: tips
需要注意的是，这种方式强调的是类的实例结构，而不是类的构造函数或静态部分。因此，只有类的实例部分的成员才会被包含在接口中。
:::

::: tips
类是无法直接使用extends继承接口的，只能使用implements去实现接口
:::
