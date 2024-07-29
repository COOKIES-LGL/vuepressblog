---
home: false
sidebar: false
---

### 前端必备linux知识

``` sh
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
````

使用find命令在终端中查找文件的路径。以下是一个基本的find命令示例，用于查找名为filename.txt的文件
``` bash
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
- $_：上一个命令的最后一个参数或最后一个命令的结果。

### 命令替换
使用 $() 进行命令替换，即执行括号内的命令，并将其输出结果替换到当前命令行
``` bash
DATE=$(date)
echo "Today's date is $DATE"
```
### 参数扩展和子字符串操作
```bash
NAME=${USER:-default}  # 如果 USER 变量未定义，则使用 "default"
FILENAME="example.txt"
echo ${FILENAME%.txt}  # 输出: example
```
