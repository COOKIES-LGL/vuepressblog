---
home: false
---
## docker 实用笔记

[面向WEB开发人员的Docker](https://juejin.cn/column/6965049243660714021)

### docker 常用指令

``` bash
docker run 提供了许多选项，但是将使用的主要选项是：
-d：运行一个容器作为后台进程（在应用程序结束时退出）
-it：保持容器在前台运行（即使在应用程序结束后），并显示活动日志
--rm ：停止后取出容器
--name：命名容器（否则使用随机GUID）
-p：将主机端口映射到容器端口
--mount：创建一个持久的docker管理卷来保存数据。字符串指定一个src卷名和一个target，在容器的文件系统中装入卷名
-v：使用符号挂载主机文件夹:
-e：定义环境变量
--env-file：从文件中读取环境变量，其中每行定义一个VAR=value
--net：连接到特定的Docker网络
--entrypoint ：覆盖默认的启动应用程序
```
