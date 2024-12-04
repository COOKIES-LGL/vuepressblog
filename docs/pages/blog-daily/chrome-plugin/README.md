<img :src="$withBase('./pages-assets/logo.png')" class="show-in-center">

## 开发与调试

Chrome 插件是一个由 HTML、CSS、JS、图片等资源组成的压缩包,保证根目录有**manifest.json**即可。  
在扩展程序管理页面,可以将包含扩展程序的文夹打包成 crx 文件.因为 Chrome 要求插件必须从它的 Chrome 应用商店安装，其它任何网站下载的都无法直接安装，所以我们可以把 crx 文件解压，然后通过开发者模式直接加载,点击扩展程序的**查看视图**即可进入调试页面。

## 基础介绍

### manifest.json

这是一个 Chrome 插件最重要也是必不可少的文件，用来配置所有和插件相关的配置，必须放在根目录。其中，
**manifest_version**、**name**、**version**3 个是必不可少的，**description**和**icons**是推荐的。

下面给出的是一些常见的配置项:

```javascript
{
 // 清单文件的版本，这个必须写，而且必须是2
 "manifest_version": 2,
 // 插件的名称
 "name": "demo",
 // 插件的版本
 "version": "1.0.0",
 // 插件描述
 "description": "简单的Chrome扩展demo",
 // 图标，一般偷懒全部用一个尺寸的也没问题
 "icons":
 {
  "16": "img/icon.png",
  "48": "img/icon.png",
  "128": "img/icon.png"
 },
 // 会一直常驻的后台JS或后台页面
 "background":
 {
  // 2种指定方式，如果指定JS，那么会自动生成一个背景页
  "page": "background.html"
  //"scripts": ["js/background.js"]
 },
 // 浏览器右上角图标设置，browser_action、page_action、app必须三选一
 "browser_action":
 {
  "default_icon": "img/icon.png",
  // 图标悬停时的标题，可选
  "default_title": "这是一个示例Chrome插件",
  "default_popup": "popup.html"
 },
 // 当某些特定页面打开才显示的图标
 /*"page_action":
 {
  "default_icon": "img/icon.png",
  "default_title": "我是pageAction",
  "default_popup": "popup.html"
 },*/
 // 需要直接注入页面的JS
 "content_scripts":
 [
  {
   //"matches": ["http://*/*", "https://*/*"],
   // "<all_urls>" 表示匹配所有地址
   "matches": ["<all_urls>"],
   // 多个JS按顺序注入
   "js": ["js/jquery-1.8.3.js", "js/content-script.js"],
   // JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
   "css": ["css/custom.css"],
   // 代码注入的时间，可选值： "document_start", "document_end",
   // or "document_idle", 最后一个表示页面空闲时，默认document_idle
   "run_at": "document_start"
  },
  // 这里仅仅是为了演示content-script可以配置多个规则
  {
   "matches": ["*://*/*.png", "*://*/*.jpg", "*://*/*.gif", "*://*/*.bmp"],
   "js": ["js/show-image-content-size.js"]
  }
 ],
 // 权限申请
 "permissions":
 [
  "contextMenus", // 右键菜单
  "tabs", // 标签
  "notifications", // 通知
  "webRequest", // web请求
  "webRequestBlocking",
  "storage", // 插件本地存储
  "http://*/*", // 可以通过executeScript或者insertCSS访问的网站
  "https://*/*" // 可以通过executeScript或者insertCSS访问的网站
 ],
 // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
 "web_accessible_resources": ["js/inject.js"],
 // 插件主页，这个很重要，不要浪费了这个免费广告位
 "homepage_url": "https://www.baidu.com",
 // 覆盖浏览器默认页面
 "chrome_url_overrides":
 {
  // 覆盖浏览器默认的新标签页
  "newtab": "newtab.html"
 },
 // Chrome40以前的插件配置页写法
 "options_page": "options.html",
 // Chrome40以后的插件配置页写法，如果2个都写，新版Chrome只认后面这一个
 "options_ui":
 {
  "page": "options.html",
  // 添加一些默认的样式，推荐使用
  "chrome_style": true
 },
 // 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
 "omnibox": { "keyword" : "go" },
 // 默认语言
 "default_locale": "zh_CN",
 // devtools页面入口，注意只能指向一个HTML文件，不能是JS文件
 "devtools_page": "devtools.html"
}
```

### content-scripts

所谓**content-scripts**，其实就是 Chrome 插件中向页面注入脚本的一种形式（同时还可以包括 css），借助**content-scripts**我们可以实现通过配置的方式轻松向指定页面注入 JS 和 CSS。

示例配置：

```javascript
{
 // 需要直接注入页面的JS
 "content_scripts":
 [
  {
   //"matches": ["http://*/*", "https://*/*"],
   // "<all_urls>" 表示匹配所有地址
   "matches": ["<all_urls>"],
   // 多个JS按顺序注入
   "js": ["js/jquery-1.8.3.js", "js/content-script.js"],
   // JS的注入可以随便一点，但是CSS的注意就要千万小心了，因为一不小心就可能影响全局样式
   "css": ["css/custom.css"],
   // 代码注入的时间，可选值： "document_start", "document_end",
   // or "document_idle"，最后一个表示页面空闲时，默认document_idle
   "run_at": "document_start"
  }
 ],
}
```

content-scripts 和原始页面共享 DOM 但是不共享 JS，如要访问页面 JS（例如某个 JS 变量,或函数）,只能通过 injected scripts 来实现。content-scripts 能访问下面这 4 种 API:

- chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
- chrome.i18n
- chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
- chrome.storage  
  非要调用其它 API 的话，你还可以让 background 来帮你调用然后通过通信来实现

### background

后台脚本，是一个常驻的页面，它的生命周期是插件所有类型脚本中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以把需要一直运行的、启动就运行的、全局代码放在 background 里面。

background 的权限非常高，几乎可以调用（除了 devtools）所有的 Chrome 扩展 API，而且它可以无限制跨域,
配置中，background 可以通过 page 指定一张网页，也可以通过 scripts 直接指定一个 JS，Chrome 会自动为这个 JS 生成一个默认的网页：

```json
{
  // 会一直常驻的后台JS或后台页面
  "background": {
    // 2种指定方式，如果指定JS，那么会自动生成一个背景页
    "page": "background.html"
    //"scripts": ["js/background.js"]
  }
}
```

::: tip
虽然你可以通过 chrome-extension://xxx/background.html 直接打开后台页，但是你打开的后台页和真正一直在后台运行的那个页面不是同一个，换句话说，你可以打开无数个 background.html，但是真正在后台常驻的只有一个，而且这个你永远看不到它的界面，只能调试它的代码。
:::

### event-pages

鉴于 background 生命周期太长，长时间挂载后台可能会影响性能，因此有了 event-pages(事件页面)，在配置文件上,它的使用方式和 background 一样,唯一区别就是多了一个 persistent 参数,配置成非持续存在。

```javascript
{
 "background":
 {
  "scripts": ["event-page.js"],
  "persistent": false
 },
}
```

它的生命周期是：在被需要时加载，在空闲时被关闭，什么叫被需要时呢？  
比如第一次安装、插件更新、与 content-script 进行通信时，所监听的事件被触发等。

### popup

popup 是点击 browser_action 或者 page_action 图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互。  
<img :src="$withBase('./pages-assets/popup.png')" class="show-small-in-center">

可以通过 default_popup 字段来指定 popup 页面，也可以调用 setPopup()动态注册。

```javascript
{
 "browser_action":
 {
  "default_icon": "img/icon.png",
  // 图标悬停时的标题，可选
  "default_title": "这是一个示例Chrome插件",
  "default_popup": "popup.html"
 }
}
```

::: tip
所以 popup 页面的生命周期很短,权限上和 background 非常类似，popup 通过 chrome.extension.getBackgroundPage()可以直接获取 background 的 window 对象。
:::

### injected-script

通过 DOM 操作的方式向页面注入的一种 JS。因为 content-script 有一个很大的“缺陷”，也就是**无法访问页面中的 JS**，虽然它可以操作 DOM，但是 DOM 却不能调用它，也就是无法在 DOM 中通过绑定事件的方式调用 content-script 中的代码.

在 content-script 中通过 DOM 方式向页面注入 inject-script 代码示例：

```javascript
// 向页面注入JS
function injectCustomJs(jsPath) {
  jsPath = jsPath || "js/inject.js";
  var temp = document.createElement("script");
  temp.setAttribute("type", "text/javascript");
  // 获得的地址类似：chrome-extension://demo/js/inject.js
  temp.src = chrome.extension.getURL(jsPath);
  temp.onload = function () {
    // 放在页面不好看，执行完后移除掉
    this.parentNode.removeChild(this);
  };
  document.head.appendChild(temp);
}
```

执行一下你会看到如下报错：
::: danger
Denying load of chrome-extension:/demo/js/inject.js. Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
:::
意思就是你想要在 web 中直接访问插件中的资源的话必须显示声明才行，配置文件中增加如下：

```javascript
{
 // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
 "web_accessible_resources": ["js/inject.js"],
}
```

### option(选项页)

options 页，是插件的设置页面，有 2 个入口,一个是右键图标有一个“选项”菜单，一个在插件管理页面：
<img :src="$withBase('./pages-assets/option2.png')" class="show-small-in-center">

```javascript
{
 "options_ui":
 {
     "page": "options.html",
  // 添加一些默认的样式，推荐使用
     "chrome_style": true
 },
}
```

配置之后在插件管理页就会看到一个选项按钮入口，点进去就是打开一个网页, 这里可以对你的插件进行配置并保存在本地。
数据存储建议用 chrome.storage，因为会随用户自动同步.
<img :src="$withBase('./pages-assets/option1.png')" class="show-small-in-center">

## Chrome 插件的六种展示形式

- browserAction(地址栏右侧)
- pageAction(地址栏右侧)
- contextMenus(右键菜单)
- override(覆盖特定页面)
- devtools(开发者工具)
- omnibox (搜索建议扩展)

### browserAction(地址栏右侧)

通过配置 browser_action 可以在浏览器的右上角增加一个图标，  
一个 browser_action 可以拥有一个图标，一个 tooltip，一个 badge 和一个 popup。

示例配置如下：

```javascript
"browser_action":
{
 "default_icon": "img/icon.png",
 "default_title": "这是一个示例Chrome插件",
 "default_popup": "popup.html"
}
```

图标  
browser_action 图标推荐使用宽高都为 19 像素的图片，更大的图标会被缩小，可以通过 manifest 中 default_icon 字段配置，也可以调用 setIcon()方法。  
tooltip  
修改 browser_action 的 manifest 中 default_title 字段，或者调用 setTitle()方法。  
<img :src="$withBase('./pages-assets/tooltip.png')" class="show-small-in-center">
badge  
所谓 badge 就是在图标上显示一些文本，可以用来更新一些小的扩展状态提示信息。
因为 badge 空间有限，所以只支持（英文 4 个，中文 2 个）字符。
badge 无法通过配置文件来指定，必须通过代码实现。

```javascript
chrome.browserAction.setBadgeText({ text: "new" });
chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
```

<img :src="$withBase('./pages-assets/badge.png')" class="show-small-in-center">

### pageAction(地址栏右侧)

pageAction 和普通的 browserAction 一样也是放在浏览器右上角，只不过没有点亮时是灰色的，点亮了才是彩色的，灰色时无论左键还是右键单击都是弹出选项：  
示例(只有打开百度才点亮图标)：
<img :src="$withBase('./pages-assets/pageAction.gif')" class="show-small-in-center">

<CodeGroup>
  <CodeGroupItem title="manifest.json" active>

```javascript
{
"page_action":
{
"default_icon": "img/icon.png",
"default_title": "我是pageAction",
"default_popup": "popup.html"
},
"permissions": ["declarativeContent"]
}
```

  </CodeGroupItem>

  <CodeGroupItem title="background.js">

```javascript
chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          // 只有打开百度才显示pageAction
          new chrome.declarativeContent.PageStateMatcher({ pageUrl: { urlContains: "baidu.com" } }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});
```

  </CodeGroupItem>
</CodeGroup>

### contextMenus(右键菜单)

通过开发 Chrome 插件可以自定义浏览器的右键菜单，主要是通过**chrome.contextMenusAPI**实现，右键菜单可以出现在不同的上下文，比如普通页面、选中的文字、图片、链接，等等  
添加右键百度搜索:  
<CodeGroup>
<CodeGroupItem title="manifest.json" active>

```javascript
{"permissions": ["contextMenus"， "tabs"]}
```

  </CodeGroupItem>

  <CodeGroupItem title="background.js">

```javascript
chrome.contextMenus.create({
  title: "使用度娘搜索：%s", // %s表示选中的文字
  contexts: ["selection"], // 只有当选中文字时才会出现此右键菜单
  onclick: function (params) {
    // 注意不能使用location.href，因为location是属于background的window对象
    chrome.tabs.create({
      url: "https://www.baidu.com/s?ie=utf-8&wd=" + encodeURI(params.selectionText),
    });
  },
});
```

  </CodeGroupItem>
</CodeGroup>

<img :src="$withBase('./pages-assets/contextbaidu.png')" class="show-small-in-center">

### override(覆盖特定页面)

使用 override 页可以将 Chrome 默认的一些特定页面替换掉，改为使用扩展提供的页面。

扩展可以替代如下页面：

- 历史记录：从工具菜单上点击历史记录时访问的页面，或者从地址栏直接输入 chrome://history
- 新标签页：当创建新标签的时候访问的页面，或者从地址栏直接输入 chrome://newtab
- 书签：浏览器的书签，或者直接输入 chrome://bookmarks  
  ::: warning
- 一个扩展只能替代一个页面；
- 不能替代隐身窗口的新标签页；
- 网页必须设置 title，否则用户可能会看到网页的 URL，造成困扰；
- 一个插件只能替代一个默认页  
  :::  
  下面的截图是默认的新标签页和被扩展替换掉的新标签页。
  <img :src="$withBase('./pages-assets/override.png')" class="show-small-in-center">

```javascript
// manifest.json
"chrome_url_overrides":{
 "newtab": "newtab.html", // 替换新标签页
// "history": "history.html", // 替换历史记录页
// "bookmarks": "bookmarks.html" // 替换书签页
}
```

### devtools(开发者工具)

每打开一个开发者工具窗口，都会创建 devtools 页面的实例，窗口关闭，页面也随着关闭，所以 devtools 页面的生命周期和 devtools 窗口是一致的。devtools 页面可以访问一组特有的 DevTools API 以及有限的扩展 API，这组特有的**DevTools API 只有 devtools 页面才可以访问**，这些 API 包括：

- chrome.devtools.panels：面板相关；
- chrome.devtools.inspectedWindow：获取被审查窗口的有关信息；
- chrome.devtools.network：获取有关网络请求的信息；

大部分扩展 API 都无法直接被 DevTools 页面调用，但它可以像 content-script 一样直接调用 chrome.extension 和 chrome.runtimeAPI，同时它也可以像 content-script 一样使用 Message 交互的方式与 background 页面进行通信。

实例：创建一个 devtools 扩展
首先，要针对开发者工具开发插件，需要在清单文件声明如下：
<CodeGroup>
<CodeGroupItem title="manifest.json" active>

```json
{
  // 只能指向一个HTML文件，不能是JS文件
  "devtools_page": "devtools.html"
}
```

  </CodeGroupItem>

  <CodeGroupItem title="devtools.html">

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <script type="text/javascript" src="js/devtools.js"></script>
  </body>
</html>
```

  </CodeGroupItem>

  <CodeGroupItem title="devtools.js">

```javascript
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create("MyPanel", "img/icon.png", "mypanel.html", function (panel) {
  console.log("自定义面板创建成功！"); // 注意这个log一般看不到
});

// 创建自定义侧边栏
chrome.devtools.panels.elements.createSidebarPane("Images", function (sidebar) {
  // sidebar.setPage('../sidebar.html'); // 指定加载某个页面
  sidebar.setExpression('document.querySelectorAll("img")', "All Images"); // 通过表达式来指定
  //sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
});
```

  </CodeGroupItem>

  <CodeGroupItem title="mypanel.html">

```html
<!DOCTYPE html>
<html>
  <head></head>
  <body>
    <h1>这是一个自定义的侧边栏</h1>
  </body>
</html>
```

  </CodeGroupItem>
</CodeGroup>

<img :src="$withBase('./pages-assets/devtool.png')" class="show-small-in-center">

### omnibox (搜索建议)

注册某个关键字以触发插件自己的搜索建议界面，然后可以任意发挥了。
<img :src="$withBase('./pages-assets/search.png')" class="show-small-in-center">
<CodeGroup>
<CodeGroupItem title="manifest.json">

```json
{
  // 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
  "omnibox": { "keyword": "go" }
}
```

  </CodeGroupItem>

  <CodeGroupItem title="background.js">

```javascript
// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
  if (!text) return;
  if (text == "微博") {
    suggest([
      { content: "新浪" + text, description: "新浪" + text },
      { content: "腾讯" + text, description: "腾讯" + text },
      { content: "搜狐" + text, description: "搜索" + text },
    ]);
  } else {
    suggest([
      { content: "百度搜索 " + text, description: "百度搜索 " + text },
      { content: "谷歌搜索 " + text, description: "谷歌搜索 " + text },
    ]);
  }
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
  if (!text) return;
  var href = "";
  if (text.startsWith("百度搜索"))
    href = "https://www.baidu.com/s?ie=UTF-8&wd=" + text.replace("百度搜索 ", "");
  else if (text.startsWith("谷歌搜索"))
    href = "https://www.google.com.tw/search?q=" + text.replace("谷歌搜索 ", "");
  else href = "https://www.baidu.com/s?ie=UTF-8&wd=" + text;
  openUrlCurrentTab(href);
});

// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null);
  });
}

// 当前标签打开某个链接
function openUrlCurrentTab(url) {
  getCurrentTabId((tabId) => {
    chrome.tabs.update(tabId, { url: url });
  });
}
```

  </CodeGroupItem>
</CodeGroup>

## 五种 JS 类型的对比

Chrome 插件的 JS 主要可以分为这 5 类：  
**injected script、content-script、popup js、background js、devtools js**，

### 权限对比

<img :src="$withBase('./pages-assets/jsType.png')" class="show-in-center">

### 消息通信

::: warning
注：--表示不存在或者无意义，或者待验证。
:::

| js 类型         | injected-script                       | content-script                              | popup-js                                          | background-js                                     |
| --------------- | ------------------------------------- | ------------------------------------------- | ------------------------------------------------- | ------------------------------------------------- |
| injected-script | --                                    | window.postMessage                          | --                                                | --                                                |
| content-script  | window.postMessage                    | --                                          | chrome.runtime.sendMessage chrome.runtime.connect | chrome.runtime.sendMessage chrome.runtime.connect |
| popup-js        | --                                    | chrome.tabs.sendMessage chrome.tabs.connect | --                                                | chrome.extension. getBackgroundPage()             |
| background-js   | --                                    | chrome.tabs.sendMessage chrome.tabs.connect | chrome.extension.getViews                         | --                                                |
| devtools-js     | chrome.devtools. inspectedWindow.eval | --                                          | chrome.runtime.sendMessage                        | chrome.runtime.sendMessage                        |

### 通信详细介绍

popup 和 background
popup 可以直接调用 background 中的 JS 方法，也可以直接访问 background 的 DOM：
<CodeGroup>
<CodeGroupItem title="background.js" active>

```javascript
function xipi() {
  alert("我是background.js！的xipi方法");
}
```

  </CodeGroupItem>

  <CodeGroupItem title="popup.js">

```javascript
var bg = chrome.extension.getBackgroundPage();
bg.test(); // 访问bg的函数
alert(bg.document.body.innerHTML); // 访问bg的DOM
```

  </CodeGroupItem>
</CodeGroup>

至于 background 访问 popup 如下（前提是 popup 已经打开）：

```javascript
var views = chrome.extension.getViews({ type: "popup" });
if (views.length > 0) {
  console.log(views[0].location.href);
}
```

popup 或者 bg 向 content 主动发送消息:

<CodeGroup>
  <CodeGroupItem title="background.js||popup.js">

```javascript
function sendMessageToContentScript(message, callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      if (callback) callback(response);
    });
  });
}
sendMessageToContentScript({ cmd: "test", value: "你好，我是popup！" }, function (response) {
  console.log("来自content的回复：" + response);
});
```

  </CodeGroupItem>
  <CodeGroupItem title="content-script.js">

```javascript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  if (request.cmd == "test") alert(request.value);
  sendResponse("我收到了你的消息！");
});
```

  </CodeGroupItem>
</CodeGroup>

### content-script 主动发消息给后台

<CodeGroup>
  <CodeGroupItem title="content-script.js">

```javascript
chrome.runtime.sendMessage(
  { greeting: "你好，我是content-script呀，我主动发消息给后台！" },
  function (response) {
    console.log("收到来自后台的回复：" + response);
  }
);
```

  </CodeGroupItem>

  <CodeGroupItem title="background.js||popup.js">

```javascript
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log("收到来自content-script的消息：");
  console.log(request, sender, sendResponse);
  sendResponse("我是后台，我已收到你的消息：" + JSON.stringify(request));
});
```

  </CodeGroupItem>
</CodeGroup>

注意事项：
::: warning

- content_scripts 向 popup 主动发消息的前提是 popup 必须打开！否则需要利用 background 中转；
- 如果 background 和 popup 同时监听，那么它们都可以同时收到消息，但是只有一个可以 sendResponse，一个先发送了，那么另外一个再发送就无效；  
  :::

### injected script 和 content-script

content-script 和页面内的脚本（injected-script 自然也属于页面内的脚本）之间唯一共享的东西就是页面的 DOM 元素，有 2 种方法可以实现二者通讯：

可以通过 window.postMessage 和 window.addEventListener 来实现二者消息通讯；
通过自定义 DOM 事件来实现；
<CodeGroup>
<CodeGroupItem title="injected-script.js">

```javascript
window.postMessage({ test: "你好！" }, "*");
```

  </CodeGroupItem>

  <CodeGroupItem title="content-script.js">

```javascript
window.addEventListener(
  "message",
  function (e) {
    console.log(e.data);
  },
  false
);
```

  </CodeGroupItem>
</CodeGroup>

### 长连接和短连接

Chrome 插件中有 2 种通信方式:

- 一个是短连接（chrome.tabs.sendMessage 和 chrome.runtime.sendMessage），
- 一个是长连接（chrome.tabs.connect 和 chrome.runtime.connect）。

短连接的话就类似 ajax 通信上面就是, 而长连接类似 WebSocket 会建立连接，
双方可以随时互发消息。
<CodeGroup>
<CodeGroupItem title="popup.js">

```javascript
getCurrentTabId((tabId) => {
  var port = chrome.tabs.connect(tabId, { name: "test-connect" });
  port.postMessage({ question: "你是谁啊？" });
  port.onMessage.addListener(function (msg) {
    alert("收到消息：" + msg.answer);
    if (msg.answer && msg.answer.startsWith("我是")) {
      port.postMessage({ question: "哦，原来是你啊！" });
    }
  });
});
```

  </CodeGroupItem>

  <CodeGroupItem title="content-script.js" active>

```javascript
chrome.runtime.onConnect.addListener(function (port) {
  console.log(port);
  if (port.name == "test-connect") {
    port.onMessage.addListener(function (msg) {
      console.log("收到长连接消息：", msg);
      if (msg.question == "你是谁啊？") port.postMessage({ answer: "我是小明！" });
    });
  }
});
```

  </CodeGroupItem>
</CodeGroup>

### 跨扩展程序消息传递

除了在您的扩展程序的不同组成部分间发送消息以外，您也可以使用消息传递 API 与其他扩展程序通信。这样您可以提供一个公共的 API，让其他扩展程序使用。

监听传入的请求和连接与处理内部的消息类似，  
唯一的区别是您分别使用 runtime.onMessageExternal 和 runtime.onConnectExternal 事件。  
如下是分别处理这两个事件的例子：同样，向另一个扩展程序发送消息与在您的扩展程序中发送消息类似，唯一的区别是您必须传递您需要与之通信的扩展程序的标识符。

<CodeGroup>
  <CodeGroupItem title="发送消息" active>

```javascript
// 我们需要与之通信的扩展程序的标识符。
var laserExtensionId = "abcdefghijklmnoabcdefhijklmnoabc";

// 发出一个简单请求：
chrome.runtime.sendMessage(laserExtensionId, {getTargetData: true},
  function(response) {
    if (targetInRange(response.targetData))
      chrome.runtime.sendMessage(laserExtensionId, {activateLasers: true});
  });

// 建立一个长时间的连接：
var port = chrome.runtime.connect(laserExtensionId);
port.postMessage(...);
```

  </CodeGroupItem>

  <CodeGroupItem title="接收消息">

```javascript
// 用于简单的请求：
chrome.runtime.onMessageExternal.addListener(function (request, sender, sendResponse) {
  if (sender.id == blacklistedExtension) return;
  // 不允许这一扩展程序访问
  else if (request.getTargetData) sendResponse({ targetData: targetData });
  else if (request.activateLasers) {
    var success = activateLasers();
    sendResponse({ activateLasers: success });
  }
});

// 用于长时间的连接：
chrome.runtime.onConnectExternal.addListener(function (port) {
  port.onMessage.addListener(function (msg) {
    // 有关处理 onMessage 事件的示例请参见其他例子
  });
});
```

  </CodeGroupItem>
</CodeGroup>

## 其它补充

### 本地存储

本地存储建议用 chrome.storage 而不是普通的 localStorage，最重要的 2 点区别是：

- chrome.storage 是针对插件全局的，即使你在 background 中保存的数据，在 content-script 也能获取到；
- chrome.storage.sync 可以跟随当前登录用户自动同步，这台电脑修改的设置会自动同步到其它电脑，很方便，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络；

需要声明 storage 权限，有 chrome.storage.sync 和 chrome.storage.local2 种方式可供选择，使用示例如下：

```javascript
// 读取数据，第一个参数是指定要读取的key以及设置默认值
chrome.storage.sync.get({ color: "red", age: 18 }, function (items) {
  console.log(items.color, items.age);
});
// 保存数据
chrome.storage.sync.set({ color: "blue" }, function () {
  console.log("保存成功！");
});
```

### webRequest

通过 webRequest 系列 API 可以对 HTTP 请求进行任性地修改、定制，
<img :src="$withBase('./pages-assets/webrequest.png')" class="show-in-center">

这里通过 beforeRequest 来简单演示一下它的冰山一角：

<CodeGroup>
  <CodeGroupItem title="content-script.js">

```json
{
  // 权限申请
  "permissions": [
    "webRequest", // web请求
    "webRequestBlocking", // 阻塞式web请求
    "storage", // 插件本地存储
    "http://*/*", // 可以通过executeScript或者insertCSS访问的网站
    "https://*/*" // 可以通过executeScript或者insertCSS访问的网站
  ]
}
```

  </CodeGroupItem>

  <CodeGroupItem title="background.js||popup.js">

```javascript
var showImage; // 是否显示图片
chrome.storage.sync.get({ showImage: true }, function (items) {
  showImage = items.showImage;
});
// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // cancel 表示取消本次请求
    if (!showImage && details.type == "image") return { cancel: true };
    // 简单的音视频检测
    // 大部分网站视频的type并不是media，所以这里仅仅是为了演示效果，无实际意义
    if (details.type == "media") {
      chrome.notifications.create(null, {
        type: "basic",
        iconUrl: "img/icon.png",
        title: "检测到音视频",
        message: "音视频地址：" + details.url,
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);
```

  </CodeGroupItem>
</CodeGroup>

参考链接:

- [https://developer.chrome.com/docs/extensions/](https://developer.chrome.com/docs/extensions/)
- [https://crxdoc-zh.appspot.com/extensions/webRequest](https://crxdoc-zh.appspot.com/extensions/webRequest)
