### 下载安装 UnoCSS

```bash
npm install unocss
```

### 配置文件

在项目的根目录下创建 uno.config.{js,ts,mjs,mts}文件

```ts
import {
defineConfig,
presetUno,
presetAttributify,
presetTypography,
presetIcons,
transformerVariantGroup，
transformerAttributifyJsx,
transformerCompileClass,
transformerDirectives,
} from "unocss";
import presetRemToPx from "@unocss/preset-rem-to-px";
export default defineConfig({
  //自定义规则
  rules: [[/^bg-?([0123456789abcdef]+)$/i, ([_, rgb]) => ({ background: `#${rgb}` })]],
  //预设规则 有前两个预设可以满足95%以上的需求
  presets: [
    //此预设规则可以看Tailwind CSS、Windi CSS、Bootstrap、Tachyons官网了解相关规则
    presetUno(), //m-10 理解为 margin:10rem 或者 m-10px 理解为 margin:10px
    presetAttributify(), //归因模式 bg="blue-400 hover:blue-500 dark:blue-500 dark:hover:blue-600" 背景颜色的简写  也可以再元素上不加class 直接写属样式 例如 <div m-2 p-10 bg-000></div>
   // presetTypography(), //排版预设 详细排版看https://unocss.dev/presets/typography#colors 使用这个前两个必须
   // presetIcons(), //css图标 支持图标看 https://icones.js.org/ 需要下载

   // 这里看个人需求是否要使用px
    presetRemToPx({
      baseFontSize: 4, //基准字体大小  官方的默认预设（1单位 = 0.25rem） html的字体是16  所以这里为4
    }), //默认unocss默认是rem 转换成 px单位
  ],
  //看个人需求添加转换器
  transformers: [
   transformerVariantGroup()，
   transformerAttributifyJsx(),
   transformerCompileClass(),
   transformerDirectives()
  ],
  //以下可以按个人需求添加
  shortcuts：{}，
  layers: {},
  theme: {},
  variants: [],
  extractors: [],
  preflights:[]
});
```

### 在 vite.config.ts 中引入一下

```ts
//vite.config.ts
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import UnoCss from "unocss/vite";
export default defineConfig(({ command }) => ({
 plugins: [
    vue(),
    //插件中也可以选择指定uno文件地址 参数{configFile: './uno.config.ts'}
    //当然默认不传参数也是可以正常运行的  这里就不选择传入参数了
    UnoCss()
    ],
    //....
  })

  //另外webpack5中 webpack.config.js
 const UnoCSS = require('@unocss/webpack').default
 module.exports = {
     plugins: [UnoCSS()],
     optimization: { realContentHash: true }
 }
```

[参考文献](https://juejin.cn/post/7322401091237068854)
