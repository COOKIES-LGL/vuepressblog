---
home: false
---

## package.json 知识点

### peerDependencies

用于指定当前包所依赖的其他包的版本要求，主要目的是通知用户或工具（如 npm 或 yarn）当前包需要特定版本的依赖包才能正常工作。 这些依赖并不会在安装当前包时自动安装，而是需要用户手动安装符合版本要求的依赖。
[对等依赖](https://zhuanlan.zhihu.com/p/666454541)

### bundledDependencies

用于指定一组包，这些包应该与你的包一起打包分发。这些包会被包含在你的包的发布版本中，这样，当其他开发者安装你的包时，他们也会得到这些依赖包的副本。

### optionalDependencies

用于指定一组包，这些包是可选的依赖。这些依赖在安装过程中会被尝试安装，但如果安装失败，npm 或 yarn 不会将此作为错误处理，而是继续安装其他依赖。

### package.json 的脚本勾子

在 package.json 文件中，你可以定义多种脚本钩子 `（scripts）`，这些脚本钩子可以在特定的 npm 事件发生时自动执行。以下是一些常见的脚本钩子：

- prepublish: 在包发布之前运行，通常用于构建或打包代码。
- prepare: 在包打包或发布之前运行，通常用于确保包的发布版本是正确构建的。
- prepublishOnly: 类似于 prepublish，但是在 npm publish 之前运行，而不是 npm install。
- preinstall: 在安装任何包之前运行，包括 npm install 和 npm ci。
- install: 在安装包之后运行。
- postinstall: 在安装包之后运行，包括 npm install 和 npm ci。
- postbuild: 在 build 之后运行，包括 npm build 之后自动运行此命令。
- preuninstall: 在卸载包之前运行。
- uninstall: 在卸载包之后运行。
- postuninstall: 在卸载包之后运行。
- preversion: 在更改包版本之前运行。
- version: 在更改包版本之后运行。
- postversion: 在更改包版本之后运行。
- pretest, test, posttest: 分别在运行测试之前、运行测试时、运行测试之后执行。
- prestop, stop, poststop: 分别在停止命令之前、停止命令时、停止命令之后执行。
- prestart, start, poststart: 分别在启动命令之前、启动命令时、启动命令之后执行。
- prefetch, fetch, postfetch: 分别在获取资源之前、获取资源时、获取资源之后执行。

```json
{
  "type": "module" // 指定当前包是 ECMAScript 模块。
}
```

### postinstall 写入.gitignore 文件用于本地开发

```bash
{
  "postinstall": "node ./scripts/postinstall.js",
}
```

```js
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// 执行 clean
spawn(process.platform === "win32" ? "npm.cmd" : "npm", ["run", "clean"]);

// 检查 /mock/localConfig.js 文件
const localConfigPath = path.resolve(__dirname, "../mock/localConfig.js");

const localConfigTemplate = `文件内容`;

if (!fs.existsSync(localConfigPath)) {
  fs.writeFile(localConfigPath, localConfigTemplate, (err) => {
    if (err) {
      console.error(err);
    }
  });
}
```

### 多版本包检测

```js
// check-package-lock.js
const pkgLock = require("./package-lock.json");

const result = {};

const getX = (dependencies) => {
  Object.keys(dependencies).forEach((pkgName) => {
    if (pkgName.includes("@natu")) {
      if (!result[pkgName]) {
        result[pkgName] = [];
      }
      result[pkgName].push(dependencies[pkgName].version);
      result[pkgName] = [...new Set(result[pkgName])];
    }
    if (dependencies[pkgName].dependencies) {
      getX(dependencies[pkgName].dependencies);
    }
  });
};

getX(pkgLock.dependencies);

const WHITE_PKG = ["@natu/style-base"];

const multiVersionPackages = Object.keys(result).filter(
  (key) => result[key].length > 1 && !WHITE_PKG.includes(key)
);

if (multiVersionPackages.length) {
  multiVersionPackages.forEach((key) => {
    console.error("多版本包", key, result[key], `请执行 npm list ${key} 查看详情`);
  });

  throw new Error("package-lock出现多版本包！！！");
}
```

### 字段含义说明

- main - 表示 commonjs 文件入口
- module - 表示 es 文件入口
- types - 表示 typescript 声明文件入口
