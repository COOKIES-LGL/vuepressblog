
### rel属性详解

#### rel="alternate"

* alternate 是交替、替换，标识链接有替换内容
``` html
<!-- 可以用来告知 SEO、屏幕阅读器有 H5 端 -->
<link rel="alternate" media="only screen and (max-width: 640px)" href="https://m.xxx.com/" />
<!-- rel="alternate" 定义网站的替换样式 -->
<link href="default.css" rel="stylesheet" type="text/css" title="默认">
<link href="red.css" rel="alternate stylesheet" type="text/css" title="红色">
<link href="green.css" rel="alternate stylesheet" type="text/css" title="绿色">
<!-- 上述 3 个 css 文件均会加载，但 red.css 和 green.css 的优先级为 Lowest, 即在空闲时加载，不会影响页面性能
使用时，切换 disabled 即可，例如要启用红色的皮肤样式，其他的设置 disabled 为 true，红色的设置 disabled 为 false（注意 disabled 为 DOM 属性，link 标签上没有这个属性） -->
<script>
document.querySelector('link[href="red.css"]').disabled = false;
</script>
```
#### rel="canonica"

``` html
<link rel="canonical" href="https://edu.51cto.com" />
指定规范网页，用在 link 中; 告知搜索引擎，以哪个地址为规范版本，降低其他地址的抓取频率
比如你的站点可以通过多个域名访问、或者既有移动端又有 PC 端，这时候就能设定你想要的地址为搜索引擎优化抓取
```

#### rel="nofollow"

禁止搜索引擎追踪，一般不重要的链接设置，防止搜索引擎爬取从而降低主要内容的权重
比如首页，应该只保留列表页，详情页，友链的链接追踪；对于如logo回到首页，一些不重要的链接进入登录后的页面等，均需要设置 nofollow

#### DNS 优化
rel="dns-prefetch" DNS 预读取
rel="preconnect" DNS 预链接
rel="preload" 强制浏览器提前加载资源 优先级为 high
rel="prefetch" 资源预拉取 优先级为 low
rel="prerender" 预渲染

``` html
<meta http-equiv="x-dns-prefetch-control" content="on"> 
<link rel="preconnect" href="https://xxx.com/"> 
<link rel="dns-prefetch" href="https://xxx.com/"> 
<link rel="preload" href="https://xxx.com/"> 
<link rel="prefetch" href="https://xxx.com/"> 
```

### 实用HTML 属性
``` html
<!-- HTML中的Spellcheck属性是用于指定元素是否启用拼写检查的属性。 -->
<p spellcheck="true"></p>

<!-- HTML中的loading属性是一个新的属性，它可以用于指定浏览器在加载资源时的优先级。lazy、eager、auto -->
<Img src="./src/img.png" loading="lazy">

<!-- onerror是一个JavaScript事件处理程序， JavaScript错误时触发。 -->
<Img src="./src/img.png" onerror="()=> {console.log('发生错误')}">
```

### dns-prefetch、preconnect、Preload、prefetch

::: tip
由于dns-prefetch 仅执行 DNS查找，不像preconnect 会建立与服务器的连接.如果页面需要建立与许多第三方域的连接，则将它们预先连接会适得其反。 
preconnect 提示最好仅用于最关键的连接。对于其他的，只需使用 `<link rel="dns-prefetch">` 即可节省第一步的时间DNS查找
Preload 与 prefetch 不同的地方就是它专注于当前的页面，并以高优先级加载资源，Prefetch 专注于下一个页面将要加载的资源并以低优先级加载。同时也要注意 preload 并不会阻塞 window 的 onload 事件。
:::

#### 防盗链
- rel="noreferrer"
- rel="noopener"

### crossorigin

- anonymous - 执行跨源请求。不发送凭据
- 加载了具有crossorigin属性的跨域js脚本，这样就可以获取到user.com/index.js中的具体错误信息了。
- crossorigin会让浏览器启用CORS访问检查，检查http响应头的Access-Control-Allow-Origin
``` html
<script src="user.com/index.js" crossorigin ></script>
```

### Script error.
浏览器只允许同域下的脚本捕获具体的错误信息。其它脚本只知道发生了一个错误，而不知具体发生了什么错误

### integrity
integrity的作用有：避免由【托管在CDN的资源被篡改】而引入的XSS 风险

### http-equiv

HTML 页面中的 `<a>` 标签 会 自动启用 DNS 提前解析 来提升网站性能，但是在使用 https 协议的网站中失效，可通过设置以下方式进行打开
``` html
<meta http-equiv="x-dns-prefetch-control" content="on">
```

### 上传预览图片

``` javascript
// window.URL.createObjectURL
function imgChange(img) {
 document.querySelector("img").src=window.URL.createObjectURL(img.files[0]);
}

// FileReader
function imgChange(img) {
    // 生成一个文件读取的对象
    const reader = new FileReader();
    reader.onload = function (ev) {
        document.querySelector("img").src = imgFile;
    }
    //发起异步读取文件请求，读取结果为data:url的字符串形式，
    reader.readAsDataURL(img.files[0]);
}

```

### 标签页通信-BroadcastChannel

::: tip
BroadcastChannel 只能在相同的源（origin）下工作, 不需要使用 BroadcastChannel 实例时，通过 close() 方法手动关闭频道，以便释放资源
::: 

``` javascript

const channel = new BroadcastChannel('myChannel');

channel.addEventListener('message', event => {
  console.log('Received message:', event.data);
});

channel.postMessage('Hello, other windows!');

```


### a标签下载
::: tip
download设置文件名 跨域情况下，download将不会起作用.  
可以使用axios通过blob形式拉取资源
:::

``` javascript
import axios from 'axios';

function downloadFile(fileUrl,fileName){
  axios.get(fileUrl, { responseType: "blob" }).then(response => {
      const blob = new Blob([response.data]);
      const a = document.createElement("a");//创建a标签
      a.href = window.URL.createObjectURL(blob);// 创建下载的链接
      a.download = fileName;//下载文件名称
      a.style.display = "none";
      document.body.appendChild(a);//a标签追加元素到body内
      a.click();//模拟点击下载
      document.body.removeChild(a);// 下载完成移除元素
      window.URL.revokeObjectURL(a.href);// 释放掉blob对象
  }).catch(console.error);
}

```

### HTML details 标签

``` html
<details>
  <summary>
    文章概要
  </summary>
  <div>文章内容文章内容文章内容文章内容文章内容文章内容文章内容文章内容</div>
</details>
```
