### 多文件同名命名空间合并 ‌

```ts
// fileA.ts
export namespace Skill {
  export class TempNum { ... }
}

// fileB.ts
export namespace Skill {
  export class TSkill {
    public t: Skill.TempNum;  // 引用另一文件的命名空间成员
  }
}
```

### declare module

#### 声明外部模块类型

```ts
// my-module.d.ts
declare module "some-library" {
  export function doSomething(param: string): void;
  export const version: string;
}
```

#### 为现有模块添加新类型

```ts
// vue.d.ts
declare module "vue" {
  interface ComponentCustomProperties {
    $myGlobalMethod: () => void;
  }
}
```

#### 非代码文件类型声明

```ts
// global.d.ts
declare module "*.png" {
  const src: string;
  export default src;
}
```

#### 模块通配符声明

```ts
declare module "*/config.json" {
  const value: { apiUrl: string };
  export default value;
}
```

::: tip
若声明文件包含 import/export，需通过 declare global 声明全局类型，否则作用域仅限当前文件 ‌
:::
