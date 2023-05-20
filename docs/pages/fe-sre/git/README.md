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
