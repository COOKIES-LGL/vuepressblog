---
home: false
---

## vite 使用笔记

[Vite 是如何实现 Esbuild 打包的](https://segmentfault.com/a/1190000043980887)  
[Vite 工作原理](https://juejin.cn/post/7350936959059722280?utm_source=gold_browser_extension)  
[rollup 打包原理](https://www.baidu.com/link?url=qSPsxiW5_Rboe-4tNN26ObiF8LoQFgnyDX8zMl7HZHYClDlr1eq37JL-4hpDSab5WUqwB7iqfo8Y4VnKAtXBla&wd=&eqid=d2f2c99500896c100000000565e43fbb)  
[Vite 配置 Https 启动服务](https://blog.csdn.net/weixin_44786530/article/details/135893697)  
[vite 和 webpack 热更新的区别](https://juejin.cn/post/7338042858702618678?utm_source=gold_browser_extension#heading-14)
[vite 官方文档](https://cn.vitejs.dev/guide/)

### vite 支持 require

1、安装插件 vite-plugin-require-transform

```bash
yarn add -D vite-plugin-require-transform
```

2、vite.config.js

```js
import requireTransform from "vite-plugin-require-transform";
module.exports = {
  plugins: [
    vue(),
    requireTransform({
      fileRegex: /.js$|.vue$/,
    }),
  ],
};
```

### babel/traverse

不支持 es Module 可以从 babel/core 引入 traverse
没有遍历所有节点, 需要自行编写遍历代码

::: tip
有些三方包没有默认导出 可以使用 import \* as babel from 'babel/core' 进行导入
:::

### plugin

```bash
npm i -D unplugin-auto-import
```

是基于 unimport 开发，这个插件可以帮助开发者在代码中直接使用 Vue 核心库的功能，而不需要显式地导入它们。

```ts
// vite.config.ts
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig({
  plugins: [
    AutoImport({
      /* options */
    }),
  ],
});
```

### vite 本地开发支持 https

**前置条件**

安装了 mkcert 并且添加了它的可执行文件到系统的 PATH 中。

```bash
brew install mkcert
# Homebrew安装mkcert
mkcert -install
# 添加本地CA到系统的根证书颁发机构
```

安装插件

```bash
npm i -D vite-plugin-mkcert
```

配置 vite.config.ts

```ts
// vite.config.ts
import mkcert from "vite-plugin-mkcert";

export default defineConfig({
  plugins: [
    mkcert({
      /* options */
    }),
  ],
});
```

### 使用 banner 或 footer 选项添加 import 语句

```js
config.output = {
  ...config.output,
  banner: `require('./index.css');\n`, // 在打包的后 JS 文件顶部插入 import 语句
};
```

### ‌import.meta

- ‌import.meta.url‌：返回当前模块的 URL 路径。
- import.meta.scriptElement‌：在浏览器中，返回加载模块的`<script>`元素。
- import.meta.hot‌：在支持模块热更新（HMR）的环境中，如 Vite 和 Webpack，提供处理热更新的逻辑。
- import.meta.env‌：用于读取环境变量，常见于 Vite 和 Rollup 等工具中。
- import.meta.dir‌：提供当前文件的目录路径。
- import.meta.file‌：提供当前文件的名称。
- import.meta.path‌：提供当前文件的绝对路径。
- ‌import.meta.main‌：指示当前文件是否是入口点文件。
- ‌import.meta.resolve‌：用于解析模块导入符号的绝对路径 ‌
