---
home: false
sidebar: false
---
### 前端必备nginx知识

一般来说Nginx有三大应用场景：

1、静态资源服务-通过本地文件系统提供服务
2、反向代理服务-缓存、负载均衡
3、API服务-openresty


通常一个URL请求先通过Nginx转发到应用服务，然后再去访问数据库。

一般来说应用服务的运行效率是很低的，而且并发都是受限的。所以需要把很多应用服务组成一个集群，向用户提供高可用性。随着把应用服务都组成集群，那么就会带来两个需求。

- 第一、需要动态的扩容.
- 第二、有些服务出了问题之后，需要做容灾。

所以就需要Nginx具有反向代理功能。  
而且在这样的一个链路中，nginx一般是处于企业内网的一个边缘节点，随着网络链路的增长，用户体验的到时延就会增加。所以需要把一些不变的，或者说在一段时间内不变的资源缓存在nginx中，比如css文件、图片，由nginx直接提供服务，这样时延就会减少很多。所以这样就衍生出nginx的缓存功能。

数据库服务要比应用服务好得多，应用功能比较简单，所以并发与运行都要远高于应用服务。所以衍生出第三个应用场景，直接由nginx访问数据库服务，利用nginx的强大并发性实现如web防火墙等复杂的业务功能

### Nginx组成
Nginx主要有4部分组成：

1. Nginx二进制可执行文件
2. Nginx.conf配置文件
3. asscess.log文件
4. error.log文件

Nginx的二进制可执行文件是由官方模块或者第三方模块一起编译出的一个文件。这个文件提供了nginx所需要的功能，就如同一辆汽车，本身提供了载人、高速行走等功能，至于音响，冷气等功能视乎于自己想不想要。

虽然二进制可执行文件提供了许多功能，但开启与关闭或者如何使用这些功能就需要配置文件，就好比一辆汽车需要驾驶员来驾驶一样。Nginx.conf配置文件就是这个驾驶员。

asscess.log就是记录每一条请求信息，凡走过必留痕迹，这些痕迹就在access.log文件中。

error.log文件是记录问题的文件，就好比汽车的黑匣子一样，如果汽车发生问题，就要打开黑匣子看看，究竟是驾驶员出现的问题还是汽车本身的问题。

### 编译Nginx
编译Nginx大概分以下步骤：

1. 下载Nginx。
2. 执行configure。
3.编译与安装Nginx。

> 下载Nginx

从nginx.org网站下载即可
nginx的版本分为三类：

Mainline：开发版
Stable：最新稳定版
Legacy：老版本的稳定版

``` Bash
// 在centos7中演示，使用如下命令行
// 下载nginx
wget http://nginx.org/download/nginx-1.18.0.tar.gz

// 解压nginx压缩包
tar -zxvf nginx-1.18.0.tar.gz
``` 
下面为解压后的nginx目录
- auto目录：是一些判用于断操作系统支持与编译等相关的文件。
- CHANGES文件：nginx版本的迭代日志（.ru是俄语版，因为作者是俄罗斯）
- conf目录：是示例配置文件，用于配置参考。
- configure文件：用于编译生成中间文件的脚本。
- contrib目录: 提供了nginx语法支持脚本。
- man目录：提供了nginx帮助文档。
- html目录: 提供了两个标准的html文件
- src目录: 源码目录

> 编译与安装Nginx

// 使用以下命令行，查看执行configure时的参数
./configure --help

这些代码是配置这几个模块的地址，引导nginx在执行在这些地址中读取相应的内容。

这些代码是说明使用哪些模块，不使用哪些模块。主要是用with和without区分。

默认情况下，只需要配置prefix就行，该参数是指定将nginx编译在哪里，比如：

./configure -- prefix=/home/nginx
生成的中间文件在objs目录下

> 编译nginx
``` Bash
make
make install
```

### Nginx 语法

lsof -i:端口号 查看端口占有情况
kill -9 PID 杀除进程

### uname -m 查看操作系统类型
### sysctl machdep.cpu.brand_string 查看CPU 芯片型号

###  安装homebrew

``` bash
/bin/zsh -c "$(curl -fsSL https://gitee.com/cunkai/HomebrewCN/raw/master/Homebrew.sh)"
```

### 别名alias

``` bash
# some alias
alias g=git
alias ga='git add'
alias ll='ls -lh'
```

### ls -lh
查看当前目录文件修改记录信息