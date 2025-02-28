---
home: false
---

## 高频使用的 npm 包

### depcheck

检测幽灵依赖

### yargs 命令参数配置

如果通过 process.argv 来获取，要额外处理两种不同的命令参数格式，不方便。

这里推荐 yargs 开源库来解析命令参数。运行以下命令安装 yargs

> npm install -g yargs

### copy-dir

拷贝文件夹，在 Node.js 中拷贝文件夹并不简单，需要用到递归，这里推荐使用开源库 copy-dir 来实现拷贝文件。

### minimist

轻量命令行参数解析工具

### fast-glob

NodeJS 文件系统遍历工具：fast-glob

### nodemon

观察运行 node

### ts-morph

基于 TS Compiler API 的工具
[知乎教程](https://zhuanlan.zhihu.com/p/616134364)
[文档](https://ts-morph.com/utilities)

### chokidar

极简高效的跨平台文件监视库 封装 Node.js 监控文件系统文件变化功能
[知乎教程](https://zhuanlan.zhihu.com/p/601689232?utm_id=0)

### yargs 命令行参数处理工具

[yargs](https://www.npmjs.com/package/yargs)

### MockJs

[MockJs 官方文档](http://mockjs.com/)

### simple-git 一个轻量级但功能强大的 Node.js Git 库

[simple-git](https://juejin.cn/post/7229906749070721085)

### @oclif/command 脚手架命令执行

[@oclif/command](https://zhuanlan.zhihu.com/p/54538055)

### cosmiconfig

读取项目配置信息

### cron

node 维护定时任务

### amqplib

node 维护消息队列

### @better-scroll/core 核心滚动，

实现基础的列表滚动效

### patch-package

用与修复 npm 包的工具，允许你在不修改原始包的情况下进行补丁

### resize-observer-polyfill

提供浏览器的 resize 事件监听

### @loadable/server

### react-spring

react 动画库

### @loadable/component

应用程序，组件拆分懒加载  
Enable Code Splitting in your React application.
[文档](https://loadable-components.com/)

### generator-eslint

自定义 eslint 规则生成器

[generator-eslint](https://github.com/eslint/generator-eslint)

### markdown-it

一个快速、灵活的 markdown 引擎

[markdown 中文文档](https://markdown-it.docschina.org/)

### 开发 npm 开发笔记

开发一个 npm 包需要创建在项目中新建 example 项目用于测试

### github-markdown-css

帮助您轻松实现与 GitHub 一致的 Markdown 样式

### node-stream-zip

是查看和提取大型 ZIP 文件的 Node.js 库

### cheerio

一个用于解析 HTML 的库

### unplugin-vue-components

插件可以在 Vue 文件中自动引入组件

### http2-proxy

- 微服务架构：作为不同微服务间的代理层，实现高效的内部通信。
- 负载均衡：可以用来分发流量到不同的后端服务器，增强系统的可扩展性和稳定性。
- 协议转换：帮助老旧系统与采用 HTTP/2 的新服务之间进行通信。
- API 网关：在前端应用程序与多个后端 API 服务之间架设桥梁，统一管理和代理请求。
- 开发测试：快速搭建本地开发环境的代理，方便调试跨域问题或模拟不同后端服务响应。

### Corepack 包管理器的管理器

在不同的项目切换时，难免会遇到使用不同的包管理器或者不同的包管理器版本的情况。如果团队中每个人都是用不同的包管理器或者不同版本,可能会导致：

- 新版本的包管理的 breaking change 导致安装失败
- 安装的依赖版本不一致导致构建或运行失败，亦或是产生不同的构建结果，导致运行结果不一致
- 在没有对依赖进行变更的情况下更新了 lock 文件

`Corepack`就是为了解决这些问题

### ts-node

执行一个一次性的 Nodejs 脚本命令

> TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts"

这是因为通过 tsc --init 生成默认 tsconfig.json 使用的默认模块规范是："module": "commonjs",
也就是说 Typescript 的默认配置是将代码编译为 commonjs 的模块，而非我们在 package.json 中声明的 module （即 ES module）模块。
ts-node 在运行时会既会读取 package.json 又会读取 tsconfig.json ，而二者的配置相互冲突，于是产生了错误。
修改 tsconfig.json 中的

```json
{
  "compilerOptions": {
    "module": "ESNext" // or ES2015, ES2020
  },
  "ts-node": {
    "esm": true
  }
}
```

### xterm.js

一个使用 TypeScript 编写的前端终端组件

### dependency-cruiser

检测项目三方 npm 包依赖， 分析单文件对应的所有依赖

### bundle-require

‌bundle-require 是一个用于在 Node.js 项目中打包和管理依赖的包

### react-css-modules

React CSS Modules 实现了自动化映射 CSS modules，完美得解决了上述问题，它的原理是扩展了 render 方法，根据 styleName 的值去在关联的 styles 对象中查找相应的 css-module，并给每个 CSS 类赋予一个带有全局唯一名字的本地标识符的类名
[react-css-modules](https://github.com/gajus/react-css-modules)

### it-cliff

一个自动总结提交信息，生成 changelog 文件的命令行工具。
[it-cliff](https://github.com/orhun/git-cliff)

### source-map-explorer

打包体积分析

```bash
"scripts": {
  "analyze": "source-map-explorer 'build/static/js/*.js'",
}
```

### @11ty/eleventy

静态网站生成器 [官网](https://www.11ty.dev/)

### ‌nyc

nyc npm 包是一个用于 JavaScript 项目的测试覆盖率工具
[官网](https://istanbul.js.org/)

### require-all

是一个在 Node.js 环境中使用的 npm 包，它的主要功能是递归地加载指定目录下的所有模块，并将它们注册到给定的对象上。这样，你就可以很方便地一次性引入多个模块，而不需要一个一个地 require 它们

### eclint

eclint 是一个用于检查和修复文件格式以符合 EditorConfig 规范的工具。EditorConfig 是一种配置文件，旨在帮助开发者在不同编辑器和 IDE（集成开发环境）之间保持一致编码风格。

### dotenv

应用程序的入口文件中引入 dotenv，并调用 dotenv.config()方法加载环境变量。
以将配置信息从代码中分离出来，存储在一个单独的.env 文件中 .env 文件通常不应该被提交到版本控制系统中，尤其是在包含敏感信息（如生产环境的 API 密钥）的情况下。可以将.env 文件添加到.gitignore 文件中，以防止敏感信息泄露。

```js
require("dotenv").config();
```

之后，你就可以在应用程序中使用 process.env 来访问这些环境变量了，如 process.env.DB_HOST 和 process.env.DB_USER

### throng

它的主要作用是实现进程管理，特别是在需要运行多个工作进程（worker processes）的场景中。可以帮助开发者轻松地启动和管理多个进程，以确保应用程序能够充分利用多核 CPU 资源，提高性能和吞吐量。

- 自动启动和管理多个进程 ‌：throng 可以根据可用的 CPU 核心数自动启动相应数量的工作进程。当某个进程崩溃时，throng 会自动重启它，以确保应用程序的稳定性和可用性。

- 负载均衡 ‌：通过运行多个工作进程，throng 可以帮助实现负载均衡，将任务分配给不同的进程处理，从而提高整体处理效率。
- ‌ 简化进程管理 ‌：throng 提供了一个简单的 API 来启动和管理多个进程，使得开发者无需编写复杂的进程管理代码。
- 支持集群模式 ‌：在 Node.js 中，throng 可以与 cluster 模块配合使用，以实现更高效的进程间通信和负载均衡。

### serveStatic

serveStatic 是一个用于 Node.js 的中间件包，它的主要作用是提供静态文件服务。这意味着它可以帮助开发者轻松地配置和
提供如 HTML 页面、CSS 样式表、JavaScript 脚本等静态资源给客户端

- 静态文件服务 ‌：从指定目录中为客户端提供静态文件。
- 高效的文件检测 ‌：通过对不存在的路径快速返回 404 响应，减少不必要的磁盘 I/O 操作。
- 缓存策略 ‌：结合 CDN 网络，可以为不同类型的静态资产设定差异化的缓存策略，以平衡缓存利用率与实时更新需求。
- 灵活的配置 ‌：提供多种配置选项，如根目录、查找逻辑、错误处理等，以适应各类部署环境。
- 兼容性广 ‌：不仅适用于纯 Node.js HTTP 服务器，也无缝融入流行框架如 Express 之中。
- 错误处理 ‌：优雅地处理错误，不直接发送标准错误码，而是传递给下一个中间件，便于流程继续执行或自定义错误页展示。
- 与其他中间件结合使用 ‌：例如，与 compression 中间件结合使用，可以对通过 serveStatic 服务的静态文件进行压缩，从而减少传输的数据量，加快加载速度
