---
home: false
sidebar: false
---

**背景：**
开发过程中，经常会有一些通用的部分希望抽取出来做成一个公共库来提供给别的工程来使用，而公共代码库的版本管理是个麻烦的事情。

**作用：**
允许你将一个 Git 仓库作为另一个 Git 仓库的子目录。 它能让你将另一个仓库克隆到自己的项目中，同时还保持提交的独立。

**使用:**

```bash
​git submodule add http://XXXcommon.git(仓库地址)
```

会创建.gitmodules 文件。该配置文件保存了项目 URL 与已经拉取的本地目录之间的映射。如果有多个子模块，该文件中就会有多条记录。
要重点注意的是，该文件也像 .gitignore 文件一样受到（通过）版本控制。 它会和该项目的其他部分一同被拉取推送。

**注意：**
当使用 git clone 下来的工程中带有 submodule 时，初始的时候，submodule 的内容并不会自动下载下来的
需要手动执行拉取动作

```bash
git submodule update --init --recursive
```
