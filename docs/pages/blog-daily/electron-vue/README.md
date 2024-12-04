---
sidebar: auto
---

## 初始化 vue3 和 electron13 版本开发桌面应用

接下来一步一步手动创建 electron10+ 、Vue3+、cli4+的项目。

- electron ：https://www.electronjs.org/
- Vue3： https://cn.vuejs.org/
- Vue-cli :https://cli.vuejs.org/zh/

::: warning
使用 cnpm 加速
npm config set registry https://registry.npm.taobao.o
npm config set ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/
:::

### 创建项目 app

1、安装 Vue-cli4+

```shell command
npm install @vue/cli -g
```

2、创建 Vue 项目 直接选择使用 vue3 创建项目

```shell command
vue create electron-vue-app
```

3、先进入项目然后安装 electron  
这一步骤很重要，electron-builder 会自动配置 package.json 文件，打包方式和启动方式。
这里我们可以选择需要的 electron 版本。如果想了解 electron-builder，请点这里https://www.electron.build/

```shell command
cd electron-vue-app
vue add electron-builder
```

4、安装依赖

```shell command
yarn install
```

### 启动项目 app

```shell command
yarn run electron:serve
```

编译成功后，就会出现开发环境的 APP 了。

### 打包项目 app

```shell command
yarn run electron:build
```

效果图 项目自带 electron-devtools-installer 调试器
<img :src="$withBase('./pages-assets/electron-vue.png')">
