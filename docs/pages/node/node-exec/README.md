---
home: false
sidebar: false
---

### nodejs多进程spawn execFile exec fok方法的区别
::: tip
在Node.js中，spawn、execFile、exec和fork都用于创建子进程，但它们之间有一些区别：

spawn：用于生成一个 shell，可以执行任何命令。它通过 stdio 流与子进程通信。

exec：与 spawn 类似，但需要等待命令执行完毕才返回结果。

execFile：专门用于执行一个文件，不需要启动 shell。

fork：用于执行一个 JavaScript 文件，类似于 spawn 但是专门用于 Node.js 进程，并且它提供了一个 IPC 通信信道。
:::

下面是每种方法的简单示例代码：
1. spawn 创建新进程，执行结果已流的形式返回，只能通过事件来获取结果数据
``` javascript
const spawn = require('child_process').spawn;
const ls = spawn('ls', ['-lh', '/usr']);

ls.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

ls.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`);
});

ls.on('close', (code) => {
  console.log(`child process exited with code ${code}`);
});
```

2. execFile 创建新进程，按照其后面的File名字，执行一个可执行文件，可以带选项，以回调形式返回调用结果，可以得到完整数据
``` javascript
execFile('node', ['--version'], function(error, stdout, stderr){
    if(error){
        throw error;
    }
    console.log(stdout);
});
```

3. exec  创建新进程，可以直接执行shell命令，简化了shell命令执行方式，同样以回调方式
``` javascript
exec('ls -lh /usr', (error, stdout, stderr) => {
  if (error) {
    throw error;
  }
  console.log(stdout);
});
```

4. execSync  创建新进程，可以直接执行shell命令，简化了shell命令执行方式，它会阻塞 Node.js 事件循环,同步执行.
常见的 stdio 选项：
> 'inherit'：这意味着输出将直接显示在控制台上，就像你直接在终端中运行命令一样。  
> 'pipe'：这将创建一个管道来传输子进程的输出，可以在 stdout 或 stderr 属性中获取。  
> 'ignore'：这将忽略子进程的相应输出，不会在父进程中显示。  
``` javascript
const stdout = execSync('ls -lh /usr', { stdio: 'pipe' } )
console.log(stdout);
```

5. fork  创建新进程，执行node程序
``` javascript
const child = fork('child_script.js');
```
