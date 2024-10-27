---
home: false
---

## babel 使用笔记

`@babel/preset-env` 是一个 `Babel` 预设，它根据你的目标环境自动确定你的代码需要的 `Babel` 插件和 `polyfills`，并添加它们。然而，它主要关注于转换你的代码本身，而不是第三方包

`Webpack` 在使用 `Babel-loader` 时会读取项目根目录下的 `.babelrc` 或 `babel.config.js` 配置文件，并应用这些配置选项。
如果你在 `webpack` 配置文件中也配置了 `Babel`，那么这些配置可能会与 `.babelrc` 文件中的配置有所覆盖
options 对象内的配置将优先于 `.babelrc` 中的配置。如果两边有同样的配置，`webpack` 的配置将覆盖 `.babelrc` 中的配置

`.browserslistrc` 文件内容会被 `Babel` 自动读取并用于确定目标浏览器的版本，不会覆盖 `Babel` 本身的配置。
如果你使用 `Babel` 配置文件（如 `.babelrc、babel.config.js`或 `package.json` 中的 `babel` 字段），
你可以在其中指定额外的 `Babel` 插件和预设，这些配置将会与 `.browserslistrc` 的内容相结合，共同决定如何转换代码

我们的组件引入方式不是从 `lib` 文件夹里引入的，这些组件不支持旧版浏览器。`lib` 里的组件走过 `polyfill` 支持旧版浏览器，所以手动从入口文件引入了下 `polyfill`。后续有兼容性组件特性引入可以从 组件库 `lib` 路径引入。
转译第三方包可能会导致构建时间显著增加，会引入不必要的复杂性。因此，在大多数情况下，建议只为自己的源代码配置 `Babel`。`core-js` 本身并不提供 `Intl.DateTimeFormate` 的 `polyfill` 之前的时区 `polyfill` 还是得手动填加。

### MarkDown 使用指南

- [MarkDown](../blog-daily/use-markdown) <span style="color:#bbb; float:right">2021-06-24</span>
