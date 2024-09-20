## WebContainers 使用笔记

### 定义

WebContainers 是一种基于浏览器的运行时，用于在浏览器标签内完全执行 Node.js 应用程序和操作系统命令。
在 WebContainers 中，先前需要云虚拟机来执行用户代码的应用程序可以完全在客户端运行，并且相对于传统的云虚拟机，具有许多优点。

### 使用

#### 安装 webcontainer/api

可以让我们使用到 webcontainer 中的一些核心的功能  
我们接下来就是需要通过 webcontainer/api 来将这段 node.js 代码运行在浏览器环境中
项目结构
---files.js
---main.js
---index.html

```js
// files.js
export const files = {
    'index.js': {
      file: {
        contents: `
import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
    res.send('Welcome to a WebContainers app! 🥳');
});

app.listen(port, () => {
    console.log(`App is live at http://localhost:${port}`);
});`,
      },
    },
    'package.json': {
      file: {
        contents: `
          {
            "name": "example-app",
            "type": "module",
            "dependencies": {
              "express": "latest",
              "nodemon": "latest"
            },
            "scripts": {
              "start": "nodemon index.js"
            }
          }`,
      },
    },
  };
```

```html
<!-- index.html -->
<html>
  <div id="app"></div>
  <script src="./main.js"></script>
</html>
```

```js
// main.js
import { WebContainer } from "@webcontainer/api";
import { files } from "./files";
import { Terminal } from "xterm";
import "xterm/css/xterm.css";

// 创建输入组件
document.querySelector("#app").innerHTML = `
  <div class="container">
    <div class="editor">
      <textarea>I am a textarea</textarea>
    </div>
    <div class="preview">
      <iframe src="loading.html"></iframe>
    </div>
    <div class="terminal"></div>
  </div>
`;
// 配置调试终端
// convertEol设置为的原因true是强制光标始终从下一行的开头开始
const terminal = new Terminal({
  convertEol: true,
});

/** @type {HTMLTextAreaElement | null} */
const terminalEl = document.querySelector(".terminal");

window.addEventListener("load", async () => {
  terminal.open(terminalEl);
});

// 加载files.js文件
window.addEventListener("load", async () => {
  textareaEl.value = files["index.js"].file.contents;
  textareaEl.addEventListener("input", (e) => {
    writeIndexJS(e.currentTarget.value);
  });
});

async function writeIndexJS(content) {
  await webcontainerInstance.fs.writeFile("/index.js", content);
}

/** @type {HTMLIFrameElement | null} */
const iframeEl = document.querySelector("iframe");

/** @type {HTMLTextAreaElement | null} */
const textareaEl = document.querySelector("textarea");

window.addEventListener("load", async () => {
  webcontainerInstance = await WebContainer.boot();
  await webcontainerInstance.mount(files);

  const exitCode = await installDependencies();
  if (exitCode !== 0) {
    throw new Error("Installation failed");
  }

  startDevServer();
});

// 下载代码所需的依赖了，我们需要通过webcontainer/api 提供的 spawn 方法来执行 npm 命令
async function installDependencies() {
  // Install dependencies
  const installProcess = await webcontainerInstance.spawn("npm", ["install"]);
  installProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );
  // Wait for install command to exit
  return installProcess.exit;
}

async function startDevServer() {
  // Run `npm run start` to start the Express app
  const serverProcess = await webcontainerInstance.spawn("npm", ["run", "start"]);
  serverProcess.output.pipeTo(
    new WritableStream({
      write(data) {
        terminal.write(data);
      },
    })
  );

  // Wait for `server-ready` event
  webcontainerInstance.on("server-ready", (port, url) => {
    iframeEl.src = url;
  });
}
```

### 配置跨域

为避免跨域问题，WebContainers 要求我们的页面（即使在开发阶段）也需要使用这两个标头

```js
import { defineConfig } from "vite";
export default defineConfig({
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
});
```
