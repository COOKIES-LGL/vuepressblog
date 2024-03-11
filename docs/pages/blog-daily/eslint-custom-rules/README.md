### 自定义eslint 规则


``` typescript
'use strict'

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

const REPORT_MESSAGE =
  '💣💣💣 在 SSR 环境, 声明使用全局变量非常容易造成敏感信息泄露、内存泄漏、数据缓存等问题, 请务必确认当前使用方式不会发生以上问题 💥💥💥'

function report({ context, node, illegal }) {
  if (illegal.some(type => node.type === type)) {
    context.report({
      node,
      message: REPORT_MESSAGE
    })
  }
}

function check(item, context) {
  // const obj = {}
  // const arr = []
  // const date = new Date()
  if (item.type === 'VariableDeclaration') {
    const declarations = Array.isArray(item.declarations)
      ? item.declarations
      : []

    declarations
      .filter(declaration => {
        const init = declaration.init
        // const options = {
        //   fetch: {
        //     index: async (_: IInitDataParams, { post }: IFetcher) => {
        //       return post('cambridge/api/college/app/queryHotKeywords')
        //     }
        //   }
        // }
        if (
          init.type === 'ObjectExpression' &&
          typeof declaration.id === 'object' &&
          declaration.id.name === 'options'
        ) {
          return false
        }
        return typeof init === 'object'
      })
      .forEach(declaration => {
        const init = declaration.init

        report({
          node: init,
          context,
          illegal: ['ObjectExpression', 'ArrayExpression', 'NewExpression']
        })
      })
  }

  // module.exports = new Store()
  if (item.type === 'ExpressionStatement') {
    if (item.expression && typeof item.expression.right === 'object') {
      const right = item.expression.right

      report({
        node: right,
        context,
        illegal: ['NewExpression']
      })
    }
  }

  // export default new Store()
  if (item.type === 'ExportDefaultDeclaration') {
    if (typeof item.declaration === 'object') {
      const init = item.declaration

      report({
        node: init,
        context,
        illegal: ['NewExpression']
      })
    }
  }

  // export const s = new Store()
  if (item.type === 'ExportNamedDeclaration') {
    if (typeof item.declaration === 'object') {
      check(item.declaration, context)
    }
  }
}

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: REPORT_MESSAGE
    }
  },

  create: function(context) {
    return {
      'Program:exit'(node) {
        const body = Array.isArray(node.body) ? node.body : []

        body.forEach(item => {
          check(item, context)
        })
      }
    }
  }
}
```
