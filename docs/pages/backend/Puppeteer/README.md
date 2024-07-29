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

### 浏览器管理
connect 直接连接到已启动的浏览器
``` js
import puppeteer from 'puppeteer';
(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        // 设置远程调试端口
        args: ['--remote-debugging-port=9222']
    })
    const page = await browser.newPage()
    // /json/version 获取 webSocketDebuggerUrl
    await page.goto('http://localhost:9222/json/version')
})()
// 连接上一个浏览器并打印 caniuse.com 网站的 news 元素：
(async () => {
    const browser = await puppeteer.connect({
        browserWSEndpoint: "ws://localhost:9222/devtools/browser/5bce4998-1ba5-4f96-b512-d0fb8d49187d"
    })
    const page = await browser.newPage()
    await page.goto('https://caniuse.com/')
    const textContext = await page.locator('.news').map(el => el.textContent).wait()
    console.log(textContext)

    // 断开连接并不会关闭浏览器
    await browser.disconnect()
})()
```

### 网络日志
page 提供了一个 on(event, handler) 函数，允许对 Puppeteer 派发的事件进行监听
``` js
import puppeteer from 'puppeteer';
(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://caniuse.com/')

    page.on('request', request => {
        console.log('request : ', request.url())
    })

    page.on('response', response => {
        console.log('response : ', response.url())
    })
})()
```

### 页面交互
#### 定位器
点击元素	await page.locator('button').click();
录入文本	await page.locator('input').fill('hello world');
鼠标悬停	await page.locator('div').hover();
滚动元素	await page.locator('div').scroll({ scrollTop: 10, scrollLeft: 20 });
等待元素可见	await page.locator('.loading').wait();
``` js
// 配置超时时间
await page.locator('button').setTimeout(5 * 1000).click();
// 由于网页的响应速度存在差异，默认的超时时间不满足需要的情况下，可使用 setTimeout() 函数适当延长，超时时将抛出 TimeoutError 异常
```
``` js
// 配置自检项
await page.locator('button')
  .setEnsureElementIsInTheViewport(false) // 禁用后无法保证操作前元素位于视口中
  .setVisibility(null)                    // 设置忽略操作前检查元素可见或隐藏状态
  .setWaitForEnabled(false)               // 禁用后无法保证操作前元素可用
  .setWaitForStableBoundingBox(false)     // 禁用后将不等待元素在两个连续动画帧上具有稳定边界框
  .click();
```
``` js
// 添加过滤器
await page.locator('button')
	.filter(el = el.innerText().includes('Click Me'))
  .click();
// 添加事件监听
await page.locator('button')
  .on(LocatorEvent.Action, () => {
      console.log('clicked');
  }).click();
```
#### 等待选择器
等待选择器（waitForSelector）与定位器相比是一个较低级别的 API，允许等待元素在 DOM 中可用。如果操作失败不具备重试特性，且需要手动释放生成 ElementHandle 以防止内存泄漏
``` js
import pprt from "puppeteer"
(async () => {
    const browser = await pprt.launch()
    const page = await browser.newPage()
    await page.goto("URL_ADDRESS")

    // 使用 waitForSelector 查询句柄
    const element = await page.waitForSelector("div > .class-name")
    await element.click();

    // 注意释放资源
    await element.dispose();

    await browser.close();
})()
```
#### 立即选择器
在明确已知元素位于页面上时，可以直接使用立即选择器
- page.$()返回与选择器匹配的单个元素
- page.$$()返回与选择器匹配的多个元素
- page.$eval()返回与选择器匹配的第一个元素上运行 JavaScript 函数的结果
- page.$$eval()返回与选择器匹配的每一个元素上运行 JavaScript 函数的结果


#### 扩展选择器
XPath 选择器（-p-path）
``` js
import puppeteer from 'puppeteer'
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })
    await page.goto('https://developer.mozilla.org/zh-CN/')
  	// XPath 选择器
    const textContent = await page.locator('::-p-xpath((//*[@class="tile-container"]/div/h3/a)[1])')
      .map(el => el.textContent)
      .wait()
    console.log(textContent)
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
})()
```
Text 选择器（-p-text）
``` js
import puppeteer from 'puppeteer'
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })
    await page.goto('https://developer.mozilla.org/zh-CN/')
      		
  	// 文本选择器
    const textContent = await page.locator('::-p-text(Developer essentials: JavaScript console methods)')
    	.map(el => el.textContent)
    	.wait()
		console.log(textContent)
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
})()
```
ARIA 选择器（-p-aria）
``` js
import puppeteer from 'puppeteer'
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })
    await page.goto('https://developer.mozilla.org/zh-CN/')
      
  	// 无障碍属性选择器
    const innerHTML = await page.locator('::-p-aria(MDN homepage)')
      .map(el => el.innerHTML)
      .wait()
    console.log(innerHTML)
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
})()
```
Pierce 选择器（pierce/）
``` js
import puppeteer from 'puppeteer'
(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    await page.setViewport({ width: 1080, height: 1024 })
    await page.goto('https://mdn.github.io/web-components-examples/composed-composed-path/')
        
  	// 穿透 shadow DOM 选择器，深度组合器，同 pierce/p
    const textContent = await page.locator('& >>> p')
    	.map(el => el.textContent)
    	.wait()
    console.log(textContent)
    await page.screenshot({ path: 'screenshot.png' })
    await browser.close()
})()
```
自定义选择器（如 -p-class）
``` js
import puppeteer, { Puppeteer } from "puppeteer"
(async () => {
    // 注册 class 选择器 
    Puppeteer.registerCustomQueryHandler('class', {
        queryOne: (node, selector) => {
            return node.querySelector(`.${selector}`)
        },
        queryAll: (node, selector) => {
            return [...node.querySelectorAll(`.${selector}`)]
        }
    })
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto("https://developer.mozilla.org/zh-CN/")
      
    // 使用 class 选择器
    const innerHTML = await page.locator('::-p-class(tile-title)').map(el => el.innerText).wait()
    console.log(innerHTML)
    await browser.close()
})()
```

### 配置说明
Puppeteer 支持通过配置文件和环境变量两种方式来改变默认配置项，且环境变量的优先级要高于配置文件
``` js
// .puppeteerrc.js
const { join } = require('path');
/**
 * @type {import('puppeteer').Configuration}
 */
module.exports = {
  	// 修改缓存目录后需要重新安装 Puppeteer，以保证新的缓存目录中包含的运行的必要文件
    cacheDirectory: join(__dirname, '.cache', 'puppeteer')
}
```
<img :src="$withBase('./images/daily-blog/puppeteerrc.png')" class="show-in-center">

### 请求拦截
```js
import puppeteer from 'puppeteer';
(async () => {
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setRequestInterception(true);
    page.on('request', request => {
        // 判断是否已经处理过请求
        if (request.isInterceptResolutionHandled()) return;
        if (
            request.url().endsWith('.png') ||
            request.url().endsWith('.jpg')
        )
            request.abort(); // 拦截中止
        else request.continue(); // 继续请求
    });
    await page.goto('https://taobao.com');
    await browser.close();
})();
```
::: tips
在处理拦截到的请求前要调用 isInterceptResolutionHandled() 或 interceptResolutionState() 检查请求的状态，处理过的请求被再次处理会引发Request is already handled! 异常
:::

### PDF 生成
``` js
import puppeteer from 'puppeteer'
(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://developer.mozilla.org/zh-CN/', {
        waitUntil: 'networkidle2'
    })
    await page.pdf({
        path: 'mozilla.pdf',
    });
    await browser.close();
})()
```
### cookie 操作
``` js
await page.setCookie({})
await page.cookies()
```
### 屏幕截图
``` js
import puppeteer from 'puppeteer'
(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://developer.mozilla.org/zh-CN/', {
      	// Waits till there are no more than 2 network connections for at least `500` ms.
        waitUntil: 'networkidle2'
    })
    await page.screenshot({
        path: 'screenshot.png',
    });
    await browser.close();
})()
// 捕获特定元素的截图
(async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    const element = await page.waitForSelector('div');
    await element.screenshot({
      path: 'screenshot.png',
    });
    await browser.close();
})()
```


#### cheerio
方便快捷的html xml 解析工具
[中文文档](https://github.com/cheeriojs/cheerio/wiki/Chinese-README)
