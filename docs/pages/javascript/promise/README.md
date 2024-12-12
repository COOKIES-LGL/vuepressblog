---
home: false
sidebar: true
---

## promise 高级封装使用

### p-reduce

**使用场景**
适用于需要根据异步资源计算累加值的场景
**使用实例**

```js
import delay from "delay";
import pReduce from "p-reduce";
const inputs = [Promise.resolve(1), delay(50, { value: 6 }), 8];
async function main() {
  const result = await pReduce(inputs, async (a, b) => a + b, 0);
  console.dir(result); // 输出结果：15
}
main();
```

**源码分析**

```js
export default async function pReduce(iterable, reducer, initialValue) {
  return new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.iterator](); // 获取迭代器
    let index = 0; // 索引值
    const next = async (total) => {
      const element = iterator.next(); // 获取下一项
      if (element.done) {
        // 判断迭代器是否迭代完成
        resolve(total);
        return;
      }
      try {
        const [resolvedTotal, resolvedValue] = await Promise.all([total, element.value]);
        // 迭代下一项
        // reducer(previousValue, currentValue, index): Function
        next(reducer(resolvedTotal, resolvedValue, index++));
      } catch (error) {
        reject(error);
      }
    };
    // 使用初始值，开始迭代
    next(initialValue);
  });
}
```

### p-map

**使用场景**
使用不同的输入多次运行 promise-returning 或 async 函数的场景
**使用实例**

```js
import delay from "delay";
import pMap from "p-map";

const inputs = [200, 100, 50];
const mapper = (value) => delay(value, { value });
async function main() {
  console.time("start");
  const result = await pMap(inputs, mapper, { concurrency: 1 });
  console.dir(result); // 输出结果：[ 200, 100, 50 ]
  console.timeEnd("start");
}
main();
```

**源码分析**

```js
import AggregateError from "aggregate-error";

export default async function pMap(
  iterable,
  mapper,
  { concurrency = Number.POSITIVE_INFINITY, stopOnError = true } = {}
) {
  return new Promise((resolve, reject) => {
    // 省略参数校验代码
    const result = []; // 存储返回结果
    const errors = []; // 存储异常对象
    const skippedIndexes = []; // 保存跳过项索引值的数组
    const iterator = iterable[Symbol.iterator](); // 获取迭代器
    let isRejected = false; // 标识是否出现异常
    let isIterableDone = false; // 标识是否已迭代完成
    let resolvingCount = 0; // 正在处理的任务个数
    let currentIndex = 0; // 当前索引

    const next = () => {
      if (isRejected) {
        // 若出现异常，则直接返回
        return;
      }

      const nextItem = iterator.next(); // 获取下一项
      const index = currentIndex; // 记录当前的索引值
      currentIndex++;

      if (nextItem.done) {
        // 判断迭代器是否迭代完成
        isIterableDone = true;

        // 判断是否所有的任务都已经完成了
        if (resolvingCount === 0) {
          if (!stopOnError && errors.length > 0) {
            // 异常处理
            reject(new AggregateError(errors));
          } else {
            for (const skippedIndex of skippedIndexes) {
              // 删除跳过的值，不然会存在空的占位
              result.splice(skippedIndex, 1);
            }
            resolve(result); // 返回最终的处理结果
          }
        }
        return;
      }

      resolvingCount++; // 正在处理的任务数加1

      (async () => {
        try {
          const element = await nextItem.value;

          if (isRejected) {
            return;
          }

          // 调用mapper函数，进行值进行处理
          const value = await mapper(element, index);
          // 处理跳过的情形，可以在mapper函数中返回pMapSkip，来跳过当前项
          // 比如在异常捕获的catch语句中，返回pMapSkip值
          if (value === pMapSkip) {
            // pMapSkip = Symbol("skip")
            skippedIndexes.push(index);
          } else {
            result[index] = value; // 把返回值按照索引进行保存
          }

          resolvingCount--;
          next(); // 迭代下一项
        } catch (error) {
          if (stopOnError) {
            // 出现异常时，是否终止，默认值为true
            isRejected = true;
            reject(error);
          } else {
            errors.push(error);
            resolvingCount--;
            next();
          }
        }
      })();
    };

    // 根据配置的concurrency值，并发执行任务
    for (let index = 0; index < concurrency; index++) {
      next();
      if (isIterableDone) {
        break;
      }
    }
  });
}
export const pMapSkip = Symbol("skip");
```

### pWaterfall

**使用场景**
串行执行 promise-returning 或 async 函数，并把前一个函数的返回结果自动传给下一个函数的场景
**使用实例**

```js
import pWaterfall from "p-waterfall";
const tasks = [async (val) => val + 1, (val) => val + 2, async (val) => val + 3];
async function main() {
  const result = await pWaterfall(tasks, 0);
  console.dir(result); // 输出结果：6
}
main();
```

**源码分析**

```js
// 使用了上面的pReduce函数
import pReduce from "p-reduce";
export default async function pWaterfall(iterable, initialValue) {
  return pReduce(iterable, (previousValue, function_) => function_(previousValue), initialValue);
}
```

### p-forever

**使用场景**
需要重复不断执行 promise-returning 或 async 函数，直到用户终止的场景
**使用实例**

```js
import delay from "delay";
import pForever from "p-forever";
async function main() {
  let index = 0;
  await pForever(async () => (++index === 10 ? pForever.end : delay(50)));
  console.log("当前index的值: ", index); // 输出结果：当前index的值: 10
}
main();
// 传入 pForever 函数的 fn 函数会一直重复执行，直到该 fn 函数返回 pForever.end 的值，才会终止执行。
```

**源码分析**

```jss
const endSymbol = Symbol("pForever.end");

const pForever = async (function_, previousValue) => {
  const newValue = await function_(await previousValue);
  if (newValue === endSymbol) {
    return;
  }
  return pForever(function_, newValue);
};

pForever.end = endSymbol;
export default pForever;
```

### p-pipe

**使用场景**
把 promise-returning 或 async 函数组合成可复用的管道
**使用实例**

```js
import pPipe from "p-pipe";
const addUnicorn = async (string) => `${string} Unicorn`;
const addRainbow = async (string) => `${string} Rainbow`;
const pipeline = pPipe(addUnicorn, addRainbow);
(async () => {
  console.log(await pipeline("❤️")); // 输出结果：❤️ Unicorn Rainbow
})();
```

**源码分析**

```js
export default function pPipe(...functions) {
  if (functions.length === 0) {
    throw new Error("Expected at least one argument");
  }
  return async (input) => {
    let currentValue = input;

    for (const function_ of functions) {
      currentValue = await function_(currentValue); // eslint-disable-line no-await-in-loop
    }
    return currentValue;
  };
}
```

### Can Cancel Promise

```js
let isCanceled = false;
const cancellablePromise = (promise) => {
  return new Promise((resolve, reject) => {
    promise
      .then((value) => {
        if (isCanceled) {
          reject({ isCanceled: true, value });
        } else {
          resolve(value);
        }
      })
      .catch((error) => {
        if (isCanceled) {
          reject({ isCanceled: true, error });
        } else {
          reject(error);
        }
      });
  });
};
//测试案例
const p = cancellablePromise(new Promise((res) => setTimeout(() => res("OK"), 3000)));
setTimeout(() => (isCanceled = true), 1000);
p.then(console.log).catch(console.error); // 输出错误信息和isCanceled
```

### 重试 promise

```js
const retryPromise = async (promiseFn, maxAttempts, interval) => {
  let attempts = 0;
  while (attempts < maxAttempts) {
    try {
      const result = await promiseFn();
      return result;
    } catch (error) {
      console.error(`Attempt ${attempts + 1} failed:`, error);
      attempts++;
      await new Promise((resolve) => setTimeout(resolve, interval));
    }
  }
  throw new Error("Max attempts reached");
};

const unreliablePromise = () =>
  new Promise((resolve, reject) => {
    if (Math.random() < 0.5) {
      resolve("Success!");
    } else {
      reject(new Error("Failed!"));
    }
  });

retryPromise(unreliablePromise, 3, 1000)
  .then((result) => console.log(result))
  .catch((error) => console.error(error));
```
