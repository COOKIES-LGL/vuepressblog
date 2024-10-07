### 插件开发 常用 npm 包

#### @microsoft/vscode-file-downloader-api

这个包作为 VS 代码文件下载器扩展的包装器，它公开了一个 API，允许其他扩展下载和管理二进制依赖关系。
[使用案例](https://github.com/microsoft/vscode-file-downloader-api)

#### @vscode/webview-ui-toolkit

微软的 VSCode WebView UI Toolkit 是一个开源项目，它提供了一套用于在 Visual Studio Code (VSCode)扩展中构建现代、响应式和可自定义的 Web 视图界面的组件库。开发者可以轻松地利用 VSCode 的 WebView 功能创建出与编辑器无缝集成的用户界面  
[使用文档](https://github.com/microsoft/vscode-webview-ui-toolkit)

### 插件开发 常用接口

#### vscode.commands.registerCommand

注册命令

#### vscode.commands.executeCommand

允许命令

#### vscode.workspace.getConfiguration

获取插件配置

#### vscode.window.activeTextEditor

获取当前激活的编辑器

#### vscode.window.showInformationMessage

展示 Toast.info 提示

#### vscode.window.showErrorMessage

展示 Toast.error 提示

#### vscode.window.showOpenDialog

展示文件选择框

#### vscode.window.showInputBox

展示输入框

#### vscode.window.createTreeView

用于创建一个树形视图（TreeView）在 VSCode 的侧边栏中，通常用于创建自定义视图，例如显示项目结构、调试变量或其他自定义数据

#### vscode.window.createWebviewPanel

用于创建一个 Webview 面板。Webview 是 VSCode 中的一种强大功能，它允许扩展开发者在 VSCode 界面中嵌入 HTML 内容

#### vscode.window.registerWebviewPanelSerializer

注册一个序列化器（serializer），该序列化器可以在 Webview 面板被重新打开时恢复面板的状态。这个功能对于那些需要在会话之间保持状态的 Webview 面板来说非常有用

> 注意： 序列化器只能用于那些在 createWebviewPanel 方法中指定了 retainContextWhenHidden: true 选项的 Webview 面板

#### vscode.workspace.onDidChangeConfiguration

一个事件，它在用户更改了配置设置时触发。这个事件允许扩展开发者监听配置更改，并根据需要更新扩展的行为

#### vscode.Uri

表示统一资源标识符

- vscode.Uri.file(path: string)：创建一个表示文件路径的 vscode.Uri 对象。
- vscode.Uri.parse(uri: string)：将一个字符串解析为 vscode.Uri 对象。
- uri.fsPath：获取 URI 的文件系统路径表示形式。
- uri.toString()：获取 URI 的字符串表示形式。
- uri.scheme：获取 URI 的方案（如 file 或 http）。
- uri.path：获取 URI 的路径部分。

#### vscode.extensions.getExtension("插件 id")

获取插件（可以执行插件暴露的方法）需要在 package.json 中配置

```json
{
  "extensionDependencies": ["yangzhao.auto-updater"]
}
```

#### panel.webview.onDidReceiveMessage

处理来自 webview 的信息

#### webview.postMessage

webview 发送消息
