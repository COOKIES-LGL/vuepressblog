<img :src="$withBase('./images/daily-blog/vscode-plugin.png')" class="show-in-center">

### 开发与调试
Vscode插件是一个由HTML、CSS、JS、图片等资源组成的压缩包,保证根目录有**manifest.json**即可。   

### 如何编写一个vscode插件
开发vscode插件需要本地环境安装了node.js和git，然后借助脚手架yomen和generator-code来快速生成项目框架

``` shell
// 安装yomen generator-code
npm install yo generator-code
// 根据提示选择配置，快速生成项目框架，
yo code
```
生成的项目目录结构如下：  

vscode插件的核心实现主要在package.json和extension.js文件中。 
### package.json：插件的声明文件，包含 2 个重要配置项
activationEvents、contributes。
#### activationEvents

主要用于指定插件的触发事件。基于性能的考虑，vscode 插件都是lazy load的，只有激活的时候才启用插件。例子中用到的是onCommand，在 Hello World 命令被调用时，插件才会被激活。

目前支持11种激活事件：

- onLanguage:${language} ：当打开特定语言时插件被激活
- onCommand:${command}： 调用某个 VSCode命令时插件被激活
- onDebug：Debug时插件被激活
- workspaceContains:${toplevelfilename}：当打开包含某个命名规则的文件夹时插件被激活
- onFileSystem:${scheme}：以某个协议（ftp/sftp/ssh等）打开文件或文件夹时插件被激活
- onView:${viewId}：指定 id 的视图展开时插件被激活
- onUri：插件的系统级URI打开时插件被激活
- onWebviewPanel：webview触发时插件被激活
- *：VSCode启动时插件被激活。

#### contributes
主要是描述插件的拓展点，定义插件要扩展vscode哪部分功能。
常用扩展项有
代码片段（snippets）、命令（commands）、菜单（menus）、快捷键（keybindings）、主题（themes）。通常完成命令的开发后，会将其与菜单/快捷键进行关联，以便调用。

### extension.js：插件的执行入口文件，
通常包括激活（activate）和禁用（deactivate）2 个方法。vscode会在激活插件的时候会执行active钩子，在卸载插件的时候会执行deactivate钩子。
接下来通过开发一个jumpNpm的插件来看一下如何实现一个vscode插件 实现功能：
::: tip
根据package.json里的npm包名字按commond键+点击跳转到本地node_modules下
鼠标悬浮在npm包名字上的时候，显示当前包的名字、版本、协议信息的提示
:::
``` js
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
由于用在package.json里的npm包，只用打开json文件的时候激活插件，所以配置了"activationEvents": ["onLanguage:json"]
``` js
const vscode = require('vscode');
const path = require('path');
const fs = require('fs');
const utils = require('./utils');

function activate(context) {
  // 注册如何实现跳转到定义，第一个参数表示仅对json文件生效
  const definitionProvider = vscode.languages.registerDefinitionProvider(['json'], {
    provideDefinition(document, position, token) {
      // 当前文件完整路径
      const filePath = document.fileName;

      if (!filePath.endsWith("package.json")) return;

      // 当前文件所在目录
      const workDir = path.dirname(filePath);
      // 光标所在单词
      const pkgName = document.getText(document.getWordRangeAtPosition(position));

      if (!pkgName) return

      // 更改 Node.js进程到package.json文件工作目录
      process.chdir(workDir);
      const destPath = utils.resolvePath(pkgName);

      // 判空
      if (destPath && fs.existsSync(destPath)) {
        // new vscode.Position(0, 0) 表示跳转到某个文件的第一行第一列
        return new vscode.Location(
          vscode.Uri.file(destPath),
          new vscode.Position(0, 0)
        );
      }
    }
  })

  const hoverProvider = vscode.languages.registerHoverProvider('json', {
    provideHover: function (document, position) {
      const filePath = document.fileName;
      const workDir = path.dirname(filePath);
      const word  = document.getText(document.getWordRangeAtPosition(position));

      if (!filePath.endsWith("package.json")) return;

      const content = require(filePath)

      if (content?.dependencies[word] || content?.devDependencies[word]) {
        // 更改 Node.js进程到package.json文件工作目录
        process.chdir(workDir);
        const destPath = utils.resolvePath(word);
        const packageContent = require(destPath);
        // hover内容支持markdown语法
        return new vscode.Hover(`* **名称**：${packageContent.name}\n* **版本**：${packageContent.version}\n* **许可协议**：${packageContent.license}`);
      }
    }
  })
  context.subscriptions.push(definitionProvider, hoverProvider);
}
function deactivate() {}

module.exports = {
  activate,
  deactivate
}
``` 

出于安全性考虑，vscode不支持直接操作dom，只能使用vscode封装的api来操作编辑器，也就是头部require的vscode对象。这里是对json文件的内容进行跳转命令，所以使用vscode.languages.registerDefinitionProvider注册一个监听json文件的provider，然后将返回的实例添加至 context.subscriptions 中。当命令被激活时，会执行相应的回调方法。
### 如何调试vscode 
使用Yomen生成的模板自带vs code运行能力，切换到调试面板点击运行就会创建一个新的vscode窗口(Extension Development Host)，可以在该窗口进行调试。每次修改了代码通过command+shift+F5刷新
### 打包
插件的打包需要借助vsce这个工具打包成vsix文件
``` bash
// 全局安装vsce
npm install -g vsce
// 打包
vsce package
```
打包后会生成一个以.vsix结尾的文件  vscode插件的安装支持本地安装和插件应用市场两种安装形式。 
本地安装的话，可以通过以下步骤安装上一步生成的.vsix文件。
<img :src="$withBase('./images/daily-blog/vscode-plugin-open.png')" class="show-in-center">  
发布到应用市场安装的话，就需要在Azure DevOps上注册账号，并创建一个组织来获取PAT(Personak access tokens)。
``` bash
// 登陆 需要PAT
vsce login <plublisher name> 
// 打包
vsce package
// 发布
vsce publish
```
### 发布的注意事项：

- PAT网站不会存储，需要自行保存
- plublisher name需要和pacage.json里的保持一致


