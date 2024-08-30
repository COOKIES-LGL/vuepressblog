---
home: false
sidebar: false
---
## eslint-tslint-prettier配置

``` JSON
// eslint rules 配置
{
{
  "extends": ["plugin:natu/all"],
  "plugins": ["simple-import-sort"],
  "rules": {
    "simple-import-sort/imports": [
      "error",
      {
          "groups": [
              // Side effect imports.
              ["^\\u0000", "^\\u0000.+\\.(s?css|styl|less)$"],
              // external packages
              ["^react", "^\\w", "^@pd*"],
              // alias path
              ["@*", "src/*"],
              // Parent imports. Put `..` last.
              ["^\\.\\.(?!/?$)", "^\\.\\./?$"],
              // Other relative imports. Put same-folder imports and `.` last.
              ["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
              // Style imports.
              ["^.+\\.(s?css|styl|less)$"],
              // Side effect imports.
              ["^\\u0000"]
          ]
      }
  ]
  }
}
}
```

``` JSON .vscode settings.json

{
  "files.eol": "\n",
  "prettier.endOfLine": "lf",
  "eslint.validate": ["javascriptreact", "html", "javascript", "typescript"],
  "typescript.tsdk": "node_modules/typescript/lib",
  "importSorter.generalConfiguration.sortOnBeforeSave": true,
  "importSorter.importStringConfiguration.hasSemicolon": false,
  "importSorter.importStringConfiguration.maximumNumberOfImportExpressionsPerLine.count": 80,
  "importSorter.importStringConfiguration.maximumNumberOfImportExpressionsPerLine.type": "newLineEachExpressionAfterCountLimitExceptIfOnlyOne",
  "importSorter.importStringConfiguration.tabSize": 2,
  "importSorter.sortConfiguration.customOrderingRules.rules": [
    {
      "type": "importMember",
      "regex": "^$",
      "orderLevel": 5,
      "disableSort": true
    },
    {
      "regex": "^[@](|mc|pd)",
      "orderLevel": 20,
      "disableSort": true
    },
    {
      "regex": "^[@](components|pages|utils|constants|routes|api|store|api)",
      "orderLevel": 25
    },
    {
      "regex": "^(components|pages|utils|constants|routes|api|store|api)",
      "orderLevel": 25
    },
    {
      "regex": "^[.]",
      "orderLevel": 30
    }
  ],
  "importSorter.sortConfiguration.removeUnusedImports": true,
  "editor.formatOnSave": true,
  // 主要是这个几个配置
  "editor.codeActionsOnSave": {
    "source.formatDocument": true,
    "source.fixAll.eslint": true
  },
  "eslint.codeActionsOnSave.rules": ["simple-import-sort/imports"],
  //
  "explorer.compactFolders": false
}

```

