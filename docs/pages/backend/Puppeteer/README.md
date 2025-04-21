---
sideBar: true;
---

## Puppeteer 开发笔记

Puppeteer 的核心在于提供用户控制浏览器行为的方法，以下是一些自动化入门示例：

- 自动提交表单、UI 测试、键盘输入等；
- 使用最新的 JavaScript 和 浏览器特性创建自动化环境；
- 捕获网站的时间线跟踪，帮助诊断性能问题；
- 测试 Chrome 扩展程序；
- 对页面截图和生成 PDF；
- 对 SPA 应用爬取并生成预渲染内容；

### 基础知识

#### 配置列表

```js
puppeteer.launch({
  headless: true, // 是否以无头模式运行浏览器，默认为true
  executablePath: "", // 可执行文件路径，如果不指定则自动下载
  args: [], // 命令行参数数组
  ignoreDefaultArgs: false, // 是否忽略默认的命令行参数
  defaultViewport: null, // 默认视窗大小，null表示自动设置
  slowMo: 0, // 延迟毫秒数，用于调试
  timeout: 30000, // 超时时间，单位为毫秒
  devtools: false, // 是否打开DevTools面板，默认为false
  pipe: false, // 是否将浏览器启动的I/O连接通过管道传递，默认为false
  handleSIGINT: true, // 是否在收到SIGINT信号时关闭浏览器，默认为true
  handleSIGTERM: true, // 是否在收到SIGTERM信号时关闭浏览器，默认为true
  handleSIGHUP: true, // 是否在收到SIGHUP信号时关闭浏览器，默认为true
  env: {}, // 环境变量对象
  userDataDir: "", // 用户数据目录路径
  dumpio: false, // 是否将浏览器I/O输出到进程的stdout和stderr中，默认为false
  executablePath: "", // 可执行文件路径，如果不指定则自动下载
  ignoreHTTPSErrors: false, // 是否忽略HTTPS错误，默认为false
  ignoreCertificateErrors: false, // 是否忽略SSL证书错误，默认为false
});
```

#### browser 常用属性方法

```js
const browser = await puppeteer.launch();
const version = await browser.version(); // 返回浏览器实例的版本信息
const target = await browser.target(); // 返回浏览器实例的Target对象
const target = await browser.waitForTarget((target) => target.url() === "https://baidu.com/"); // 等待符合条件的Target对象，返回Promise，在目标找到时resolve
const isConnected = browser.isConnected(); // 表示浏览器实例是否连接
const process = browser.process(); // 返回Node.js的ChildProcess实例，表示浏览器进程
browser.on("disconnected", () => console.log("Browser disconnected")); // 监听浏览器实例的事件
browser.once("disconnected", () => console.log("Browser disconnected")); // 浏览器实例的单次事件监听
browser.removeListener("disconnected", onDisconnected); // 移除浏览器实例的事件监听器
browser.removeAllListeners(); // 移除浏览器实例的全部事件监听器
```

#### page 常用属性方法

```js
await page.goto("https://www.baidu.com"); // 当前页面跳转到
await page.waitForSelector(".container"); // 等待页面上 container 元素出现
const element = await page.$(".container"); // 获取页面上第一个 container 元素
page.click(".container"); // 模拟点击页面上的 container 元素
await page.setViewport({ width: 1920, height: 1080 }); // 设置页面的视口大小
await page.screenshot({ path: "picture.png" }); // 对当前页面进行截图，并将截图保存在 picture.png 文件中
const title = await page.evaluate(() => {
  return document.title; //  可以在浏览器页面上下文中执行任意JavaScript代码的方法，它可以访问所有页面中的DOM元素和JavaScript对象
});
const metrics = await page.metrics(); // 得到一些页面性能数据
```

#### 注入函数

```js
// 可以将nodejs的方法暴露给浏览器
const crypto = require('crypto');
​
...
await page.exposeFunction('md5', text =>
  crypto.createHash('md5').update(text).digest('hex')
);
console.log(window.md5)
```

#### 鼠标键盘

```js
// 模拟按下Esc键
await page.keyboard.down("Escape");
// 模拟松开Esc键
await page.keyboard.up("Escape");
// 模拟按下并松开Enter键
await page.keyboard.press("Enter");
// 模拟输入文本
await page.keyboard.type("hello, world");
// 将鼠标移动到指定位置
await page.mouse.move(100, 100);
// 模拟鼠标单击事件
await page.mouse.click(100, 100);
// 模拟鼠标按下事件
await page.mouse.down();
// 模拟鼠标松开事件
await page.mouse.up();
```

#### waitFor 等待

```js
// 等待id为myButton的按钮出现并单击
await page.waitFor('#myButton');
await page.click('#myButton');
​
// 等待页面中的img元素加载完成
await page.waitForSelector('img', { visible: true });
console.log('All images loaded');
​
// 等待页面中的第一个a元素出现并单击
await page.waitForXPath('//a[1]');
await page.click('//a[1]');
​
// 等待页面标题包含“Puppeteer”的页面跳转完成
await page.waitForNavigation({ waitUntil: 'titleContains', url: /puppeteer/i });
console.log('Page navigation completed');
​
// 等待一个异步操作完成
await page.waitForFunction(() => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
}, { polling: 100 });
console.log('Async function completed');
​
// 等待指定的URL请求完成
await page.waitForRequest(request => {
  return request.url().endsWith('.png');
}, { timeout: 5000 });
console.log('PNG request completed');
​
// 等待指定的URL响应完成
await page.waitForResponse(response => {
  return response.url().endsWith('.js');
}, { timeout: 5000 });
console.log('JS response completed');
```

### 浏览器管理

connect 直接连接到已启动的浏览器

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    // 设置远程调试端口
    args: ["--remote-debugging-port=9222"],
  });
  const page = await browser.newPage();
  // /json/version 获取 webSocketDebuggerUrl
  await page.goto("http://localhost:9222/json/version");
})()(
  // 连接上一个浏览器并打印 caniuse.com 网站的 news 元素：
  async () => {
    const browser = await puppeteer.connect({
      browserWSEndpoint:
        "ws://localhost:9222/devtools/browser/5bce4998-1ba5-4f96-b512-d0fb8d49187d",
    });
    const page = await browser.newPage();
    await page.goto("https://caniuse.com/");
    const textContext = await page
      .locator(".news")
      .map((el) => el.textContent)
      .wait();
    console.log(textContext);

    // 断开连接并不会关闭浏览器
    await browser.disconnect();
  }
)();
```

### 网络日志

page 提供了一个 on(event, handler) 函数，允许对 Puppeteer 派发的事件进行监听

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://caniuse.com/");

  page.on("request", (request) => {
    console.log("request : ", request.url());
  });

  page.on("response", (response) => {
    console.log("response : ", response.url());
  });
})();
```

### 页面交互

#### 定位器

- 点击元素 await page.locator('button').click();
- 录入文本 await page.locator('input').fill('hello world');
- 鼠标悬停 await page.locator('div').hover();
- 滚动元素 await page.locator('div').scroll({ scrollTop: 10, scrollLeft: 20 });
- 等待元素可见 await page.locator('.loading').wait();

```js
// 配置超时时间
await page
  .locator("button")
  .setTimeout(5 * 1000)
  .click();
// 由于网页的响应速度存在差异，默认的超时时间不满足需要的情况下，可使用 setTimeout() 函数适当延长，超时时将抛出 TimeoutError 异常
```

```js
// 配置自检项
await page
  .locator("button")
  .setEnsureElementIsInTheViewport(false) // 禁用后无法保证操作前元素位于视口中
  .setVisibility(null) // 设置忽略操作前检查元素可见或隐藏状态
  .setWaitForEnabled(false) // 禁用后无法保证操作前元素可用
  .setWaitForStableBoundingBox(false) // 禁用后将不等待元素在两个连续动画帧上具有稳定边界框
  .click();
```

```js
// 添加过滤器
await page
  .locator("button")
  .filter((el = el.innerText().includes("Click Me")))
  .click();
// 添加事件监听
await page
  .locator("button")
  .on(LocatorEvent.Action, () => {
    console.log("clicked");
  })
  .click();
```

#### 等待选择器

等待选择器（waitForSelector）与定位器相比是一个较低级别的 API，允许等待元素在 DOM 中可用。如果操作失败不具备重试特性，且需要手动释放生成 ElementHandle 以防止内存泄漏

```js
import pprt from "puppeteer";
(async () => {
  const browser = await pprt.launch();
  const page = await browser.newPage();
  await page.goto("URL_ADDRESS");

  // 使用 waitForSelector 查询句柄
  const element = await page.waitForSelector("div > .class-name");
  await element.click();

  // 注意释放资源
  await element.dispose();

  await browser.close();
})();
```

#### 立即选择器

在明确已知元素位于页面上时，可以直接使用立即选择器

- page.$()返回与选择器匹配的单个元素
- page.$$()返回与选择器匹配的多个元素
- page.$eval()返回与选择器匹配的第一个元素上运行 JavaScript 函数的结果
- page.$$eval()返回与选择器匹配的每一个元素上运行 JavaScript 函数的结果

#### 扩展选择器

XPath 选择器（-p-path）

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto("https://developer.mozilla.org/zh-CN/");
  // XPath 选择器
  const textContent = await page
    .locator('::-p-xpath((//*[@class="tile-container"]/div/h3/a)[1])')
    .map((el) => el.textContent)
    .wait();
  console.log(textContent);
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
})();
```

Text 选择器（-p-text）

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto("https://developer.mozilla.org/zh-CN/");

  // 文本选择器
  const textContent = await page
    .locator("::-p-text(Developer essentials: JavaScript console methods)")
    .map((el) => el.textContent)
    .wait();
  console.log(textContent);
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
})();
```

ARIA 选择器（-p-aria）

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto("https://developer.mozilla.org/zh-CN/");

  // 无障碍属性选择器
  const innerHTML = await page
    .locator("::-p-aria(MDN homepage)")
    .map((el) => el.innerHTML)
    .wait();
  console.log(innerHTML);
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
})();
```

Pierce 选择器（pierce/）

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1024 });
  await page.goto("https://mdn.github.io/web-components-examples/composed-composed-path/");

  // 穿透 shadow DOM 选择器，深度组合器，同 pierce/p
  const textContent = await page
    .locator("& >>> p")
    .map((el) => el.textContent)
    .wait();
  console.log(textContent);
  await page.screenshot({ path: "screenshot.png" });
  await browser.close();
})();
```

自定义选择器（如 -p-class）

```js
import puppeteer, { Puppeteer } from "puppeteer";
(async () => {
  // 注册 class 选择器
  Puppeteer.registerCustomQueryHandler("class", {
    queryOne: (node, selector) => {
      return node.querySelector(`.${selector}`);
    },
    queryAll: (node, selector) => {
      return [...node.querySelectorAll(`.${selector}`)];
    },
  });
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://developer.mozilla.org/zh-CN/");

  // 使用 class 选择器
  const innerHTML = await page
    .locator("::-p-class(tile-title)")
    .map((el) => el.innerText)
    .wait();
  console.log(innerHTML);
  await browser.close();
})();
```

### 配置说明

Puppeteer 支持通过配置文件和环境变量两种方式来改变默认配置项，且环境变量的优先级要高于配置文件

```js
// .puppeteerrc.js
const { join } = require("path");
/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  // 修改缓存目录后需要重新安装 Puppeteer，以保证新的缓存目录中包含的运行的必要文件
  cacheDirectory: join(__dirname, ".cache", "puppeteer"),
};
```

<img :src="$withBase('./images/daily-blog/puppeteerrc.png')" class="show-in-center">

### 请求拦截

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  await page.setRequestInterception(true);
  page.on("request", (request) => {
    // 判断是否已经处理过请求
    if (request.isInterceptResolutionHandled()) return;
    if (request.url().endsWith(".png") || request.url().endsWith(".jpg")) request.abort();
    // 拦截中止
    else request.continue(); // 继续请求
  });
  await page.goto("https://taobao.com");
  await browser.close();
})();
```

::: tip
在处理拦截到的请求前要调用 isInterceptResolutionHandled() 或 interceptResolutionState() 检查请求的状态，处理过的请求被再次处理会引发 Request is already handled! 异常
:::

### PDF 生成

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://developer.mozilla.org/zh-CN/", {
    waitUntil: "networkidle2",
  });
  await page.pdf({
    path: "mozilla.pdf",
  });
  await browser.close();
})();
```

### cookie 操作

```js
await page.setCookie({});
await page.cookies();
```

### 屏幕截图

```js
import puppeteer from "puppeteer";
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto("https://developer.mozilla.org/zh-CN/", {
    // Waits till there are no more than 2 network connections for at least `500` ms.
    waitUntil: "networkidle2",
  });
  await page.screenshot({
    path: "screenshot.png",
  });
  await browser.close();
})()(
  // 捕获特定元素的截图
  async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const element = await page.waitForSelector("div");
    await element.screenshot({
      path: "screenshot.png",
    });
    await browser.close();
  }
)();
```

[玩转 Puppeteer](https://zhuanlan.zhihu.com/p/624900686)

#### cheerio

方便快捷的 html xml 解析工具
[中文文档](https://github.com/cheeriojs/cheerio/wiki/Chinese-README)
