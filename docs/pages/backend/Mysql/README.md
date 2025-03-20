---
sideBar: false
---

## Mysql 使用笔记

### 连接 mysql

```bash
mysql --version // 查看mysql版本

mysql -u root -p
# 输入密码 cookies666

uname -a 查看mac CPU类型

sudo mysql.server status
# 查看mysql状态

sudo mysql.server start
# 启动命令

sudo mysql.server stop
# 关闭命令

# 退出mysql
exit
quit
# 退出mysql
```

[Mysql 链接常见错误](https://blog.csdn.net/m0_70556273/article/details/126490767)

### 数据库 sql 常用语句

1、 显示数据库列表

```bash
show databases;
```

缺省有两个数据库：mysql 和 test。 mysql 库存放着 mysql 的系统和用户权限信息，我们改密码和新增用户，实际上就是对这个库进行操作。
2、 显示库中的数据表：

```bash
use mysql;
show tables;
```

3、 显示数据表的结构：

```bash
describe 表名;
```

4、 建库与删库：

```bash
create database 库名;
drop database 库名;
```

5、 建表：

```bash
use 库名;
create table 表名(字段列表);
drop table 表名;
```

6、 清空表中记录：

```bash
delete from 表名;
truncate table 表名;
```

7、 显示表中的记录：

```bash
select * from 表名;
```

### sql 文件初始化数据库

1、确保您有一个 SQL 文件，其中包含您想要创建的表、视图、触发器等的 DDL 语句。
2、登录到数据库服务器。
3、选择或创建一个新的数据库，您将在其中应用 SQL 文件。
4、使用命令行工具或 SQL 客户端应用 SQL 文件中的语句

```bash
# -- 创建新数据库
CREATE DATABASE myDataBase;

# -- 使用新数据库
USE myDataBase;

# -- 执行SQL文件中的语句
SOURCE path/to/yourFile.sql;
```

直接使用命令行

```bash
mysql -u username -p myDataBase < path/to/yourFile.sql
```

### mysqldump

通过灵活的 SQL 脚本生成能力，满足从全库到表级的数据备份需求，结合参数优化可平衡性能与一致性，是 MySQL 日常运维的核心工具 。
