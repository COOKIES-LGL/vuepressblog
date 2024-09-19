---
home: false
---

## chrome 模糊知识汇总

### 浏览器一轮循环流程

::: tip
一个 task(宏任务) -- 这个开始时的宏任务也叫同步任务  
队列中全部 job(微任务) --  
requestAnimationFrame --  
浏览器重排/重绘 --  
requestIdleCallback --
task(宏任务)  
:::

[彻底搞懂 EventLoop 事件循环机制(浏览器和 Node EventLoop)](https://www.zhihu.com/tardis/bd/art/582586289)

### sessionStorage 不在多个窗口或标签页之间共享数据

sessionStorage 不能在多个窗口或标签页之间共享数据，但是当通过 window.open 或链接打开新页面时(不能是新窗口)，新页面会复制前一页的 sessionStorage，window.open 新打开的页面新增的 sessionStorage 值，在父页面是无法访问的。localStorage 能够共享数据。

- windows.open(, ‘\_blank’): A 跳到 B，B 拷贝 A 的 sessionStorage，互不影响。
- windows.open(, ‘\_self’): A 刷新到 B，A 和 B 共用 sessionStorage，肯定影响。
- link（‘\_blank’）: A 跳到 B，B 不拷贝 A 的 sessionStorage，互不影响。
- link（‘\_self’）: A 刷新到 B，A 和 B 共用 sessionStorage，肯定影响。

```sh
chrome://version/
# 用于查看可执行文件路径和版本信息
```
