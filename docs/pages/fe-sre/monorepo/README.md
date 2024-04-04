---
home: false
sidebar: false
---

[微服务架构乾坤核心原理](https://zhuanlan.zhihu.com/p/414468874)

### 使用 monorepo 的原因
我正在开发的项目 A，依赖了已经线上发布的项目 B，但是随着项目 A 的不断开发，又需要不时修改项目 B 的代码（这些修改暂时不必发布线上），如何能够在修改项目 B 代码后及时将改动后在项目 A 中同步？ 在项目 A 发布上线后，如何以一种优雅的方式解决项目 A，B 版本升级后的版本同步问题？


### Mono-repo、Mult-repo
在 mono-repo 方法中，你可以将所有服务保存在单一(mono)存储库中。你仍然可以独立地部署和管理每个服务。这些服务可以共享公共库和代码。

1、Mono-repo 的优势
Mon-repo 方式有许多优点：

- 存储所有项目代码的单独位置，团队中的每个人都可以访问。
- 易于重用和共享代码，与团队合作。
- 很容易理解你的变更对整个项目的影响。
- 代码重构和代码大变更的最佳选择。
- 团队成员可以获得整个项目的总体视图。
- 易于管理依赖关系。

2、Mono-repo 的劣势
当然，Mono-repo 也有一些缺点，
- 主要表现在性能上。如果你的项目增长，每隔一天都会添加更多的文件，那么 git checkout、pull 和其他操作可能变得缓慢，以及文件搜索可能需要更长的时间。
- 此外，如果你为你的项目雇佣了许多独立的承包商，那么让他们访问整个代码库可能不那么安全。
- 此外，实现持续部署(Continuous deployation，CD)也很困难，因为许多人可以合入他们的更改，而持续集成(Continuous Integration，CI)系统可能需要进行多次重构。

使用 Mono-repo 的大公司都有自定义工具来处理扩展问题。例如，Facebook 使用自定义文件系统和源代码控制。

*什么是 Multi-repo?*
在 Multi-repo 方法中，存在多个存储库，它们承载一个项目的多个库和服务。如果服务发生更改，开发人员只需重新构建该服务，而不需要构建整个项目。个人和团队可以从事他们特定的服务，他们只能访问他们有权限的服务。

1、Multi-repo 的优势
采用 Multi-repo 的公司数量远远多于采用 Mono-repo 的公司，原因如下:
- 每个服务和库都有自己的版本控制。
- 代码 checkout 和 pull 是小型且独立的，因此即使项目规模增大，也不存在性能问题。
- 团队可以独立工作，不需要访问整个代码库。
- 更快的开发和灵活性。
- 每个服务都可以单独发版，并有自己的部署周期，从而使 CI 和 CD 更易于实现。
- 更好的权限访问控制——所有的团队不需要完全访问所有的库——需要的时候，再获得读访问权限。
2、Multi-repo 的劣势
1. 跨服务和项目使用的公共依赖和库必须定期同步以获得最新版本。
2. 某种程度上鼓励孤立文化，导致重复代码和各个团队试图解决相同问题。
3. 每个团队可能遵循不同的一组最佳实践来编写代码，从而导致难以遵循通用的最佳实践。

### multrepo与monorepo优缺点

<img src="http://upload-images.jianshu.io/upload_images/19806861-7e0ab233b65060e2.png?imageMogr2/auto-orient/strip|imageView2/2/w/960/format/webp" />

### 创建一个monorepo

(lerna教程详解)[https://segmentfault.com/a/1190000019350611]
#### 安装lerna
```
npm i lerna -g
```

#### 初始化项目
找一个空文件夹执行 lerna init 初始化项目。

#### 创建项目包
``` bash
lerna create moduleA
lerna create moduleB
```

#### 本地包相互引用
``` bash
lerna link
```

j假设moduleA依赖moduleB，现在我们在 moduleA 包下增加个依赖。

``` json
packages/moduleA/package.json

{
  ...
  "dependencies":  {
  "moduleB":  "^1.0.0"
  },
  ...
}
```
在终端执行
lerna link
会在包中帮你安装moduleB依赖。

#### 添加公共依赖
假设 moduleA 和 moduleB 都依赖 lodash
``` bash
lerna add lodash
```
#### 添加单独依赖
l 假设moduleA 自己依赖 jquery，moduleB 自己依赖 zepto

``` bash
lerna add jquery --scope=@fengyinchao/modulea
lerna add zepto --scope=@fengyinchao/moduleb
```

#### 卸载包
l 给 moduleA 移除一个依赖 husky
``` bash
lerna exec --scope=@fengyinchao/modulea npm uninstall husky
```

#### 重新安装依赖
``` bash
lerna bootstrap
```
这样会帮我们安装package.json里的dependencies依赖项

#### 抽离公共模块
上面 moduleA 和 moduleB 都依赖了 lodash，且在各自 package 下的node_modules 里都有副本，这其实很浪费空间，可以使用 --hoist
``` bash
lerna bootstrap --hoist
```
这会将 packages 里重复的依赖提取到最外层的 node_modules 里，同时最外层的 package.json 也不会更新 dependency 信息，所以不建议将公用依赖写到最外层的package.json里，而是重复写到每个子package.json 里，然后用 --hoist 提取出来

#### 更新公共依赖
假设要升级 moduleA 和 moduleB 都依赖的 lodash 版本，不必依次到各子package下升级，可以借助 lerna-update-wizard 这个包来做
``` bash
// 根目录执行
npm install --save-dev lerna-update-wizard
```
#### 发布
- 登录 npm
- npm login
- lerna changed 查看代码变化
- lerna version 修改版本
- lerna publish 发布

#### 使用
npm i @syyyds-cli/vue2wx --save

#### 使用脚手架：
``` bash
"scripts": {
    "dev": "lsy-cli-repo-lerna",
}
```

### with proxy 代理
 
``` javascript
// 构造一个 with 来包裹需要执行的代码，返回 with 代码块的一个函数实例
function withedYourCode(code) {
  code = 'with(globalObj) {' + code + '}'
  return new Function('globalObj', code)
}
 
// 可访问全局作用域的白名单列表
const accessWhiteList = ['Math', 'Date','console']
 
 
// 待执行程序
const code = `
    console.log(1111,Math.random());
    func(foo)
    location.href = 'xxx'
`
 
// 执行上下文对象
const ctx = {
    func: variable => {
        console.log(variable)
    },
    foo: 'foo'
}

// 执行上下文对象的代理对象
const ctxProxy = new Proxy(ctx, {
    has: (target, prop) => { // has 可以拦截 with 代码块中任意属性的访问
      if (accessWhiteList.includes(prop)) { // 在可访问的白名单内，可继续向上查找
          return target.hasOwnProperty(prop)
      }
 
      if (!target.hasOwnProperty(prop)) {
          throw new Error(`Invalid expression - ${prop}! You can not do that!`)
      }
 
      return true
    }
})
 
// 普通的沙箱
function normalSandbox(code, proxy) {
    withedYourCode(code).call(ctx, proxy) // 将 this 指向手动构造的全局代理对象
}
 
normalSandbox(code, ctxProxy) 
 
// Uncaught Error: Invalid expression - location! You can not do that!
```
