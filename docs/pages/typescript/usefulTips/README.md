### 复制类型和值

如果你想移动一个类，你可能会想要做以下事情：

```typescript
class Foo {}
const Bar = Foo;
let bar: Bar; // Error: 不能找到名称 'Bar'
```

这会得到一个错误，因为 const 仅仅是复制了 Foo 到一个变量声明空间，因此你无法把 Bar 当作一个类型声明使用。正确的方式是使用 import 关键字，请注意，如果你在使用 namespace 或者 modules，使用 import 是你唯一能用的方式：

```typescript
namespace importing {
  export class Foo {}
}

import Bar = importing.Foo;
let bar: Bar; // ok
```

这个 import 技巧，仅适合于类型和变量。

### 多重继承

::: tip
「混合」是一个函数：
传入一个构造函数；
创建一个带有新功能，并且扩展构造函数的新类；
返回这个新类。
:::

```typescript
// 所有 mixins 都需要
type Constructor<T = {}> = new (...args: any[]) => T;

// 添加属性的混合例子
function TimesTamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    timestamp = Date.now();
  };
}

// 添加属性和方法的混合例子
function Activatable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    isActivated = false;
    activate() {
      this.isActivated = true;
    }
    deactivate() {
      this.isActivated = false;
    }
  };
}

///////////
// 组合类
///////////
// 简单的类
class User {
  name = "";
}
// 添加 TimesTamped 的 User
const TimestampedUser = TimesTamped(User);
// Tina TimesTamped 和 Activatable 的类
const TimestampedActivatableUser = TimesTamped(Activatable(User));

//////////
// 使用组合类
//////////
const timestampedUserExample = new TimestampedUser();
console.log(timestampedUserExample.timestamp);

const timestampedActivatableUserExample = new TimestampedActivatableUser();
console.log(timestampedActivatableUserExample.timestamp);
console.log(timestampedActivatableUserExample.isActivated);
```

### 添加废弃注解

```typescript
{
  /**
   * @deprecated 该属性即将禁用，请使用 style属性
   */
  className?: string;
  onClick: () => void;
}

```

### ITypeA 类型的 tag 可以直接点击到 ITag 类型

```typescript
// types.ts
export interface ITypeA {
  /**
   * tag 标签 {@link ITag}.
   */
  tag: ITag;
}

export interface ITag {
  /** tag id */
  id: string;
  /** tag name */
  name: string;
}
// 参考链接 https://juejin.cn/post/7140337202097029133
```

当我们在使用字面量创建了一个正则表达式的时候，相当于初始化了一个对象，这个对象上有一个叫做 lastIndex 的属性

```javascript
const reg = /[^0-9]/g;
reg.test("a"); // true
reg.lastIndex; // 1
reg.test("a"); // false
reg.lastIndex; // 0
```

### tsconfig.json 大括号报错

使用 消除这个报错

```json
{
  compilerOption: {
    ignoreDeprecations："5.0"
  }
}
```

### tsconfig.json references

::: tip
references 指定工程引用依赖。在多子项目中共享配置文件
:::

### satisfies

satisfies 这个语法。它的作用就是让你用自动推导出的类型，而不是声明的类型，增加灵活性，同时还可以对这个推导出的类型做类型检查，保证安全。

### 枚举值 value 为 string 类型时不会反映射

```typescript
enum NUM {
  A = 1,
  B = 2,
  C = "3",
  D = "demo",
}
console.log(Object.entires(NUM));
NUM[1] === "A";
NUM[2] === "B";
NUM["demo"] !== "D";
```

### import 标红报错找不到 tsconfig.json 配置文件

原因: .eslintrc 配置的 tsconfig.json 的路径不对

```json
{
  "parserOptions": { "project": ["/tsconfig.json"] }
}
```

这个时候一般我们的项目处于子目录中，可以使用相对路径指定 tsconfig.json 的路径
需要将.eslintrc 文件改成 .eslintrc.js 然后使用\_\_dirname 获取相对路径

```js
module.exports = {
  parser: "@typescript-eslint/parser",
  parserOptions: { project: [__dirname + "/tsconfig.json"] },
};
```

### 模块“"fs"”没有默认导出

- 1 可以使用 import \* as fs from 'fs'
- 2 或者在 tsconfig.json 的 compilation 填加属性"esModuleInterop": true

### Cannot find module '\*' Error

Cannot find module '\*'. Did you mean to set the 'moduleResolution' option to 'node'
-1 在 tsconfig.json 的 compilation 填加属性"moduleResolution": "node"

::: tip
模块解析策略（moduleResolution）更多描述的是一个模块包括相对路径以及非相对路径（也就是第三方库，亦或者说 npm 包）是按照怎样的规则去查找的
现在支持的值有三个 classic、node、Bundler

- classic 简单来说这种模块解析策略就是一直递归往上找同名文件，当前目录找不到同名文件就往父级目录找。不过这种策略目前前端界用得不多
- 相比于 classic 策略的区别在于：

  - 递归查找的目录是 node_modules，不是父级文件夹
  - 引入了 package.json，各种配置项尤其是后面会展开说的 exports 字段使得 node 模块解析策略的变得非常复杂
  - 支持文件夹模块，也就是 pkg/index.js，文件夹中包含 index.js，这个文件夹就是一个模块
    [参考资料](https://zhuanlan.zhihu.com/p/621795173)
    [用来检测 npm 的 moduleResolution 是否合理](https://arethetypeswrong.github.io/)

:::

### 模块化 js 如何规避循环引用

CommonJS 和 ES Module 都对循环引入做了处理，不会进入死循环，但方式不同：

- CommonJS 借助模块缓存，遇到 require 函数会先检查是否有缓存，已经有的则不会进入执行，在模块缓存中还记录着导出的变量的拷贝值；
- ES Module 借助模块地图，已经进入过的模块标注为获取中，遇到 import 语句会去检查这个地图，已经标注为获取中的则不会进入，地图中的每一个节点是一个模块记录，上面有导出变量的内存地址，导入时会做一个连接——即指向同一块内存。
- 有时会项目编译报错因为循环引用使得变量未定义就使用了。

### 普通枚举与常量枚举

::: tip
普通枚举 enum A {...} 和常量枚举 const enum A {...} 之间的区别主要在于 TS 的编译结果上有所差别
普通枚举 enum A {...}, 会将其编译为一个 JS 对象, 对象内就是枚举成员和值的一个相互映射
常量枚举 const enum A {...}, 编译后不会生成任何代码, 会删除 TS 部分内容, 对于使用到的成员只会进行值的替换
常量枚举 会有更好的性能, 避免额外的性能开销
:::

### Exclude not work on [key: string]:any

```typescript
interface TestType {
  a: number;
  b: string;
  [key: string]: any;
}
type NTestType1 = {
  [P in keyof TestType]: any;
};
const test1: NTestType1 = {}; // error missing a and b. this is correct.
type NTestType2 = {
  [P in Exclude<keyof TestType, "a">]: any;
};
const test2: NTestType2 = {}; // no error, we expect show missing b error here.
```

### tsConfig 配置样式可点击

首先安装插件 typescript-plugin-css-modules

```json
{
  "plugins": [{ "name": "typescript-plugin-css-modules" }]
}
```

### extends infer

```ts
// 条件类型（其中extends可以理解为T类型（窄类型）是否是U类型（宽类型）的子类型，或者说T类型是否可以赋值给U类型，
// 语法同js的三元表达式）
T extends U ? U : T;
// infer只能在extends类型语句中使用
// infer存储的变量U只能用于语句的true返回分支
type UnpackedArray<T> = T extends (infer U)[] ? U : T;

```

### UnpackedArray 获取数组子元素类型

```ts
type Arr = string[];
// 工具类型
type UnpackedArray<T> = T extends (infer R)[] ？ R : T;
type newArr = UnpackedArray<Arr>; // string
```

### 提取链接参数类型

```ts
// 1. /分割
type Split<S extends string> = S extends `/${infer L}/${infer R}`
  ? L | Split<`/${R}`>
  : S extends `/${infer L}`
  ? L
  : never;

// 2， 提取含:的参数
type PickParams<T extends string> = T extends `:${infer P}` ? P : never;

const path = "/transport/ground/detail/:code/:tab" as const;

type Params = Record<PickParams<Split<typeof path>>, string>; // { code: string; tab: string; }
```

### 对象 key 值限制

```ts
const ROUTES = {
  router1: "/router1",
  router2: "/router2",
};
const pmm: Record<keyof typeof ROUTES, { module: string }> = {
  router1: { module: "1212" },
  router2: { module: "1212" },
};
```

### is 关键词

主要用来框定类型并实现对应的类型断言

```ts
function isString(value: unknown): boolean {
  return typeof value === "string";
}
let someValue: unknown = "hhhha";
if (isString(someValue)) {
  console.log(someValue.length); //这边出现报错，someValue任然是个unknown类型
}
// ------------------------------
function isString1(value: unknown): value is string {
  return typeof value === "string";
}
if (isString(someValue)) {
  console.log(someValue.length); // 这里就没有报错，如果在编辑器上可以发现，这个someValue的类型转成了string
}
```

### keyof typeof

解决 cannot expression of type string used to index type 'object'
方案一

```ts
const user = {
  name: "Daniel",
  age: 26,
};

const keys = Object.keys(user) as Array<keyof typeof user>;
keys.forEach((key) => {
  console.log(user[key]);
});
```

方案二

```ts
const keys = Object.keys(user);
keys.forEach((key) => {
  console.log(user[key as keyof typeof user]);
});
```

方案三

```ts
function isKey<T extends object>(x: T, k: PropertyKey): k is keyof T {
  return k in x;
}

const keys = Object.keys(user);
keys.forEach((key) => {
  if (isKey(user, key)) {
    console.log(user[key]);
  }
});
```

### const enum 枚举

```ts
enum Constants {
  Long = "a very long string",
}

const enum Constants {
  Long = "a very long string",
}
// const enum 我们使用const常量打完包之后的体积更小
```

### as const 将变量设置只读

```ts
const menuConst = {
  home: "/home",
  about: "/about",
  contact: "/contact",
};
// 而在一般的对象中，由于对象的属性都具有可修改性
menuConst.home = "/home1"; // 是不会报错的

const menuAsConst = {
  home: "/home",
  about: "/about",
  contact: "/contact",
} as const;
menuConst.home = "/home1"; // 报错

type ValueOf<T> = T[keyof T];
type MenuEnumType = ValueOf<typeof menuAsConst>;
const env: MenuEnumType = menuAsConst.home;
```

### 数组转转联合类型

```ts
const permissions = [
  "system:role:list",
  "system:role:create",
  "system:role:read",
  "system:role:update",
  "system:role:delete",
] as const;

export type PermissionType = typeof permissions[number];
// PermissionType;  "system:role:list" | "system:role:create" | "system:role:read" | "system:role:update" | "system:role:delete"
```
