---
sidebar: auto
---

### pnpm 搭建 Monorepo 环境

#### 全局安装 pnpm

```bash
npm install pnpm -g
```

然后在项目下使用 pnpm init 进行 package.json 的初始化。
这跟 npm init 是一样的。

```bash
pnpm init
```

得到 package.json 初始内容，然后把 package.json 中的 name 属性删掉，并且添加一个 "private": true 属性，因为它是不需要发布的。

```json
{
  "private": true,
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo "Error: no test specified" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

### 配置 pnpm 的 monorepo 工作区

在我们这个仓库下，我们需要管理多个项目，就可以采用 pnpm 的 monorepo。我们在仓库的根目录下创建一个 pnpm-workspace.yaml 文件，可以在 pnpm-workspace.yaml 配置文件中指定这个仓库中有多少个项目。

```json
packages:
  - play # 存放组件测试的代码
  - docs # 存放组件文档
  - packages/* # packages 目录下都是组件包
```

可以在 play 目录中运行我们写好的组件，相当于一个测试环境，在开发的时候可以知道效果是否达到预期；
还需要一个组件说明文档的项目目录：docs;
packages 目录则是所有组件的项目目录了，在 packages 目录中又可以放很多包的项目目录，比如，组件包目录：components、主题包目录：theme-chalk、工具包目录：utils 等。然后每一个包目录里面也需要一个 package.json 文件进行声明这是一个 NPM 包目录。所以我们需要进入每个包目录进行初始一个 package.json 文件。以 components 包为例，我们进入到 components 目录底下初始化一个 package.json 文件，更改包名：@elemnet-plus/components。文件内容如下：

```json
{
  "name": "@elemnet-plus/components",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo "Error: no test specified" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

其他两个的包名则分别为：@elemnet-plus/theme-chalk 和 @elemnet-plus/utils，创建过程同上。
至此我们一个初步搭建的项目目录结构如下：

```json
|── README.md
├── package.json
├── packages
│   ├── components
│   │   └── package.json
│   ├── theme-chalk
│   │   └── package.json
│   └── utils
│       └── package.json
├── play
└── pnpm-workspace.yaml
```

仓库项目内的包相互调用
@elemnet-plus/components、
@elemnet-plus/theme-chalk、
@elemnet-plus/utils 这几个包要互相进行调用呢，就需要把它们安装到仓库根目录下的 node_modules 目录中。
然后我们在根目录下进行安装操作。

```bash
pnpm install @elemnet-plus/components -w
pnpm install @elemnet-plus/theme-chalk -w
pnpm install @elemnet-plus/utils -w
```

-w 表示安装到共公模块的 packages.json 中，也就是根目录下的 packages.json。
安装后根目录下的 package.json 的内容为：

```json
{
  "dependencies": {
    "@elemnet-plus/components": "workspace:*",
    "@elemnet-plus/theme-chalk": "workspace:*",
    "@elemnet-plus/utils": "workspace:*"
  }
}
```

注意：workspace:\* 将来发布的时候会被转换成具体的版本号。
TypeScript 初始化配置文件
接下来继续安装一些我们开发时所需要的依赖。

```bash
pnpm install vue typescript @types/node -D -w
```

因为 vue 、 typescript 和 @types/node 只是开发环境需要的，所以安装的时候需要添加一个 -D 参数表示安装到开发环境，-w 表示安装到共公模块的 packages.json 中，也就是根目录下的 packages.json。
因为我们使用了 TypeScript，这样我们想要去校验我们的代码，让我们代码有提示，并且可以按照一些规则来解析我们的语法，给我们更友好的提示，我们就需要去初始化一下这个 TypeScript 配置命令。 又因为我们安装了 typescript，所以在 node_modules 目录下 bin 目录里面就会存在一个 tsc 的命令，这个命令，就可以帮我们进行初始化，我们可以使用

```bash
/** 来初始化 */
npm tsc --init
/** 也可以使用 */
pnpm tsc --init
```

那么执行这个命令，它就会去 node_modules 目录下 bin 目录找这个 tsc 命令进行执行。

```bash
pnpm tsc --init
```
