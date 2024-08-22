---
home: false
---

## vite 使用笔记

[Vite是如何实现Esbuild打包的](https://segmentfault.com/a/1190000043980887)  
[Vite工作原理](https://juejin.cn/post/7350936959059722280?utm_source=gold_browser_extension)  
[rollup打包原理](https://www.baidu.com/link?url=qSPsxiW5_Rboe-4tNN26ObiF8LoQFgnyDX8zMl7HZHYClDlr1eq37JL-4hpDSab5WUqwB7iqfo8Y4VnKAtXBla&wd=&eqid=d2f2c99500896c100000000565e43fbb)  
[Vite配置Https启动服务](https://blog.csdn.net/weixin_44786530/article/details/135893697)  
[vite和webpack热更新的区别](https://juejin.cn/post/7338042858702618678?utm_source=gold_browser_extension#heading-14) 
[vite官方文档](https://cn.vitejs.dev/guide/)
### vite 支持 require

1、安装插件vite-plugin-require-transform
``` bash
yarn add -D vite-plugin-require-transform
```

2、vite.config.js
``` js
import requireTransform from 'vite-plugin-require-transform';
module.exports = {
    plugins: [
        vue(),
        requireTransform({
            fileRegex: /.js$|.vue$/
        })
    ]
}
```

### babel/traverse 
不支持es Module 可以从babel/core引入traverse
没有遍历所有节点, 需要自行编写遍历代码

::: tip
有些三方包没有默认导出 可以使用import * as babel from 'babel/core' 进行导入
:::

### plugin

``` bash
npm i -D unplugin-auto-import
```
是基于 unimport 开发，这个插件可以帮助开发者在代码中直接使用Vue核心库的功能，而不需要显式地导入它们。
``` ts
// vite.config.ts
import AutoImport from 'unplugin-auto-import/vite'

export default defineConfig({
  plugins: [
    AutoImport({ /* options */ }),
  ],
})
```
### vite本地开发支持https

**前置条件** 

安装了 mkcert 并且添加了它的可执行文件到系统的 PATH 中。

``` bash
brew install mkcert
# Homebrew安装mkcert
mkcert -install
# 添加本地CA到系统的根证书颁发机构
```

安装插件
``` bash
npm i -D vite-plugin-mkcert
```
配置vite.config.ts
``` ts
// vite.config.ts
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [
    mkcert({ /* options */ }),
  ],
})
```

###  使用 banner 或 footer 选项添加 import 语句
``` js
config.output = {
  ...config.output,
  banner: `require('./index.css');\n` // 在打包的后 JS 文件顶部插入 import 语句
}
```

