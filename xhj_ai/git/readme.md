# Git 开发必备技能

- xhj_ai 目录是什么？
项目开发目录
缺点？
  - 无法多人协作
    单机版本
    需要有一个中央仓库（remote） github/gitee/gitlab
    团队（分布在每个人的机器上 local）共享仓库的代码
    分布式 distribute
  - 文件 硬盘坏了 、找到之前的修改
      版本的概念 
      一个文件 有不同的版本（快照）
  - 不够工程化

## git init 
- 初始化
- 本地的代码目录升级为带有版本控制能力的代码仓库。
- 目录下多了一个.git 隐藏文件夹
    - 为什么要隐藏？∵不能乱改这个文件，只能按git要求来执行
    - windows 和 linus shell 脚本不一样
    - 项目目录下 git bash ，可以使用最简版本的linux命令
- ls - all

## git add 文件名 
- 将readme.md 添加进暂存区(stage)
2 insertions ： 2行新增  严谨需要，可以知道改变了哪些东西

## git commit -m "提交信息"
- 提交暂存区的文件到本地仓库
- 提交暂存区的文件到本地仓库，记录下提交信息
-  -m说明 不能乱写 leader 主要看这个，最终添加到仓库中
## 为什么要用两条命令把文件添加到仓库？
    - 完成某项功能， index.html, style.css, script.js
    stage 暂存区 多次添加， 不会带来仓库版本的改变
    git add index.html
    git add style.css
    git add script.js
    提前后悔一下的机会
    git commit -m "首页页面功能"
## git status
  什么时候用他呢？任何时候你需要清楚当前仓库的状态的时候
    任何关键时刻先git status

## 文件状态
- untracked 未跟踪状态
- to be commit 待提交
- add 多次，commit 一次（开发任务）
要保证仓库的干净

- add a repo   //repo就是一个远程仓库的意思