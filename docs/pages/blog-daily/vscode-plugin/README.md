<img :src="$withBase('./images/daily-blog/vscode-plugin.png')" class="show-in-center">

### 开发与调试

Vscode 插件是一个由 HTML、CSS、JS、图片等资源组成的压缩包,保证根目录有**manifest.json**即可。

### 如何编写一个 vscode 插件

开发 vscode 插件需要本地环境安装了 node.js 和 git，然后借助脚手架 yomen 和 generator-code 来快速生成项目框架

```shell
// 安装yomen generator-code
npm install yo generator-code
// 根据提示选择配置，快速生成项目框架，
yo code
```

生成的项目目录结构如下：

vscode 插件的核心实现主要在 package.json 和 extension.js 文件中。

### package.json：插件的声明文件，包含 2 个重要配置项

activationEvents、contributes。

#### activationEvents

主要用于指定插件的触发事件。基于性能的考虑，vscode 插件都是 lazy load 的，只有激活的时候才启用插件。例子中用到的是 onCommand，在 Hello World 命令被调用时，插件才会被激活。

目前支持 11 种激活事件：

- onLanguage:${language} ：当打开特定语言时插件被激活
- onCommand:${command}： 调用某个 VSCode 命令时插件被激活
- onDebug：Debug 时插件被激活
- workspaceContains:${toplevelfilename}：当打开包含某个命名规则的文件夹时插件被激活
- onFileSystem:${scheme}：以某个协议（ftp/sftp/ssh 等）打开文件或文件夹时插件被激活
- onView:${viewId}：指定 id 的视图展开时插件被激活
- onUri：插件的系统级 URI 打开时插件被激活
- onWebviewPanel：webview 触发时插件被激活
- \*：VSCode 启动时插件被激活。

#### contributes

主要是描述插件的拓展点，定义插件要扩展 vscode 哪部分功能。
常用扩展项有
代码片段（snippets）、命令（commands）、菜单（menus）、快捷键（keybindings）、主题（themes）。通常完成命令的开发后，会将其与菜单/快捷键进行关联，以便调用。

### extension.js：插件的执行入口文件，

通常包括激活（activate）和禁用（deactivate）2 个方法。vscode 会在激活插件的时候会执行 active 钩子，在卸载插件的时候会执行 deactivate 钩子。
接下来通过开发一个 jumpNpm 的插件来看一下如何实现一个 vscode 插件 实现功能：
::: tip
根据 package.json 里的 npm 包名字按 commond 键+点击跳转到本地 node_modules 下
鼠标悬浮在 npm 包名字上的时候，显示当前包的名字、版本、协议信息的提示
:::

```js
{
  "name": "jumpNpm",
  "displayName": "jumpNpm",
  "description": "",
  "version": "0.0.1",
  "engines": {
    "vscode": "^1.73.0" // 插件支持的最低vscode版本
  },
  "categories": [
    "Other"
  ],
  "activationEvents": [
    "onLanguage:json" // 注册命令事件
  ],
  "main": "./extension.js",
  "contributes": {},
  "scripts": {
    "lint": "eslint .",
    "pretest": "yarn run lint",
    "test": "node ./test/runTest.js"
  },
  "devDependencies": {
    "@types/glob": "^8.0.0",
    "@types/mocha": "^10.0.0",
    "@types/node": "16.x",
    "@types/vscode": "^1.73.0",
    "@vscode/test-electron": "^2.2.0",
    "eslint": "^8.26.0",
    "glob": "^8.0.3",
    "mocha": "^10.1.0",
    "typescript": "^4.8.4"
  },
  "dependencies": {}
}
```

由于用在 package.json 里的 npm 包，只用打开 json 文件的时候激活插件，所以配置了"activationEvents": ["onLanguage:json"]

```js
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const utils = require("./utils");

function activate(context) {
  // 注册如何实现跳转到定义，第一个参数表示仅对json文件生效
  const definitionProvider = vscode.languages.registerDefinitionProvider(["json"], {
    provideDefinition(document, position, token) {
      // 当前文件完整路径
      const filePath = document.fileName;

      if (!filePath.endsWith("package.json")) return; // 当前文件所在目录

      const workDir = path.dirname(filePath); // 光标所在单词
      const pkgName = document.getText(document.getWordRangeAtPosition(position));

      if (!pkgName) return; // 更改 Node.js进程到package.json文件工作目录

      process.chdir(workDir);
      const destPath = utils.resolvePath(pkgName); // 判空

      if (destPath && fs.existsSync(destPath)) {
        // new vscode.Position(0, 0) 表示跳转到某个文件的第一行第一列
        return new vscode.Location(vscode.Uri.file(destPath), new vscode.Position(0, 0));
      }
    },
  });

  const hoverProvider = vscode.languages.registerHoverProvider("json", {
    provideHover: function (document, position) {
      const filePath = document.fileName;
      const workDir = path.dirname(filePath);
      const word = document.getText(document.getWordRangeAtPosition(position));

      if (!filePath.endsWith("package.json")) return;

      const content = require(filePath);

      if (content?.dependencies[word] || content?.devDependencies[word]) {
        // 更改 Node.js进程到package.json文件工作目录
        process.chdir(workDir);
        const destPath = utils.resolvePath(word);
        const packageContent = require(destPath); // hover内容支持markdown语法
        return new vscode.Hover(
          `* **名称**：${packageContent.name}\n* **版本**：${packageContent.version}\n* **许可协议**：${packageContent.license}`
        );
      }
    },
  });
  context.subscriptions.push(definitionProvider, hoverProvider);
}
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
```

出于安全性考虑，vscode 不支持直接操作 dom，只能使用 vscode 封装的 api 来操作编辑器，也就是头部 require 的 vscode 对象。这里是对 json 文件的内容进行跳转命令，所以使用 vscode.languages.registerDefinitionProvider 注册一个监听 json 文件的 provider，然后将返回的实例添加至 context.subscriptions 中。当命令被激活时，会执行相应的回调方法。

### 如何调试 vscode

使用 Yomen 生成的模板自带 vs code 运行能力，切换到调试面板点击运行就会创建一个新的 vscode 窗口(Extension Development Host)，可以在该窗口进行调试。每次修改了代码通过 command+shift+F5 刷新

### 打包

插件的打包需要借助 vsce 这个工具打包成 vsix 文件

```bash
// 全局安装vsce
npm install -g vsce
// 打包
vsce package
```

打包后会生成一个以.vsix 结尾的文件 vscode 插件的安装支持本地安装和插件应用市场两种安装形式。
本地安装的话，可以通过以下步骤安装上一步生成的.vsix 文件。
<img :src="$withBase('./images/daily-blog/vscode-plugin-open.png')" class="show-in-center">  
发布到应用市场安装的话，就需要在 Azure DevOps 上注册账号，并创建一个组织来获取 PAT(Personak access tokens)。

```bash
// 登陆 需要PAT
vsce login <plublisher name>
// 打包
vsce package
// 发布
vsce publish
```

### 发布的注意事项：

- PAT 网站不会存储，需要自行保存
- plublisher name 需要和 pacage.json 里的保持一致
