---
home: false
---

### depcheck 
检测幽灵依赖 

## 高频使用的NPM包

### yargs 命令参数配置

如果通过 process.argv 来获取，要额外处理两种不同的命令参数格式，不方便。

这里推荐 yargs 开源库来解析命令参数。运行以下命令安装 yargs
> npm install -g yargs

### copy-dir 拷贝文件夹
在 Node.js 中拷贝文件夹并不简单，需要用到递归，这里推荐使用开源库copy-dir来实现拷贝文件。

### minimist
轻量命令行参数解析工具

### fast-glob
NodeJS文件系统遍历工具：fast-glob

### nodemon
观察运行node

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
[MockJs官方文档](http://mockjs.com/)

### simple-git 一个轻量级但功能强大的 Node.js Git库
[simple-git](https://juejin.cn/post/7229906749070721085)

### @oclif/command 脚手架命令执行
[@oclif/command](https://zhuanlan.zhihu.com/p/54538055)

### cosmiconfig
读取项目配置信息

### cron 
node维护定时任务

### amqplib 
node 维护消息队列

### @better-scroll/core 核心滚动，
实现基础的列表滚动效

### patch-package 
用与修复npm包的工具，允许你在不修改原始包的情况下进行补丁

### resize-observer-polyfill 
提供浏览器的resize事件监听

### @loadable/server

### react-spring 
react 动画库

### @loadable/component
应用程序，组件查分懒加载   
Enable Code Splitting in your React application. 
[文档](https://loadable-components.com/)

### generator-eslint 自定义eslint规则生成器
[generator-eslint](https://github.com/eslint/generator-eslint)

### markdown-it 一个快速、灵活的 markdown 引擎
[markdown中文文档](https://markdown-it.docschina.org/)

### 开发npm开发笔记
开发一个npm包需要创建在项目中新建example项目用于测试

### github-markdown-css
帮助您轻松实现与GitHub一致的Markdown样式

### node-stream-zip
是查看和提取大型 ZIP 文件的 Node.js 库

### Corepack 包管理器的管理器
在不同的项目切换时，难免会遇到使用不同的包管理器或者不同的包管理器版本的情况。如果团队中每个人都是用不同的包管理器或者不同版本,可能会导致：
- 新版本的包管理的breaking change导致安装失败
- 安装的依赖版本不一致导致构建或运行失败，亦或是产生不同的构建结果，导致运行结果不一致
- 在没有对依赖进行变更的情况下更新了lock文件

`Corepack`就是为了解决这些问题
