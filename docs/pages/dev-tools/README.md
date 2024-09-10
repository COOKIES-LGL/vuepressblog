---
home: false
sidebar: false
---

## 开发提效工具

### 页面元素定位到代码

https://inspector.fe-dev.cn/guide/start.html#%E9%85%8D%E7%BD%AE

### 比 npm link 更高效的 npm 包调试工具 yalc

https://cloud.tencent.com/developer/article/1843716

### vite plugin 开发调试包

vite-plugin-inspect

### magic-string

对 AST 字符串做轻量替换

### vite-plugin-checker

vite 插件用来运行时校验 typescript 类型 eslint
[使用文档](https://vite-plugin-checker.netlify.app/introduction/introduction.html)

### class-validator

TS 类做参数校验

### cspell 单词拼写检查

https://www.npmjs.com/package/cspell

### ansi-escapes

[ansi-escapes](https://www.npmjs.com/search?q=ansi-escapes)
我们经常需要对终端输出进行控制，比如清空终端、移动光标等操作。而 npm 包 ansi-escapes 就是一个非常实用的工具，它提供了一系列 ANSI 转义码，可以让我们方便地对终端输出进行控制。

- ansiEscapes.cursorTo(x, y)：将光标移动到指定位置（x, y）处。
- ansiEscapes.cursorMove(dx, dy)：将光标沿水平和垂直方向分别移动 dx 和 dy 个单位。
- ansiEscapes.eraseLines(n)：删除从当前行开始的 n 行。
- ansiEscapes.clearScreen()：清空终端屏幕。
- ansiEscapes.clearTerminal()：清空终端屏幕并将光标移动到左上角。
- ansiEscapes.scrollUp(n)：向上滚动 n 行。
- ansiEscapes.scrollDown(n)：向下滚动 n 行。

### mute-stream 包

[mute-stream](https://www.npmjs.com/package/mute-stream)
