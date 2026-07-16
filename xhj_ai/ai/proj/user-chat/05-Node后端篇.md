# Node.js 快速搭建 RESTful API

> 本文是 user-chat 全栈项目学习笔记系列第 5 篇，讲解使用 Node.js 和 json-server 快速搭建后端 API。

---

## 一、Node.js 与 npm

### 1.1 什么是 Node.js？

> JS 可以做前端、后端、AI

- **Node.js** 是 JavaScript 的服务端运行环境
- 让 JS 脱离浏览器，在服务器上运行
- 适合构建高性能、高并发的网络应用

### 1.2 什么是 npm？

- **npm** = Node Package Management（包管理工具）
- 用于安装、管理第三方包
- 随 Node.js 一起安装

---

## 二、后端项目搭建

### 2.1 初始化项目

```bash
# 初始化项目，生成 package.json
npm init -y
```

> `package.json` 是**后端项目描述文件**，记录项目信息和依赖。

### 2.2 package.json 详解

```json
{
  "name": "backend",           // 项目名称
  "version": "1.0.0",          // 版本号
  "description": "",           // 项目描述
  "main": "index.js",          // 入口文件
  "scripts": {
    "dev": "json-server --watch db.json"  // 启动命令
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "type": "commonjs",          // 模块系统
  "dependencies": {
    "json-server": "^1.0.0-beta.15"  // 依赖包
  }
}
```

### 2.3 安装依赖

```bash
# 安装 json-server
npm i json-server
```

> **json-server** 把对象字面量作为 HTTP server 来提供服务

---

## 三、json-server 使用

### 3.1 创建数据文件 db.json

```json
{
    "users": [
        {
            "id": 1,
            "name": "xi haojun",
            "age": 20,
            "hometown": "吉安"
        },
        {
            "id": 2,
            "name": "li si",
            "age": 19,
            "hometown": "北京"
        },
        {
            "id": 3,
            "name": "wangwu",
            "age": 20,
            "hometown": "上海"
        }
    ]
}
```

### 3.2 启动服务

```bash
# 方式1：使用 npm script
npm run dev

# 方式2：直接运行
json-server --watch db.json
```

启动后默认运行在 `http://localhost:3000`

### 3.3 API 端点

json-server 自动根据 JSON 结构生成 RESTful API：

| 方法 | URL | 功能 |
|---|---|---|
| GET | `/users` | 获取所有用户 |
| GET | `/users/1` | 获取 id=1 的用户 |
| POST | `/users` | 新增用户 |
| PUT | `/users/1` | 更新 id=1 的用户 |
| DELETE | `/users/1` | 删除 id=1 的用户 |

---

## 四、前后端联调

### 4.1 前端请求示例

```javascript
fetch('http://localhost:3000/users')
    .then(data => data.json())
    .then(data => {
        console.log(data);
        // 渲染数据到页面
    });
```

### 4.2 数据流

```
db.json (数据文件)
    ↓
json-server (HTTP服务)
    ↓
http://localhost:3000/users (API)
    ↓
fetch 请求 (前端)
    ↓
JSON 数据 (响应)
    ↓
渲染到 DOM (页面)
```

### 4.3 跨域问题

如果前端和后端不同源，可能遇到跨域问题：

```bash
# 启动时允许跨域
json-server --watch db.json --cors
```

---

## 五、常用 npm 命令

| 命令 | 作用 |
|---|---|
| `npm init -y` | 初始化项目 |
| `npm i <包名>` | 安装依赖 |
| `npm i <包名> -g` | 全局安装 |
| `npm run dev` | 运行 dev 脚本 |
| `npm uninstall <包名>` | 卸载依赖 |
| `npm list` | 查看已安装依赖 |

---

## 六、package.json 中 scripts 的作用

```json
{
  "scripts": {
    "dev": "json-server --watch db.json",
    "start": "node index.js",
    "build": "webpack"
  }
}
```

**使用方式：**
```bash
npm run dev     # 运行 dev 脚本
npm start       # 运行 start 脚本（start 可省略 run）
```

> `scripts` 相当于命令快捷方式，把常用命令封装起来

---

## 七、总结

| 知识点 | 核心要点 |
|---|---|
| Node.js | JS 服务端运行环境 |
| npm | Node 包管理工具 |
| package.json | 后端项目描述文件 |
| json-server | 快速搭建 RESTful API |
| db.json | 数据存储文件 |
| npm run dev | 启动开发服务 |

---

> **上一篇：** [前后端分离架构实践](./04-前端架构篇.md)
> **下一篇：** [Git 版本控制与工程化实践](./06-Git工程化篇.md)
