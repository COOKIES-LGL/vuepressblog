---
home: false
---

* [高频使用的npm包](./common-use-npm) <span style="color:#bbb; float:right">2022-02-10</span>

### https://www.npmjs.com/ 登陆通行key

::: tip
a10f91d9caceb99b42e02939b65383a24636618d9e8b4d2a4a5aef1ded9f4323
59cb94abf01531e2372ea509815d33b3e0ed920c62b4ebcad70cf71796e10ab0
42048040dc187f85fbbb77027ef3c09ad2f18126e01dacbb1a52275f68a7c785
47a2d47060b6db99ff123bce9d63410d1601d0e0dd41cdf543cf93e2f3fbf9da
2168994a69337937328c3160237fe4afe805db4567a0ef5cbe011a07f6e7fed3
:::

:::tip
112278114e8574249c83fb75075ce7a81e61a4d410528022e1e302b7a1e25433
3a7af25fc4f806e33ba616acbbb36fd5bd4eafa9728a32924209fc00aa81cbef
3e97b73765c682c5c011dbb0cdae0ae97de0215cd0c77f2f29cfc49effd8288e
25127cf7808b16164de9604bb15eacc0961c1d804aa7307a98ed550efedf710f
afbe64d25823c47593a997ffaecea7c20f59d29d1c1e7fb1c03662e3285d3f54
:::

### npm update

已经存在node_modules时 npm install 不会更新 ^的版本控制，需要使用npm update. 或者删除node_modules进行更新

npm update命令的目的是根据您在package.json文件中指定的内容更新您的package-lock.json。这是正常行为。
如果你想更新你的package.json文件，你可以使用npm-check-updates
> npm install -g npm-check-updates.  

然后可以使用以下命令：

- ncu检查package.json文件中的更新
- ncu -u更新package.json文件
- npm update --save从package.json文件更新package-lock.json文件

### yarn deduplicate

Yarn-deduplicate是一款npm包，它可以帮助我们自动解决项目中遇到的同一依赖重复问题，可以有效地保证我们项目的稳定性和安全性。

### npm 设置仓库源
``` bash
npm config set registry [https://registry.npmjs.org/](https://registry.npmjs.org/)
```

### 使npm包同时支持多种模块类型

要使 npm 包同时适配 commonJS 和 esModule，可以在 package.json 的 "main" 字段中指定 commonJS 版本的入口文件，同时在 "module" 字段中指定 esModule 版本的入口文件。例如：
``` json
{
  "name": "my-package",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js"
}
```

知识点：
（1）.mjs文件总是以 ES6 模块加载，.cjs文件总是以 CommonJS 模块加载，.js文件的加载取决于package.json里面type字段的设置。
（2）ES6 模块与 CommonJS 模块尽量不要混用。require命令不能加载.mjs文件，会报错，只有import命令才可以加载.mjs文件。反过来，.mjs文件里面也不能使用require命令，必须使用import。

### npm ls --depth=0
可以使用 npm ls --depth=0 命令查看项目中的幽灵依赖

### npm list package
展示当前package的安装情况 

::: tip
这个工程位于我们主工程的目录底下，
这里要用到的依赖包，如果本工程没有安装，
则会自动查找上层目录，
也就是，外层安装了的话就可用。
另外，找到根目录也没有的话还会查看全局安装，都没有的时候才会报错 
:::

如果通过路径进行安装会出现循环依赖问题
以下安装方式

``` bash
npm install --save-dev ../../npm-plugin/index.js
```

因为 demo 工程位于 package 工程目录下，
会导致递归引用。
仅当不在同一路径下创建新工程时可以。

因此我们可以直接在项目文件中按文件路径引入 或者使用npx link引入

``` json
{
  "resolutions": {
    "**/typescript": "^5.3.3"
  },
}
// 可以用来限制某个开发包的 依赖包版本
```

### package.json 中配置 workspaces
单个代码库中统一管理多个包（monorepo），在workspaces声明目录下的package会软链到根目录的node_modules中。

1. 初始化项目
> npm init -y
2. 声明本项目是workspaces模式
``` json
{
  "private": "true",
  "workspaces": [
    "packages/*" 
  ]
}
```
3. 创建子包 package1
``` bash
npm init -w packages/package1 -y
```
package-lock.json 中可以看到软链link
``` json
{
  "packages": {
    "node_modules/package1": {
      "resolved": "packages/package1",
      "link": true
    },
  }
}
```
4. 创建子包 package2
``` bash
npm init -w packages/package2 -y
```
5. 将子包package1添加到package2中
``` bash
npm i p1 -w p2
```
workspaces功能与lerna类似，如果只需简单地管理多个包，workspaces足够了。lerna具有版本管理，发包提示，简化多包项目发布流程等更多功能。
