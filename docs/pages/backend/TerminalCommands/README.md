---
sideBar: false
---

## terminal commands 常用指令

### grep

是一个在文本文件中搜索特定模式的命令行工具

```bash
grep [选项] 模式 [文件...]
```

常用选项
-i：忽略大小写。
-v：反向匹配，即显示不包含模式的行。
-r 或 -R：递归搜索目录中的文件。
-w：只匹配整个单词。
-c：只输出匹配的行数。
-l：显示包含匹配模式的文件列表。
-L：显示不包含匹配模式的文件列表。
-n：显示匹配行的行号。
-e：使用多个模式进行匹配。
-f：从文件中读取模式进行匹配。
-o：只输出匹配的部分。

```bash
grep -i "hello" file.txt
# 在 file.txt 中搜索包含 "hello"、"Hello"、"HELLO" 等不区分大小写的行
```

### man

man 命令的作用是查看 Linux 或 Unix 系统中命令、函数、系统调用等的手册页面，帮助用户了解特定命令的用法、选项和参数 ‌

```bash
man ls
```

### cat

‌1、显示文件内容 ‌

使用 cat 命令查看名为 file.txt 的文件内容：

```bash
cat file.txt
# 这将输出file.txt中的所有内容到终端上‌12。
```

‌
2、创建新文件 ‌

使用 cat 命令创建一个名为 newfile.txt 的新文件，并输入内容：

```bash
cat > newfile.txt
# 此时可以开始输入内容，输入完成后按 Ctrl+D 保存并退出。这样，输入的内容将被保存到 newfile.txt。
```

‌3、合并文件 ‌

使用 cat 命令将 file1.txt 和 file2.txt 的内容合并到一个名为 mergedFile.txt 的新文件中：

```bash
cat file1.txt file2.txt > mergedFile.txt
# 这将把 file1.txt 和 file2.txt 的内容依次写入 mergedFile.txt。
```

‌4、显示行号 ‌

使用 cat 命令显示 file.txt 的内容，并为每一行加上行号：

```bash
cat -n file.txt
# 这将输出 file.txt 的内容，并在每一行的前面加上行号。
```

### awk

用于在 Linux/Unix 系统中对文本和数据进行处理

### sed

‌sed 命令是 Linux 和 Unix 系统中的一个强大文本处理工具，全称为 Stream Editor（流编辑器）实现对文本的查找、替换、删除、插入等多种操作

```bash
sed 's/old/new/g' file.txt
# 将文件file.txt中的old替换为new
sed '3d' file.txt
# 删除特定行‌：删除文件file.txt的第3行
sed '2i\This is an inserted line' file.txt
# 在第2行前插入This is an inserted line
sed '2a\This is an appended line' file.txt
# 在第2行后追加This is an appended line
sed -n '1,5p' file.txt
# 打印特定行‌：打印文件file.txt的第1到5行
sed -i 's/old/new/g' file.txt
# 将文件file.txt中的old替换为new，并直接修改文件内容
```

### head

‌head 命令的作用是显示文件的开头部分内容，默认情况下会显示文件的前 10 行

```bash
head filename
head -n 5 filename
# 显示文件的前5行
head -c 20 filename
# 显示文件的前20个字节
head -v file1 file2 file3
# 显示多个文件的前10行内容，并显示文件名
```

### tail

‌tail 命令主要用于显示指定文件的末尾内容，默认显示最后 10 行，同时支持实时监控文件更新

```bash
tail -n 20 file.txt
# 显示最后 20 行
tail -n 20 -f file.txt
# -f选项允许tail命令实时监控文件的更新
```

### chmod

‌chmod 命令用于修改文件或目录的访问权限
来控制不同用户或用户组对这些文件或目录的访问权限。权限位包括读（r）、写（w）和执行（x）权限，分别对应数字 4、2 和 1

```bash
chmod 777 file.txt
# 使file.txt对所有用户开放读、写和执行权限
chmod 755 directory
# 使directory的所有者有读、写和执行权限，用户组和其他用户有读和执行权限
```

### xargs

是将标准输入的数据转换为命令行参数，然后传递给其他命令执行

```bash
echo "file1.txt file2.txt" | xargs rm
# 这条命令会删除file1.txt和file2.txt两个文件
find . -type f -name "*.txt" | xargs grep "keyword"
# ‌结合find命令使用‌：查找文件并将结果传递给其他命令执行
```

### find

可以根据文件名、类型、大小、修改时间等多种属性进行搜索，并能对搜索结果执行各种操作，如删除、移动、复制或执行命令等 ‌
-name：根据文件的名称搜索文件，支持通配符\*‌。
-type：根据文件类型搜索，如 f 代表普通文件，d 代表目录。
-size：根据文件大小搜索，可以使用+、-号来表示大于或小于指定大小的文件。
-mtime、-atime、-ctime：分别根据文件内容修改时间、文件访问时间、文件权限修改时间搜索文件，可以使用+、-号来表示在指定时间之前或之后的时间段。
-user、-group：根据文件的所有者或所属组搜索文件。
-exec：对查找到的文件执行指定的命令，命令需要以{}作为占位符，并以\;结束命令序列。

```bash
# find [搜索路径] [查找条件] [处理动作]
```

### telnet

‌Telnet 命令主要用于通过 TCP/IP 协议远程登录到其他计算机或设备，执行相应的命令操作

- 远程登录
- 测试端口连接

```bash
# telnet [主机名] [端口号]
```
