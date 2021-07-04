# **nodejs写bash脚本终极方案!**
### 前言
最近在学习bash脚本语法，但是如果对bash语法不是熟手的话，感觉非常容易出错，  
比如说：未定义的变量shell中变量没有定义，仍然是可以使用的，但是它的结果可能不是你所预期的。  
举个例子：

``` bash
#！/bin/bash
# 这里是判断变量var是否等于字符串abc，但是var这个变量并没有声明
if [ "$var" = "abc" ] 
then
   # 如果if判断里是true就在控制台打印 “ not abc”
   echo  " not abc" 
else
   # 如果if判断里是false就在控制台打印 “ abc”
   echo " abc "
fi
```
结果是打印了abc，但问题是，这个脚本应该报错啊，变量并没有赋值算是错误吧。

为了弥补这些错误，我们学会在脚本开头加入： <font color=#00ffff size=18>set -u</font>   
这句命令的意思是脚本在头部加上它，遇到不存在的变量就会报错，并停止执行。  

::: danger
再次运行就会提示：test.sh: 3: test.sh: num: parameter not set
:::


再想象一下，你本来想删除：
``` bash
rm -rf $dir/*
```
然后dir是空的时候，变成了什么？rm -rf是删除命令，$dir是空的话，相当于执行
``` bash
rm -rf /*,
``` 
这是删除所有文件和文件夹。。。然后，你的系统就没了，这就是传说中的删库跑路吗~~~~

如果是node或者浏览器环境，我们直接
``` javascript
var === 'abc' 
```
肯定是会报错的,也就是说很多javascript编程经验无法复用到bash来，如果能复用的话，该多好啊。

后来就开始探索，如果用node脚本代替bash该多好啊，经过一天折腾逐渐发现一个神器，  
Google旗下的<font color=#00ffff size=18>zx</font>库，
我们先看看目前主流用node如何编写bash脚本，就知道为啥它是神器了。

1、 勉强解决方案：**child_process API**
例如 child_process的API里面exec命令

``` bash
const { exec } = require("child_process");

exec("ls -la", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
``` 
这里需要注意的是，首先exec是异步的，但是我们bash脚本命令很多都是同步的。

而且注意：error对象不同于stderr. error当child_process模块无法执行命令时，该对象不为空。  
例如，查找一个文件找不到该文件，则error对象不为空。但是，如果命令成功运行并将消息写入标准错误流，则该stderr对象不会为空。

2、当然我们可以使用同步的exec命令，**execSync**
``` bash
// 引入 exec 命令 from child_process 模块
const { execSync } = require("child_process");
// 同步创建了一个hello的文件夹
execSync("mkdir hello");
```
再简单介绍一下child_process的其它能够执行bash命令的api
* spawn： 启动一个子进程来执行命令
* exec：启动一个子进程来执行命令，与spawn不同的是，它有一个回调函数能知道子进程的情况
* execFile：启动一子进程来执行可执行文件
* fork：与spawn类似，不同点是它需要指定子进程需要需执行的javascript文件
* exec跟ececFile不同的是，exec适合执行命令，eexecFile适合执行文件。

3、node执行bash脚本: 进阶方案 **shelljs**
``` bash
const shell = require('shelljs');
 
# 删除文件命令
shell.rm('-rf', 'out/Release');
// 拷贝文件命令
shell.cp('-R', 'stuff/', 'out/Release');
 
# 切换到lib目录，并且列出目录下到.js结尾到文件，并替换文件内容（sed -i 是替换文字命令）
shell.cd('lib');
shell.ls('*.js').forEach(function (file) {
  shell.sed('-i', 'BUILD_VERSION', 'v0.1.2', file);
  shell.sed('-i', /^.*REMOVE_THIS_LINE.*$/, '', file);
  shell.sed('-i', /.*REPLACE_LINE_WITH_MACRO.*\n/, shell.cat('macro.js'), file);
});
shell.cd('..');
 
# 除非另有说明，否则同步执行给定的命令。 在同步模式下，这将返回一个 ShellString
#（与 ShellJS v0.6.x 兼容，它返回一个形式为 { code:..., stdout:..., stderr:... } 的对象）。
# 否则，这将返回子进程对象，并且回调接收参数（代码、标准输出、标准错误）。
if (shell.exec('git commit -am "Auto-commit"').code !== 0) {
  shell.echo('Error: Git commit failed');
  shell.exit(1);
}
```

从上面代码上看来，shelljs真的已经算是非常棒的nodejs写bash脚本的方案了，
如果你们那边的node环境不能随便升级，我觉得shelljs确实够用了。

接着我们看看今天的主角zx。

zx库 [官方网址：](www.npmjs.com/package/zx)

我们先看看怎么用

``` bash
#!/usr/bin/env zx

await $`cat package.json | grep name`

let branch = await $`git branch --show-current`
await $`dep deploy --branch=${branch}`

await Promise.all([
  $`sleep 1; echo 1`,
  $`sleep 2; echo 2`,
  $`sleep 3; echo 3`,
])

let name = 'foo bar'
await $`mkdir /tmp/${name}
``` 
各位看官觉得咋样，是不是就是在写linux命令而已，bash语法可以忽略很多，  
直接上js就行，而且它的优点还不止这些，有一些特点挺有意思的：

1、支持ts，自动编译.ts为.mjs文件，.mjs文件是node高版本自带的支持es6 module的文件结尾，  
也就是这个文件直接import模块就行，不用其它工具转义

2、自带支持管道操作pipe方法

3、自带fetch库，可以进行网络请求，自带chalk库，可以打印有颜色的字体，
自带错误处理nothrow方法，如果bash命令出错，可以包裹在这个方法里忽略错误  

完整中文文档（在下翻译水平一般，请见谅）
``` bash
#!/usr/bin/env zx

await $`cat package.json | grep name`

let branch = await $`git branch --show-current`
await $`dep deploy --branch=${branch}`

await Promise.all([
  $`sleep 1; echo 1`,
  $`sleep 2; echo 2`,
  $`sleep 3; echo 3`,
])

let name = 'foo bar'
await $`mkdir /tmp/${name}
``` 
Bash 很棒，但是在编写脚本时，人们通常会选择更方便的编程语言。   
JavaScript 是一个完美的选择，但标准的 Node.js 库在使用之前需要额外的做一些事情。
zx 基于 child_process ，转义参数并提供合理的默认值。
------- 
安装
``` bash
npm i -g zx
``` 
需要的环境
``` bash
Node.js >= 14.8.0
```
将脚本写入扩展名为 .mjs 的文件中，以便能够在顶层使用await。

将以下 shebang添加到 zx 脚本的开头：
``` bash
#!/usr/bin/env zx
现在您将能够像这样运行您的脚本：

chmod +x ./script.mjs
./script.mjs
``` 

或者通过 zx可执行文件：

zx ./script.mjs

所有函数（$、cd、fetch 等）都可以直接使用，无需任何导入。

ZX [README.md](https://github.com/google/zx/tree/7cd3299723df48453c20c514c8bcb72c8a063064)