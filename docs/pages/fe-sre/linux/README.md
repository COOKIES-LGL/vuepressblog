---
home: false
sidebar: false
---

### 前端必备 linux 知识

```sh
ifconfig
# 获取ip地址
lsof -i:端口号
# 查看端口占有情况
kill -9 PID
# 杀除进程
sudo vi /etc/hosts
# 修改hosts文件
netstat -ano
# 列出PID进程信息
findstr PID
# 查看端口占用情况
chmod g+w file.txt
# 更改文件或目录权限，将向文件 file.txt 的组添加写入权限
```

使用 find 命令在终端中查找文件的路径。以下是一个基本的 find 命令示例，用于查找名为 filename.txt 的文件

```bash
sudo find / -name filename.txt
# 搜索用户的主目录，可以使用~代替/
sudo find ~ -name filename.txt
```

### 特殊变量:

$ 符号还用于一些特殊变量，这些变量有特定的含义。例如：

- $0：当前脚本的文件名。
- $1, $2, ...：传递给脚本或函数的参数。
- $#：传递给脚本或函数的参数数量。
- $?：上一个命令的退出状态码。
- $$：当前 shell 的进程 ID。
- $\_：上一个命令的最后一个参数或最后一个命令的结果。

### 命令替换

使用 $() 进行命令替换，即执行括号内的命令，并将其输出结果替换到当前命令行

```bash
DATE=$(date)
echo "Today's date is $DATE"
```

### 参数扩展和子字符串操作

```bash
NAME=${USER:-default}  # 如果 USER 变量未定义，则使用 "default"
FILENAME="example.txt"
echo ${FILENAME%.txt}  # 输出: example
```

### 命令行光标移到

Ctrl + A 要将光标移到当前命令行的开始位置
Ctrl + E 将光标移动到当前命令行的末尾
Ctrl + U 清除从光标位置到行首的所有字符

### cp -r 复制

```bash
cp -r source_directory existing_directory
```

当你使用 cp -r 命令复制一个已经存在的目录时，如果目标位置是一个已经存在的目录，cp 命令会在该目标目录下创建一个与源目录同名的子目录，并将源目录及其所有内容复制到这个新创建的子目录中.

使用下面方式解决此问题

```bash
cp -r source_directory/* existing_directory/
```

### | 连接符

在 bash 命令中，管道操作符（|）用于将一个命令的输出作为另一个命令的输入

### xargs

在 bash 命令中，将前面的参数输入给后面的函数

```bash
git rev-parse --show-toplevel | echo
```
### mac 快速复制文件路径
- 选择你想要复制路径的文件或文件夹。
- 按下Command + Option + C键，即可快速复制路径到剪贴板。‌
