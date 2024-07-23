---
home: false
---
## docker 实用笔记

[面向WEB开发人员的Docker](https://juejin.cn/column/6965049243660714021)

### docker 常用指令

Docker可用于在任何开发PC上提供可复制的构建环境。  

docker run 提供了许多选项，但是将使用的主要选项是：
``` bash
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

### Dockerfile

Dockerfile 就是这样一个用于描述 Docker 镜像构建过程的文本文件，这个文件可以包含多条构建指令，以及相关的描述
[Dockerfile文件详解](https://juejin.cn/post/7179042892395053113?searchId=20240723114156ADF38CC477C06B958D85)
[Dockerfile赋能前端部署](https://juejin.cn/post/7269668219488354361?searchId=20240723155610C04B85D6CEF8063CAB10)

### Docker Compose

Docker Compose 允许您在单个YAML文件中定义和管理多容器应用程序。这简化了编排和协调各种服务的复杂任务，使管理和复制应用程序环境变得更加容易。

1. docker-compose up - 启动服务。
    - -d 参数可以在后台启动服务：docker-compose up -d。
    - --build 参数可以在启动服务前重新构建镜像：docker-compose up --build。

2. docker-compose down - 停止服务并删除容器、网络和卷。

3. docker-compose start - 启动服务。

4. docker-compose stop - 停止服务。

5. docker-compose restart - 重启服务。

6. docker-compose ps - 列出所有容器。

7. docker-compose exec <service> - 进入指定服务的容器。
    - 例如：docker-compose exec web /bin/bash。

8. docker-compose logs - 查看服务的日志。

9. docker-compose config - 验证和查看 Compose 文件的配置。

10. docker-compose build - 构建或重新构建服务的镜像。

11. docker-compose pull - 拉取服务的镜像。

12. docker-compose push - 推送服务的镜像。

13. docker-compose rm - 删除停止的服务容器。

14. docker-compose scale - 设置服务的容器数量。例如：docker-compose scale web=3。

15. docker-compose version - 显示版本信息。

#### docker.yml 文件说明

- Docker是一种轻量级的容器化技术，用于将应用程序及其依赖项打包为一个可移植的容器。
- Docker Compose是Docker官方推出的一个用于定义和运行多容器Docker应用程序的工具。
- Docker Compose使用一个名为docker-compose.yml的文件来配置应用程序的服务。
下面详细解释Docker yml文件的结构和使用方法。
一个典型的Docker Compose yml文件包含如下几个部分：
- version：指定Docker Compose文件的版本号。
- services：定义各个服务的容器配置。
- networks：定义应用程序的网络配置。
- volumes：定义应用程序的卷配置。

在Docker Compose yml文件中，常用的配置项包括：
1. image：指定容器使用的镜像。
2. build：指定Dockerfile的路径，用于构建自定义镜像。
3. ports：定义端口映射关系。
4. volumes：定义卷映射关系。
5. environment：设置环境变量。
6. networks：定义网络配置。。
7. depends_on：定义服务之间的依赖关系。
8. restart：指定服务的重启策略。
``` yml
restart: "no"
# no是默认的重启策略，在任何情况下都不会重启容器
restart: always
# always指定时，容器总是重新启动
restart: on-failure
# on-failure如果退出代码指示失败错误，则该策略会重新启动容器
restart: unless-stopped 
# unless-stopped总是重新启动容器，除非容器停止（手动或其他方式
```
[全部配置项说明](https://www.cnblogs.com/dirgo/p/18112035)


### 常见错误
> Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?  

运行 docker compose 遇到上述报错时需要重新启动docker服务

-------
> 拉取Docker镜像时，如果遇到“error getting credentials - err: exit status 1, out: ``  

这通常意味着Docker客户端无法获取到需要的认证信息来访问Docker Hub或其他镜像仓库，`需要登录docker hub` [进入Docker官网](https://www.docker.com)注册。

-------
> no matching manifest for linux/arm64/v8 in the manifest list entries ELIFECYCLE  Command failed with exit code 18.
Docker镜像可能包含多个架构的变体。当客户端尝试拉取针对特定架构（比如arm64或者v8，这是ARM架构的一种说法）的镜像时，如果服务器上没有对应架构的镜像，就会出现这个错误
你知道你的系统架构，你可以使用docker run命令的--platform选项指定要运行的特定架构的镜像
``` bash
docker run --platform=linux/arm64/v8 <image-name>
```

对于 docker compose 运行方式 配置 yml文件的 platform 字段，可以指定要运行的架构。
``` yml
services:
  redis:
    image: redis:alpine
    platform: linux/x86_64
    container_name: nest-admin-redis
    restart: always
    env_file:
      - .env
      - .env.production
    ports:
      - '${REDIS_PORT}:6379'
    command: >
      --requirepass ${REDIS_PASSWORD}
    networks:
      - nest_admin_net
```
