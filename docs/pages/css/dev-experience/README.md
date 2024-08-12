
### font-display

#### @font-face 后文本的渲染过程
- 下载 web font
- 在下载期间先用备选字体渲染
- web font 字体下载完成后使用该字体替换
实际这只是 @font-face 渲染方式的一种，而且不是默认的，@font-face 由 font-display属性决定 web font 在下载时间和可用时间是如何展示的
在字体下载比较慢的情况下
- 如果认为字体切换带来的闪烁不是问题，可以设置 font-display:swap;提前渲染文本
- 如果认为不一定要保障使用 web font 来渲染，那么无疑 font-display:optional;是最优选

#### 提前加载 web font
令人意外的是浏览器解析到 @font-face 声明时候并不会下载对应的字体，只有解析到使用了该 font-face 中定义字体的页面元素时，才会下载对应的字体这也就意味着把 @font-face 声明写在页面顶部是没有作用的，可以使用 preconnect 或者 preload 提前让浏览器提前建连和下载字体文件，尤其是在页面应用了流式渲染时候有奇效
``` html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" href="https://fonts.gstatic.com/s/roboto/v30/KFOkCnqEu92Fr1MmgVxFIzIXKMnyrYk.woff2" as="font" type="font/woff2" crossorigin>
```

####  unicode-range 子集化缩减 web font 体积
在 @font-face 内部可以使用 unicode-range 定义字体应用到的 Unicode 字符范围。这样可以将字体文件拆分成多个，当字符在定义的范围内时，浏览器才会下载并使用对应的字体文件
``` css
@font-face {
  font-family: 'MyFont';
  src: url('myfont.woff2') format('woff2');
  unicode-range: U+00-FF; /* 基本拉丁字母及扩展 */
}
```


#### position：sticky 无效的原因
- 缺少top、left、right或bottom属性：为了使position: sticky生效，你需要指定至少一个定位属性（如top、left、right或bottom），以定义元素在何时开始粘性定位。

- 父元素没有足够的内容或高度：如果父元素没有足够的内容或高度，导致没有滚动条，sticky定位可能不会生效，因为没有滚动行为来触发粘性定位。

- 父元素设置了overflow属性：如果元素的直接父元素或任何祖先元素设置了overflow: hidden或overflow: auto、scroll，这可能会创建一个新的格式化上下文（formatting context），导致sticky定位失效。

- 元素的祖先元素使用了transform属性：如果元素的任何祖先元素使用了transform属性，这可能会创建一个新的包含块（containing block），这会影响sticky定位的行为。

- position: sticky 仅在元素的父容器是块级元素（block-level element）时有效。如果父容器是内联元素（inline element），粘性定位将不起作用


