---
home: false
sidebar: false
---

GitHub Actions 是 GitHub 的持续集成服务, 每个 action 就是一个独立脚本.
GitHub 做了一个 [Actions 官方市场](https://github.com/marketplace?type=actions)，可以搜索到他人提交的 actions

**_ GitHub Actions 有一些自己的术语 _**

- workflow，工作流程：持续集成一次运行的过程，就是一个 workflow。
- job，任务 ：一个 workflow 由一个或多个 jobs 构成，含义是一次持续集成的运行，可以完成多个任务。
- step，步骤：每个 job 由多个 step 构成，一步步完成。
- action，动作：每个 step 可以依次执行一个或多个命令（action）。

#### workflow

GitHub Actions 的配置文件叫做 workflow 文件，存放在代码仓库根目录的 .github/workflows 目录下。
workflow 文件采用 YAML 格式，文件名可以任意取，但是后缀名统一为.yml，比如 foo.yml。一个库可以有多个 workflow 文件。
GitHub 只要发现 .github/workflows 目录里面有 .yml 文件，就会自动运行该文件。

workflow 文件的配置字段非常多 下面是一些基本字段

1、 `name`
name 字段是 workflow 的名称。GitHub 在存储库的“操作”页面上显示工作流程的名称。如果省略 name，则 GitHub 将其设置为相对于存储库根目录的工作流文件路径。

2、 `on`
必需触发工作流程的 GitHub 事件的名称。您可以提供一个事件 string，array 一个事件，array 一个事件 types 或一个事件配置 map，以安排工作流程或将工作流程的执行限制为特定的文件，标记或分支更改。有关[可用事件的列表](https://docs.github.com/en/actions/using-workflows/events-that-trigger-workflows)

示例：

```yml
# Trigger on push
on: push
# Trigger the workflow on push or pull request
on: [push, pull_request]
# 指定触发事件时，可以限定分支或标签
on:
  # Trigger the workflow on push or pull request,
  # but only for the master branch
  push:
    branches:
      - master
# 上面代码指定，只有 master 分支发生 push 事件时，才会触发 workflow
```

3 、 `jobs`
workflow 文件的主体是 jobs 字段，表示要执行的一项或多项任务  
jobs 字段里面，需要写出每一项任务的 job_id，具体名称自定义。job_id 里面的 name 字段是显示在 GitHub 上任务的说明。

```yml
jobs:
  my_first_job:
    name: My first job
  my_second_job:
    name: My second job
#  上面代码的 jobs 字段包含两项任务，job_id 分别是 my_first_job 和 my_second_job
```

`needs` 字段指定当前任务的依赖关系，即运行顺序

```yml
jobs:
  job1:
  job2:
    needs: job1
  job3:
    needs: [job1, job2]
# 上面代码中，job1 必须先于 job2 完成，而 job3 等待 job1 和 job2 的完成才能运行。因此，这个 workflow 的运行顺序依次为：job1、job2、job3
```

`runs-on` 字段指定运行所需要的虚拟机环境

- GitHub 托管的可用虚拟机为

| 虚拟环境             | YAML 工作流程标签                |
| -------------------- | -------------------------------- |
| Windows Server 2019  | windows-latest 要么 windows-2019 |
| Ubuntu 18.04         | ubuntu-latest 要么 ubuntu-18.04  |
| Ubuntu 16.04         | ubuntu-16.04                     |
| macOS 卡塔利娜 10.15 | macos-latest 要么 macos-10.15    |

完整案例

```yml
name: Greeting from Mona
on: push
jobs:
  my-job:
    name: My Job
    runs-on: ubuntu-latest
    steps:
      - name: Print a greeting
        env:
          MY_VAR: Hi there! My name is
          FIRST_NAME: Mona
          MIDDLE_NAME: The
          LAST_NAME: Octocat
        run: |
          echo $MY_VAR $FIRST_NAME $MIDDLE_NAME $LAST_NAME.
```
