---
home: false
---
## git 实用笔记

### 切换账户
``` Bash
ssh-add ~/.ssh/private // 后面的路径是指定的配置文件
```

### 忽略大小写
``` Bash
git config core.ignorecase false
```

### 更新分支名
``` Bash
git branch -m oldBranch newBranch
git push --delete origin oldBranch

git push origin newBranch
git branch --set-upstream-to origin/newBranch
```

### 优雅回退
``` Bash
reset --soft：软回溯，回退 commit 的同时保留修改内容。
cherry-pick：复制 commit。
revert：撤销 commit 的修改内容。
reflog：记录了 commit 的历史操作。
```

### 仓库分支合并
``` Bash
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

在项目开发过程中个，一般都会添加 .gitignore 文件，规则很简单，但有时会发现，规则不生效。
原因是 .gitignore 只能忽略那些原来没有被track的文件，如果某些文件已经被纳入了版本管理中，则修改.gitignore是无效的。
那么解决方法就是先把本地缓存删除（改变成未track状态），然后再提交。

```Bash
git rm -r --cached .

git add .

git commit -m 'update .gitignore'
```

### git 无法识别空目录

1、在空目录下新建.gitkeep文件, 这是一个约定的文件也可以是其它类型文件起到占位的作用
2、使用git add -f foldername 
