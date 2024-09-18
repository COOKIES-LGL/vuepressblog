### EventEmitter

```js
const { EventEmitter } = require("events");
const emitter = new EventEmitter();

emitter.on("doSomething", (arg1, arg2) => {
  console.log(`${arg1} ${arg2}`);
});

emitter.emit("doSomething", "Hello", "World"); // 'Hello World'
```
