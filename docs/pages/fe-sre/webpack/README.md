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

### MarkDown 使用指南

- [MarkDown](../blog-daily/use-markdown) <span style="color:#bbb; float:right">2021-06-24</span>
