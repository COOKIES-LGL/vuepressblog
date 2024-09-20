---
home: false
sidebar: false
---

#### node 多进程

它一般有两种实现：

- 主进程监听一个端口，子进程不监听端口，通过主进程分发请求到子进程；
- 主进程和子进程分别监听不同端口，通过主进程分发请求到子进程。

#### cluster 创建子进程

```javascript
const cluster = require("cluster");
// 开启的子进程数
const workerNum = 3;
// 如果是主进程
if (cluster.isMaster) {
  // 创建子进程
  for (let i = 0; i < workerNum; i++) {
    // 通过cluster.fork创建子进程
    cluster.fork();
  }
  // 如果有子进程，就启动相关服务,这里会使用三个进程来执行http服务演示
} else {
  require("./http-server");
}
```

### pm2 多进程管理器

PM2 是一个内建了负载均衡器的 node 进程管理工具，可以利用它来简化很多 node 应用管理的繁琐任务，如性能监控、自动重启、负载均衡等，而且使用非常简单。当你要把你的独立代码利用全部的服务器上的所有 CPU，并保证进程永远都活着，0 秒的重载， PM2 是完美的。

#### 为啥需要 pm2

目前 Nodejs 开发中有很多痛点，因为 node 本身是一个单线程应用，它的特点就是所有方法都是串行一次执行，并且 node 并没有能力像 Java 一样独自去创建一个新的线程来实现异步操作，如果在执行 I/O 中遇到了阻塞就会降低整个应用的执行效率，导致 CPU 使用率高等不利原因。

因此在这种模式下，一个线程只能处理一个任务，要想提高吞吐量必须通过多线程。虽然单线程的好处有很多比如避免了线程同步或者死锁、状态同步等等之类的问题，但是在应用和计算能力要求日益倍增的今天，单线程最大的弊端就是无法利用多核 CPU 带来的优势来提升运行效率。pm2 可以把你的应用部署到服务器所有的 CPU 上，有效的解决这个问题

#### [PM2 官网](https://pm2.keymetrics.io/docs/usage/pm2-doc-single-page/)

::: tip
当 setTimeout 不设置时间时,因受进程性能约束
在文件 IO、网络 IO 回调中，setImmediate 会先于 setTimeout 执行  
其它情况 setTimeout 会先于 setImmediate 执行
:::

### express-sslify express 配置证书

```js
const express = require("express");
const sslify = require("express-sslify");
const app = express();
// ... 其他中间件和路由配置 ...
// 使用sslify中间件
app.use(sslify());
// 启动服务器
const port = process.env.PORT || 443;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
```

### HTTP Range 实现文件分片并发下载

```js
const express = require("express");
const fs = require("fs");
const app = express();

app.get("/length", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.end("" + fs.statSync("./guangguang.png").size);
});

app.options("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Range");
  res.end("");
});

app.get("/", (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.download("guangguang.png", {
    acceptRanges: true,
  });
});

app.listen(3000, () => {
  console.log(`server is running at port 3000`);
});
```

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <script src="https://www.unpkg.com/axios@1.3.5/dist/axios.min.js"></script>
  </head>
  <body>
    <img id="img" />
    <script>
      async function concurrencyDownload(path, size, chunkSize) {
        let chunkNum = Math.ceil(size / chunkSize);

        const downloadTask = [];
        for (let i = 1; i <= chunkNum; i++) {
          const rangeStart = chunkSize * (i - 1);
          const rangeEnd = chunkSize * i - 1;

          downloadTask.push(
            axios.get(path, {
              headers: {
                Range: `bytes=${rangeStart}-${rangeEnd}`,
              },
              responseType: "arraybuffer",
            })
          );
        }
        const arrayBuffers = await Promise.all(
          downloadTask.map((task) => {
            return task.then((res) => res.data);
          })
        );
        return mergeArrayBuffer(arrayBuffers);
      }

      function mergeArrayBuffer(arrays) {
        let totalLen = 0;
        for (let arr of arrays) {
          totalLen += arr.byteLength;
        }
        let res = new Uint8Array(totalLen);
        let offset = 0;
        for (let arr of arrays) {
          let uint8Arr = new Uint8Array(arr);
          res.set(uint8Arr, offset);
          offset += arr.byteLength;
        }
        return res.buffer;
      }

      (async function () {
        const { data: len } = await axios.get("http://localhost:3000/length");
        const res = await concurrencyDownload("http://localhost:3000", len, 300000);
        console.log(res);
        const blob = new Blob([res]);
        const url = URL.createObjectURL(blob);
        img.src = url;
      })();
    </script>
  </body>
</html>
```
