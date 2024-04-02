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
[webpack5持久缓存](https://segmentfault.com/a/1190000041726881?sort=votes)
[深度解析webpack打包流程](https://www.pipipi.net/30583.html/amp)
[webpack与rollup背后的acorn](https://www.zhihu.com/tardis/bd/art/149323563)

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


### 编写插件在指定插件后执行

``` javascript
class MyCustomPlugin {
  apply(compiler) {
    compiler.hooks.afterPlugins.tap('MyCustomPlugin', (compilation) => {
      // 在这里编写你的逻辑
      // 确保这个插件在SomeOtherPlugin之后执行
    });
  }
}
module.exports = MyCustomPlugin;
```

``` javascript
const SomeOtherPlugin = require('some-other-plugin');
const MyCustomPlugin = require('./MyCustomPlugin');
 
module.exports = {
  // ... 其他webpack配置
  plugins: [
    new SomeOtherPlugin(),
    new MyCustomPlugin(),
  ],
};
```

请注意，afterPlugins 钩子是在所有插件都应用之后触发的，因此你可以在这个钩子中执行代码，确保它在其他插件之后执行。  
如果你需要更精确地控制，可能需要查看特定插件的文档，看看它们提供的钩子，并选择最适合你需求的钩子。


### Tapable 事件机制

Tapable 是一个类似于 Node.js 中的 EventEmitter 的库，但它更专注于自定义事件的触发和处理。  
通过 Tapable 我们可以注册自定义事件，然后在适当的时机去执行自定义事件。  
这个和我们所熟知的生命周期函数类似，在特定的时机去触发。  

``` javascript
const { SyncHook } = require("tapable");

// 实例化 钩子函数 定义形参
const syncHook = new SyncHook(["name"]);

//通过tap函数注册事件
syncHook.tap("同步钩子1", (name) => {
  console.log("同步钩子1", name);
});

//同步钩子 通过call 发布事件
syncHook.call("古茗前端");

```
通过上面的例子，我们大致可以将 Tapable 的使用分为以下三步:

- 实例化钩子函数
- 事件注册
- 事件触发

#### 事件注册
同步的钩子要用 tap 方法来注册事件  
异步的钩子可以像同步方式一样用 tap 方法来注册，也可以用 tapAsync 或 tapPromise 异步方法来注册。  
- tapAsync： 使用用 tapAsync 方法来注册 hook 时，必须调用callback 回调函数。  
- tapPromise：使用 tapPromise 方法来注册 hook 时，必须返回一个 pormise ，异步任务完成后 resolve 。  

####  事件触发
同步的钩子要用 call 方法来触发  
异步的钩子需要用 callAsync 或 promise 异步方法来触发。
- callAsync：当我们用 callAsync 方法来调用 hook 时，第二个参数是一个回调函数，回调函数的参数是执行任务的最后一个返回值  
- promise：当我们用 promise 方法来调用 hook 时，需要使用 then 来处理执行结果，参数是执行任务的最后一个返回值。  
