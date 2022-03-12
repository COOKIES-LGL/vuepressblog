## 增加按钮可点击区域
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
## 用户选择文本
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
## 充分利用onerror事件
``` HTML
<!-- 我们可以给img元素添加一个onerror事件。
加载图片时出现了错误，那么我们可以通过 onerror事件给该元素添加一个样式，并使用404图片。 -->
<img src="https://miro.medium.com/xxx.jpg" alt='fireworks picture' onerror="this.classList.add('error');">
```

## 固定定位元素
``` HTML
<!-- 给固定定位元素的父元素设置 transform: scale(1), 可让固定定位相较于父元素定位 -->
transform: scale(1);
<!-- 设置固定定位后元素的宽度会不确定, 设置100%时会溢出,因此设置left:0 right:0 可以解决 -->
left: 0;
right: 0;
```