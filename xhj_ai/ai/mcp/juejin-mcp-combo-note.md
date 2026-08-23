---
title: "从「拿来主义」到「亲手造轮子」：2种MCP文件服务器写法全对比（附12步通信链路+8个真实坑）"
subtitle: "结合两个真实项目：官方 @modelcontextprotocol/server-filesystem 开箱即用 VS 手写 simple-read-mcp（McpServer+zod 极简模板），搞懂什么时候该用哪个"
categories: ["前端","AI","Node.js"]
tags: ["MCP","AI","Node.js","Agent","zod","Context Engineering","Claude Code","Trae"]
keywords: ["MCP","Model Context Protocol","@modelcontextprotocol/server-filesystem","手写 MCP Server","McpServer","stdio","zod","AI Agent","Context Engineering","Claude Code MCP 配置"]
cover: "https://picsum.photos/seed/mcp-combo-note-20260823b/1280/720"
summary: "2026 年 MCP（Model Context Protocol）已经从概念变成 AI 工程师的基础能力。面对同一个"读本地文件"的需求，有两种做法：① 官方现成的 @modelcontextprotocol/server-filesystem，npx 全局装、mcp.json 三行配置就能用；② 自己用 Node.js + McpServer + zod 写一个 simple-read-mcp，20 行代码注册一个 read_file 工具。本文基于作者真实项目（xhj_ai/ai/mcp 下两份 readme + 两套可跑代码），先从 MCP 是什么、资源 vs 工具两个概念讲透，再并排走完这两种方案：从依赖安装、全局配置、完整 12 步 stdio 通信链路（ASCII 时序图 + 逐词解析表格）、新旧 McpServer 语法糖差异，最后给出两套方案的对比表、8 条真实踩过的坑清单和 6 步自测 Checklist，读完不仅能独立跑通两种 MCP 文件服务器，还能在新项目里 3 秒判断该选"现成包"还是"自己写"。"
createTime: "2026-08-23"
updateTime: "2026-08-23"
author: "xhj"
---

# 从「拿来主义」到「亲手造轮子」：2 种 MCP 文件服务器写法全对比（附 12 步通信链路 + 8 个真实坑）

## 一、引言：为什么你会需要两种 MCP 写法？
2024 年 11 月 25 日 Anthropic 推出 **MCP（Model Context Protocol）**，一句"AI 届的 USB-C 接口"让所有 AI 客户端（Claude Code / Trae / Cursor）和所有资源（文件 / DB / 飞书 / 高德）开始按同一套协议互联互通。到 2026 年的今天，「会不会写 MCP Server」已经成为 AI 工程师和普通前端工程师的分水岭。

很多新手第一次学 MCP，都会被同一个问题卡住：

> **"我要让 AI 读本地文件，到底是直接 npm i 官方包就完事？还是要我自己从零写一个 MCP Server？两者差别是什么？"**

这其实就是「**拿来主义**」和「**亲手造轮子**」的经典选择。本文就拿作者的两个真实项目做对照：

- 📦 **方案一（拿来主义）**：用官方 `@modelcontextprotocol/server-filesystem` 包 —— 对应 `xhj_ai/ai/mcp/readme.md`「案例」小节（`npm i -g @modelcontextprotocol/server-filesystem` 那句话）
- 🔧 **方案二（亲手造轮子）**：用 Node.js + McpServer + zod 手写一个 `simple-read-mcp` —— 对应 `xhj_ai/ai/mcp/simple-read-mcp/readme.md` 全部 12 行（手写 MCP 职责 / 依赖安装 / 12 步调用链）

读完本文你会得到 4 件事：
1. 两种方案从 0 到能跑的完整步骤（可复制命令 / 可复制代码模板）
2. simple-read-mcp/readme.md 里那条"12 步 MCP 调用链"的**逐词拆解 + ASCII 时序图**，以后你能一眼看懂 MCP 消息是怎么流动的
3. **8 条真实踩过的坑清单**（全是跑代码真实炸过的，每一条都能对应一个具体报错号 + 一句话修复）
4. 两套方案并排对比表，让你在新项目 3 秒判断用哪个

---

## 二、先搞懂 MCP 基础：是什么？不是什么？资源 vs 工具？
在开始两套方案之前，先把你 `mcp/readme.md#L32-L41` 那段「MCP 是什么」用三张图讲透，避免跑代码了还在糊涂。

### 2.1 MCP 是什么？不是什么？
`mcp/readme.md#L32-L34` 原话：

> - 它不是一个工具，也不是一个应用，不是一个 api sdk，也不是一个产品，而是一个协议。它的目标是希望任何一个 AI 模型，能以统一的方式去访问资源和工具。mcp 就是 llm 和外部世界的一个通信协议。

一张图讲清这句话：

```
                 ┌───────────────────────────────────────────────┐
                 │          MCP 协议（USB-C 接口规矩）           │
                 └───────────────────────────────────────────────┘
                             ▲                   ▲
                             │                   │
                MCP Host（Claude Code / Trae）  MCP Server（文件/DB/飞书/高德）
                             │                   │
                             ▼                   ▼
                      ┌──────────────┐     ┌──────────────┐
                      │    LLM       │     │  fs / API    │
                      │ （推理干活）   │     │ （真实世界）  │
                      └──────────────┘     └──────────────┘
```

- **MCP = 一套规矩**，规定了"握手怎么握、工具怎么列、调用怎么发、响应怎么拼、返回怎么按 id 对应"。它不是 npm 包、不是 SaaS、不是某个具体的应用 —— `@modelcontextprotocol/sdk` 才是 npm 包（按 MCP 规矩封装好的实现）。
- **LLM 和外部世界之间必须有"翻译官"**：LLM 只会吐字，不会读文件、不会发邮件，所有这些外部动作都要按 MCP 协议这条规矩去"翻译"给 Server，Server 干完再"翻译"回来。

### 2.2 资源 vs 工具（readme 最容易混的一对概念）
`mcp/readme.md#L36-L41` 原话：

> 模型需要交互什么呢？模型想知道、能用、能调的内容。（工具和资源）
> - 资源：数据库、API、文件，SaaS（飞书、高德地图）
> - Tool：创建日历、发邮件、执行命令、远程控制。这些资源和工具就是让大模型变得真正有用的上下文和能力。

做成对照卡就不会混：

| 维度 | Resource（资源） | Tool（工具） |
|---|---|---|
| 本质 | **数据**（被"看到"的东西，纯读） | **动作**（会产生副作用） |
| 生活类比 | 书架上的一本书 | 你手里的笔 |
| MCP 注册方法 | `server.resource('file', 'file://{path}', '文件内容', handler)` | `server.tool('read_file', '描述', zodSchema, handler)` |
| 列出方法 | `resources/list` | `tools/list` |
| 变更通知 | 可以订阅（比如文件改了自动推给 Agent）| 一般不缓存，每次直接执行 |
| 例子 | DB 某一行、飞书文档原文、本地文件内容 | 读文件（对，read_file 是动作所以我们注册成 tool）、写文件、发邮件、执行 shell |

> 💡 为什么我们的 `read_file` 注册成 `.tool()` 不是 `.resource()`？因为以后还要加 `write_file`、`list_dir`、`delete_file` 这些明显是动作的，统一用 tool 注册**扩展性好**；如果你的项目真的只是"只读地给模型喂一些文档"，那用 `.resource()` 更准确、能享受到订阅变更的好处。

---

## 三、方案一：拿来主义 —— 官方 filesystem server（3 步搞定）
对应 `mcp/readme.md#L26-L28` 的原话：

> `npm i -g @modelcontextprotocol/server-filesystem`，MCP 官方文件系统服务端，安装完了之后，本地 server / 远程 server，用于通过 MCP 协议安全读写本地指定目录文件，为 AI 模型提供合规的本地文件访问能力。

这就是典型的「拿来主义」：官方包封装好了一切，你只要告诉它两件事 —— ① 你想让 AI 访问**哪个目录**（围墙边界）② 用哪种**传输方式**（stdio / HTTP）。

### Step 1：全局装包
```bash
npm i -g @modelcontextprotocol/server-filesystem
```

你也可以不全局装，直接在配置里用 `npx -y @modelcontextprotocol/server-filesystem` 临时拉包用（npx -y = 没装就临时下载、不确认），适合偶尔用的场景。

### Step 2：写全局 MCP 配置（最关键的一步）
⚠️ **Claude Code / Trae 不从项目子目录读 `.mcp.json`**，它默认读的全局配置位置是：
- Windows：`C:\Users\<你的用户名>\.claude\mcp.json`
- macOS / Linux：`~/.claude/mcp.json`

写进下面这段：

```json
{
  "mcpServers": {
    "filesystem": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-filesystem",
        "C:/Users/xhj/Desktop/db_ai/xhj_ai/ai/mcp/mcp-test"
      ]
    }
  }
}
```

逐字段解释：
| 字段 | 值 | 含义 |
|---|---|---|
| `type` | `"stdio"` | 用 stdio 传输（父子进程管道，不开端口、本机用、最安全）|
| `command` | `"npx"` | 用 npx 启动（没装就下，装了就用全局）|
| `args[0]` | `"-y"` | npx 不弹安装确认（自动化友好）|
| `args[1]` | `"@modelcontextprotocol/server-filesystem"` | 要跑的 MCP Server 包名 |
| `args[2]` | `"C:/.../mcp-test"` | ⚠️ 安全围墙：AI 只能访问这个目录及子目录，越界绝对读不到。**正斜杠或双反斜杠，不能写单反斜杠 `C:\xxx`**（JSON 里单反斜杠是转义字符，路径会被吃）|

### Step 3：重启 Host 验证
重启 Claude Code → 输入 `/mcp list` → 应该能看到 `filesystem (stdio)`。然后说：「列出 mcp-test 目录下的文件」→ 如果能列出来，方案一成了。

> 💡 方案一最大优点：**3 步、0 代码、官方维护**。对于「我就是想让 AI 能读我本地项目文件夹」这个需求，90% 场景用它足矣。

---

## 四、方案二：亲手造轮子 —— 手写 simple-read-mcp（20 行模板）
对应 `simple-read-mcp/readme.md#L1-L12` 全部内容：
```
# 手写文件处理mcp
- server fs 读取文件 
  - schema 声明 函数名字，参数传递一个地址
  返回 上下文 给 llm
- server 还要满足 mcp 通信协议

## 开发
- pnpm i zod         ← 数据验证 schema
- pnpm i @modelcontextprotocol/sdk  ← 协议 SDK 通信部分
```

这 12 行看着短，其实已经把「怎么写 MCP Server」骨架写全了。下面按顺序走完。

### Step 1：初始化项目 + 装依赖
```bash
mkdir simple-read-mcp && cd simple-read-mcp
pnpm init -y
# 手动编辑 package.json 加一行："type": "module"  ← 让 .js 用 ES Module（import 语法）
pnpm i zod                       # readme 原话：数据验证 schema
pnpm i @modelcontextprotocol/sdk # readme 原话：协议通信部分
```

### Step 2：写 server.js（新版 McpServer + zod，20 行注册一个工具）
这是**新版 SDK 推荐的高级语法糖**，对比你之前写过的旧版 `Server + setRequestHandler + 手写 JSON Schema`，代码量从 60+ 行 → 20 行：

```js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from 'fs/promises';

// ✨ 实例化：不用手写 capabilities（McpServer 根据你后面注册的工具自动推导）
// 彻底避免之前的「capabolities 拼写错 / tool 少 s → Server 不认工具能力」坑
const server = new McpServer({
  name: 'simple-read-mcp',
  version: '1.0.0'
});

// 🔑 server.tool 一行模板 = 旧版三件事合并：
// ① 自动注册 tools/list handler（Agent 一问"你有哪些工具"就返回正确 schema）
// ② 自动注册 tools/call handler（按工具名分发，不用自己写 switch(name)）
// ③ 把 zod schema → 转成合规 JSON Schema（required 位置一定正确）
server.tool(
  "read_file",
  "读取指定路径的本地文件内容",
  { path: z.string().describe("文件的绝对或相对路径") }, // zod → 自动校验参数
  async ({ path }) => {
    try {
      const content = await fs.readFile(path, 'utf-8');
      return { content: [{ type: "text", text: content }] }; // MCP 规定返回格式
    } catch (err) {
      return { isError: true, content: [{ type: "text", text: `读取文件失败：${err.message}` }] };
    }
  }
);

// 🚀 启动：stdio 传输层 + 打 stderr（不能打 stdout，stdout 是 MCP 协议通道）
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP read_file 服务已启动（stdio 模式）"); // ✅ stderr 不污染协议
}
main().catch(console.error); // 兜底 UnhandledPromiseRejection
```

这段代码刚好**把 simple-read-mcp/readme.md L1-L10 全部实现**：
- `server fs 读取文件` → `fs.readFile(args.path, 'utf-8')`
- `schema 声明 函数名字，参数传递一个地址` → `server.tool("read_file", ..., { path: z.string().describe(...) }, ...)`
- `返回上下文给 llm` → `{ content: [{ type: 'text', text: content }] }`
- `server 还要满足 mcp 通信协议` → `McpServer` + `StdioServerTransport` 帮你搞定
- `pnpm i zod`、`pnpm i @modelcontextprotocol/sdk` → Step 1 里真的装了

### Step 3：写全局配置 + 重启 Host
在 `C:\Users\xhj\.claude\mcp.json` 里 `mcpServers` 加一段：
```json
"simple-read-mcp": {
  "type": "stdio",
  "command": "node",
  "args": [ "C:/Users/xhj/Desktop/db_ai/xhj_ai/ai/mcp/simple-read-mcp/server.js" ]
}
```
重启 Claude Code → `/mcp list` 看到 `simple-read-mcp (stdio)` → 问「用 simple-read-mcp 读 test.js」→ OK。

---

## 五、打通「最后一公里」：12 步通信链路逐词解析
simple-read-mcp/readme.md 最精华的一句话是 L12：

> `cc prompt -> llm -> 分析 -> 选中fs client -> stdioServerTransport -> stdin -> server -> 执行返回 -> stdout -> StdioServerTransport -> cc -> llm -> generate`

这 12 个箭头其实就是 **MCP 标准工作流的完整数据通路**。初学者经常会问「我调用 `fs.readFile` 的结果怎么就能回到 AI 聊天框里？」，答案全在这 12 步里。

### 5.1 ASCII 时序图（比纯文字直观 10 倍）
```
 你（用户）        Claude Code Host          LLM         simple-read-mcp server      资源文件 test.js
    │                   │                      │                  │                      │
    │  "读一下test.js"   │                      │                  │                      │
    │──────────────────▶│  cc prompt           │                  │                      │
    │                   │─────────────────────▶│  llm: 分析推理    │                      │
    │                   │                      │  "这个要真读文件" │                      │
    │                   │◀─────────────────────│  选择 read_file   │                      │
    │                   │                      │  填 path 参数     │                      │
    │                   │                      │                  │                      │
    │                   │ [stdioClientTransport]                    │                      │
    │                   │─────────────────────────────▶ stdin       │                      │
    │                   │  JSON-RPC id=3 tools/call                │                      │
    │                   │                      │                  │ fs.readFile(path)     │
    │                   │                      │                  │──────────────────────▶│
    │                   │                      │                  │◀──────────────────────│
    │                   │                      │                  │  "let i = 1; ..."    │
    │                   │                      │                  │                      │
    │                   │◀───────────────────────────── stdout     │                      │
    │                   │                     [StdioServerTransport]                      │
    │                   │  JSON-RPC id=3 content:{text:"..."}                            │
    │                   │                      │                  │                      │
    │                   │ 把 content 拼进 Prompt│                  │                      │
    │                   │─────────────────────▶│  llm: generate 再 │                      │
    │                   │◀─────────────────────│  基于内容生成答案 │                      │
    │◀──────────────────│                      │                  │                      │
    │  "test.js 里写了："│                      │                  │                      │
    │  "let i = 1; ..." │                      │                  │                      │
```

### 5.2 逐词解析表格
| # | 链路里的词 | 技术对应物 | 在整个流程里的作用 |
|---|---|---|---|
| 1 | `cc prompt` | 你在 Claude Code（简称 CC）输入框里敲的内容 | 触发整个 MCP 工作流的事件 |
| 2 | `llm` | Host 调的大模型（Claude Sonnet / GPT-4o / 通义…）| 第一次调用：决定「直接答还是用工具？用哪个工具？传什么参数？」|
| 3 | `分析` | 模型的 tool-calling 推理步骤 | Context Engineering 核心：预训练知识答不上的 → 去看有哪些 MCP Server 可用 |
| 4 | `选中fs client` | Host 根据 `mcp.json` 定位到 `simple-read-mcp` 这条配置 | 找到对应的子进程启动方式 |
| 5 | `stdioServerTransport` | Host（Client 侧）传输对象 | 把工具调用**序列化**成一行 JSON-RPC，写进子进程的 stdin |
| 6 | `stdin` | Standard Input，操作系统级父子进程共享的「进水管」| 你之前问过的「stdio 是什么」的关键概念之一：Host → Server 的消息通道 |
| 7 | `server` | `simple-read-mcp/server.js` 里的 McpServer 实例 | 内部按工具名找到对应 handler → 调 `fs.readFile(args.path, 'utf-8')` |
| 8 | `执行返回` | handler 执行完后按 MCP 规范拼返回值 `{ content: [{ type:'text', text: ... }] }` | 失败则 `{ isError: true, content:[{ type:'text', text:'失败：xxx' }] }` |
| 9 | `stdout` | Standard Output，操作系统级「出水管」| Server → Host 的消息通道（和 stdin 是一对管道）|
| 10 | `StdioServerTransport` | Server 侧的传输对象（和第 5 步 Client 侧对称）| 把响应**序列化**成一行 JSON-RPC，写进 stdout |
| 11 | `cc` | 回到 Claude Code Host 侧 | 按 JSON-RPC 的 id 匹配（id=3 的响应对应 id=3 的请求），把 content 存起来 |
| 12 | `llm -> generate` | Host 把 content **拼进下一轮 Prompt 的上下文**，再发一次 LLM | 第二次调用：LLM 基于真实读到的内容生成人类可读的最终回答 |

> 🔑 最关键的洞察：**LLM 被调用了两次**。第一次「选工具+填参数」（纯推理），第二次「基于工具返回内容生成答案」。这就是 RAG 三兄弟：**R=Retrieval（通过 MCP 检索到内容）→ A=Augment（把内容拼进 Prompt）→ G=Generate（LLM 再生成）**。

---

## 六、两套方案并排对比表（3 秒决定用哪个）
| 维度 | 📦 方案一：官方 `@modelcontextprotocol/server-filesystem` | 🔧 方案二：手写 `simple-read-mcp` |
|---|---|---|
| **代码量** | **0 行**（npm i 完就用） | ~80 行（import + 实例化 + 注册工具 + 启动）|
| **工具可扩展** | ❌ 只能读/写/列/删（官方固定 4 个工具）| ✅ 想加什么加什么：`query_mysql` / `send_email` / `check_traffic` … 每个工具 20 行模板复制改 |
| **灵活性** | ❌ 只能做它内置的那几个文件操作 | ✅ 任意：加白名单路径、加审计日志、接自定义权限系统、做路径转换、接远程 WebDAV … |
| **上手难度** | ⭐ 简单（3 步）| ⭐⭐ 中等（要懂 McpServer / zod / 一点点 stdio 概念）|
| **维护成本** | ✅ 官方跟着 MCP 协议升级 | ⚠️ 你自己跟着 SDK 版本升级（zod 4.x 升级过 API 就手动过一次）|
| **安全边界** | ✅ 内置「目录围墙」， args 最后一个目录越界绝对读不到 | ⚠️ 自己写：你忘了围墙 AI 就能读到 C 盘任何文件 |
| **适合的团队规模** | 个人 / 小团队（90% 场景）| 中大型团队（要接 DB / SaaS / 要自定义审计和权限）|
| **学习价值** | 低（只会用不理解原理）| 极高（能彻底搞懂 MCP 协议、JSON-RPC、stdio、zod）|

**一句话判断**：
- **「我只想让 AI 读我本地项目文件夹、马上干活」→ 直接上方案一，别纠结**
- **「我要学 MCP 原理 / 以后想接 DB 接飞书 / 想做自己的工具生态」→ 一定要写一次方案二，真懂了再用官方包也不迟**

---

## 七、8 条真实踩过的坑（每条对应一个具体报错号 + 一句话修复）
跑这两套方案的过程中，作者踩过的坑全在这里。每条都有具体的报错关键字（可以直接 ctrl+f 自己的终端报错定位）。

| # | 报错关键字 | 根因 | 一句话修复 |
|---|---|---|---|
| 1 | `ERR_MODULE_NOT_FOUND: Cannot find module .../server/stdio imported` | import SDK 内部路径**没写 `.js` 后缀**。SDK package.json 的 exports map 严格匹配，不会自动补扩展名 | `server/stdio` → `server/stdio.js`，所有 SDK 内部子路径一律补 `.js` |
| 2 | `ERR_MODULE_NOT_FOUND: .../server/schema.js` | `server/schema.js` **根本不存在**，想当然猜 SDK 目录结构。Schema 统一在 types.js 暴露 | 改成 `import { ListToolsRequestSchema, CallToolRequestSchema } from '@modelcontextprotocol/sdk/types.js'` |
| 3 | `No MCP servers configured` | 你把 `.mcp.json` 放在项目子目录（比如 `mcp-test/.mcp.json`），Claude Code 根本不去那里找 | 全局配置写在 `C:\Users\xhj\.claude\mcp.json`，写完重启 Host |
| 4 | `None of the specified directories are accessible`（方案一常见）| `mcp.json` 里写的围墙目录路径是 `C:\Users\xhj\...` 单反斜杠 —— JSON 里单反斜杠是转义字符，路径被吃掉了 | 写成**正斜杠** `C:/Users/...` 或**双反斜杠** `C:\\Users\\...` |
| 5 | Host 握手失败、解析 JSON-RPC 报错 | 启动日志写了 `console.log('服务已启动')` → 写进了 stdout 协议通道，Host 把它当 JSON-RPC 去 parse | 所有调试/启动日志一律 `console.error`（写 stderr）或重定向到文件 |
| 6 | `Server does not support tools`（旧版写法才会有）| `capabilities` 拼写错成 `capabolities` 或 `tools` 少 s 写成 `tool` → Server 不认为自己有工具能力 | 用新版 McpServer，不用手写 capabilities，自动推导 |
| 7 | 参数不传 path 也能进 handler，然后 `fs.readFile` 炸（旧版写法）| JSON Schema 的 `required:['path']` **缩进错了，写到 properties 内部** —— 等于没声明 | 用新版 zod，`z.string()` 默认必填 + 位置永远正确 |
| 8 | `SyntaxError: Unexpected token '.'`（写 JS 链调用常见）| 链式调用 `.map().sort().reverse().slice()` **中间写了分号** → 链被截断，下一行开头单独一个 `.` 就是语法错误 | 整条链只在**最后一行末尾**写分号，中间不写；或者写 `;` 之前想清楚：这是一句话的结束吗？ |

---

## 八、自测 6 步 Checklist（以后忘了，照做 100% 能跑起来）
- [ ] **Step 1：依赖存在**
  - 方案一：`npm list -g @modelcontextprotocol/server-filesystem` 有版本号
  - 方案二：`cd simple-read-mcp` 然后 `ls node_modules/zod` 和 `ls node_modules/@modelcontextprotocol/sdk/dist/esm/server/mcp.js` 都能看到文件
- [ ] **Step 2：ESM OK**（方案二）：`cat simple-read-mcp/package.json | grep '"type"'` 看到 `"type": "module"`
- [ ] **Step 3：Smoke Test（不启动 Claude Code，先自测 server 对不对）**：复制下面 4 行 PowerShell 跑
  ```powershell
  cd C:\Users\xhj\Desktop\db_ai\xhj_ai\ai\mcp\simple-read-mcp
  @'
  {"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"test","version":"1.0"}}}
  {"jsonrpc":"2.0","method":"notifications/initialized"}
  {"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"read_file","arguments":{"path":"C:\\Users\\xhj\\Desktop\\db_ai\\xhj_ai\\ai\\mcp\\mcp-test\\test.js"}}}
  '@ | node server.js 2>$null
  ```
  ✅ id=3 的响应里 `text` 是 `let i = 1;\nlet b = 2;\n` 就过
- [ ] **Step 4：全局配置正确**：`C:\Users\xhj\.claude\mcp.json` 里有对应 server 段、路径是正斜杠或双反斜杠、command 在 PATH 里（npx / node）
- [ ] **Step 5：重启 Claude Code**（改了 mcp.json 必须重启，配置启动时读）
- [ ] **Step 6：Host 内验证**：`/mcp list` 显示目标 server → 说「用 xxx 读一下 test.js」→ 读到内容 = 全链路通

---

## 九、从 Chatbot 到 Agentic AI：为什么 MCP 是新基建？
回到 `mcp/readme.md#L30` 那句最有高度的原话：

> MCP 不单单只是便利，而是从根本上重构了 AI 的整个应用架构，真正把 AI，从 chatbot 推到了 Agentic AI（智能体 AI）阶段。

这句话怎么理解？用一张前后时代对比图：

```
 「Chatbot 时代」
 ┌──────────┐
 │  用户问题  │
 └────┬─────┘
      ▼
 ┌──────────┐    靠预训练知识 + 一点点 Prompt 工程
 │   LLM    │──────────────────────────────────────▶ 用户收到「看起来很对」的空话
 └──────────┘
```

```
 「Agentic AI 时代（有了 MCP 之后）」
 ┌──────────┐      ┌──────────────────────────────┐      ┌─────────────┐
 │  用户问题  │─────▶│ MCP Host 选工具 → 填参数 →  │─────▶│ MCP Server  │
 └──────────┘      │ 执行返回 → 再拼进 Prompt →    │◀─────│ (真读文件/  │
                   │ 让 LLM 基于真实内容生成答案    │      │  真查DB/    │
                   └──────────────────────────────┘      │  真发邮件)  │
                                │                         └─────────────┘
                                ▼
                        「基于事实的」落地回答
```

Chatbot 时代的 LLM 像「嘴炮专家」：会说、不会干、瞎编数据、读不到你私有的 DB。Agentic AI 时代的 LLM 像「执行总裁」：不会直接说答案，先**调研**（读 MCP Resource）、**决策**（选 MCP Tool）、**执行**（调 MCP Server）、**汇报**（基于执行结果生成）。

让「嘴炮专家」进化成「执行总裁」的那根数据线，就是 MCP。今天我们写的这两套文件服务器，正是那根数据线的一端。

---

## 十、结语
2026 年学 MCP，有两条必经之路：

1. **「拿来主义」路径**：用官方包、3 步跑起来 —— 解决你 90% 的日常问题，让 AI 立刻能读本地项目文件。
2. **「亲手造轮子」路径**：用 Node.js + McpServer + zod 写一个 simple-read-mcp —— 真正搞懂 JSON-RPC、stdio 管道、zod Schema、MCP 返回格式这些底层原理，为将来接 DB、接 SaaS、做团队的 MCP 工具生态打基础。

本文把两条路径的代码、配置、通信链路、踩坑全部摆在你面前了。接下来最值得做的事只有一件：

**打开终端，按第八节自测 6 步，亲手跑一次两套方案。** 等你亲眼看到 simple-read-mcp 的 `read_file` 工具把 test.js 的内容吐出来、Claude Code 基于真实内容生成回答的那一瞬间，MCP 对你就不再是文档里的抽象概念 —— 它是你每天都能用来提效的那根「USB-C 数据线」。

**Happy Coding，也 Happy Context Engineering！**
