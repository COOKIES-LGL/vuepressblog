---
home: false
sidebar: false
---

### 使用 monorepo 的原因
我正在开发的项目 A，依赖了已经线上发布的项目 B，但是随着项目 A 的不断开发，又需要不时修改项目 B 的代码（这些修改暂时不必发布线上），如何能够在修改项目 B 代码后及时将改动后在项目 A 中同步？ 在项目 A 发布上线后，如何以一种优雅的方式解决项目 A，B 版本升级后的版本同步问题？

### multrepo与monorepo优缺点
<img src="http://upload-images.jianshu.io/upload_images/19806861-7e0ab233b65060e2.png?imageMogr2/auto-orient/strip|imageView2/2/w/960/format/webp" />