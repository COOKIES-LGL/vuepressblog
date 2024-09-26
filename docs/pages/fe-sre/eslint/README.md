---
home: false
---

## eslint 实用笔记

#### globals 字段值为一个对象，‌ 键为全局变量名，‌ 值为该变量是否允许被重写

```json
{
    "globals": {
        "jQuery": "readonly",
        "Vue": "writable"
    },
    "parserOptions": {
        "sourceType": "module", // 指定源代码的类型，‌'module'表示ES6模块
        "ecmaVersion": 2017, // 配置支持es2017的语法 async await 等
        "ecmaFeatures": {
            "jsx": true // 如果使用JSX，‌则设置为true
        }
    }
  }
}
```

#### eslintcache

运行 ESLint 时加上--cache 参数，会自动生成一个.eslintcache 文件，用于储存上次缓存的结果。

- [eslint-tslint-prettier](./eslint-tslint-prettier) <span style="color:#bbb; float:right">2021-08-10</span>
- [eslint-plugin-simple-import-sort](./eslint-plugin-simple-import-sort) <span style="color:#bbb; float:right">2021-09-10</span>
- [eslint 官方规则](https://github.com/eslint/eslint/tree/main/lib/rules)
- [eslint 官方规则说明](https://eslint.nodejs.cn/docs/latest/rules/prefer-rest-params#google_vignette)
