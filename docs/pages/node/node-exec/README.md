nodejs多进程spawn execFile exec fok方法的区别

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
execFile('node', ['--version'], function(error, stdout, stderr){
    if(error){
        throw error;
    }
    console.log(stdout);
});
```

fork  创建新进程，执行node程序
``` javascript
execFile('node', ['--version'], function(error, stdout, stderr){
    if(error){
        throw error;
    }
    console.log(stdout);
});