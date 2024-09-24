---
home: false
sidebar: false
---

### 旧版 husky 使用总结

在做前端工程化时 husky 可以说是一个必不可少的工具。husky 可以让我们向项目中方便添加 git hooks。通常情况下我只需要如下两步就可在项目中引入并设置好 husky：

#### 将 husky 添加到项目的开发依赖中

```shell command
npm install -D husky
```

#### 在 package.json 中设置我们需要的 git hooks

```json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run test", // 在commit之前先执行npm run test命令
      "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS" // 校验commit时添加的备注信息是否符合我们要求的规范
    }
  }
}
```

::: tip
在之前的项目中我们通常都是这样完成对 husky 的引入和设置的。但是今天在我新建的项目中这样设置竟然不起作用了，经过一番查看才知道原来最新版本的 husky（6.0.0）已经做了破坏性的变更，之前的设置方式已经失效了
:::

### 新版 husky 使用

根据官方的说法，之前 husky 的工作方式是这样的，为了能够让用户设置任何类型的 git hooks 都能正常工作，husky 不得不创建所有类型的 git hooks。这样在 git 工作的每个阶段都会调用 husky 所设置的脚本，在这个脚本中 husky 会检查用户是否配置该 hook，如果有就运行用户配置的命令，如果没有就继续往下执行。

这样做的好处就是无论用户设置什么类型的 git hook husky 都能确保其正常运行。但是缺点也是显而易见的，即使用户没有设置任何 git hook，husky 也向 git 中添加了所有类型的 git hook。

那有没有可能让 husky 只添加我们需要的 git hook 呢

#### 新版 husky 的工作原理

新版的 husky 使用了从 git 2.9 开始引入的一个新功能 core.hooksPath。core.hooksPath 可以让你指定 git hooks 所在的目录而不是使用默认的.git/hooks/。这样 husky 可以使用 husky install 将 git hooks 的目录指定为.husky/，然后使用 husky add 命令向.husky/中添加 hook。通过这种方式我们就可以只添加我们需要的 git hook，而且所有的脚本都保存在了一个地方（.husky/目录下）因此也就不存在同步文件的问题了。

> 位置：默认在.git/hooks， 不会被 push 到远端。也可以通过以下配置指定，然后 push 到远端，不用每个人都配置
> 需要配置下 `core.hooksPath`

```bash
git config core.hooksPath .mygithooks
```

#### 安装 husky

```shell command
npm install -D husky
```

#### 在 packgae.json 中添加 prepare 脚本

```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

prepare 脚本会在 npm install（不带参数）之后自动执行。也就是说当我们执行 npm install 安装完项目依赖后会执行 husky install 命令，  
该命令会创建.husky/目录并指定该目录为 git hooks 所在的目录。

### 添加 git hooks，运行一下命令创建 git hooks

```shell command
npx husky add .husky/pre-commit "npm run test"
```

运行完该命令后我们会看到.husky/目录下新增了一个名为 pre-commit 的 shell 脚本。也就是说在在执行 git commit 命令时会先执行 pre-commit 这个脚本。pre-commit 脚本内容如下：

```shell command
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test
```

可以看到该脚本的功能就是执行 npm run test 这个命令

### 需要注意的点

在项目中我们会使用 commit-msg 这个 git hook 来校验我们 commit 时添加的备注信息是否符合规范。在以前的我们通常是这样配置：

```json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS" // 校验commit时添加的备注信息是否符合我们要求的规范
    }
  }
}
```

- pre-commit：键入提交信息前运行
- prepare-commit-msg:启动提交信息编辑器之前，默认信息被创建之后运行
- commit-msg： 用来在提交通过前验证项目状态或提交信息
- post-commit：整个提交过程完成后运行。该钩子一般用于通知之类的事情，通知有人 push 了代码等

在新版 husky 中`$HUSKY_GIT_PARAMS`这个变量不再使用了，取而代之的是`$1`。在新版 husky 中我们的 commit-msg 脚本容如下：

```shell command
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

#--no-install 参数表示强制npx使用项目中node_modules目录中的commitlint包
npx --no-install commitlint --edit $1
```

这个脚本应该也能使用类似于下面的命令进行添加

```shell command
npx husk add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### cspell 处理单词拼写

```bash
/** 对当前更改的文件执行cspell命令 */
git diff --name-only | npx cspell --file-list stdin
```
