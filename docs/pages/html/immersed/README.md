---
home: false
sidebar: false
---

### 沉浸式

**沉浸式状态栏是指在应用程序中，将状态栏的背景色和应用程序的背景色融合在一起，从而让应用程序的界面更加整洁美观**

#### H5 页面设置沉浸式状态栏 `theme-color`

theme-color 是一个专门为移动设备设计的 meta 标签，用于设置网站的主题色，可以改变浏览器地址栏、任务管理器等的颜色。  
目前，theme-color 标签的兼容性已经非常好，几乎所有主流的移动设备和浏览器都支持它。  
H5 页面可以通过设置 meta 标签来设置浏览器顶部状态栏颜色。具体的做法是在页面的 head 标签中添加以下 meta 标签：

```html
<html>
  <head>
    <meta name="theme-color" content="#ffffff" />
  </head>
</html>
<script>
  // 获取meta标签
  var meta = document.querySelector('meta[name="theme-color"]');
  // 修改颜色值
  meta.setAttribute("content", "#颜色值");
</script>
```

### 设置 paddingTop 值

获取到状态栏高度后，就可以设置页面的根布局组件的 paddingTop 值了

### H5 开发获取键盘是否显示

```js
function isInput(element: Element | null) {
  return element && ["INPUT", "TEXTAREA"].includes(element.tagName.toUpperCase());
}

// 获取键盘是否显示
export function isKeyboardShow() {
  return isInput(document.activeElement);
}

// 隐藏键盘
export function hideKeyboard() {
  // @ts-ignore
  isInput(document.activeElement) && document.activeElement.blur();
}
```
