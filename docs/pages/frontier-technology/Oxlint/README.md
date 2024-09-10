---
home: false
sidebar: false
---

### 1. 安装

常规 npm 安装：

```bash
npm install -D oxlint

yarn add -D oxlint
```

### Oxlint 参数介绍

```text
用法: oxlint [-A=NAME | -D=NAME]... [--fix] [-f] [-c=PATH] [--tsconfig=PATH] [PATH]...

关闭和开启规则：
  举例： `-D correctness -A no-debugger` 或 `-A all -D no-debugger`.
  默认开启的规则集是 correctness.
  "--rules" 展示所有支持的规则.
  "--help --help" 展示所有支持的规则集合.
  -A, --allow=NAME          关闭哪些规则或规则集合
  -D, --deny=NAME           开启哪些规则或规则集合

开启插件：
        --import-plugin       启用实验性的导入插件并检测ESM问题
        --jest-plugin         启用 Jest 插件并检测测试问题
        --jsx-a11y-plugin     启用 JSX-a11y 插件并检测可访问性问题
        --nextjs-plugin       启用 Next.js 插件并检测 Next.js 问题
        --react-perf-plugin   启用React性能插件并检测渲染性能问题

问题修复：
        --fix                 尽可能多地解决问题。输出中只报告未解决的问题

忽略文件：
        --ignore-path=PATH    指定要用作.elinignore的文件
        --ignore-pattern=PAT  指定要忽略的文件模式（除了.eslitingnore 中指定之外的）
        --no-ignore           禁止从.elinignore文件中排除文件, --ignore-path --ignore-pattern

告警处理：
        --quiet               禁用警告报告，只报告错误
        --deny-warnings       确保警告产生非零退出代码
        --max-warnings=INT    指定一个警告阈值，如果项目中存在太多违反警告级别规则的情况，该阈值可用于强制退出并显示错误状态

输出：
        -f, --format          使用特定的输出格式（默认为json）

多线程：
        --threads=INT         要使用的线程数。设置为1以仅使用1个CPU核心

其他参数:
        --rules               列出当前注册的所有规则
    -c, --config=PATH         ESLint 配置文件 (experimental)
        --tsconfig=PATH       TypeScript“tsconfig.json”路径，用于读取导入插件的路径别名和项目引用
    -h, --help                帮助信息
    -V, --version             版本信息
```

### 配套工具

#### eslint-plugin-oxlint

借助 eslint-plugin-oxlint，可以关闭 ESLint 中 Oxlint 已经支持的规则，这样可以在 ESLint 项目中结合 Oxlint 来进行代码 Lint，提高速度

#### lint-staged

```json
{
  "lint-staged": {
    "**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx,vue,astro,svelte}": "oxlint"
  }
}
```

#### pre-commit

```text
repos:
  - repo: https://github.com/oxc-project/mirrors-oxlint
    rev: v0.0.0 # change to the latest version
    hooks:
      - id: oxlint
        verbose: true
```
