---
sidebar: auto
---
### live code debug
1、目前因跨域限制本地开发环境（localhost:4200）只能连接到 test 环境。
2、Live等环境的代码经过Babel转化和压缩后调试困难，不利于排查问题。
3、因此下文主要介绍如何使用本地开发环境调试线上(live、staging、uat等)数据。

### 思路
访问线上环境时通过 Charles 映射线上请求的 vendor.js 和 seller.js 为本地 localhost 对应的路径。

### 配置 Charles

#### Rewrite
1. 点击 Charles 的 Tools -> Rewrite... (快捷键：⌘⌥R)。
2. 点击 Import 导入 sc-rewrite.xml。
3. 勾选 Enable Rewrite。
完成之后的效果应该是这样： 
<img :src="$withBase('./images/daily-blog/debug-live-code1.png')">

#### Map Remote
1. 点击 Charles 的 Tools -> Map Remote... (快捷键：⌘⌥M)。 
2. 点击 Import 导入 sc-map.xml。
3. 勾选 Enable Map Remote。
完成之后的效果应该是这样：
<img :src="$withBase('./images/daily-blog/debug-live-code2.png')">

### 调试步骤
1、修改 environment.local.js 文件：
``` javascript
module.exports = {
  COUNTRY: 'sg',
  shopeeEnvironment: 'live'
};
```
2、使用 yarn dev 或 npm start 命令启动本地项目。
3、打开浏览器访问 https://seller.shopee.sg。
4、修改本地文件后重新刷新浏览器。
5、当需要切换国家或者 staging 和 live 时，修改 environment.local.js 即可。