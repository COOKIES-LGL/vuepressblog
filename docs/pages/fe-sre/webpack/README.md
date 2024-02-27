---
home: false
---

## webpack 使用笔记

Webpack 在构建过程中会触发一系列的生命周期事件，开发者可以针对这些事件进行相应的处理或插件化。下面是Webpack的主要生命周期事件：

- beforeRun：在 Webpack 开始执行构建任务前触发的事件。
- run：Webpack 开始进行编译打包时触发的事件。
- beforeCompile：在 Webpack 开始编译之前触发的事件。
- compile：Webpack 开始编译时触发的事件。
- compilation：在 Webpack 的每次编译构建过程中触发的事件。
- emit：在 Webpack 输出资源到output目录之前触发的事件。
- afterEmit：在 Webpack 输出资源到output目录之后触发的事件。
- done：Webpack 构建完成所有的编译、和输出等任务之后触发的事件。
- failed：Webpack 构建过程中出现错误时触发的事件。

可以通过 npm install --production 实现仅安装 dependencies 中的依赖

[一篇详解webpack](https://zhuanlan.zhihu.com/p/443964387)
[webpack打包原理详解](https://www.pipipi.net/30583.html/amp)
[参考编写一个loader和plugins](https://pcaaron.github.io/pages/fe/webpack/plugin.html#%E6%8F%92%E4%BB%B6%E4%BA%8B%E4%BB%B6%E5%A4%84%E7%90%86)
[webpack-Loader详解](https://zhuanlan.zhihu.com/p/397174187)

[深度解析webpack打包流程](https://www.pipipi.net/30583.html/amp)

### 动态匹配配置信息

如果要根据 webpack.config.js 中的 mode 变量更改打包行为，则必须将配置导出为函数，而不是导出对象：
``` js
var config = {
  entry: './app.js',
  //...
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  if (argv.mode === 'production') {
    //...
  }

  return config;
};
```

### webpack的热更新原理

``` m
面试官比较想听到的是工作流程和关键点，非“流水账”式的源码分析。我认为可以这样的介绍：

首先，介绍webpack-dev-server:
webpack-dev-server 主要包含了三个部分：
1.webpack: 负责编译代码
2.webpack-dev-middleware: 主要负责构建内存文件系统，把webpack的 OutputFileSystem 替换成 InMemoryFileSystem。同时作为Express的中间件拦截请求，从内存文件系统中把结果拿出来。
3.express：负责搭建请求路由服务。

其次，介绍工作流程:
1.启动dev-server，webpack开始构建，在编译期间会向 entry 文件注入热更新代码；
2.Client 首次打开后，Server 和 Client 基于Socket建立通讯渠道；
3.修改文件，Server 端监听文件发送变动，webpack开始编译，直到编译完成会触发"Done"事件；
4.Server通过socket 发送消息告知 Client；
5.Client根据Server的消息（hash值和state状态），通过ajax请求获取 Server 的manifest描述文件；
6.Client对比当前 modules tree ，再次发请求到 Server 端获取新的JS模块；
7.Client获取到新的JS模块后，会更新 modules tree并替换掉现有的模块；
8.最后调用 module.hot.accept() 完成热更新；

```


### MarkDown 使用指南

- [MarkDown](../blog-daily/use-markdown) <span style="color:#bbb; float:right">2021-06-24</span>
