---
home: false
---
## package.json 知识点

### peerDependencies
用于指定当前包所依赖的其他包的版本要求，主要目的是通知用户或工具（如 npm 或 yarn）当前包需要特定版本的依赖包才能正常工作。  
这些依赖并不会在安装当前包时自动安装，而是需要用户手动安装符合版本要求的依赖。
[对等依赖](https://zhuanlan.zhihu.com/p/666454541)
### bundledDependencies
用于指定一组包，这些包应该与你的包一起打包分发。这些包会被包含在你的包的发布版本中，这样，当其他开发者安装你的包时，他们也会得到这些依赖包的副本。

### optionalDependencies
用于指定一组包，这些包是可选的依赖。这些依赖在安装过程中会被尝试安装，但如果安装失败，npm 或 yarn 不会将此作为错误处理，而是继续安装其他依赖。

### package.json的脚本勾子
在 package.json 文件中，你可以定义多种脚本钩子 `（scripts）`，这些脚本钩子可以在特定的 npm 事件发生时自动执行。以下是一些常见的脚本钩子：

- prepublish: 在包发布之前运行，通常用于构建或打包代码。
- prepare: 在包打包或发布之前运行，通常用于确保包的发布版本是正确构建的。
- prepublishOnly: 类似于 prepublish，但是在 npm publish 之前运行，而不是 npm install。
- preinstall: 在安装任何包之前运行，包括 npm install 和 npm ci。
- install: 在安装包之后运行。
- postinstall: 在安装包之后运行，包括 npm install 和 npm ci。
- preuninstall: 在卸载包之前运行。
- uninstall: 在卸载包之后运行。
- postuninstall: 在卸载包之后运行。
- preversion: 在更改包版本之前运行。
- version: 在更改包版本之后运行。
- postversion: 在更改包版本之后运行。
- pretest, test, posttest: 分别在运行测试之前、运行测试时、运行测试之后执行。
- prestop, stop, poststop: 分别在停止命令之前、停止命令时、停止命令之后执行。
- prestart, start, poststart: 分别在启动命令之前、启动命令时、启动命令之后执行。
- prefetch, fetch, postfetch: 分别在获取资源之前、获取资源时、获取资源之后执行。

``` json 
{
    "type": "module" // 指定当前包是 ECMAScript 模块。
}
```
