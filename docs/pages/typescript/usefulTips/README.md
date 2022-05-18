### 复制类型和值
如果你想移动一个类，你可能会想要做以下事情：

``` typescript
class Foo {}
const Bar = Foo;
let bar: Bar; // Error: 不能找到名称 'Bar'
```
这会得到一个错误，因为 const 仅仅是复制了 Foo 到一个变量声明空间，因此你无法把 Bar 当作一个类型声明使用。正确的方式是使用 import 关键字，请注意，如果你在使用 namespace 或者 modules，使用 import 是你唯一能用的方式：
``` typescript
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
``` typescript
// 所有 mixins 都需要
type Constructor<T = {}> = new (...args: any[]) => T;

/////////////
// mixins 例子
////////////

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
  name = '';
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