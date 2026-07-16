# Git 版本控制与工程化实践

> 本文是 user-chat 全栈项目学习笔记系列第 6 篇，讲解 Git 版本控制与工程化配置。

---

## 一、Git 基础

### 1.1 什么是 Git？

- **Git** 是分布式版本控制系统
- 记录代码的每次修改，支持回滚
- 支持多人协作开发

### 1.2 Git vs GitHub

| 概念 | 说明 |
|---|---|
| **Git** | 版本控制工具（本地） |
| **GitHub** | 代码托管平台（远程） |
| **仓库** | 项目代码的存储空间 |

---

## 二、基本工作流

### 2.1 三步提交法

```bash
# 1. 添加所有更改到暂存区
git add .

# 2. 提交到本地仓库
git commit -m "提交信息"

# 3. 推送到远程仓库
git push origin master
```

### 2.2 工作流图解

```
工作区 (Working Directory)
    ↓ git add .
暂存区 (Staging Area)
    ↓ git commit -m "msg"
本地仓库 (Local Repository)
    ↓ git push origin master
远程仓库 (Remote Repository - GitHub)
```

### 2.3 常用命令

| 命令 | 作用 |
|---|---|
| `git status` | 查看当前状态 |
| `git add .` | 添加所有更改 |
| `git commit -m "信息"` | 提交到本地 |
| `git push origin master` | 推送到远程 |
| `git pull origin master` | 拉取远程更新 |
| `git log --oneline` | 查看提交历史 |
| `git remote -v` | 查看远程仓库 |
| `git branch` | 查看分支 |

---

## 三、远程仓库配置

### 3.1 添加远程仓库

```bash
# HTTPS 方式
git remote add origin https://github.com/用户名/仓库名.git

# SSH 方式（推荐）
git remote add origin git@github.com:用户名/仓库名.git
```

### 3.2 SSH 配置

```bash
# 1. 生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "你的邮箱"

# 2. 查看公钥（添加到 GitHub Settings → SSH Keys）
cat ~/.ssh/id_rsa.pub

# 3. 修改远程地址为 SSH
git remote set-url origin git@github.com:用户名/仓库名.git
```

### 3.3 HTTPS vs SSH

| 方式 | 优点 | 缺点 |
|---|---|---|
| HTTPS | 简单易用 | 每次需要输密码 |
| SSH | 免密推送 | 需要配置密钥 |

---

## 四、.gitignore 配置

### 4.1 为什么需要 .gitignore？

> `node_modules` 不应提交到仓库，会占用大量空间

**不提交的原因：**
- `node_modules` 体积大（可能几百 MB）
- 可以通过 `npm install` 恢复
- 不同系统可能不兼容

### 4.2 标准 .gitignore 文件

```gitignore
# 依赖目录
node_modules/

# 构建产物
dist/
build/

# 日志文件
*.log
npm-debug.log*

# 环境变量
.env
.env.local

# 编辑器配置
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 缓存
.cache/
*.tmp
```

### 4.3 清理已提交的 node_modules

如果已经提交了 `node_modules`，需要清理：

```bash
# 从 Git 中移除（保留本地文件）
git rm -r --cached node_modules

# 提交清理
git commit -m "移除 node_modules，添加 .gitignore"

# 推送
git push origin master
```

> `--cached` 参数：只从 Git 追踪中移除，不删除本地文件

---

## 五、行尾符问题

### 5.1 LF vs CRLF

| 符号 | 全称 | 系统 |
|---|---|---|
| **LF** | Line Feed (`\n`) | Linux、macOS |
| **CRLF** | Carriage Return + Line Feed (`\r\n`) | Windows |

### 5.2 警告处理

```
warning: LF will be replaced by CRLF
```

**解决方法：**
```bash
# 配置 Git 自动转换
git config --global core.autocrlf true
```

---

## 六、首次上传项目

### 6.1 完整流程

```bash
# 1. 初始化 Git 仓库
git init

# 2. 配置用户信息（首次需要）
git config user.name "你的名字"
git config user.email "你的邮箱"

# 3. 添加远程仓库
git remote add origin git@github.com:用户名/仓库名.git

# 4. 添加所有文件
git add .

# 5. 首次提交
git commit -m "Initial commit"

# 6. 推送到 GitHub
git push -u origin master
```

### 6.2 后续更新

```bash
# 修改代码后
git add .
git commit -m "更新说明"
git push origin master
```

---

## 七、协作开发

### 7.1 分支管理

```bash
# 创建分支
git branch feature-login

# 切换分支
git checkout feature-login

# 创建并切换
git checkout -b feature-login

# 合并分支
git checkout master
git merge feature-login
```

### 7.2 协作流程

```
1. 克隆仓库      git clone <url>
2. 创建分支      git checkout -b feature
3. 开发提交      git add . && git commit -m "..."
4. 推送分支      git push origin feature
5. 发起 PR      (在 GitHub 上操作)
6. 合并代码      (管理员审核合并)
```

---

## 八、总结

| 知识点 | 核心要点 |
|---|---|
| 三步提交 | add → commit → push |
| SSH | 免密推送，推荐使用 |
| .gitignore | 忽略不需要提交的文件 |
| node_modules | 不提交，用 npm install 恢复 |
| 行尾符 | Windows 用 CRLF，配置 autocrlf |

---

> **上一篇：** [Node.js 快速搭建 RESTful API](./05-Node后端篇.md)
> **下一篇：** [前端开发效率工具集](./07-开发工具篇.md)
