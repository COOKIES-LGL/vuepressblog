import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';
const { path } = require('@vuepress/utils');

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: '归零@you',
  description: '带着疑问抬头望天,繁星点点',
  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',
    navbar: [
      {
        text: '首页',
        link: '/',
      },
      {
        text: '我的博客',
        link: '/pages',
      },
      {
        text: '摸鱼棋盘',
        link: 'http://html5.huceo.com/wzq/',
      },
      {
        text: '在线工具',
        children: [
          {
            text: 'Code Pen',
            link: 'https://codepen.io/pen/',
          },
          {
            text: '格式图片获取',
            link: 'https://placeholder.com/',
          },
        ],
      },
      {
        text: '实用收藏',
        children: [
          {
            text: '摸鱼棋盘',
            link: 'http://html5.huceo.com/wzq/',
          },
          {
            text: '摸鱼棋盘',
            link: 'http://html5.huceo.com/wzq/',
          },
        ],
      },
      {
        text: '官方文档',
        children: [
          {
            text: 'Vue3中文文档',
            link: 'https://vue3js.cn/docs/zh/',
          },
          {
            text: 'Vuex4中文文档',
            link: 'https://next.vuex.vuejs.org/zh/index.html',
          },
          {
            text: 'Vue Router4中文文档',
            link: 'https://next.router.vuejs.org/zh/guide/index.html',
          },
        ],
      },
    ],
    sidebar: 'auto',
    sidebarDepth: 2,
  },
  // theme: path.resolve(__dirname, './theme'),
});
