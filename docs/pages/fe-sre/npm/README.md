---
home: false
---

- [高频使用的 npm 包](./common-use-npm) <span style="color:#bbb; float:right">2022-02-10</span>

### https://www.npmjs.com/ 登陆通行 key

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

已经存在 node_modules 时 npm install 不会更新 ^的版本控制，需要使用 npm update. 或者删除 node_modules 进行更新

npm update 命令的目的是根据您在 package.json 文件中指定的内容更新您的 package-lock.json。这是正常行为。
如果你想更新你的 package.json 文件，你可以使用 npm-check-updates

> npm install -g npm-check-updates.

然后可以使用以下命令：

- ncu 检查 package.json 文件中的更新
- ncu -u 更新 package.json 文件
- npm update --save 从 package.json 文件更新 package-lock.json 文件

### yarn deduplicate

Yarn-deduplicate 是一款 npm 包，它可以帮助我们自动解决项目中遇到的同一依赖重复问题，可以有效地保证我们项目的稳定性和安全性。

### npm 设置仓库源

```bash
npm config set registry [https://registry.npmjs.org/](https://registry.npmjs.org/)
```

### 使 npm 包同时支持多种模块类型

要使 npm 包同时适配 commonJS 和 esModule，可以在 package.json 的 "main" 字段中指定 commonJS 版本的入口文件，同时在 "module" 字段中指定 esModule 版本的入口文件。例如：

```json
{
  "name": "my-package",
  "main": "dist/cjs/index.js",
  "module": "dist/esm/index.js"
}
```

知识点：
（1）.mjs 文件总是以 ES6 模块加载，.cjs 文件总是以 CommonJS 模块加载，.js 文件的加载取决于 package.json 里面 type 字段的设置。
（2）ES6 模块与 CommonJS 模块尽量不要混用。require 命令不能加载.mjs 文件，会报错，只有 import 命令才可以加载.mjs 文件。反过来，.mjs 文件里面也不能使用 require 命令，必须使用 import。

### npm ls --depth=0

可以使用 npm ls --depth=0 命令查看项目中的幽灵依赖

### npm list package

展示当前 package 的安装情况

::: tip
这个工程位于我们主工程的目录底下，
这里要用到的依赖包，如果本工程没有安装，
则会自动查找上层目录，
也就是，外层安装了的话就可用。
另外，找到根目录也没有的话还会查看全局安装，都没有的时候才会报错
:::

如果通过路径进行安装会出现循环依赖问题
以下安装方式

```bash
npm install --save-dev ../../npm-plugin/index.js
```

因为 demo 工程位于 package 工程目录下，
会导致递归引用。
仅当不在同一路径下创建新工程时可以。

因此我们可以直接在项目文件中按文件路径引入 或者使用 npx link 引入

```json
{
  "resolutions": {
    "**/typescript": "^5.3.3"
  }
}
// 可以用来限制某个开发包的 依赖包版本
```

### npm 查看依赖包版本信息

```bash
npm list express versions
# 查看express所有版本
npm view express versions
# 查询到npm服务器上对应查询包express的版本所有信息‌
npm view express version
# 查看express当前安装的版本信息
```

### package.json 中配置 workspaces

单个代码库中统一管理多个包（monorepo），在 workspaces 声明目录下的 package 会软链到根目录的 node_modules 中。

1. 初始化项目
   > npm init -y
2. 声明本项目是 workspaces 模式

```json
{
  "private": "true",
  "workspaces": ["packages/*"]
}
```

3. 创建子包 package1

```bash
npm init -w packages/package1 -y
```

package-lock.json 中可以看到软链 link

```json
{
  "packages": {
    "node_modules/package1": {
      "resolved": "packages/package1",
      "link": true
    }
  }
}
```

4. 创建子包 package2

```bash
npm init -w packages/package2 -y
```

5. 将子包 package1 添加到 package2 中

```bash
npm i p1 -w p2
```

workspaces 功能与 lerna 类似，如果只需简单地管理多个包，workspaces 足够了。lerna 具有版本管理，发包提示，简化多包项目发布流程等更多功能。

### npm home、 npm repo

```bash
# npm home 查看官网
npm home express
# npm repo 打开代码仓库
npm repo react
```

### yarn why、npm why

```bash
# yarn why命令的输出结果通常包括以下几个部分：
# ‌包名‌：你查询的包名。
# ‌版本‌：安装的包版本。
# ‌原因‌：显示了哪个包（及其版本）依赖于这个包。如果有多个依赖路径，它会列出所有路径。
# ‌依赖树‌：有时，Yarn还会显示一个简化的依赖树，帮助你更直观地理解依赖关系。
yarn why express
```

### yarn why-not、npm why-not

```bash
# npm why-not命令的输出结果通常包括以下几个部分：
# ‌包名和版本‌：你查询的包名及其特定版本。
# ‌当前安装版本‌：项目中实际安装的包版本。
# ‌依赖路径‌：显示了哪个包（及其版本）依赖于该包的另一个版本，以及这个依赖关系是如何在依赖树中形成的。
# ‌版本解析信息‌：有时，npm还会提供关于为什么选择了当前版本而不是你查询的版本的信息，比如版本冲突、语义化版本控制规则等。
npm why-not lodash@5.0.0
```

### npm outdated

检查项目中哪些包已经过时，有可用的更新版本。

### .npmignore

发布 npm 时指定需要上传的文件或者目录。如果你有少数不上传的文件，那可以创建一个.npmignore 文件（类似于.gitignore，但该文件不会上传 npm），去掉你不需要上传的文件。

- 注意 package.json 的 files 字段可以覆盖.npmignore。

```json
{
  "files": ["dist/", "package.json", "README.md"]
}
```

### npm --filter

使用通配符时匹配批量操作

```bash
npm install --filter @my/*
# 安装所有符合 @my/* 模式的包
npm update --filter react-*
# 更新所有符合 react-* 模式的包
npm --filter \"./packages/*\" run build
# 子包目录执行build
```

### 给指定的 scope 配置源

```bash
@afa:registry = https://registry.npmmirror.com
```

### 单独限制源

```json
{
  "resolutions": {
    "globby": "npm:@nat/globby@^11.1.0"
  }
}
```

### run-s

用于顺序执行多个在 `package.json` 文件的 `scripts` 部分定义的脚本命令

```bash
{
  "test": "run-s test:*",
  # 执行test前缀的所有命令
}
```
