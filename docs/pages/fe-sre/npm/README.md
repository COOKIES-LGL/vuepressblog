---
home: false
---

### npm update

已经存在node_modules时 npm install 不会更新 ^的版本控制，需要使用npm update. 或者删除node_modules 进行更新

npm update命令的目的是根据您在package.json文件中指定的内容更新您的package-lock.json。这是正常行为。
如果你想更新你的package.json文件，你可以使用npm-check-updates：npm install -g npm-check-updates.
然后可以使用以下命令：

ncu检查package.json文件中的更新
ncu -u更新package.json文件
npm update --save从package.json文件更新package-lock.json文件

### 命令参数配置

果通过 process.argv 来获取，要额外处理两种不同的命令参数格式，不方便。

这里推荐 yargs 开源库来解析命令参数。运行以下命令安装 yargs：

在 Node.js 中拷贝文件夹并不简单，需要用到递归，这里推荐使用开源库copy-dir来实现拷贝文件。

### yarn deduplicate

Yarn-deduplicate是一款npm包，它可以帮助我们自动解决项目中遇到的同一依赖重复问题，可以有效地保证我们项目的稳定性和安全性。

版权声明：本文为原创文章，版权由本站（JavaScript中文网）拥有，严禁未经允许复制、转载、传播、篡改等任何行为，如需转载，请联系本站管理员获取书面授权

### npm 设置仓库源
``` bash
npm config set registry [https://registry.npmjs.org/](https://registry.npmjs.org/)
```


### 使npm包同时支持多种模块类型

要使 npm 包同时适配 commonJS 和 esModule，可以在 package.json 的 "main" 字段中指定 commonJS 版本的入口文件，同时在 "module" 字段中指定 esModule 版本的入口文件。例如：
``` json
{
  "name": "my-package",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js"
}
```

知识点：
（1）.mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置。
（2）ES6 模块与 CommonJS 模块尽量不要混用。require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。

### nodemon

### npm install -g depcheck

### npm ls --depth=0
可以使用 npm ls --depth=0 命令查看项目中的幽灵依赖


### minimist
轻量命令行参数解析工具

### fast-glob
NodeJS文件系统遍历工具：fast-glob


### 开发npm开发笔记

开发一个npm包需要创建在项目中新建example项目用于测试

::: tip
这个工程位于我们主工程的目录底下，
这里要用到的依赖包，如果本工程没有安装，
则会自动查找上层目录，
也就是，外层安装了的话就可用。
另外，
找到根目录也没有的话还会查看全局安装，
都没有的时候才会报错 
:::

如果通过路径进行安装会出现循环依赖问题
以下安装方式
``` bash
npm install --save-dev ../../npm-plugin/index.js
```
因为 demo 工程位于 package 工程目录下，
会导致递归引用。
仅当不在同一路径下创建新工程时可以。

因此我们可以直接在项目文件中按文件路径引入 或者使用npx link引入
