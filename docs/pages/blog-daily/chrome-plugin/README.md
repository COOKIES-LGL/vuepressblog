<img :src="$withBase('./pages-assets/logo.png')" class="show-in-center">

## 开发与调试
Chrome插件没有严格的项目结构要求，只要保证本目录有一个**manifest.json**即可，  
从右上角菜单->更多工具->扩展程序可以进入插件管理页面，或在地址栏输入<u>chrome://extensions</u> 访问。  
勾选开发者模式即可以文件夹的形式直接加载插件，否则只能安装.crx格式的文件。因为Chrome要求插件必须从它的Chrome应用商店安装，其它任何网站下载的都无法直接安装，所以我们可以把crx文件解压，然后通过开发者模式直接加载。

## 核心介绍
### manifest.json
这是一个Chrome插件最重要也是必不可少的文件，用来配置所有和插件相关的配置，必须放在根目录。其中，
**manifest_version**、**name**、**version**3个是必不可少的，**description**和**icons**是推荐的。

下面给出的是一些常见的配置项:
``` javascript
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
   // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
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
所谓**content-scripts**，其实就是Chrome插件中向页面注入脚本的一种形式（同时还可以包括css的），借助**content-scripts**我们可以实现通过配置的方式轻松向指定页面注入JS和CSS（如果需要动态注入，可以参考下文），最常见的比如：广告屏蔽、页面CSS定制，等等。

示例配置：
``` javascript
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
   // 代码注入的时间，可选值： "document_start", "document_end", or "document_idle"，最后一个表示页面空闲时，默认document_idle
   "run_at": "document_start"
  }
 ],
}
```
特别注意，如果没有主动指定run_at为**document_start**（默认为**document_idle**），下面这种代码是不会生效的：
``` javascript
document.addEventListener('DOMContentLoaded', function(){
 console.log('我被执行了！');
});
```
content-scripts和原始页面共享DOM，但是不共享JS，如要访问页面JS（例如某个JS变量），只能通过injected js来实现。content-scripts能访问下面这4种API:
* chrome.extension(getURL , inIncognitoContext , lastError , onRequest , sendRequest)
* chrome.i18n
* chrome.runtime(connect , getManifest , getURL , id , onConnect , onMessage , sendMessage)
* chrome.storage  
非要调用其它API的话，你还可以让background来帮你调用然后通过通信来实现
### background
后台（姑且这么翻译吧），是一个常驻的页面，它的生命周期是插件中所有类型页面中最长的，它随着浏览器的打开而打开，随着浏览器的关闭而关闭，所以通常把需要一直运行的、启动就运行的、全局的代码放在background里面。

background的权限非常高，几乎可以调用所有的Chrome扩展API（除了devtools），而且它可以无限制跨域,
配置中，background可以通过page指定一张网页，也可以通过scripts直接指定一个JS，Chrome会自动为这个JS生成一个默认的网页：
``` json
{
 // 会一直常驻的后台JS或后台页面
 "background":
 {
  // 2种指定方式，如果指定JS，那么会自动生成一个背景页
  "page": "background.html"
  //"scripts": ["js/background.js"]
 },
}
```
::: tip
虽然你可以通过chrome-extension://xxx/background.html直接打开后台页，但是你打开的后台页和真正一直在后台运行的那个页面不是同一个，换句话说，你可以打开无数个background.html，但是真正在后台常驻的只有一个，而且这个你永远看不到它的界面，只能调试它的代码。
:::
### event-pages
鉴于background生命周期太长，长时间挂载后台可能会影响性能，所以Google又弄一个event-pages，在配置文件上，它与background的唯一区别就是多了一个persistent参数：
``` javascript
{
 "background":
 {
  "scripts": ["event-page.js"],
  "persistent": false
 },
}
```
它的生命周期是：在被需要时加载，在空闲时被关闭，什么叫被需要时呢？比如第一次安装、插件更新、与content-script进行通信时，等等。除了配置文件的变化，代码上也有一些细微变化，个人这个简单了解一下就行了，一般情况下background也不会很消耗性能的。 
### popup
popup是点击browser_action或者page_action图标时打开的一个小窗口网页，焦点离开网页就立即关闭，一般用来做一些临时性的交互。   
<img :src="$withBase('./pages-assets/popup.png')" class="show-small-in-center">  
博客园网摘插件popup效果

popup可以包含任意你想要的HTML内容，并且会自适应大小。可以通过default_popup字段来指定popup页面，也可以调用setPopup()动态注册。
``` javascript
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
所以popup页面的生命周期很短，需要长时间运行的代码不能写在popup里面。
权限上，和background非常类似，popup通过chrome.extension.getBackgroundPage()可以直接获取background的window对象。

### injected-script
指的是通过DOM操作的方式向页面注入的一种JS。为什么需要通过这种方式注入JS呢？

这是因为content-script有一个很大的“缺陷”，也就是**无法访问页面中的JS**，虽然它可以操作DOM，但是DOM却不能调用它，也就是无法在DOM中通过绑定事件的方式调用content-script中的代码.

在content-script中通过DOM方式向页面注入inject-script代码示例：
``` javascript
// 向页面注入JS
function injectCustomJs(jsPath)
{
 jsPath = jsPath || 'js/inject.js';
 var temp = document.createElement('script');
 temp.setAttribute('type', 'text/javascript');
 // 获得的地址类似：chrome-extension://ihcokhadfjfchaeagdoclpnjdiokfakg/js/inject.js
 temp.src = chrome.extension.getURL(jsPath);
 temp.onload = function()
 {
  // 放在页面不好看，执行完后移除掉
  this.parentNode.removeChild(this);
 };
 document.head.appendChild(temp);
}
```
执行一下你会看到如下报错：
::: danger
Denying load of chrome-extension://efbllncjkjiijkppagepehoekjojdclc/js/inject.js. Resources must be listed in the web_accessible_resources manifest key in order to be loaded by pages outside the extension.
:::
意思就是你想要在web中直接访问插件中的资源的话必须显示声明才行，配置文件中增加如下：
``` javascript
{
 // 普通页面能够直接访问的插件资源列表，如果不设置是无法直接访问的
 "web_accessible_resources": ["js/inject.js"],
}
```
### option(选项页)
options页，是插件的设置页面，有2个入口,一个是右键图标有一个“选项”菜单，一个在插件管理页面： 
<img :src="$withBase('./pages-assets/option2.png')" class="show-small-in-center"> 
``` javascript
{
 "options_ui":
 {
     "page": "options.html",
  // 添加一些默认的样式，推荐使用
     "chrome_style": true
 },
}
```
这个页面里面的内容就随你自己发挥了，配置之后在插件管理页就会看到一个选项按钮入口，点进去就是打开一个网页, 这里可以对你的插件进行配置并保存在本地。
<img :src="$withBase('./pages-assets/option1.png')" class="show-small-in-center">

* 新版options中不能使用alert；
* 数据存储建议用chrome.storage，因为会随用户自动同步；

## Chrome插件的6种展示形式
* browserAction(地址栏右侧)
* pageAction(地址栏右侧)
* contextMenus(右键菜单)
* override(覆盖特定页面)
* devtools(开发者工具)
* omnibox (搜索建议扩展)

### browserAction(地址栏右侧)
通过配置browser_action可以在浏览器的右上角增加一个图标，一个browser_action可以拥有一个图标，一个tooltip，一个badge和一个popup。

示例配置如下：
``` javascript
"browser_action":
{
 "default_icon": "img/icon.png",
 "default_title": "这是一个示例Chrome插件",
 "default_popup": "popup.html"
}
```
图标
browser_action图标推荐使用宽高都为19像素的图片，更大的图标会被缩小，格式随意，一般推荐png，可以通过manifest中default_icon字段配置，也可以调用setIcon()方法。
tooltip  
修改browser_action的manifest中default_title字段，或者调用setTitle()方法。  
<img :src="$withBase('./pages-assets/tooltip.png')" class="show-small-in-center"> 
badge  
所谓badge就是在图标上显示一些文本，可以用来更新一些小的扩展状态提示信息。
因为badge空间有限，所以只支持（英文4个，中文2个）字符。 
badge无法通过配置文件来指定，必须通过代码实现。

``` javascript
chrome.browserAction.setBadgeText({text: 'new'});
chrome.browserAction.setBadgeBackgroundColor({color: [255, 0, 0, 255]});
```
<img :src="$withBase('./pages-assets/badge.png')" class="show-small-in-center">

### pageAction(地址栏右侧)
pageAction和普通的browserAction一样也是放在浏览器右上角，只不过没有点亮时是灰色的，点亮了才是彩色的，灰色时无论左键还是右键单击都是弹出选项：  
示例(只有打开百度才点亮图标)：
``` javascript
// manifest.json
{
 "page_action":
 {
  "default_icon": "img/icon.png",
  "default_title": "我是pageAction",
  "default_popup": "popup.html"
 },
 "permissions": ["declarativeContent"]
}

// background.js
chrome.runtime.onInstalled.addListener(function(){
 chrome.declarativeContent.onPageChanged.removeRules(undefined, function(){
  chrome.declarativeContent.onPageChanged.addRules([
   {
    conditions: [
     // 只有打开百度才显示pageAction
     new chrome.declarativeContent.PageStateMatcher({pageUrl: {urlContains: 'baidu.com'}})
    ],
    actions: [new chrome.declarativeContent.ShowPageAction()]
   }
  ]);
 });
});
```
<img :src="$withBase('./pages-assets/pageAction.gif')" class="show-small-in-center">

### contextMenus(右键菜单)
通过开发Chrome插件可以自定义浏览器的右键菜单，主要是通过**chrome.contextMenusAPI**实现，右键菜单可以出现在不同的上下文，比如普通页面、选中的文字、图片、链接，等等  
最简单的右键菜单示例:    
``` javascript
// manifest.json
{"permissions": ["contextMenus"]}

// background.js
chrome.contextMenus.create({
 title: "测试右键菜单",
 onclick: function(){alert('您点击了右键菜单！');}
});

```
<img :src="$withBase('./pages-assets/contextMenu.png')" class="show-small-in-center">

添加右键百度搜索  
``` javascript
// manifest.json
{"permissions": ["contextMenus"， "tabs"]}

// background.js
chrome.contextMenus.create({
 title: '使用度娘搜索：%s', // %s表示选中的文字
 contexts: ['selection'], // 只有当选中文字时才会出现此右键菜单
 onclick: function(params)
 {
  // 注意不能使用location.href，因为location是属于background的window对象
  chrome.tabs.create({url: 'https://www.baidu.com/s?ie=utf-8&wd=' + encodeURI(params.selectionText)});
 }
});
```
<img :src="$withBase('./pages-assets/contextbaidu.png')" class="show-small-in-center">

### override(覆盖特定页面)
使用override页可以将Chrome默认的一些特定页面替换掉，改为使用扩展提供的页面。

扩展可以替代如下页面：

历史记录：从工具菜单上点击历史记录时访问的页面，或者从地址栏直接输入 chrome://history  
新标签页：当创建新标签的时候访问的页面，或者从地址栏直接输入 chrome://newtab  
书签：浏览器的书签，或者直接输入 chrome://bookmarks    
::: warning
* 一个扩展只能替代一个页面；
* 不能替代隐身窗口的新标签页；
* 网页必须设置title，否则用户可能会看到网页的URL，造成困扰；
* 一个插件只能替代一个默认页  
:::  
下面的截图是默认的新标签页和被扩展替换掉的新标签页。
<img :src="$withBase('./pages-assets/override.png')" class="show-small-in-center">
``` json
"chrome_url_overrides":{
 "newtab": "newtab.html",
//  "history": "history.html",
//  "bookmarks": "bookmarks.html"
}
```
### devtools(开发者工具)
每打开一个开发者工具窗口，都会创建devtools页面的实例，F12窗口关闭，页面也随着关闭，所以devtools页面的生命周期和devtools窗口是一致的。devtools页面可以访问一组特有的DevTools API以及有限的扩展API，这组特有的DevTools **API只有devtools页面才可以访问**，这些API包括：  
* chrome.devtools.panels：面板相关；
* chrome.devtools.inspectedWindow：获取被审查窗口的有关信息；
* chrome.devtools.network：获取有关网络请求的信息；
大部分扩展API都无法直接被DevTools页面调用，但它可以像content-script一样直接调用chrome.extension和chrome.runtimeAPI，同时它也可以像content-script一样使用Message交互的方式与background页面进行通信。

实例：创建一个devtools扩展
首先，要针对开发者工具开发插件，需要在清单文件声明如下：
``` json
{
 // 只能指向一个HTML文件，不能是JS文件
 "devtools_page": "devtools.html"
}
```
``` html
<!DOCTYPE html>
<html>
<head></head>
<body>
 <script type="text/javascript" src="js/devtools.js"></script>
</body>
</html>
```
里面一般什么都没有，就引入一个js , 可以看出来，其实真正代码是devtools.js
``` javascript
// 几个参数依次为：panel标题、图标（其实设置了也没地方显示）、要加载的页面、加载成功后的回调
chrome.devtools.panels.create('MyPanel', 'img/icon.png', 'mypanel.html', function(panel)
{
 console.log('自定义面板创建成功！'); // 注意这个log一般看不到
});

// 创建自定义侧边栏
chrome.devtools.panels.elements.createSidebarPane("Images", function(sidebar)
{
 // sidebar.setPage('../sidebar.html'); // 指定加载某个页面
 sidebar.setExpression('document.querySelectorAll("img")', 'All Images'); // 通过表达式来指定
 //sidebar.setObject({aaa: 111, bbb: 'Hello World!'}); // 直接设置显示某个对象
});
```
<img :src="$withBase('./pages-assets/devtool.png')" class="show-small-in-center">

### omnibox (搜索建议)

注册某个关键字以触发插件自己的搜索建议界面，然后可以任意发挥了。
<img :src="$withBase('./pages-assets/search.gif')" class="show-small-in-center">
首先，配置文件如下：
``` json
{
 // 向地址栏注册一个关键字以提供搜索建议，只能设置一个关键字
 "omnibox": { "keyword" : "go" },
}
```
``` javascript
// omnibox 演示
chrome.omnibox.onInputChanged.addListener((text, suggest) => {
 console.log('inputChanged: ' + text);
 if(!text) return;
 if(text == '美女') {
  suggest([
   {content: '中国' + text, description: '你要找“中国美女”吗？'},
   {content: '日本' + text, description: '你要找“日本美女”吗？'},
   {content: '泰国' + text, description: '你要找“泰国美女或人妖”吗？'},
   {content: '韩国' + text, description: '你要找“韩国美女”吗？'}
  ]);
 }
 else if(text == '微博') {
  suggest([
   {content: '新浪' + text, description: '新浪' + text},
   {content: '腾讯' + text, description: '腾讯' + text},
   {content: '搜狐' + text, description: '搜索' + text},
  ]);
 }
 else {
  suggest([
   {content: '百度搜索 ' + text, description: '百度搜索 ' + text},
   {content: '谷歌搜索 ' + text, description: '谷歌搜索 ' + text},
  ]);
 }
});

// 当用户接收关键字建议时触发
chrome.omnibox.onInputEntered.addListener((text) => {
    console.log('inputEntered: ' + text);
 if(!text) return;
 var href = '';
    if(text.endsWith('美女')) href = 'http://image.baidu.com/search/index?tn=baiduimage&ie=utf-8&word=' + text;
 else if(text.startsWith('百度搜索')) href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text.replace('百度搜索 ', '');
 else if(text.startsWith('谷歌搜索')) href = 'https://www.google.com.tw/search?q=' + text.replace('谷歌搜索 ', '');
 else href = 'https://www.baidu.com/s?ie=UTF-8&wd=' + text;
 openUrlCurrentTab(href);
});
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
 {
  if(callback) callback(tabs.length ? tabs[0].id: null);
 });
}

// 当前标签打开某个链接
function openUrlCurrentTab(url)
{
 getCurrentTabId(tabId => {
  chrome.tabs.update(tabId, {url: url});
 })
}
```
## 五种类型的JS对比
Chrome插件的JS主要可以分为这5类：  
**injected script、content-script、popup js、background js、devtools js**，
### 权限对比
<img :src="$withBase('./pages-assets/jsType.png')" class="show-in-center">

### 消息通信
前面我们介绍了Chrome插件中存在的5种JS，那么它们之间如何互相通信呢？
::: warning
注：-表示不存在或者无意义，或者待验证。
::: 
<img :src="$withBase('./pages-assets/sendMessage.png')" class="show-in-center"> 

### 通信详细介绍
popup和background
popup可以直接调用background中的JS方法，也可以直接访问background的DOM：
``` javascript
// background.js
function test()
{
 alert('我是background！');
}

// popup.js
var bg = chrome.extension.getBackgroundPage();
bg.test(); // 访问bg的函数
alert(bg.document.body.innerHTML); // 访问bg的DOM
```
至于background访问popup如下（前提是popup已经打开）：
``` javascript
var views = chrome.extension.getViews({type:'popup'});
if(views.length > 0) {
 console.log(views[0].location.href);
}
```
popup或者bg向content主动发送消息
background.js或者popup.js：
``` javascript
function sendMessageToContentScript(message, callback)
{
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
 {
  chrome.tabs.sendMessage(tabs[0].id, message, function(response)
  {
   if(callback) callback(response);
  });
 });
}
sendMessageToContentScript({cmd:'test', value:'你好，我是popup！'}, function(response)
{
 console.log('来自content的回复：'+response);
});
```
content-script.js接收：
``` javascript
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
 // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
 if(request.cmd == 'test') alert(request.value);
 sendResponse('我收到了你的消息！');
});
```
双方通信直接发送的都是JSON对象，不是JSON字符串，所以无需解析，很方便（当然也可以直接发送字符串）。

### content-script主动发消息给后台
content-script.js：
``` javascript
chrome.runtime.sendMessage({greeting: '你好，我是content-script呀，我主动发消息给后台！'}, function(response) {
 console.log('收到来自后台的回复：' + response);
});
```
background.js 或者 popup.js：
``` javascript
// 监听来自content-script的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
 console.log('收到来自content-script的消息：');
 console.log(request, sender, sendResponse);
 sendResponse('我是后台，我已收到你的消息：' + JSON.stringify(request));
});
```
注意事项：
::: warning
* content_scripts向popup主动发消息的前提是popup必须打开！否则需要利用background作中转；
* 如果background和popup同时监听，那么它们都可以同时收到消息，但是只有一个可以sendResponse，一个先发送了，那么另外一个再发送就无效；  
::: 
### injected script和content-script  
content-script和页面内的脚本（injected-script自然也属于页面内的脚本）之间唯一共享的东西就是页面的DOM元素，有2种方法可以实现二者通讯：

可以通过window.postMessage和window.addEventListener来实现二者消息通讯；
通过自定义DOM事件来实现；
injected-script中：
``` javascript
window.postMessage({"test": '你好！'}, '*');
```
content script中：
``` javascript
window.addEventListener("message", function(e)
{
 console.log(e.data);
}, false);
```
### 长连接和短连接
其实上面已经涉及到了，这里再单独说明一下。Chrome插件中有2种通信方式，
* 一个是短连接（chrome.tabs.sendMessage和chrome.runtime.sendMessage），
* 一个是长连接（chrome.tabs.connect和chrome.runtime.connect）。

短连接的话就是挤牙膏一样，我发送一下，你收到了再回复一下，如果对方不回复，你只能重新发，而长连接类似WebSocket会一直建立连接，
双方可以随时互发消息。
短连接上面已经有代码示例了，这里只讲一下长连接。
``` javascript
//popup.js：
getCurrentTabId((tabId) => {
 var port = chrome.tabs.connect(tabId, {name: 'test-connect'});
 port.postMessage({question: '你是谁啊？'});
 port.onMessage.addListener(function(msg) {
  alert('收到消息：'+msg.answer);
  if(msg.answer && msg.answer.startsWith('我是'))
  {
   port.postMessage({question: '哦，原来是你啊！'});
  }
 });
});
```
``` javascript
//content-script.js：
// 监听长连接
chrome.runtime.onConnect.addListener(function(port) {
 console.log(port);
 if(port.name == 'test-connect') {
  port.onMessage.addListener(function(msg) {
   console.log('收到长连接消息：', msg);
   if(msg.question == '你是谁啊？') port.postMessage({answer: '我是你爸！'});
  });
 }
});
```
## 其它补充

### 获取当前窗口ID
``` javascript
chrome.windows.getCurrent(function(currentWindow)
{
 console.log('当前窗口ID：' + currentWindow.id);
});
```
### 获取当前标签页ID
``` javascript
// 获取当前选项卡ID
function getCurrentTabId(callback)
{
 chrome.tabs.query({active: true, currentWindow: true}, function(tabs)
 {
  if(callback) callback(tabs.length ? tabs[0].id: null);
 });
}
```
### 本地存储

本地存储建议用chrome.storage而不是普通的localStorage，最重要的2点区别是：
* chrome.storage是针对插件全局的，即使你在background中保存的数据，在content-script也能获取到；
* chrome.storage.sync可以跟随当前登录用户自动同步，这台电脑修改的设置会自动同步到其它电脑，很方便，如果没有登录或者未联网则先保存到本地，等登录了再同步至网络；  

需要声明storage权限，有chrome.storage.sync和chrome.storage.local2种方式可供选择，使用示例如下：
``` javascript
// 读取数据，第一个参数是指定要读取的key以及设置默认值
chrome.storage.sync.get({color: 'red', age: 18}, function(items) {
 console.log(items.color, items.age);
});
// 保存数据
chrome.storage.sync.set({color: 'blue'}, function() {
 console.log('保存成功！');
});
```

### webRequest
通过webRequest系列API可以对HTTP请求进行任性地修改、定制，这里通过beforeRequest来简单演示一下它的冰山一角：
``` json
//manifest.json
{
 // 权限申请
 "permissions":
 [
  "webRequest", // web请求
  "webRequestBlocking", // 阻塞式web请求
  "storage", // 插件本地存储
  "http://*/*", // 可以通过executeScript或者insertCSS访问的网站
  "https://*/*" // 可以通过executeScript或者insertCSS访问的网站
 ],
}
```
``` javascript
// background.js
// 是否显示图片
var showImage;
chrome.storage.sync.get({showImage: true}, function(items) {
 showImage = items.showImage;
});
// web请求监听，最后一个参数表示阻塞式，需单独声明权限：webRequestBlocking
chrome.webRequest.onBeforeRequest.addListener(details => {
 // cancel 表示取消本次请求
 if(!showImage && details.type == 'image') return {cancel: true};
 // 简单的音视频检测
 // 大部分网站视频的type并不是media，且视频做了防下载处理，所以这里仅仅是为了演示效果，无实际意义
 if(details.type == 'media') {
  chrome.notifications.create(null, {
   type: 'basic',
   iconUrl: 'img/icon.png',
   title: '检测到音视频',
   message: '音视频地址：' + details.url,
  });
 }
}, {urls: ["<all_urls>"]}, ["blocking"]);

```





参考链接:
* [https://developer.chrome.com/docs/extensions/](https://developer.chrome.com/docs/extensions/)