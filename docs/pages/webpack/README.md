---
home: false
---

## webpack 使用笔记

### 技术文档列表

- [webpack5](./vue/vuex) <span style="color:#bbb; float:right">2021-06-10</span>

### MarkDown 使用指南

- [MarkDown](../blog-daily/use-markdown) <span style="color:#bbb; float:right">2021-06-24</span>

node_modules 中的所有依赖并不是插件运行时都需要的，我们可以将 devDependencies 排除在外不打包，进一步减少体积。

可以通过 npm install --production 实现仅安装 dependencies 中的依赖，此时 node_modules 中的依赖只与运行时相关。得到 asar 产物后再安装全部依赖完成插件的其它构建步骤，感兴趣的朋友可以尝试下。
