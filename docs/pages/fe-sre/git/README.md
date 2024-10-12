---
home: false
---

## git 实用笔记

- [Husky](./husky) <span style="color:#bbb; float:right">2021-08-10</span>
- [Github Actions](./github-actions) <span style="color:#bbb; float:right">2023-01-14</span>
- [Git Modules](./git-modules) <span style="color:#bbb; float:right">2024-01-14</span>
- [GitHub 文档](https://docs.github.com/zh) <span style="color:#bbb; float:right">2024-02-10</span>

### 切换账户

```Bash
ssh-add ~/.ssh/private // 后面的路径是指定的配置文件
```

### 忽略大小写

```Bash
git config core.ignorecase false
```

### 更新分支名

```Bash
git branch -m oldBranch newBranch
git push --delete origin oldBranch

git push origin newBranch
git branch --set-upstream-to origin/newBranch
```

### 优雅回退

```Bash
git reset --soft：软回溯，回退 commit 的同时保留修改内容。
git cherry-pick：复制 commit。
git revert：撤销 commit 的修改内容。
git reflog：记录了 commit 的历史操作。
```

### 仓库分支合并

```Bash
git merge master -m 'merge master' --allow-unrelated-histories //  把两段不相干的 分支进行强行合并
```

### 意外提交大小写文件到远程仓库

```Bash
 git config core.ignorecase false
 git rm --cached src/biz/**[需要删除的文件路径] -r
 git add .
 git commit -m 'feat: 移除大小写文件'
 git push
```

### gitignore 规则不生效

项目都会添加 .gitignore 文件但有时会发现，规则不生效。原因是 .gitignore 只能忽略那些原来没有被 track 的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore 是无效的。
那么解决方法就是先把本地缓存删除（改变成未 track 状态），然后再提交。

```Bash
git rm -r --cached .

git add .

git commit -m 'update .gitignore'
```

### git 无法识别空目录

1、在空目录下新建.gitkeep 文件, 这是一个约定的文件也可以是其它类型文件起到占位的作用
2、使用 git add -f foldername

### git merge --no-ff

```bash
git merge --no-ff branch1
```

以上命令将指定分支合并到当前分支，但总会生成一个合并 commit（即便这一合并操作可以快进）。当你需要在仓库的提交历史中标记合并事件时这一命令相当有用。
https://zhuanlan.zhihu.com/p/467878513?utm_id=0

### git 获取当前分支名

```bash
git rev-parse --abbrev-ref HEAD
```

### 同步远程 master

```bash
#!/bin/bash
set -ex

currentGitBranch=`git rev-parse --abbrev-ref HEAD`

git checkout master

git pull

git checkout $currentGitBranch

git merge --no-ff master -m 'feat: merge master'
```

### 当前 commitId

```bash
git show -s --format=%H
```

### 当前 commit diff 文件列表

```bash
git diff <commit1> <commit2> --name-only
```

### 禁用 git push --force

不要用 git push --force，而要用 git push --force-with-lease 代替。
在你上次提交之后，只要其他人往该分支提交给代码，git push --force-with-lease 会拒绝覆盖

[merge rebase 的区别](https://fe.ecool.fun/topic/cfe8f03e-1a05-4c00-baa7-04ae08c8765c?orderBy=updateTime&order=desc&tagId=0)

### git ls-remote

查看仓库是否可达

```bash
 git ls-remote github.com:****.github.git
```

#### git ls-files

获取当前目录 git 追踪的文件

```bash
git ls-files命令用于列出git仓库中的文件
```

### 获取当前 git 仓库根目录

```bash
git rev-parse --show-toplevel
```

### 切换目录到 Git 仓库的根目录

用反引号`或$(...)）将 git rev-parse --show-toplevel 的输出直接作为 cd 命令的参数

```bash
cd `git rev-parse --show-toplevel`
cd $(git rev-parse --show-toplevel)
```
