### 增加按钮可点击区域

```CSS
/*增加按钮可点击区域*/
#btn::before {
  content: "";
  position: absolute;
  top: -20px;
  right: -20px;
  bottom: -20px;
  left: -20px;
}

```

### 用户选择文本

```CSS
/*
用户选择的CSS属性控制用户是否可以选择文本。如果它的值是all，意味着一个元素的所有内容都将被原子化地选择。
如果你想在文本被选中后添加一些额外的样式，你可以使用::selection 。
::selection CSS伪元素将样式应用于文档中被用户突出显示的部分（比如在文本上点击和拖动鼠标）。
*/
.all{
  user-select: all;
}
.all::selection{
  background-color: yellow;
  color: red;
}
```

### 充分利用 onerror 事件

```HTML
<!-- 我们可以给img元素添加一个onerror事件。
加载图片时出现了错误，那么我们可以通过 onerror事件给该元素添加一个样式，并使用404图片。 -->
<img src="https://miro.medium.com/xxx.jpg" alt='fireworks picture' onerror="this.classList.add('error');">
```

### 固定定位元素

```HTML
<!-- 给固定定位元素的父元素设置 transform: scale(1), 可让固定定位相较于父元素定位 -->
transform: scale(1);
<!-- 设置固定定位后元素的宽度会不确定, 设置100%时会溢出,因此设置left:0 right:0 可以解决 -->
left: 0;
right: 0;
```

### 固定定位元素相对父标签

```HTML
因为position： fixed 的是相对于浏览器视图窗口定位的，并且宽度是继承自浏览器视图窗口的总宽度，无法达到宽度自适应的效果
可以使用 position: sticky; 替换fixed 达到相对于父标签固定定位的功能

```

### 打印自动分页

```html
<span>打印自动分页</span>
<hr style="page-break-before:always; visibility:hidden" />
```

### 固定文本字符宽度

```html
font-feature-setting:'tunm', 可以用来固定文本字符的宽度，
```

### clamp() 函数

::: tip
clamp() 函数的作用是把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。它接收三个参数：最小值、首选值、最大值。
:::

```css
h1 {
  font-size: clamp(5.25rem, 8vw, 8rem);
}
```

### hyphens

::: tip
hyphens 告知浏览器在换行时如何使用连字符连接单词。可以完全阻止使用连字符，也可以控制浏览器什么时候使用，或者让浏览器决定什么时候使用。
hyphens: none | manual | auto
:::

### column count

::: tip
使用列属性为文本元素制作漂亮的列布局。
:::

```CSS
p{
  column-count: 3;
  column-gap: 5rem;
  column-rule: 1px solid salmon; /* border between columns */
}
```

### column count

::: tip
1、textContent innerText 都可以用来获取元素内文本,但 textConten 可以获取隐藏但元素. 一般使用 textContent
2、border-sizing: border-box; 在设置了宽 高才会生效
3、table 设置了 border-collapse:collapse 之后，设置 border-radius 没效果
4、tr、无法这是 padding td 、无法设置 margin
:::

### attr() css 实现 tooltip

attr() 属性是我最近发现的，且是最得意的发现。我本打算为我的站点添加 tooltip 的功能，但是发现需要引入一个插件，这就引入了不必要的东西，让我的站点看起来臃肿。感谢的是，可以使用 attr() 来避免这种情况。
attr() 属性工作的方式很简单，我逐步解析一下：

1、我们使用 tooltip class 去标志哪个元素需要展示 tooltip 信息。然后为该元素添加你喜欢的样式，这个方便演示，我们使用了 dotted border-bottom 的样式。
2、接下来，我们创建一个 :before 伪元素，它将包含内容 content，指向特定的 attr()。这里指 attr(tooltip-data)。
3、接着，我们会创建一个 :hover 伪类，当用户鼠标移动道元素上时，它将设置 opacity 为 1。

此外，你可以包含自定义的样式。这取决于你设定的 tooltp 的数据，你也许需要调整其宽度或者边距。一旦你设定了 tooptip-data arrt() 类，你可以在你设计的其他部分应用 [参考链接 ](https://juejin.cn/post/7089997204252786702)

```HTML
<h1>
  HTML/CSS tooltip
</h1>
<p>
  Hover <span class="tooltip" tooltip-data="Tooltip Content">Here</span> to see the tooltip.
</p>
<p>
  You can also hover <span class="tooltip" tooltip-data="This is another Tooltip Content">here</span> to see another example.
</p>
<style>
.tooltip {
  position: relative;
  border-bottom: 1px dotted black;
}
.tooltip:before {
  content: attr(tooltip-data);
  position: absolute;
  width: 250px;
  background-color: #efba93;
  color: #fff;
  text-align: center;
  padding: 15px;
  line-height: 1.1;
  border-radius: 5px;
  z-index: 1;
  opacity: 0;
  transition: opacity .5s;
  bottom: 125%;
  left: 50%;
  margin-left: -60px;
  font-size: 0.70em;
  visibility: hidden;
}

.tooltip:after {
  content: "";
  position: absolute;
  bottom: 75%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  opacity: 0;
  transition: opacity .5s;
  border-color: #000 transparent transparent transparent;
  visibility: hidden;
}

.tooltip:hover:before,
.tooltip:hover:after {
  opacity: 1;
  visibility: visible;
}
</style>

```

### 条件逻辑选择器。:is() 和 :where()

```CSS
:where(h2,h3,h4) > b {
  color: blue;
}

:is(h2):where(.content-title) {
  text-transform: uppercase;
}
```

### drop-shadow

drop-shadow 的工作方式是，其遵循给给定图片的 Alpha 通道。因此阴影是基于图片的内部形状，而不是显示在图片外面。

### :checked 伪类

我们使用 checkbox 输入类型，加上一个 :checked 伪类。
当 :checked 返回 true 的情况时，我们使用 transform 属性更改状态。

### HTML details 标签

```HTML
 <details>
    <summary>
      文章概要
    </summary>
    <div>文章内容文章内容文章内容文章内容文章内容文章内容文章内容文章内容</div>
  </details>
```

### 将自身的高度设置成自身的宽度

```CSS
.div-box {
  height: 100px;
  width: attr(height);
}

```

### 延迟hover执行&实现长按效果

现在转折来了，如果借用 CSS 就可以有效地避免上述问题，如下，先给需要触发的元素加一个有延时的transition
``` CSS
button:hover{
  opacity: 0.999; /*无关紧要的样式*/
  transition: 0s 1s opacity; /*延时 1s */
}
```
这里只需一个无关紧要的样式就行，如果opacity已经使用过了，可以使用其他的，比如transform:translateZ(.1px)，也是可行的。然后添加监听transitionend方法
``` javascript
GlobalEventHandlers.ontransitionend - Web API 接口参考 | MDN (mozilla.org)

el.addEventListener('transitionend', () => {
  // 具体逻辑
})
```
----------------------------------------------------------------
``` Css
button:hover:active{
  opacity: .999; /*无关紧要的样式*/
  transition: opacity 1s; /*延时 1s */
}
```
``` Javascript
el.addEventListener('transitionend', () => {
  // 具体逻辑
})
```

### 两端渐变透明的线条
``` Css
.class {
    border-right: 0.01rem solid #622f01;
    border-image: linear-gradient(transparent, #622f01, transparent) 5 5;
}
```

### 固定渐变高度，剩余部分纯色
``` Css
.class {
      background-image: linear-gradient(to bottom, #ffffff 0%, #ffffff 1.4rem, #fee9cd 2rem, #fee9cd);
}
```

### 渐变文字

``` Css
.class {
    background: radial-gradient(circle closest-side, #c36300, #713701);
    background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

### rotate(0deg) 解决边角无法hidden

``` Css 
.class {
        overflow: hidden;
        position: relative;
        transform: rotate(0deg);
}

```
