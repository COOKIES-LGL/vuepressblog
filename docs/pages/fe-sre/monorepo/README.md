---
home: false
sidebar: false
---

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

### yarn deduplicate

Yarn-deduplicate是一款npm包，它可以帮助我们自动解决项目中遇到的同一依赖重复问题，可以有效地保证我们项目的稳定性和安全性。

版权声明：本文为原创文章，版权由本站（JavaScript中文网）拥有，严禁未经允许复制、转载、传播、篡改等任何行为，如需转载，请联系本站管理员获取书面授权

### npm update

已经存在node_modules时 npm install 不会更新 ^的版本控制，需要使用npm update. 或者删除node_modules 进行更新

npm update命令的目的是根据您在package.json文件中指定的内容更新您的package-lock.json。这是正常行为。
如果你想更新你的package.json文件，你可以使用npm-check-updates：npm install -g npm-check-updates.
然后可以使用以下命令：

ncu检查package.json文件中的更新
ncu -u更新package.json文件
npm update --save从package.json文件更新package-lock.json文件