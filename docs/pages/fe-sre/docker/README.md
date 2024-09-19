---
home: false
---

## docker 实用笔记

[面向 WEB 开发人员的 Docker](https://juejin.cn/column/6965049243660714021)

### docker 常用指令

Docker 可用于在任何开发 PC 上提供可复制的构建环境。

Docker 使用了缓存来加速镜像构建，所以上面执行结果可以看出只要上一层和当前层的输入没有变动，那么执行结果就会被缓存下来。

docker run 提供了许多选项，但是将使用的主要选项是：

```bash
-d：运行一个容器作为后台进程（在应用程序结束时退出）
-it：保持容器在前台运行（即使在应用程序结束后），并显示活动日志
--rm ：停止后取出容器
--name：命名容器（否则使用随机GUID）
-p：将主机端口映射到容器端口
--mount：创建一个持久的docker管理卷来保存数据。字符串指定一个src卷名和一个target，在容器的文件系统中装入卷名
-v：使用符号挂载主机文件夹: $PWD/data （当前命令所在目录/data）
-e：定义环境变量
--env-file：从文件中读取环境变量，其中每行定义一个VAR=value
--net：连接到特定的Docker网络
--entrypoint ：覆盖默认的启动应用程序
```

```sh
docker inspect mysql
# 返回JSON格式的容器信息
docker container ls -a
# 查看正在运行的容器的列表
docker ps
# 查看正在运行的容器的列表
docker system df
# 获得磁盘使用情况统计信息
docker volume ls
# 查看所有Docker管理的磁盘卷
docker network ls
# 查看所有Docker网络
docker exec -it cd7b5d5bb5e8 bash
# 进入容器cd7b5d5bb5e8
```

**自定义 docker 网络**
创建自己的 Docker 网络

```sh
docker network create --driver bridge mysqlNet
```

```bash
docker run
  -d --rm --name mysql
  -p 3306:3306
  --mount "src=mysqldata,target=/var/lib/mysql"
  -e MYSQL_ROOT_PASSWORD=websecret
  --net mysqlNet
  mysql
```

```bash
docker run
  -d --rm --name adminer
  -p 8080:8080
  --net mysqlNet
  adminer
```

### Dockerfile

Dockerfile 中执行各种任务，包括环境初始化、单元测试、构建

使用 Dockerfile 配置映像。它定义：

- 起始基本映像，通常是操作系统
- 工作目录和用户权限
- 所有必要的安装步骤，例如定义环境变量，从主机复制文件，运行安装过程等。
- 容器是否应附加一个或多个卷以进行数据存储
- 容器是否应加入网络以与他人通信
- 主机上公开了哪些端口（如果有） localhost
- 应用程序启动命令。

Dockerfile 就是这样一个用于描述 Docker 镜像构建过程的文本文件，这个文件可以包含多条构建指令，以及相关的描述

```yml
# 基于 Node.js 的 lts镜像
FROM node:lts-alpine

# 定义环境变量
ENV WORKDIR=/data/node/app
ENV NODE_ENV=production
ENV NODE_PORT=3005

# 创建应用程序文件夹并分配权限给 node 用户
RUN mkdir -p $WORKDIR && chown -R node:node $WORKDIR

# 设置工作目录
WORKDIR $WORKDIR

# 设置活动用户
USER node

# 复制 package.json 到工作目录
COPY --chown=node:node package.json $WORKDIR/

# 安装依赖
RUN npm install && npm cache clean --force

# 复制其他文件
COPY --chown=node:node . .

# 暴露主机端口
EXPOSE $NODE_PORT

# 应用程序启动命令
CMD [ "node", "./index.js" ]
```

[Dockerfile 文件详解](https://juejin.cn/post/7179042892395053113?searchId=20240723114156ADF38CC477C06B958D85)
[Dockerfile 赋能前端部署](https://juejin.cn/post/7269668219488354361?searchId=20240723155610C04B85D6CEF8063CAB10)

---

### .dockerignore

- 减少构建上下文的大小，因为不需要将所有文件发送到 Docker 守护进程。
- 加速构建过程，因为 Docker 不需要处理不必要的文件。
- 保护敏感数据，如本地配置文件或源代码，不会意外地包含在镜像中。

```bash
# 忽略 node_modules 目录
node_modules/
# 忽略 git 信息
.git
# 忽略 IDE 设置
.vscode/
# 忽略本地配置文件
config/local.js
# 忽略日志文件
logs/
# 忽略构建产物
dist/
```

---

### Docker Compose

Docker Compose 允许您在单个 YAML 文件中定义和管理多容器应用程序。这简化了编排和协调各种服务的复杂任务，使管理和复制应用程序环境变得更加容易。

1. docker-compose up - 启动服务。

   - -d 参数可以在后台启动服务：docker-compose up -d。
   - --build 参数可以在启动服务前重新构建镜像：docker-compose up --build。

2. docker-compose down - 停止服务并删除容器、网络和卷。

3. docker-compose start - 启动服务。

4. docker-compose stop - 停止服务。

5. docker-compose restart - 重启服务。

6. docker-compose ps - 列出所有容器。

7. docker-compose exec `<service>` - 进入指定服务的容器。

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

- Docker 是一种轻量级的容器化技术，用于将应用程序及其依赖项打包为一个可移植的容器。
- Docker Compose 是 Docker 官方推出的一个用于定义和运行多容器 Docker 应用程序的工具。
- Docker Compose 使用一个名为 docker-compose.yml 的文件来配置应用程序的服务。
  下面详细解释 Docker yml 文件的结构和使用方法。可以在必要时覆盖 Dockerfile 设置  
  一个典型的 Docker Compose yml 文件包含如下几个部分：

- version：指定 Docker Compose 文件的版本号。
- services：定义各个服务的容器配置。
- networks：定义应用程序的网络配置。
- volumes：定义应用程序的卷配置。

在 Docker Compose yml 文件中，常用的配置项包括：

1. image：指定容器使用的镜像。
2. build：指定 Dockerfile 的路径，用于构建自定义镜像。
3. ports：定义端口映射关系。
4. volumes：定义卷映射关系。
5. environment：设置环境变量。
6. networks：定义网络配置。。
7. depends_on：定义服务之间的依赖关系。
8. restart：指定服务的重启策略。

```yml
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

管理，扩展和维护容器的过程称为业务流程,Docker Compose 可以用于基本的编排，但是最好使用专业工具，

> Docker Swarm
> Kubernetes

---

### 常见错误

> Cannot connect to the Docker daemon at unix:///var/run/docker.sock. Is the docker daemon running?

运行 docker compose 遇到上述报错时需要重新启动 docker 服务

---

> 拉取 Docker 镜像时，如果遇到“error getting credentials - err: exit status 1, out: ``

这通常意味着 Docker 客户端无法获取到需要的认证信息来访问 Docker Hub 或其他镜像仓库，`需要登录docker hub` [进入 Docker 官网](https://www.docker.com)注册。

---

> no matching manifest for linux/arm64/v8 in the manifest list entries ELIFECYCLE  Command failed with exit code 18.
> Docker 镜像可能包含多个架构的变体。当客户端尝试拉取针对特定架构（比如 arm64 或者 v8，这是 ARM 架构的一种说法）的镜像时，如果服务器上没有对应架构的镜像，就会出现这个错误
> 你知道你的系统架构，你可以使用 docker run 命令的--platform 选项指定要运行的特定架构的镜像

```bash
docker run --platform=linux/arm64/v8 <image-name>
```

对于 docker compose 运行方式 配置 yml 文件的 platform 字段，可以指定要运行的架构。

```yml
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
      - "${REDIS_PORT}:6379"
    command: >
      --requirepass ${REDIS_PASSWORD}
    networks:
      - nest_admin_net
```

### 何时不使用 Docker

1. 应用程序不是无状态的
2. 正在使用 Windows Server
3. Docker 容器已施加 CPU 和 RAM 限制, 性能比原生 OS 慢
4. Docker 容器是隔离的，但是与真实的 VM 不同，容器没有从主机 OS 完全沙盒化.它不能替代强大的安全性.
