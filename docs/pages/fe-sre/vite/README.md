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

### babel/traverse 不支持es Module 可以从babel/core引入traverse

### babel/traverse 没有遍历所有节点, 需要自行编写遍历代码

### 有些三方包没有默认导出 可以使用import * as babel from 'babel/core' 进行导入
