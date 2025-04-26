### 前期准备

- 八股文、
- 算法、
- 常见 coding、
- 项目总结、
- 前端新技术拓展。

### 面试介绍文案

面试官你好，我叫李贵霖，20 年毕业于江南大学计算机科学与技术专业，然后校招进入 SHOPEE seller 部门担任前端开发工程师，
主要负责卖家教育、卖家入驻、卖家保证金健康度管理、等业务的开发工作。22 年来到拼多多，在拼多多先后待了两个业务组，一个是 特木 的基础电商业务组
一个是 特木 跨境结算。在基础电商部门的时候参与了用户增长达人邀约项目搭建，特木 App 内部新人转化活动页全额返和一折购的开发工作。
在跨境结算部门负责一个微服务项目内的人力结算业务的业务开发，涉及人力成本、仓作业计费管理等，也有涉及卖家履约服务，等卖家管理。

### 项目介绍

**达人邀约项目**项目涉及 H5 端和 PC 端，前端部署了两份服务端渲染的代码，通过在网关处拦截用户的 userAgent 来判断访问 PC 端还是 H5 端。

**PAP**
此项目是页面性能数据上报分析平台，包含 SDK、SDK-BE、PAP、PAP-BE、四部分，BE 使用
Koa 框架，使用 kafka 缓冲层应对突发流量，数据存储、分析使用了 Elastic
Search，图表展示使用了 Echart。平台对宿主项目的资源加载、页面渲染、自定义埋点等耗时进行统计分析。以及基于 Node-schedule 任务调度器，提供了告警服务和邮件日志。

**SEH**
卖家教育平台，用于对入驻卖家进行以视频，文章形式的教育。同时支持移动端展示，对 SEO、国际化和首页渲染有较高要求。站点支持十几个国家，内容由管理后台配置，管理后台支持富文本和多语言配置，视频内容编辑大文件支持断点续传。

**插件应用市场**
支持公司级部署私有的 vscode 插件市场，方便内部插件的安装、更新管理。使用 pnpm
workspace 管理项目，插件开发完成后打包成 vsix 文件上传到 github，然后核心插件程序通过 node 将插件 vsix 文件拉取到本地，然后通过 vscode 指令动态安装扩展程序。

**jscodeshift-cli**
基于 jscodeshift 通过 AST(抽象语法树)实现代码的批量转换，支持代码风格统一。比如批量增加 try
catch、规范 React 组件、移除冗余代码等。

### 项目难点

首页弹窗管理
首先维护了一个弹窗队列，保存了首屏会出现的所有弹窗，数组的每一项是一个对象保存了弹窗组件，弹窗展示条件，弹窗关闭回调，然后根据用户状态，
filter 需要展示的弹窗队列，在首页递归展示。

场景数据 MOCK
由于我们的接口数据 mock 是单个接口拦截处理的，接口是没有副作用的， 接口与接口之间是不相关的，所以涉及到接口有副作用，接口与接口之间相互影响的时候
就无法 mock 了。所以就弄了一个场景值 mock 函数，主要原理就是一开始在各个接口内调用函数注册场景值，然后这里面有一个接口是驱动者，
这个接口的调用次数来驱动场景值往下一个场景值切换。给场景值定义一个唯一标识为 key，当前场景为值绑定到 global 上，这样这个场景值可以在多个接口之间共享。

script 加载 js 走服务器响应的缓存策略。
fetch 加载 js 如果请求 header 有缓存策略会影响到响应的缓存策略。
但请求头的设置确实可以影响缓存的使用方式和策略。如果请求头设置了 Cache-Control: no-cache，即使响应头指示资源可以被缓存，客户端也可能会选择不直接使用缓存的响应，而是向服务器发送请求进行验证 ‌

内存泄漏分析

### jscodeshift

### polyfill-service

### 简历知识点汇总

1、vue ssr 改造
2、内存泄露问题排查流程
3、站点 SEO 流程 （‌https://search.google.com/search-console/）
4、大文件分片上传、断点续传
5、六方格、大圈盘活动页开发要点
6、webpack5、新特性
7、webpack 优化
8、eslint stylelint 自定义规则编写
9、PAP 项目理解

### 常见性能指标获取

```js
window.onload = function () {
  setTimeout(() => {
    const t = performance.timing;
    // DNS查询耗时
    console.log("DNS耗时:", t.domainLookupEnd - t.domainLookupStart);
    // TCP连接耗时
    console.log("TCP耗时:", t.connectEnd - t.connectStart);
    // 白屏时间（首字节到达前）
    console.log("白屏时间:", t.responseStart - t.navigationStart);
    // DOM解析完成时间
    console.log("页面总加载时间:", t.domInteractive - t.navigationStart);
    // 页面完全加载时间
    console.log("页面总加载时间:", t.loadEventEnd - t.navigationStart);
  });
};
```
