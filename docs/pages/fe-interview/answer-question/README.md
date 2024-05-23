---
home: false
sidebar: false
---

### 为啥使用img gif 做埋点

- img兼容性好
- 无需挂载到页面上，反复操作dom
- img的加载不会阻塞html的解析，但img加载后并不渲染，它需要等待Render Tree生成完后才和Render Tree一起渲染出来
- 注：通常埋点上报会使用gif图，合法的 GIF 只需要 43 个字节

###
