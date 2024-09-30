### EventEmitter

```js
const { EventEmitter } = require("events");
const emitter = new EventEmitter();

emitter.on("doSomething", (arg1, arg2) => {
  console.log(`${arg1} ${arg2}`);
});

emitter.emit("doSomething", "Hello", "World"); // 'Hello World'
```

### ReferenceError: \_\_dirname is not defined

原因，NodeJS 支持通过 ESM 方式导入模块
package.json 加了以下配置

> "type": "module",

使用下面的替代

```js
import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__filename);
console.log(__dirname);
```

### 捕获 SIGINT 信号

```js
process.on("SIGINT", () => {
  console.log("捕获到SIGINT信号，执行清理工作...");
  // 在这里执行清理工作，例如关闭数据库连接、保存数据等
  process.exit();
});
```
