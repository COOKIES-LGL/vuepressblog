---
sidebar: auto
---

## 使用要点

webpack 5 不再引入 Node.js 变量的 polyfill，在前端代码中应避免使用。

你可能会收到很多弃用警告，插件需要时间来赶上内核的变化。请将这些弃用上报给插件。这些弃用只是警告，构建仍然可以正常工作，只是会有小瑕疵（比如性能降低）。
你使用带有 --no-deprecation 选项的 node 运行 webpack，可以隐藏废弃告警，例如
node --no-deprecation node_modules/webpack/bin/webpack.js

一般来说，webpack 5 的性能应该会有所提高，但也存在少数情况性能会变差。
而在这里，你可以做一些事清来改善这种情况：

通过 Profile 检查时间耗费在哪里。
--profile --progress 可以展示一个简单的性能曲线。
node --inspect-brk node_modules/webpack/bin/webpack.js +
chrome://inspect / edge://inspect（查看 profiler 选项）。
你可以将这些性能文件保存到文件中，并在 issues 中提供它们。
尝试使用 --no-turbo-inlining 选项，在某些情况下可以获得更好的堆栈信息。
在增量构建时，构建模块的世界可以通过使用像 webpack 4 中的不安全缓存来改善：
module.unsafeCache: true
但这可能会影响处理代码库的一些变化能力。
全量构建
与新功能相比，弃用特性的向后兼容层通常性能很差。
创建许多警告会影响构建性能，即使它们被忽略。
Source Maps 的代价很昂贵。请在文档中查看 devtool 选项以比较使用不同选项的代价。
Anti-Virus（反病毒）保护可能会影响文件系统的访问性能。
持久缓存可以帮助改善重复性的完整构建。
Module Federation 允许将应用程序分割成多个较小的构建。

经排查发现原来在 webpack4 中 url-loader 使用 loaders 的配置已经被废弃掉，而在 webpack5 中 url-loader 在使用 options 配置的时候必须要使用 use 数组，相应的 loader 也要使用对象的形式来书写。

因为我们的脚手架在开发环境使用的是 webpack-dev-middleware 配合 express 来启动本地前端服务的，经排查在 webpack5 中废弃掉了 compiler.plugin()的方式调用。

## 常用 loader

<details>
  <summary>cache-loader</summary>
  <div>
  <pre>
  // 用法
  module.exports = {
    module: {
      rules: [
        {
          test: /\.ext$/,
          use: [
            'cache-loader',
            ...loaders
          ],
          include: path.resolve('src')
        }
      ]
    }
  }
  注意⚠️ 保存和读取这些缓存文件会有一些时间开销，所以请只对性能开销较大的 loader 使用此 loader。
  </pre>
  </div>
</details>


<details>
  <summary>imports-loader</summary>
  <div>
  <pre>
  // 用法
  module.exports = {
    module: {
      rules: [
        {
         test: require.resolve('./src/index.js'),
         use: 'imports-loader?wrapper=window',
        }
      ]
    }
  }
当项目运行在浏览器的时候this指向weindow,
当模块运行在 CommonJS 上下文中，这将会变成一个问题，也就是说此时的 this 指向的是 module.exports。
在这种情况下，你可以通过使用 imports-loader 覆盖 this 指向：
  </pre>
  </div>
</details>


## 常用plugin

<details>
  <summary>ProvidePlugin</summary>
  <div>
  <pre>
  // 用法
 module.exports = {
   entry: './src/index.js',
   output: {
     filename: 'main.js',
     path: path.resolve(__dirname, 'dist'),
   },
   plugins: [
    new webpack.ProvidePlugin({
      _: 'lodash',
    }),
   ],
 };
这个时候loadsh就不需要单独导入了,它已经被预置了
plugins: [
new webpack.ProvidePlugin({
  join: ['lodash', 'join'],
}),
// 按需单独预设置,可以配合treeSharking使用
  </pre>
  </div>
</details>

现在，如果执行 webpack，你会发现创建了一个体积相当大的文件。如果你查看这个文件，会看到 lodash 也被打包到代码中。在这种场景中，我们更倾向于把 lodash 当作 peerDependency。也就是说，consumer(使用者) 应该已经安装过 lodash 。因此，你就可以放弃控制此外部 library ，而是将控制权让给使用 library 的 consumer。

这可以使用 externals 配置来完成：
   externals: {
     lodash: {
       commonjs: 'lodash',
       commonjs2: 'lodash',
       amd: 'lodash',
       root: '_',
     },
   },
对于想要实现从一个依赖中调用多个文件的那些 library：
externals: [
    'library/one',
    'library/two',
    // 匹配以 "library/" 开始的所有依赖
    /^library\/.+$/,
  ],
  ------
我们可以看到这三个文件的 hash 都变化了。这是因为每个 module.id 会默认地基于解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。简要概括：

main bundle 会随着自身的新增内容的修改，而发生变化。
vendor bundle 会随着自身的 module.id 的变化，而发生变化。
manifest runtime 会因为现在包含一个新模块的引用，而发生变化。
第一个和最后一个都是符合预期的行为，vendor hash 发生变化是我们要修复的。我们将 optimization.moduleIds 设置为 'deterministic'：

    optimization: {
     moduleIds: 'deterministic',
    }

#######

正如我们在 代码分离 中所学到的，SplitChunksPlugin 可以用于将模块分离到单独的 bundle 中。webpack 还提供了一个优化功能，可使用 optimization.runtimeChunk 选项将 runtime 代码拆分为一个单独的 chunk。将其设置为 single 来为所有 chunk 创建一个 runtime bundle：

   optimization: {
     runtimeChunk: 'single',
   },

mainfest

webpack bundle optimize helper


我们知道JavaScript属于解释型语言，JavaScript的执行分为：解释和执行两个阶段,这两个阶段所做的事并不一样：
解释阶段：

词法分析
语法分析
作用域规则确定

执行阶段：

创建执行上下文
执行函数代码
垃圾回收

JavaScript解释阶段便会确定作用域规则，因此作用域在函数定义时就已经确定了，而不是在函数调用时确定，但是执行上下文是函数执行之前创建的。执行上下文最明显的就是this的指向是执行时确定的。而作用域访问的变量是编写代码的结构确定的。
作用域和执行上下文之间最大的区别是：
执行上下文在运行时确定，随时可能改变；作用域在定义时就确定，并且不会改变。
一个作用域下可能包含若干个上下文环境。有可能从来没有过上下文环境（函数从来就没有被调用过）；有可能有过，现在函数被调用完毕后，上下文环境被销毁了；有可能同时存在一个或多个（闭包）。同一个作用域下，不同的调用会产生不同的执行上下文环境，继而产生不同的变量的值。
