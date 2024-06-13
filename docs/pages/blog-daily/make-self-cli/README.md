---
sideBar: true
---
### 我们要做啥
vue-cli 工具那样大家都使用过，通过在终端执行,  
可以和用户做交互，然后基于用户的选择来自动生成对应的* Vue *项目模板    

![RUNOOB 演示图](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/61f384a5ea7a45df853314502e3ba34f~tplv-k3u1fbpfcp-watermark.image)  

### 如何打造一个自己的cli工具  
先看下项目目录  
![项目目录](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb605c86767045729fc6421930e3b845~tplv-k3u1fbpfcp-watermark.image)

### 主流程
整个程序的主流程,就是把我们之前手动创建 Vue 的过程给自动化
我们先看看手动是需要几个步骤
先创建一个项目（也就是创建文件夹）
在创建 index.js 程序入口文件
编写对应的Vue代码
接着创建 package.json (也有可能是用 npm init 来生成的)
编写对应的 package.json 的配置
安装依赖
那怎么自动化呢？其实就是把上面的过程翻译成代码
```javascript
// # index.js 入口文件
// 1. 创建项目文件夹
fs.mkdirSync(getRootPath());
// 2. 创建 index.js
fs.writeFileSync(`${getRootPath()}/index.js`, "index");
// 3. 创建 package.json
fs.writeFileSync(
  `${getRootPath()}/package.json`,
  "package"
);
// 4. 安装依赖
TODO
```
这里直接使用 fs 创建对应的文件夹、index.js、package.json文件就可以了  
最后一步给了一个 TODO, 是因为我们的 package.json 的内容还没有定义好，所以也安装不了依赖，  
等到我们解决了 package.json 内容的问题后，在来处理这个点。  
好，到目前为止，我们程序的主流程就已经定义好了  
接下来就是一个逐步完善的过程了  
### 看下package.json
```json
// # package.json 配置文件
{
  "name": "teach-setup-koa",
  "version": "1.0.0",
  "description": "",
  "main": "index.js", // 入口文件
  "type": "module",
  "bin": "./bin/index.js",
  "files": [
    "bin",
    "package.json"
  ],
  "scripts": {
    "test": "rm -rf ./hei && node ./bin/index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "chalk": "^4.1.1", // 美化输出使输出有颜色有辨识度
    "ejs": "^3.1.6", // 项目模版引擎
    "execa": "^5.1.1", // 执行命令的node包,也可用node的内置模块 child_process
    "inquirer": "^8.1.0",  // 用户交互插件用来询问用户的配置
    "prettier": "^2.3.1" // 格式化代码输出,移除空白行
  }
}
```
### 如何生成代码模板
index.js 和 package.json 其实都是代码模板，我们只需要基于动态的数据生成就可以了  
而在模板技术选型上，我选择了 ejs ，当然你也可以使用你熟悉的或者你喜欢的库来生成  
createIndexTemplate.js 模块的职责就是基于 template/index.ejs 来生成 index.js 的代码  

### 如何通过 cli 的方式调用  
那我们想让用户通过 cli 的方式调用的话，还应该做什么事呢？  
还需要处理2个事  
在 package.json 里面配置 bin 字段，然后创建 bin 文件夹，把之前所有的代码都放到 bin 文件夹内  
在 bin/index.js 文件夹的头部写上以下注释  

```javascript
// bin/index.js
#!/usr/bin/env node
```
### 如何调试
我们在本地调用 node bin/index.js 执行起来肯定是没有任何问题了，  
但是我们这个程序到时候是需要让用户通过 cli 直接执行的，  
那我们怎么可以模拟一下测试一下呢？
我们只需要在当前的这个项目路径下，执行  npm link 即可  
npm 会帮助我们把这个项目链接到 root 下，可以执行 npm root -g 来查看



cli-demo 通过软连接的方式指向了你的代码库

然后我们就可以像调用全局的 cli 命令一样来调用自己的这个库了  
比如说，你在 package.json 里面 name 是 cli-demo ,   
那么在你执行完 npm link 后，就可以在终端执行 cli-demo 命令了  


### 如何发布到社区
辛辛苦苦做完的程序，光自己用肯定不行，必须 show 出来，让其他的小伙伴也都用上，
那怎么办呢？  
我们只要把程序发布到 npm 上就可以啦。  
而发布到 npm 也很简单，只需要执行:  
```javascript 
// 先登录
npm login
// 在发布
npm publish
```
::: tip
如果你只是为了测试，希望你发布完可以把包删除掉 npm unpublish --force
:::

[参考](https://juejin.cn/post/7051851544391598094/)
