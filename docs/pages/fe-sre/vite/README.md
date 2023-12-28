---
home: false
---

## vite 使用笔记


### vite 支持 require

1、安装插件vite-plugin-require-transform
``` bash
yarn add -D vite-plugin-require-transform
```

2、vite.config.js
``` js
import requireTransform from 'vite-plugin-require-transform';
plugins: [
    vue(),
    requireTransform({
        fileRegex: /.js$|.vue$/
    })
],

```
