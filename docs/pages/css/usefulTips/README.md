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
``` CSS
/*
用户选择的CSS属性控制用户是否可以选择文本。如果它的值是 all，意味着一个元素的所有内容都将被原子化地选择。
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
``` HTML
<!-- 我们可以给img元素添加一个 onerror 事件。加载图片时出现了错误，那么我们可以通过 onerror事件给该元素添加一个样式，并使用404图片。 -->
<img src="https://miro.medium.com/xxx.jpg" alt='fireworks picture' onerror="this.classList.add('error');">
```