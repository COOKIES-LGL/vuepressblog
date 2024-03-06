
::: tip
当setTimeOut不设置时间时
因受进程性能约束
在文件IO、网络IO回调中，setImmediate会先于setTimeout执行
其它情况setTimeout会先于setImmediate执行
:::


#### node 多进程

它一般有两种实现：

- 主进程监听一个端口，子进程不监听端口，通过主进程分发请求到子进程；
- 主进程和子进程分别监听不同端口，通过主进程分发请求到子进程。

#### cluster创建子进程

``` javascript
const cluster = require('cluster')
// 开启的子进程数
const workerNum = 3;
// 如果是主进程
if(cluster.isMaster) {
  // 创建子进程
  for(let i = 0; i < workerNum; i++) {
    // 通过cluster.fork创建子进程
    cluster.fork()
  }
// 如果有子进程，就启动相关服务,这里会使用三个进程来执行http服务演示
}else {
  require('./http-server')
}
```

### pm2d多进程管理器

PM2是一个内建了负载均衡器的node进程管理工具，可以利用它来简化很多node应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。当你要把你的独立代码利用全部的服务器上的所有 CPU，并保证进程永远都活着，0 秒的重载， PM2 是完美的。

#### 为啥需要pm2

目前Nodejs开发中有很多痛点，因为node本身是一个单线程应用，它的特点就是所有方法都是串行一次执行，并且node并没有能力像Java一样独自去创建一个新的线程来实现异步操作，如果在执行I/O中遇到了阻塞就会降低整个应用的执行效率，导致CPU使用率高等不利原因。

因此在这种模式下，一个线程只能处理一个任务，要想提高吞吐量必须通过多线程。虽然单线程的好处有很多比如避免了线程同步或者死锁、状态同步等等之类的问题，但是在应用和计算能力要求日益倍增的今天，单线程最大的弊端就是无法利用多核CPU带来的优势来提升运行效率。pm2可以把你的应用部署到服务器所有的CPU上，有效的解决这个问题

[PM2官网](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

