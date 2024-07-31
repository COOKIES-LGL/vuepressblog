[WebWorker阮一峰](https://www.ruanyifeng.com/blog/2018/07/web-worker.html)

**新建worker.js**
``` js
// worker.js
self.addEventListener('message', (event) => {
  const data = event.data;
  // 进行计算或其他密集型任务
  const result = heavyComputation(data);
  self.postMessage(result); // 通过postMessage发送结果回主线程
});

```
**线程中实例化 Worker**
``` js
// main.js
const worker = new Worker('worker.js');
worker.postMessage('someInputData'); // 发送数据到Worker

worker.addEventListener('message', (event) => {
  const result = event.data; // 接收Worker返回的结果
  console.log('Result:', result);
});

// 错误处理
worker.addEventListener('error', (error) => {
  console.error('Worker error:', error);
});
```
