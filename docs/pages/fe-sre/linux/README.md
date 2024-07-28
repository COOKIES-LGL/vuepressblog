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
