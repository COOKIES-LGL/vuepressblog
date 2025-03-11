Node.js 默认单进程运行，对于 32 位系统最高可以使用 512MB 内存，对于 64 位最高可以使用 1GB 内存。
对于多核 CPU 的计算机来说，这样做效率很低，因为只有一个核在运行，其他核都在闲置，pm2 利用的 node 原生的 cluster 模块可以顺利解决该问题
pm2 是一个带有负载均衡功能的应用进程管理器，可以使 node 服务在后台运行

#### 安装

```bash
npm install pm2 -g
```

- 启动

```bash
pm2 start app.js --name api-service # 启动api-service进程 app.js node程序入口文件
pm2 start app.js --watch   # 实时监控 app.js 的方式启动，当app.js文件有变动时，pm2会自动reload
pm2 start /website/api-service/ecosystem.config.js # 按照ecosystem.config.js文件启动
```

- 清除日志

```bash
pm2 flush
```

- 查看进程

```bash
pm2 list
pm2 show 121 # 或者 pm2 info 0
#查看进程详细信息，121为PM2进程id
```

- 监控

```bash
pm2 monit
```

- 停止

```bash
pm2 stop all  #停止PM2列表中所有的进程
pm2 stop 121    #停止PM2列表中进程为121的进程
```

- 重载

```bash
pm2 reload all    #重载PM2列表中所有的进程
pm2 reload 121     #重载PM2列表中进程为121的进程
```

- 重启

```bash
pm2 restart all     #重启PM2列表中所有的进程
pm2 restart 121      #重启PM2列表中进程为121的进程
```

- 删除进程

```bash
pm2 delete 121     #删除PM2列表中进程为121的进程
pm2 delete all   #删除PM2列表中所有的进程
```

- 生成脚本

```bash
pm2 ecosystem
```

```js
module.exports = {
  apps: [
    {
      name: "api-service",
      script: "app.js",
      merge_logs: true,
      max_restarts: 20,
      instances: 1,
      max_memory_restart: "2G",
      cwd: "/website/api-service/",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
// apps：json 结构，apps 是一个数组，每一个数组成员就是对应一个 pm2 中运行的应用

// name：应用程序的名称

// cwd：应用程序所在的目录

// script：应用程序的脚本路径

// exec_interpreter：应用程序的脚本类型，这里使用的 shell，默认是 nodejs 。

// min_uptime：最小运行时间，这里设置的是 60s 即如果应用程序在 60s 内退出，pm2 会认为程序异常退出，此时触发重启 max_restarts 设置数量

// max_restarts：设置应用程序异常退出重启的次数，默认15次（从0开始计数）

// exec_mode：应用程序启动模式，这里设置的是 cluster_mode（集群），默认是 fork

// error_file：自定义应用程序的错误日志文件

// out_file：自定义应用程序日志文件

// pid_file：自定义应用程序的pid文件

// watch：是否启用监控模式，默认是 false ，如果设置成 true，当应用程序变动时，pm2 会自动重载，这里也可以设置你要监控的文件。
```
