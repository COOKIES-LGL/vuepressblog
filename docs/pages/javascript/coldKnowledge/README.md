**用 defineProperty 方法添加的属性默认不可变**

**import、require 引入的基本数据类型是 只读 的: 你不能修改引入的基本数据类型**

**import、require 引用数据类型， import 会共享内存地址，require 会拷贝内存地址，现象是，对象共用了。**

**ES5 构造函数返回值详解**

- 当构造函数 ‌ 没有 return 语句 ‌ 或 ‌return 基本类型 ‌（如数字、字符串）时：自动返回新实例对象 ‌（即 this 指向的对象）
- 如果构造函数 ‌return 一个对象 ‌（如 {}、new Date()）：覆盖默认返回值 ‌，直接返回该对象。实例与原构造函数脱离关系 ‌（instanceof 检测失效）

```js
function Person(name) {
  this.name = name;
  return { id: 1 }; // 返回新对象
}
const p = new Person("Alice");
console.log(p); // { id: 1 } （不再是 Person 的实例）
console.log(p instanceof Person); // false
```

- 如果构造函数 ‌return 基本类型 ‌（如 return 123、return "ok"）：忽略返回值 ‌，仍返回默认的 this 对象。
