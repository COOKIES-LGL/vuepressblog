### 1、日期兼容性

安卓系统下 可以
Date.parse(new Date('2018-03-30 12:00:00'))  
ios 系统下 报错
Date.parse(new Date('2018-03-30 12:00:00'))

```javascript
// 兼容写法
function formatTimeStamp(time) {
  return Date.parse(new Date("2018/03/30 12:00:00")) || Date.parse(new Date("2018-03-30 12:00:00"));
}
```

### 2、input 框聚焦，ios 出现 outline 或者阴影，安卓显示正常

```css
input:focus {
  outline: none;
}
input: {
  -webkit-appearance: none;
}
```

### 3、input 的 placeholder 属性会使文本位置偏上

```css
line-height: （和input框的高度一样高）---pc端解决方法 line-height：normal ---移动端解决方法;
```

### 4、ios 设置 input 按钮样式会被默认样式覆盖

```css
input,
textarea {
  border: 0;
  -webkit-appearance: none;
}
```

### 5、iOS 系统中，中文输入法输入英文时，字母之间可能会出现一个六分之一空格

```javascript
this.value = this.value.replace(/\u2006/g, "");
```

### 6、移动端点透问题

::: tip
touchstart 早于 touchend 早于 click。 亦即 click 的触发是有延迟的，这个时间大概在 300ms 左右，也就是说我们 tap 触发之后蒙层隐藏， 此时 click 还没有触发，300ms 之后由于蒙层隐藏，我们的 click 触发到了下面的 a 链接上。解决：

- 1、尽量都使用 touch 事件来替换 click 事件。例如用 touchend 事件(推荐)。
- 2、用 fastclick https://github.com/ftlabs/fastclick
- 3、用 preventDefault 阻止 a 标签的 click

:::

### 7、Android 下取消输入语音按钮

```css
input::-webkit-input-speech-button {
  display: none;
}
```

### 8、ios Android 监听键盘弹起事件

```js
if (window.visualViewport) {
  window.visualViewport?.addEventListener("resize", listener);
  window.visualViewport?.addEventListener("scroll", listener);
} else {
  window.addEventListener("resize", listener);
}
```

### 9、常用的 meta 属性设置

```html
<meta name="screen-orientation" content="portrait" /> // Android 禁止屏幕旋转
<meta name="full-screen" content="yes" /> // 全屏显示
<meta name="browsermode" content="application" /> //
UC应用模式，使用application后，页面默认全屏，禁止长按菜单，禁止收拾，标准排版，以及强制图片显示。
```

### 10、清除输入框内阴影

```css
div {
  -webkit-appearance: none;
}
```

### 11、如何禁止保存或拷贝图像

```css
img {
  -webkit-touch-callout: none;
}
```

### 12、设置字体禁止缩放

```css
body {
  -webkit-text-size-adjust: 100% !important;
  text-size-adjust: 100% !important;
  -moz-text-size-adjust: 100% !important;
}
```

### 13、IOS 键盘收起时页面没用回落，底部会留白

```js
window.addEventListener("focusout", function () {
  window.scrollTo(0, 0);
});

//input输入框弹起软键盘的解决方案。
var bfscrolltop = document.body.scrollTop;
$("input")
  .focus(function () {
    document.body.scrollTop = document.body.scrollHeight;
    //console.log(document.body.scrollTop);
  })
  .blur(function () {
    document.body.scrollTop = bfscrolltop;
    //console.log(document.body.scrollTop);
  });
```

### 14、IOS 下 fixed 失效的原因

软键盘唤起后，页面的 fixed 元素将失效，变成了 absolute，所以当页面超过一屏且滚动时，失效的 fixed 元素就会跟随滚动了。不仅限于 type=text 的输入框，凡是软键盘（比如时间日期选择、select 选择等等）被唤起，都会遇到同样地问题。

解决方法: 不让页面滚动，而是让主体部分自己滚动,主体部分高度设为 100%，overflow:scroll

```html
<body>
  <div class='warper'>
    <div class='main'></div>
  <div>
  <div class="fix-bottom"></div>
</body>
<style>
  .warper {
  position: absolute;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch; /* 解决ios滑动不流畅问题 */
}
.fix-bottom {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
```
