---
home: false
sidebar: false
---

## typescript-plugin-css-modules 配置

[npm 地址](https://www.npmjs.com/package/typescript-plugin-css-modules)

让你在 vscode 中，cssModule 能拥有 typeScript 一样的智能提示。

### 效果图

![效果图](https://img-blog.csdnimg.cn/b69dd09a2f2542a99474413e0c38aa29.gif#pic_center)

### 安装

yarn add -D typescript-plugin-css-modules

### 配置

配置后需要重启 vscode，然后项目中使用 cssModule 时，就可以享受到 typeScript 提示的 class 类名了，配置如下：

配置 tsconfig.json

```JSON
// tsconfig.json 配置
{
  "compilerOptions": {
    "plugins": [{"name": "typescript-plugin-css-modules"}]
  }
}

```

定义 sass 模块

```ts
// global.d.ts
declare module "*.module.scss" {
  const classes: { [key: string]: string };
  export default classes;
}
```

如果未生效 在项目中新建 setting.json 文件 加入如下配置

```JSON .vscode settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}

```

> 如果样式中使用了@import 引入其他样式文件，导致功能无效,需要配置 tsconfig.json 文件 baseUrl 属性 确保路径正确

**另一种方案**

使用这个插件 css-module-typed 即可
