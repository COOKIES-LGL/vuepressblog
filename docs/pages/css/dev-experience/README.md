---
home: false
sidebar: false
---

### font-display

#### @font-face 设置后文本的渲染过程

- 下载 web font
- 在下载期间先用备选字体渲染
- web font 字体下载完成后使用该字体替换
  实际这只是 @font-face 渲染方式的一种，而且不是默认的，@font-face 由 font-display 属性决定 web font 在下载时间和可用时间是如何展示的
  在字体下载比较慢的情况下
- 如果认为字体切换带来的闪烁不是问题，可以设置 font-display:swap;提前渲染文本
- 如果认为不一定要保障使用 web font 来渲染，那么无疑 font-display:optional;是最优选

#### 提前加载 web font

令人意外的是浏览器解析到 @font-face 声明时候并不会下载对应的字体，只有解析到使用了该 font-face 中定义字体的页面元素时，才会下载对应的字体这也就意味着把 @font-face 声明写在页面顶部是没有作用的，可以使用 preconnect 或者 preload 提前让浏览器提前建连和下载字体文件，尤其是在页面应用了流式渲染时候有奇效

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="preload"
  href="https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgVxFIzIXKMnyrYk.woff2"
  as="font"
  type="font/woff2"
  crossorigin
/>
```

#### unicode-range 子集化缩减 web font 体积

在 @font-face 内部可以使用 unicode-range 定义字体应用到的 Unicode 字符范围。这样可以将字体文件拆分成多个，当字符在定义的范围内时，浏览器才会下载并使用对应的字体文件

```css
@font-face {
  font-family: "MyFont";
  src: url("myfont.woff2") format("woff2");
  unicode-range: U+00-FF; /* 基本拉丁字母及扩展 */
}
```

#### font-display：swap

来告诉浏览器字体文本立即使用系统字体，等自定义字体准备好再替换。可以避免 FOIT

```css
@font-face {
  font-display：swap
}
```

#### position：sticky 无效的原因

- 缺少 top、left、right 或 bottom 属性：为了使 position: sticky 生效，你需要指定至少一个定位属性（如 top、left、right 或 bottom），以定义元素在何时开始粘性定位。

- 父元素没有足够的内容或高度：如果父元素没有足够的内容或高度，导致没有滚动条，sticky 定位可能不会生效，因为没有滚动行为来触发粘性定位。

- 父元素设置了 overflow 属性：如果元素的直接父元素或任何祖先元素设置了 overflow: hidden 或 overflow: auto、scroll，这可能会创建一个新的格式化上下文（formatting context），导致 sticky 定位失效。

- 元素的祖先元素使用了 transform 属性：如果元素的任何祖先元素使用了 transform 属性，这可能会创建一个新的包含块（containing block），这会影响 sticky 定位的行为。

- position: sticky 仅在元素的父容器是块级元素（block-level element）时有效。如果父容器是内联元素（inline element），粘性定位将不起作用

### 常见的 css link

```html
<link href="example.css" rel="stylesheet" type="text/css" media="all" />
```

media 属性规定被链接文档将显示在什么设备上，利用这个属性就衍生出了很多优化方式。

1、比如将不同屏幕尺寸所需的 css 分开加载，可以缩小加载 css 文件的体积。

```html
<link
  href="example-pc.css"
  rel="stylesheet"
  type="text/css"
  media="screen and (min-width: 768px)"
/>
<link href="example-m.css" rel="stylesheet" type="text/css" media="screen and (max-width: 767px)" />
```

2、 尽可能的拆分主体样式文件，并将非关键的 css link 的 media 属性设置为 none
当 media 属性为 none 时，浏览器会以最低优先级加载此文件，并不会阻塞页面的渲染进程

```html
<link rel="stylesheet" href="footer.css" media="none" onload="this.media='all'" />
```

3、对于主体样式的预加载

```html
<link rel="preload" href="common.css" as="style" />
```

### purgecss

一个用来删除未使用的 CSS 代码的工具
[purgecss](https://www.purgecss.cn/)

### sass @use

@use 规则与 @import 规则不同。@import 规则是 Sass 较早提供的引入机制，它不支持命名空间，并且会将引入的文件内容全部复制到当前文件中。
而 @use 规则则提供了更好的封装和模块化支持，它允许你通过命名空间来访问引入的文件中的内容，从而避免了命名冲突和不必要的代码复制

### Flex 布局会默认

- 把所有子项变成水平排列。
- 默认不自动换行。
- 让子项与其内容等宽，并把所有子项的高度变为最高子项的高度

### 何时需要使用 width: 100% 和 height: 100%

- 宽度： 对于大多数块级元素，其宽度由父元素决定，通常无需设置 width: 100%。只有当元素脱离文档流（如 position: absolute）时，才需设置 width: 100%。
- 高度： 元素的高度通常由内容撑开。如果需要使高度由父元素决定，则需设置 height: 100%。

### html 元素继承 box-sizing

这样的好处在于他不会覆盖其他组件的 box-sizing 值，又无需为每一个元素重复设置 box-sizing:border-box;

```css
html {
  box-sizing: border-box;
}
*,
*:before,
*:after {
  box-sizing: inherit;
}
```
