### rel 属性详解

#### rel="alternate"

alternate 是交替、替换，标识链接有替换内容

```html
<!-- 可以用来告知 SEO、屏幕阅读器有 H5 端 -->
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.xxx.com/" />
<!-- rel="alternate" 定义网站的替换样式 -->
<link href="default.css" rel="stylesheet" type="text/css" title="默认" />
<link href="red.css" rel="alternate stylesheet" type="text/css" title="红色" />
<link href="green.css" rel="alternate stylesheet" type="text/css" title="绿色" />
<!-- 上述 3 个 css 文件均会加载，但 red.css 和 green.css 的优先级为 Lowest, 即在空闲时加载，不会影响页面性能
使用时，切换 disabled 即可，例如要启用红色的皮肤样式，其他的设置 disabled 为 true，红色的设置 disabled 为 false（注意 disabled 为 DOM 属性，link 标签上没有这个属性） -->
<script>
  document.querySelector('link[href="red.css"]').disabled = false;
</script>
```

#### rel="canonica"

```html
<link rel="canonical" href="https://edu.51cto.com" />
```

指定规范网页，用在 link 中; 告知搜索引擎，以哪个地址为规范版本，降低其他地址的抓取频率
比如你的站点可以通过多个域名访问、或者既有移动端又有 PC 端，这时候就能设定你想要的地址为搜索引擎优化抓取

#### rel="nofollow"

禁止搜索引擎追踪，一般不重要的链接设置，防止搜索引擎爬取从而降低主要内容的权重
比如首页，应该只保留列表页，详情页，友链的链接追踪；对于如 logo 回到首页，一些不重要的链接进入登录后的页面等，均需要设置 nofollow

#### DNS 优化

- rel="dns-prefetch" DNS 预读取
- rel="preconnect" DNS 预链接
- rel="preload" 强制浏览器提前加载资源 优先级为 high
- rel="prefetch" 资源预拉取 优先级为 low
- rel="prerender" 预渲染

```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
<link rel="preconnect" href="https://xxx.com/" />
<link rel="dns-prefetch" href="https://xxx.com/" />
<link rel="preload" href="https://xxx.com/" />
<link rel="prefetch" href="https://xxx.com/" />
```

### httpEquiv 设置缓存

```html
<meta httpEquiv="Cache-Control" content="no-cache" />
```

::: tip
需要注意的是，虽然 httpEquiv='Cache-Control' 可以在 HTML 中设置缓存控制，但它的效果可能不如在 HTTP 响应头中设置的 Cache-Control 字段，
因为不是所有的代理服务器都会尊重 HTML 中的缓存控制指令。因此，在生产环境中，通常建议在服务器端配置正确的 HTTP 响应头来控制缓存。
:::

### 实用 HTML 属性

```html
<!-- HTML中的Spellcheck属性是用于指定元素是否启用拼写检查的属性。 -->
<p spellcheck="true"></p>
<!-- HTML中的loading属性是一个新的属性，它可以用于指定浏览器在加载资源时的优先级。lazy、eager、auto -->
<img src="./src/img.png" loading="lazy" />
<!-- onerror是一个JavaScript事件处理程序， JavaScript错误时触发。 -->
<img src="./src/img.png" onerror="()=> {console.log('发生错误')}" />
```

### 预加载的几个属性

::: tip
_dns-prefetch、preconnect、Preload、prefetch_

- dns-prefetch 仅执行 DNS 查找，不像 preconnect 会建立与服务器的连接.如果页面需要建立与许多第三方域的连接，则将它们预先连接会适得其反。
- preconnect 提示最好仅用于最关键的连接。对于其他的，只需使用 `<link rel="dns-prefetch">` 即可节省第一步的时间 DNS 查找
- Preload 与 prefetch 不同的地方就是它专注于当前的页面，并以高优先级加载资源，
- Prefetch 专注于下一个页面将要加载的资源并以低优先级加载。同时也要注意 preload 并不会阻塞 window 的 onload 事件。

:::

#### 防盗链

- rel="noreferrer"
- rel="noopener"

### crossorigin

- anonymous - 执行跨源请求。不发送凭据
- 加载了具有 crossorigin 属性的跨域 js 脚本，这样就可以获取到 user.com/index.js 中的具体错误信息了。
- crossorigin 会让浏览器启用 CORS 访问检查，检查 http 响应头的 Access-Control-Allow-Origin

```html
<script src="user.com/index.js" crossorigin></script>
```

### Script error.

浏览器只允许同域下的脚本捕获具体的错误信息。其它脚本只知道发生了一个错误，而不知具体发生了什么错误

### integrity

integrity 的作用有：避免由【托管在 CDN 的资源被篡改】而引入的 XSS 风险

### http-equiv

HTML 页面中的 `<a>` 标签 会 自动启用 DNS 提前解析 来提升网站性能，但是在使用 https 协议的网站中失效，可通过设置以下方式进行打开

```html
<meta http-equiv="x-dns-prefetch-control" content="on" />
```

### 上传预览图片

```javascript
// window.URL.createObjectURL
function imgChange(img) {
  document.querySelector("img").src = window.URL.createObjectURL(img.files[0]);
}

// FileReader
function imgChange(img) {
  // 生成一个文件读取的对象
  const reader = new FileReader();
  reader.onload = function (ev) {
    document.querySelector("img").src = imgFile;
  };
  //发起异步读取文件请求，读取结果为data:url的字符串形式，
  reader.readAsDataURL(img.files[0]);
}
```

### 标签页通信-BroadcastChannel

::: tip
BroadcastChannel 只能在相同的源（origin）下工作, 不需要使用 BroadcastChannel 实例时，通过 close() 方法手动关闭频道，以便释放资源
:::

```javascript
const channel = new BroadcastChannel("myChannel");
channel.addEventListener("message", (event) => {
  console.log("Received message:", event.data);
});
channel.postMessage("Hello, other windows!");
```

### a 标签下载

::: tip
download 设置文件名 跨域情况下，download 将不会起作用.  
可以使用 axios 通过 blob 形式拉取资源.
:::

```javascript
import axios from "axios";
function downloadFile(fileUrl, fileName) {
  axios
    .get(fileUrl, { responseType: "blob" })
    .then((response) => {
      const blob = new Blob([response.data]);
      const a = document.createElement("a"); //创建a标签
      a.href = window.URL.createObjectURL(blob); // 创建下载的链接
      a.download = fileName; //下载文件名称
      a.style.display = "none";
      document.body.appendChild(a); //a标签追加元素到body内
      a.click(); //模拟点击下载
      document.body.removeChild(a); // 下载完成移除元素
      window.URL.revokeObjectURL(a.href); // 释放掉blob对象
    })
    .catch(console.error);
}
```

### script 标签特性

1、当 script 同时存在行内代码和外部文件引用时，则只会下载外部文件而去忽略行内代码  
2、浏览器在解析行内脚本的过程中，看到字符串`</script>`，会将其当成结束的`</script>`标签。目前测试下来只有这个标签作为字符串才会出现。解决就是使用转义字符\,将`</script>`转义成`<\/script>`

```html
<script>
   function sayScript() {
     console.log('</script>')
   }
   sayScript()
</script>
```

3、如果页面是通过 https 协议启动的，那么 src 只能使用 https 协议，如果页面是 http 协议启动那么 https/http 协议都可以使用

### `<script>`标签的 nonce 属性

在 HTML 中，`<script>`标签的 nonce 属性是用于指定一个随机数（nonce），这个随机数与内容安全策略（Content Security Policy, CSP）配合使用，以确保脚本的安全执行。CSP 是一种安全特性，用于定义哪些源的内容可以被网页使用，以防止跨站脚本攻击（XSS）。

当你在 HTTP 头或`<meta>`标签中定义了 CSP 策略时，你可以指定一个脚本执行策略，例如只允许来自特定域的脚本执行，或者要求脚本必须有特定的哈希值。nonce 属性提供了另一种方式来允许脚本执行，即通过在 CSP 策略中定义一个随机的令牌（nonce），然后在`<script>`标签中包含这个令牌。

例如，如果你的 CSP 策略中包含以下内容：

```js
Content-Security-Policy
:
script-src

'nonce-4gLaoLwzcmJ2rXUH'
```

那么你的`<script>`标签应该包含相同的 nonce 值：

```html
<meta
  http-equiv="Content-Security-Policy"
  content="default-src 'none'; style-src ${webview.cspSource}; script-src 'self' 'unsafe-inline' 'nonce-4gLaoLwzcmJ2rXUH';"
/>
<script nonce="4gLaoLwzcmJ2rXUH">
  // 脚本内容
</script>
```

只有当`<script>`标签中的 nonce 属性与 CSP 策略中指定的 nonce 值匹配时，浏览器才会执行脚本。这样可以确保即使攻击者能够注入恶意脚本，除非他们知道正确的 nonce 值，否则脚本也不会被执行。

> nonce 值应该是随机生成的，并且对于每个请求都是唯一的，以防止攻击者预测或重用 nonce 值。

### ResizeObserver

```javascript
// ResizeObserver 观察 DOM 元素大小的变化
// 创建一个新的 ResizeObserver
const resizeObserver = new ResizeObserver((entries) => {
  for (let entry of entries) {
    const { width, height } = entry.contentRect;
    console.log(`元素调整大小为 ${width}px x ${height}px`);
    // 根据元素的新尺寸执行操作
  }
});

// 选择要观察的元素
const targetElement = document.querySelector(".resize-me");
// 开始观察目标元素
resizeObserver.observe(targetElement);
```

### nofollow、external

- nofollow：会告诉搜索引擎忽略这个链接，阻止搜索引擎对该页面进行追踪，从而避免权重分散
- external：会告诉搜索引擎这是一个外部链接，非本站的链接

```html
<a rel="nofollow" href="http://www.baidu.com/">百度</a>
<a rel="external" href="http://www.baidu.com/">百度</a>
```

### HTML details 标签

```html
<details>
  <summary>文章概要</summary>
  <div>文章内容文章内容文章内容文章内容文章内容文章内容文章内容文章内容</div>
</details>
```

### ‌image 和 background-image

‌image 标签和 background-image 在网页渲染中的顺序是先渲染 image 标签，再渲染 background-image。

### customElements

customElements 是 Web Components 标准的一个重要组成部分，它允许开发者定义自己的 HTML 标签，这些标签具有自定义的行为和样式

```ts
class MyButton extends HTMLElement {
  constructor() {
    super(); // 必须首先调用super()来初始化元素
    const shadow = this.attachShadow({ mode: "open" }); // 创建一个Shadow DOM
    // 在Shadow DOM中添加内容...
  }

  // 可以定义其他方法来处理事件、更新样式等...
}

customElements.define("my-button", MyButton); // 注册自定义元素
```

当你定义一个自定义元素时，你可以通过重写类中的特定方法来控制该元素的生命周期。这些方法包括：

- connectedCallback：当元素被插入到 DOM 中时调用。
- disconnectedCallback：当元素从 DOM 中移除时调用。
- adoptedCallback：当元素被移动到新的文档时调用。
- attributeChangedCallback：当元素的属性发生变化时调用。

### img 标签的 srcset、sizes 属性

响应式页面中经常用到根据屏幕密度设置不同的图片。这时就用到了 img 标签的 srcset 属性。srcset 属性用于设置不同屏幕密度下，img 会自动加载不同的图片。用法如下：

```html
<img
  src="image-128.png"
  srcset="image-128.png 128w, image-256.png 256w, image-512.png 512w"
  sizes="(max-width: 360px) 340px, 128px"
/>
```

### ‌SSE（Server-Sent Events）流式传输

- 单向通信
- 基于 HTTP 协议，使用普通的 HTTP 请求（GET 方法）。
- 服务器响应头需设置为 Content-Type: text/event-stream。
- 受同源策略限制

### EventSource

EventSource 是 HTML5 提供的一种用于接收服务器推送事件的 API，通常用于实现服务器向客户端实时推送数据。它基于 HTTP 协议，
**基本用法**

创建 EventSource 对象：
通过指定服务器端的 URL 来创建一个 EventSource 对象。

```js
const eventSource = new EventSource("https://example.com/events");
```

监听消息事件：
通过监听 message 事件来接收服务器推送的数据。

```js
eventSource.onmessage = function (event) {
  console.log("Received data:", event.data);
};
```

监听自定义事件：
如果服务器发送的是自定义事件，可以使用 addEventListener 来监听。

```js
eventSource.addEventListener("customEvent", function (event) {
  console.log("Custom event data:", event.data);
});
```

处理错误：
可以通过监听 error 事件来处理连接错误。

```js
eventSource.onerror = function (event) {
  console.error("EventSource failed:", event);
};
```

关闭连接：
当你不再需要接收事件时，可以关闭连接。

```js
eventSource.close();
```
