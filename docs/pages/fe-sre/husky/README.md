---
home: false
sidebar: false
---
## 旧版husky使用总结
在做前端工程化时husky可以说是一个必不可少的工具。husky可以让我们向项目中方便添加git hooks。通常情况下我只需要如下两步就可在项目中引入并设置好husky：
### 将husky添加到项目的开发依赖中

``` shell command
npm install -D husky
```
### 在package.json中设置我们需要的git hooks
``` json
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
在之前的项目中我们通常都是这样完成对husky的引入和设置的。但是今天在我新建的项目中这样设置竟然不起作用了，经过一番查看才知道原来最新版本的husky（6.0.0）已经做了破坏性的变更，之前的设置方式已经失效了
:::

## 新版husky使用
根据官方的说法，之前husky的工作方式是这样的，为了能够让用户设置任何类型的git hooks都能正常工作，husky不得不创建所有类型的git hooks。这样在git 工作的每个阶段都会调用husky所设置的脚本，在这个脚本中husky会检查用户是否配置该hook，如果有就运行用户配置的命令，如果没有就继续往下执行。

这样做的好处就是无论用户设置什么类型的git hook husky都能确保其正常运行。但是缺点也是显而易见的，即使用户没有设置任何git hook，husky也向git中添加了所有类型的git hook。

那有没有可能让husky只添加我们需要的git hook呢

### 新版husky的工作原理
新版的husky使用了从git 2.9开始引入的一个新功能core.hooksPath。core.hooksPath可以让你指定git hooks所在的目录而不是使用默认的.git/hooks/。这样husky可以使用husky install将git hooks的目录指定为.husky/，然后使用husky add命令向.husky/中添加hook。通过这种方式我们就可以只添加我们需要的git hook，而且所有的脚本都保存在了一个地方（.husky/目录下）因此也就不存在同步文件的问题了。

### 安装husky
``` shell command
npm install -D husky
```
### 在packgae.json中添加prepare脚本
``` json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```
prepare脚本会在npm install（不带参数）之后自动执行。也就是说当我们执行npm install安装完项目依赖后会执行 husky install命令，该命令会创建.husky/目录并指定该目录为git hooks所在的目录。

### 添加git hooks，运行一下命令创建git hooks
``` shell command
npx husky add .husky/pre-commit "npm run test"
```
运行完该命令后我们会看到.husky/目录下新增了一个名为pre-commit的shell脚本。也就是说在在执行git commit命令时会先执行pre-commit这个脚本。pre-commit脚本内容如下：
``` shell command
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"
   
npm run  test
```
可以看到该脚本的功能就是执行npm run test这个命令
### 需要注意的点
在项目中我们会使用commit-msg这个git hook来校验我们commit时添加的备注信息是否符合规范。在以前的我们通常是这样配置：
``` json
{
  "husky": {
    "hooks": {
      "commit-msg": "commitlint -e $HUSKY_GIT_PARAMS" // 校验commit时添加的备注信息是否符合我们要求的规范
    }
  }
}
```
在新版husky中$HUSKY_GIT_PARAMS这个变量不再使用了，取而代之的是$1。在新版husky中我们的commit-msg脚本内容如下：
``` shell command
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

#--no-install 参数表示强制npx使用项目中node_modules目录中的commitlint包
npx --no-install commitlint --edit $1
```
这个脚本应该也能使用类似于下面的命令进行添加
``` shell command
npx husk add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

### cspell处理单词拼写
``` bash
/** 对当前更改的文件执行cspell命令 */
git diff --name-only | npx cspell --file-list stdin
```
