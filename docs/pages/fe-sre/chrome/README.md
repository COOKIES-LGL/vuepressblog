---
home: false
---
## chrome模糊知识汇总

### 浏览器一轮循环流程

::: tip
一个task(宏任务) -- 这个开始时的宏任务也叫同步任务  
队列中全部job(微任务) --   
requestAnimationFrame --   
浏览器重排/重绘 --   
requestIdleCallback --
task(宏任务)   
:::

[彻底搞懂EventLoop事件循环机制(浏览器和Node EventLoop)](https://www.zhihu.com/tardis/bd/art/582586289)

### sessionStorage 不在多个窗口或标签页之间共享数据
sessionStorage 不能在多个窗口或标签页之间共享数据，但是当通过 window.open 或链接打开新页面时(不能是新窗口)，新页面会复制前一页的 sessionStorage，window.open新打开的页面新增的sessionStorage值，在父页面是无法访问的。localStorage能够共享数据。
- windows.open(, ‘_blank’): A跳到B，B拷贝A的sessionStorage，互不影响。
- windows.open(, ‘_self’): A刷新到B，A和B共用sessionStorage，肯定影响。
- link（‘_blank’）: A跳到B，B不拷贝A的sessionStorage，互不影响。
- link（‘_self’）: A刷新到B，A和B共用sessionStorage，肯定影响。

``` sh
chrome://version/
# 用于查看可执行文件路径和版本信息
```

