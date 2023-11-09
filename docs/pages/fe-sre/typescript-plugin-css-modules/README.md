---
home: false
sidebar: false
---
## typescript-plugin-css-modules配置

### [npm地址](https://www.npmjs.com/package/typescript-plugin-css-modules)
让你在vscode中，cssModule能拥有typeScript一样的智能提示。

### 效果图

![效果图](https://img-blog.csdnimg.cn/b69dd09a2f2542a99474413e0c38aa29.gif#pic_center)

### 安装
yarn add -D typescript-plugin-css-modules

### 配置
配置后需要重启vscode，然后项目中使用cssMoudule时，就可以享受到typeScript提示的class类名了，配置如下：

配置tsconfig.json

``` JSON
// tsconfig.json 配置
{
  "compilerOptions": {
    "plugins": [{"name": "typescript-plugin-css-modules"}]
  }
}

```

// 如果未生效 在项目中新建setting.json文件 加入如下配置
``` JSON .vscode settings.json
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}

```

