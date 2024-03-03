---
home: false
---

## vite 使用笔记

[Vite是如何实现Esbuild打包的](https://segmentfault.com/a/1190000043980887)
[rollup打包原理](https://www.baidu.com/link?url=qSPsxiW5_Rboe-4tNN26ObiF8LoQFgnyDX8zMl7HZHYClDlr1eq37JL-4hpDSab5WUqwB7iqfo8Y4VnKAtXBla&wd=&eqid=d2f2c99500896c100000000565e43fbb)
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
