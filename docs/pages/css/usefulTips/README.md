### 增加按钮可点击区域
``` CSS
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
``` CSS
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
### 充分利用onerror事件
``` HTML
<!-- 我们可以给img元素添加一个onerror事件。
加载图片时出现了错误，那么我们可以通过 onerror事件给该元素添加一个样式，并使用404图片。 -->
<img src="https://miro.medium.com/xxx.jpg" alt='fireworks picture' onerror="this.classList.add('error');">
```

### 固定定位元素
``` HTML
<!-- 给固定定位元素的父元素设置 transform: scale(1), 可让固定定位相较于父元素定位 -->
transform: scale(1);
<!-- 设置固定定位后元素的宽度会不确定, 设置100%时会溢出,因此设置left:0 right:0 可以解决 -->
left: 0;
right: 0;
```
### 固定定位元素相对父标签
``` HTML
因为position： fixed 的是相对于浏览器视图窗口定位的，并且宽度是继承自浏览器视图窗口的总宽度，无法达到宽度自适应的效果
可以使用 position: sticky; 替换fixed 达到相对于父标签固定定位的功能

```
### 打印自动分页
``` html
<span>打印自动分页</span>
    <hr style="page-break-before:always; visibility:hidden" />
```
### 固定文本字符宽度
``` html
font-feature-setting:'tunm', 可以用来固定文本字符的宽度，
```
### clamp() 函数

::: tip
clamp() 函数的作用是把一个值限制在一个上限和下限之间，当这个值超过最小值和最大值的范围时，在最小值和最大值之间选择一个值使用。它接收三个参数：最小值、首选值、最大值。
:::
``` css
h1{
  font-size: clamp(5.25rem,8vw,8rem);
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

``` CSS
p{
  column-count: 3;
  column-gap: 5rem;          
  column-rule: 1px solid salmon; /* border between columns */
}
```