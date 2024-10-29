---
home: false
sidebar: false
---

[Typescript 工具类型](https://mp.weixin.qq.com/s?__biz=MzU2MTIyNDUwMA==&mid=2247496918&idx=1&sn=1cf004f0a4091e37bfadff5f360c6326&chksm=fc7eba8dcb09339b09a6868c4ef6acfe08d063f3cc17eb3d36986a05221b4a3fedcf8a815475)  
[Typescript 类型体操](https://www.jianshu.com/p/276a7d596744)  
[ts 实用小技巧](./usefulTips/README.md)
[ts 类型推断](./infer/README.md)
[tsconfig 配置详解](https://juejin.cn/post/7386532770476490761?searchId=2024102911444713AE83BB7609117AF804)
[reflect-metadata](https://zhuanlan.zhihu.com/p/643674031)  
[tsconfig moduleResolution](https://juejin.cn/post/7276408879364948028)  
[详解 tsconfig.json 中的 module、moduleResolution](https://juejin.cn/post/7276408879364948028)

### Partial

```typescript
interface PullDownRefreshConfig {
  threshold: number;
  stop: number;
}
type PullDownRefreshOptions = Partial<PullDownRefreshConfig>;
/**
 * type PullDownRefreshOptions = {
 *   threshold?: number | undefined;
 *   stop?: number | undefined;
 * }
 */
```

### Required

```typescript
interface PullDownRefreshConfig {
  threshold: number;
  stop: number;
}
type PullDownRefreshOptions = Partial<PullDownRefreshConfig>;
type PullDownRefresh = Required<Partial<PullDownRefreshConfig>>;
/**
 * type PullDownRefresh = {
 *   threshold: number;
 *   stop: number;
 * }
 */
```

### ReturnType

TypeScript 中，你可以使用内置的 ReturnType 工具类型来获取函数的返回类型

```ts
const multiply = (a: number, b: number): number => a * b;
type MultiplyReturnType = ReturnType<typeof multiply>;
// 等同于 number
```

### Pick

```ts
// Pick 的源码
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

### Omit

```ts
// Omit 的源码
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

### Extract

```ts
// Extract实现源码 原理很简单
type Extract<T, U> = T extends U ? T : never;
// 处理联合类型
type Test1 = "1" | "2" | "3";
const obj: Extract<Test1, "1" | "2"> = "1"; // 1,2 OK 赋值3就会error
```

### Typescript 装饰器

#### 装饰器语法

对于一些刚接触 TypeScript 的小伙伴来说，在第一次看到 @Plugin({...}) 这种语法可能会觉得很惊讶。其实这是装饰器的语法，
装饰器的本质是一个函数，通过装饰器我们可以方便地定义与对象相关的元数据。

```typescript
@Plugin({
  pluginName: "Device",
  plugin: "cordova-plugin-device",
  pluginRef: "device",
  repo: "https://github.com/apache/cordova-plugin-device",
  platforms: ["Android", "Browser", "iOS", "macOS", "Windows"],
})
@Injectable()
export class Device extends IonicNativePlugin {}
```

在以上代码中，我们通过装饰器来保存 ionic-native 插件的相关元信息，而 @Plugin({...}) 中的 @ 符号只是语法糖，
为什么说是语法糖呢？这里我们来看一下编译生成的 ES5 代码：

```typescript
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r =
        c < 3
          ? target
          : desc === null
          ? (desc = Object.getOwnPropertyDescriptor(target, key))
          : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i]))
          r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };

var Device = /** @class */ (function (_super) {
  __extends(Device, _super);
  function Device() {
    return (_super !== null && _super.apply(this, arguments)) || this;
  }
  Device = __decorate(
    [
      Plugin({
        pluginName: "Device",
        plugin: "cordova-plugin-device",
        pluginRef: "device",
        repo: "https://github.com/apache/cordova-plugin-device",
        platforms: ["Android", "Browser", "iOS", "macOS", "Windows"],
      }),
      Injectable(),
    ],
    Device
  );
  return Device;
})(IonicNativePlugin);
```

通过生成的代码可知，`@Plugin({...})` 和 `@Injectable()` 最终会被转换成普通的方法调用，它们的调用结果最终会以数组的形式作为参数传递给 `__decorate` 函数，而在 `__decorate` 函数内部会以 Device 类作为参数调用各自的类型装饰器，从而扩展对应的功能。

#### 装饰器的分类

在 TypeScript 中装饰器分为

> 类装饰器  
> 属性装饰器  
> 方法装饰器  
> 参数装饰器

#### 类装饰器

类装饰器声明：

```typescript
declare type ClassDecorator = <TFunction extends Function>(target: TFunction) => TFunction | void;
// 类装饰器顾名思义，就是用来装饰类的。它接收一个参数：
```

> target: TFunction - 被装饰的类

看完第一眼后，是不是感觉都不好了。没事，我们马上来个例子：

```typescript
function Greeter(target: Function): void {
  target.prototype.greet = function (): void {
    console.log("Hello Semlinker!");
  };
}
@Greeter
class Greeting {
  constructor() {
    // 内部实现
  }
}
let myGreeting = new Greeting();
myGreeting.greet();
// console output: 'Hello Semlinker!';
```

上面的例子中，我们定义了 Greeter 类装饰器，同时我们使用了 @Greeter 语法糖，来使用装饰器。  
::: warning
友情提示：读者可以直接复制上面的代码，在 TypeScript Playground 中运行查看结果。
:::

#### 属性装饰器

属性装饰器声明：

```typescript
declare type PropertyDecorator = (target: Object, propertyKey: string | symbol) => void;
```

属性装饰器顾名思义，用来装饰类的属性。它接收两个参数：

- target: Object - 被装饰的类
- propertyKey: string | symbol - 被装饰类的属性名

```typescript
function logProperty(target: any, key: string) {
  delete target[key];
  const backingField = "_" + key;
  Object.defineProperty(target, backingField, {
    writable: true,
    enumerable: true,
    configurable: true,
  });
  // property getter
  const getter = function (this: any) {
    const currVal = this[backingField];
    console.log(`Get: ${key} => ${currVal}`);
    return currVal;
  };
  // property setter
  const setter = function (this: any, newVal: any) {
    console.log(`Set: ${key} => ${newVal}`);
    this[backingField] = newVal;
  };
  // Create new property with getter and setter
  Object.defineProperty(target, key, {
    get: getter,
    set: setter,
    enumerable: true,
    configurable: true,
  });
}
class Person {
  @logProperty
  public name: string;
  constructor(name: string) {
    this.name = name;
  }
}
const p1 = new Person("semlinker");
p1.name = "kakuqo";

// Set: name => semlinker
// Set: name => kakuqo
```

以上代码我们定义了一个 logProperty 函数，来跟踪用户对属性的操作，当代码成功运行后，在控制台会输出以下结果：

#### 方法装饰器

方法装饰器声明：

```typescript
declare type MethodDecorator = <T>(
  target: Object,
  propertyKey: string | symbol,
  descriptor: TypePropertyDescript<T>
) => TypedPropertyDescriptor<T> | void;
```

方法装饰器顾名思义，用来装饰类的方法。它接收三个参数：

- target: Object - 被装饰的类
- propertyKey: string | symbol - 方法名
- descriptor: TypePropertyDescript - 属性描述符
  废话不多说，直接上例子：

```typescript
function LogOutput(tarage: Function, key: string, descriptor: any) {
  let originalMethod = descriptor.value;
  let newMethod = function (...args: any[]): any {
    let result: any = originalMethod.apply(this, args);
    if (!this.loggedOutput) {
      this.loggedOutput = new Array<any>();
    }
    this.loggedOutput.push({
      method: key,
      parameters: args,
      output: result,
      timestamp: new Date(),
    });
    return result;
  };
  descriptor.value = newMethod;
}
class Calculator {
  @LogOutput
  double(num: number): number {
    return num * 2;
  }
}
let calc = new Calculator();
calc.double(11);
// console ouput: [{method: "double", output: 22, ...}]
console.log(calc.loggedOutput);
```

#### 参数装饰器

参数装饰器声明：

```typescript
declare type ParameterDecorator = (target: Object, propertyKey: string | symbol,
  parameterIndex: number ) => void
参数装饰器顾名思义，是用来装饰函数参数，它接收三个参数：

// target: Object - 被装饰的类
// propertyKey: string | symbol - 方法名
// parameterIndex: number - 方法中参数的索引值
function Log(target: Function, key: string, parameterIndex: number) {
  let functionLogged = key || target.prototype.constructor.name;
  console.log(`The parameter in position ${parameterIndex} at ${functionLogged} has
 been decorated`);
}
class Greeter {
  greeting: string;
  constructor(@Log phrase: string) {
 this.greeting = phrase;
  }
}
// console output: The parameter in position 0
// at Greeter has been decorated
```

### #私有字段

在 TypeScript 3.8 版本就开始支持 ECMAScript 私有字段，使用方式如下：

```typescript
class Person {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}
let semlinker = new Person("Semlinker");
semlinker.#name;
//
// Property '#name' is not accessible outside class 'Person'
// because it has a private identifier.
```

与常规属性（甚至使用 private 修饰符声明的属性）不同，私有字段要牢记以下规则：

- 私有字段以 # 字符开头，有时我们称之为私有名称；
- 每个私有字段名称都唯一地限定于其包含的类；
- 不能在私有字段上使用 TypeScript 可访问性修饰符（如 public 或 private）；
- 私有字段不能在包含的类之外访问，甚至不能被检测到。

#### 私有字段与 private 的区别

说到这里使用 # 定义的私有字段与 private 修饰符定义字段有什么区别呢？现在我们先来看一个 private 的示例：

```typescript
class Person {
  constructor(private name: string) {}
}
let person = new Person("Semlinker");
console.log(person.name);
```

在上面代码中，我们创建了一个 Person 类，该类中使用 private 修饰符定义了一个私有属性 name，接着使用该类创建一个 person 对象，然后通过 person.name 来访问 person 对象的私有属性，这时 TypeScript 编译器会提示以下异常：

> > Property 'name' is private and only accessible within class 'Person'.(2341)  
> > 那如何解决这个异常呢？当然你可以使用类型断言把 person 转为 any 类型：

console.log((person as any).name);
通过这种方式虽然解决了 TypeScript 编译器的异常提示，
但是在运行时我们还是可以访问到 Person 类内部的私有属性，为什么会这样呢？我们来看一下编译生成的 ES5 代码，也许你就知道答案了：

```javascript
var Person = /** @class */ (function () {
  function Person(name) {
    this.name = name;
  }
  return Person;
})();
var person = new Person("Semlinker");
console.log(person.name);
```

这时相信有些小伙伴会好奇，在 TypeScript 3.8 以上版本通过 # 号定义的私有字段编译后会生成什么代码：

```typescript
class Person {
  #name: string;
  constructor(name: string) {
    this.#name = name;
  }
  greet() {
    console.log(`Hello, my name is ${this.#name}!`);
  }
}
```

以上代码目标设置为 ES2015，会编译生成以下代码：

```javascript
"use strict";
var __classPrivateFieldSet =
  (this && this.__classPrivateFieldSet) ||
  function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
  };

var __classPrivateFieldGet =
  (this && this.__classPrivateFieldGet) ||
  function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
      throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
  };

var _name;
class Person {
  constructor(name) {
    _name.set(this, void 0);
    __classPrivateFieldSet(this, _name, name);
  }
  greet() {
    console.log(`Hello, my name is ${__classPrivateFieldGet(this, _name)}!`);
  }
}
_name = new WeakMap();
```

通过观察上述代码，使用 `#` 号定义的 `ECMAScript` 私有字段，会通过 **WeakMap** 对象来存储，同时编译器会生成 **classPrivateFieldSet** 和 **classPrivateFieldGet** 这两个方法用于设置值和获取值。

### 参考链接

[深入 TS 装饰器](https://mp.weixin.qq.com/s?__biz=MzI2MjcxNTQ0Nw==&mid=2247484552&idx=1&sn=fe548e36a4fcda8e103ae6a5cb6cec41&chksm=ea47a5d0dd302cc6fef0c6eab2e585aed4563e90a97a21094ee00d871d9cddaa7a2ba881533c&scene=21#wechat_redirect)
