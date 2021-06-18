import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'zh-CN',
  title: '归零@you',
  description: 'Just playing around',
  themeConfig: {
    logo: 'https://vuejs.org/images/logo.png',
  },
})