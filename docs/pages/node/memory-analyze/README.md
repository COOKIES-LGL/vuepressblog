

https://juejin.cn/post/6844904167534805005

https://zhuanlan.zhihu.com/p/461945753

https://www.cnblogs.com/rongfengliang/p/12151626.html

https://www.cnblogs.com/rongfengliang/p/12151626.html 火焰图工具使用

mac自带的apache中的ab是有最大并发限制的，您可以重新下载一个apache并且编译（可以参考这篇文章），安装之前记得卸载原来的哦。

Mac下自带apache，查看版本：

apachectl -v
Server version: Apache/2.4.34 (Unix)
Server built:   Feb 22 2019 20:20:11
查看ab版本:

ab -V
ab压力测试工具的用法，查看：

ab --help
或者
man ab
# 按Ctrl+z组合键，或者按q键退出
例如：

ab -c 并发数 -n 请求数 URL
ab工具常用参数：
-n ：总共的请求执行数，缺省是1；
-c： 并发数，缺省是1；
-t：测试所进行的总时间，秒为单位，缺省50000s
-p：POST时的数据文件
-w: 以HTML表的格式输出结果
-r: 跳过异常接口错误
-k: 让连接KeepAlive避免The timeout specified has expired (70007)
ab -n 100 -c 10 -w http://www.baidu.com/ >> baidu.html
# 结果界面和下面例子是一样的，只是以html文件形式保存而已。
下面，我们以请求百度为例：

ab -n 100 -c 10 https://www.baidu.com/

``` text
-n 在测试会话中所执行的请求个数（总数）
 
-c 一次产生的请求个数（单次请求次数）
 
-t 测试所进行的最大秒数。其内部隐含值是-n ，它可以使对服务器的测试限制在一个固定的总时间以内。默认时，没有时间限制。
 
-p 包含了需要POST的数据的文件。
 
-P 对一个中转代理提供BASIC认证信任。用户名和密码由一个:隔开，并以base64编码形式发送。无论服务器是否需要(即, 是否发送了401认证需求代码)，此字符串都会被发送。
 
-T POST数据所使用的Content-type头信息。
 
-v 设置显示信息的详细程度-4或更大值会显示头信息，3或更大值可以显示响应代码(,200等),2或更大值可以显示警告和其他信息。
 
-V 显示版本号并退出。
 
-w 以HTML表的格式输出结果。默认时，它是白色背景的两列宽度的一张表。
 
-i 执行HEAD请求，而不是GET。
 
-x 设置<table>属性的字符串。
 
-X 对请求使用代理服务器。
 
-y 设置<tr>属性的字符串。
 
-z 设置<td>属性的字符串。
 
-C 对请求附加一个Cookie:行。其典型形式是name=value的一个参数对，此参数可以重复。
 
-H 对请求附加额外的头信息。此参数的典型形式是一个有效的头信息行，其中包含了以冒号分隔的字段和值的对(如,"Accept-Encoding:zip/zop;8bit")。
 
-A 对服务器提供BASIC认证信任。用户名和密码由一个:隔开，并以base64编码形式发送。无论服务器是否需要(即,是否发送了401认证需求代码)，此字符串都会被发送。
 
-h 显示使用方法/帮助信息。
 
-d 不显示"percentage served within XX [ms] table"的消息(为以前的版本提供支持)。
 
-e 产生一个以逗号分隔的(CSV)文件，其中包含了处理每个相应百分比的请求所需要(从1%到100%)的相应百分比的(以微妙为单位)时间。由于这种格式已经“二进制化”，所以比'gnuplot'格式更有用。
 
-g 把所有测试结果写入一个'gnuplot'或者TSV(以Tab分隔的)文件。此文件可以方便地导入到Gnuplot,IDL,Mathematica,Igor甚至Excel中。其中的第一行为标题。
 
-i 执行HEAD请求，而不是GET。
 
-k 启用HTTP KeepAlive功能，即在一个HTTP会话中执行多个请求。默认时，不启用KeepAlive功能。
 
-q 如果处理的请求数大于150，ab每处理大约10%或者100个请求时，会在stderr输出一个进度计数。此-q标记可以抑制这些信息。
```

### 总结
对于 vue/react ssr，除了要注意在服务端 ssr 生命周期能触发的钩子内不要创建资源属性的内容防止内存泄露，
也要尤其注意到这类的执行错误可能引发公共模块重复编译导致的闭包泄露。


### 火焰图的基本含义

<!-- <img :src="https://pic2.zhimg.com/80/v2-7194a798ac94709936f1ec60ae73bc71_1440w.jpg"> -->
1、每一个小块代表了一个函数在栈中的位置（即一个栈帧）。
2、y 轴表示调用栈，每一层都是一个函数。调用栈越深，火焰就越高，顶部就是正在执行的函数，下方都是它的父函数。
3、x 轴表示抽样数，如果一个函数在 x 轴占据的宽度越宽，就表示它被抽到的次数多，即执行的时间长。注意，x 轴不代表时间，而是所有的调用栈合并后，按字母顺序排列的。
4、小块的宽度代表 CPU 的使用时间，或者说相对于父函数而言使用 CPU 的比例（基于所有样例），越宽则代表占用 CPU 的时间越长，或者使用 CPU 很频繁。如果一个函数在顶层占据的宽度最大，就表示该函数可能存在性能问题。
https://github.com/davidmarkclements/0x/blob/master/docs/ui.md