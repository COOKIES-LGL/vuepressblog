---
sideBar: false
---

## Maven 使用笔记

### Maven 常用命令

mvn clean：表示运行清理操作（会默认把 target 文件夹中的数据清理）。
mvn clean compile：表示先运行清理之后运行编译，会将代码编译到 target 文件夹中。
mvn clean test：运行清理和测试。
mvn clean package：运行清理和打包。
mvn clean install：运行清理和安装，会将打好的包安装到本地仓库中，以便其他的项目可以调用。
mvn clean deploy：运行清理和发布（发布到私服上面）。
