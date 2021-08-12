---
sidebar: auto
---

## 初始化vue3和electron13版本开发桌面应用 
接下来一步一步手动创建electron10+ 、Vue3+、cli4+的项目。

* electron ：https://www.electronjs.org/
* Vue3： https://cn.vuejs.org/
* Vue-cli :https://cli.vuejs.org/zh/

::: warning
使用cnpm 加速
npm config set registry https://registry.npm.taobao.o
npm config set ELECTRON_MIRROR=https://npm.taobao.org/mirrors/electron/
:::

### 创建项目app
1、安装Vue-cli4+  
``` shell command
npm install @vue/cli -g
```

2、创建Vue项目 直接选择使用vue3创建项目
``` shell command  
vue create electron-vue-app
```

3、先进入项目然后安装electron  
这一步骤很重要，electron-builder 会自动配置package.json 文件，打包方式和启动方式。
这里我们可以选择需要的electron版本。如果想了解electron-builder，请点这里https://www.electron.build/
``` shell command
cd electron-vue-app
vue add electron-builder
```

4、安装依赖
``` shell command
yarn install
```

### 启动项目app
``` shell command
yarn run electron:serve
```
编译成功后，就会出现开发环境的APP了。

### 打包项目app
``` shell command
yarn run electron:build
```

效果图 项目自带electron-devtools-installer调试器
<img :src="$withBase('./pages-assets/electron-vue.png')"> 