### 或者自身类型

```ts
// 定义
type Moment<T> = T extends infer U ? U : never;

// 使用
type StringType = Moment<string>; // string
type NumberType = Moment<number>; // number
type UnionType = Moment<string | number>; // string | number
interface User {
  name: string;
  age: number;
}
type UserType = Moment<User>; // User
```

### 获取函数返回值

```ts
// 定义
type GetReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// 使用
type ExampleFunction = (x: number, y: string) => boolean;
type ReturnTypeOfExampleFunction = GetReturnType<ExampleFunction>; // boolean
```

### 获取数组元素类型

```ts
// 定义
type GetArrayElementType<T> = T extends (infer U)[] ? U : never;

// 使用
type Moment = string[];
type Example1Array = Array<string>;
type ElementTypeOfExampleArray = GetArrayElementType<Moment>; // string
type ElementTypeOfExample1Array = GetArrayElementType<Example1Array>; //string
```

### 获取 Promise 的值类型

```ts
// 定义
type GetPromiseValueType<T> = T extends Promise<infer U> ? U : never;

// 使用
type ExamplePromise = Promise<number>;
type ValueTypeOfExamplePromise = GetPromiseValueType<ExamplePromise>; // number
```

### 获取函数参数类型

```ts
// 定义
type GetParameters<T> = T extends (...args: infer P) => any ? P : never;

// 使用
type ExampleFunction = (a: number, b: string) => void;
type Params = GetParameters<ExampleFunction>; // [number, string]
```

简单来说，infer 可以帮助从复杂类型中自动提取出所需的部分类型。
