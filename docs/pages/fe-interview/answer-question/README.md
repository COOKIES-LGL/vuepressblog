---
home: false
sidebar: false
---

### 为啥使用 img gif 做埋点

- img 兼容性好
- 无需挂载到页面上，反复操作 dom
- img 的加载不会阻塞 html 的解析，但 img 加载后并不渲染，它需要等待 Render Tree 生成完后才和 Render Tree 一起渲染出来
- 注：通常埋点上报会使用 gif 图，合法的 GIF 只需要 43 个字节

###
