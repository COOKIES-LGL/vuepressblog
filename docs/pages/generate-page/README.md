---
sideBar: false;
---

### 案例
``` javascript
const inquirer = require('inquirer')
const { addNewRoute } = require('./new-route.js')

const enumTemplateType = {
  routePage: '普通页面：TableWithFilter',
}

// 通过命令行选择模板类型
const chooseCreate = async () => {
  const questions = [
    {
      type: 'list',
      name: 'templateType',
      message: '请选择模板类型',
      choices: [enumTemplateType.routePage, enumTemplateType.drawer, enumTemplateType.print]
    }
  ]
  const { templateType } = await inquirer.prompt(questions)

  if (templateType === enumTemplateType.routePage) {
    const questions = [
      {
        type: 'confirm',
        name: 'hasButton',
        message: '需要Button区域吗？',
        default: true
      },
      {
        type: 'input',
        name: 'menuName',
        message: '请输入菜单名称',
        validate: val => {
          if (!val) {
            return false
          }
          return true
        }
      },
      {
        type: 'input',
        name: 'filePath',
        message: '请输入文件路径(相对于src/routes)：',
        validate: val => {
          if (!val) {
            return false
          }
          return true
        }
      }
    ]

    const { hasButton, menuName, filePath } = await inquirer.prompt(questions)

    await addNewRoute({ hasButton, menuName, filePath })
    return
  }
}

// 默认创建 search+table+button
const quickCreate = async args => {
  await addNewRoute({ hasButton: true, menuName: args[0], filePath: args[1] })
}

async function main() {
  // 获取传入的参数
  const args = process.argv.slice(2).map(item => (item === 'undefined' ? undefined : item))

  // 没有输入参数时，命令行交互选择模板
  if (args.length === 0) {
    await chooseCreate()
    return
  }

  if (args.length === 1) {
    console.log('请依次输入 [菜单名(中文)] [文件路径(相对src/routes)]')
    process.exit(0)
  }

  // 输入参数时，创建默认模板
  quickCreate(args)
}

main()

```

