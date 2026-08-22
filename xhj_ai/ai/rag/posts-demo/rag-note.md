# RAG 语义搜索实战 · 学习笔记

> 这篇笔记把整个 `posts-demo` 项目里的所有源文件、知识点、踩过的坑、运行流程都串起来，**自包含**——之后回看时不需要再翻别的资料就能看明白。

---

## 0. 这篇笔记解决什么问题

很多教程讲 RAG 都停留在概念，代码一上手就懵。这份笔记配合 `posts-demo` 项目里的真实可跑代码，回答 3 个问题：

1. **RAG 到底在干什么？**（概念）
2. **每一行代码在干这件事里的哪一步？**（落地）
3. **跑起来要注意什么坑？**（实战）

---

## 1. RAG 是什么：检索 → 增强 → 生成

**RAG = Retrieval-Augmented Generation（检索增强生成）**

| 阶段 | 中文 | 做什么 | 本项目覆盖？ |
|---|---|---|---|
| **R**etrieval | 检索 | 从知识库里找出和问题相关的内容 | ✅ 全做完了 |
| **A**ugment | 增强 | 把检索结果拼到提示词里，作为"参考资料"喂给大模型 | ❌ 没做 |
| **G**enerate | 生成 | 大模型基于参考资料 + 问题生成回答 | ❌ 没做 |

本项目只做 **检索这一半**——而且是最简单的形态：**用余弦相似度做向量检索**。但这是 RAG 最核心、最值钱的一步，搞定它，剩下两步只是把字符串拼一下、调一次 chat API。

### 为什么传统搜索不行？

假设知识库里有这条数据：`"酸辣土豆丝的做法..."`

| 用户问 | 正则 / SQL `LIKE` | 向量搜索 |
|---|---|---|
| `酸辣土豆丝` | ✅ 字面匹配，命中 | ✅ 命中 |
| `马铃薯怎么做？` | ❌ "土豆丝" ≠ "马铃薯"，字面不匹配 | ✅ **语义命中**——土豆=马铃薯，模型懂这个同义关系 |

向量搜索的精髓：**模型理解"意思"，不只比"字面"**。

---

## 2. 项目结构 + 每个文件的职责

```
posts-demo/
├── .env                          # 阿里 API Key（不能提交到 git）
├── package.json                  # 依赖声明（dotenv + openai）
├── readme.md                     # 原始简短笔记
├── app.service.mjs               # 【配置层】封装 OpenAI client，可复用
├── index.mjs                     # 【测试层】最小化 hello world，验证 API 通不通
├── create-embedding.mjs          # 【第一阶段】把 posts.json 向量化，输出 posts-embedding.json
├── semantic-search.mjs          # 【第二阶段】命令行交互式语义搜索（主入口）
└── data/
    ├── posts.json                # 原始数据：32 条博客标题（检索范围）
    └── posts-embedding.json      # 向量化后的数据：每条多了 embedding 字段
```

| 文件 | 一句话 | 运行命令 |
|---|---|---|
| `app.service.mjs` | 准备好一个能调阿里通义 OpenAI 兼容接口的 client | 不直接运行，被别的文件 import |
| `index.mjs` | 测试 client 能不能调通 | `node index.mjs` |
| `create-embedding.mjs` | 一次性把全部 post 转成向量持久化到文件 | `node create-embedding.mjs` |
| `semantic-search.mjs` | 启动交互搜索，用户输入 → Top3 | `node semantic-search.mjs` |

执行顺序：**先 `create-embedding.mjs`（生成向量文件）→ 再 `semantic-search.mjs`（消费向量文件）**。第二次以后只跑 `semantic-search.mjs` 就行，向量文件已经存好了。

---

## 3. 配置层：`app.service.mjs`（怎么连大模型）

```js
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

export const client = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL:'https://dashscope.aliyuncs.com/compatible-mode/v1'
})
```

### 逐行讲

| 行 | 代码 | 作用 |
|---|---|---|
| 1 | `import OpenAI from 'openai'` | 引入官方 `openai` npm 包。它默认连 OpenAI 官方 API，但**可以通过 `baseURL` 改成连阿里通义** |
| 2-3 | `import dotenv from 'dotenv'; dotenv.config()` | 把 `.env` 文件里的环境变量（如 `DASHSCOPE_API_KEY=sk-xxx`）加载到 `process.env` |
| 6 | `new OpenAI({...})` | 创建一个 client 实例，配置好鉴权和地址 |
| `apiKey` | `process.env.DASHSCOPE_API_KEY` | 从环境变量读 key（**不要把 key 硬编码进代码**，会泄露） |
| `baseURL` | `https://dashscope.aliyuncs.com/compatible-mode/v1` | 阿里通义的 **OpenAI 兼容接口**地址。改了这一个就能用 OpenAI SDK 调阿里模型 |
| 6 | `export const client` | 把 client 导出，让别的文件复用 |

### 📚 知识点：为什么把 client 单独放一个文件？

如果每个脚本都自己 `new OpenAI(...)`，会有 3 个问题：
1. **配置重复**：改一次 baseURL 要改 N 个文件
2. **密钥暴露面变大**：每个文件都直接 `process.env.XXX`
3. **不利于切换**：以后要换成 GPT 或本地模型，要改 N 处

抽成 `app.service.mjs` 是大型项目标准做法——**单一职责**：这个文件只负责"造一个能用的 client"，别的文件只管"用"。

### `.env` 文件内容（不提交到 git）

```env
DASHSCOPE_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
```

⚠️ 一定要把 `.env` 加进 `.gitignore`。如果 key 不小心提交到 GitHub，阿里会立刻吊销。

---

## 4. 测试层：`index.mjs`（最小化验证）

```js
import OpenAI from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const client = new OpenAI({
    apiKey: process.env.DASHSCOPE_API_KEY,
    baseURL:'https://dashscope.aliyuncs.com/compatible-mode/v1'
})

const response = await client.embeddings.create({
   model:"text-embedding-v4",
   input:"wxf是pig"
});

console.log(response.data[0].embedding);
```

**这个文件的目的**：验证 client 能不能调通 embedding API。跑通了再写复杂逻辑，省得后面排查时不知道是 API 问题还是代码问题。

注意它**没用 `app.service.mjs`**，而是又造了一遍 client——这是一个**最小化独立测试**的写法，复制到任何机器都能直接跑，不依赖项目其他文件。教学/调试场景常用。

跑成功的话，会打印一长串浮点数（向量），像这样：

```
[0.0123, -0.0456, 0.0789, ...]   // 1024 维或更多
```

---

## 5. 数据层：`data/posts.json`（检索范围）

```json
[
  { "title": "如何使用 Nuxt.js 进行服务器端渲染", "category": "前端开发" },
  { "title": "使用 Nest.js 和 TypeScript 构建一个简单的微服务应用", "category": "后端开发" },
  ...
]
```

32 条博客标题，每条只有 `title` 和 `category` 两个字段。**这就是知识库**——RAG 的 R（检索）要检索的对象。

数据简单到极致是为了把焦点放在 RAG 流程上。实际项目里这里可能换成产品文档、客服记录、PDF 拆分后的段落。

---

## 6. 第一阶段：`create-embedding.mjs`（向量化）

```js
import fs from 'fs/promises';
import { client } from './app.service.mjs';

const inputFilePath = './data/posts.json';
const outputFilePath = './data/posts-embedding.json';

const data = await fs.readFile(inputFilePath, 'utf-8');
const posts = JSON.parse(data);

const sleep = (ms) =>
    new Promise(resolve => setTimeout(resolve, ms));

const postsWithEmbedding = [];

for(const { title, category } of posts) {
    console.log(title, category, 'embedding');
    const response = await client.embeddings.create({
        model: 'text-embedding-v4',
        input: `标题：${title}, 分类：${category}`
    });
    postsWithEmbedding.push({
        title,
        category,
        embedding: response.data[0].embedding
    });
    await sleep(200);
}

console.log(`成功写入文件`);
await fs.writeFile(
    outputFilePath, 
    JSON.stringify(postsWithEmbedding, null, 2)
);
```

### 流程

```
posts.json (32 条)
   │
   │ for 循环每一条
   ▼
"标题：xxx, 分类：yyy"  ──→  embedding API  ──→  向量
                                                   │
                                                   ▼
                          postsWithEmbedding[] 累积
                                                   │
                                                   ▼
                  写入 posts-embedding.json （持久化）
```

### 逐行讲要点

| 行 | 代码 | 解读 |
|---|---|---|
| 7 | `const data = await fs.readFile(inputFilePath, 'utf-8')` | 异步读 posts.json，`'utf-8'` 让返回的是字符串不是 Buffer |
| 8 | `JSON.parse(data)` | 字符串 → JS 数组 |
| 20-21 | `const sleep = (ms) => new Promise(r => setTimeout(r, ms))` | 定义一个"等 N 毫秒"的工具函数，避免请求太快被限流 |
| 26 | `for(const { title, category } of posts)` | 遍历数组，**对象解构**直接取出 title 和 category 两个字段 |
| 28-32 | `client.embeddings.create({ model, input })` | 调阿里通义把文本转向量 |
| 31 | `input: \`标题：${title}, 分类：${category}\`` | **模板字符串**把两个字段拼成一句文本喂给模型 |
| 33-37 | `postsWithEmbedding.push({...})` | 把结果累积到新数组 |
| 38 | `await sleep(200)` | 每次请求后等 200ms，**防限流** |
| 42-45 | `fs.writeFile(outputFilePath, JSON.stringify(postsWithEmbedding, null, 2))` | 把数组转回 JSON 字符串写文件。`null, 2` 表示格式化缩进 2 空格（好看易读） |

### 📚 知识点：为什么用 `sleep(200)`？

API 服务端通常有 QPS（每秒请求数）限制。32 条挨个调，平均每条几毫秒就发完了，远远超 QPS，会被服务端拒绝（HTTP 429 Too Many Requests）。所以主动加 200ms 延时把请求节奏压下去。

### 📚 知识点：`JSON.stringify(obj, null, 2)` 的 3 个参数

```js
JSON.stringify(value, replacer, space)
```

- `value`：要序列化的对象
- `replacer`：`null` 表示全保留（也可以是函数做过滤）
- `space`：缩进空格数。`2` = 每层缩进 2 空格，文件可读性好；不传就是一行紧凑格式

---

## 7. 第二阶段：`semantic-search.mjs`（语义搜索主入口）

```js
// rag 实现语义搜索
import fs from 'fs/promises';
import { client } from './app.service.mjs';
import readline from 'readline';

const inputFilePath = './data/posts-embedding.json';
const data = await fs.readFile(inputFilePath, 'utf-8');
const posts = JSON.parse(data);

const cosineSimilarity = (v1, v2) => {
  const dotProduct = v1.reduce((acc, curr, i) => acc + curr * v2[i], 0);
  const lengthV1 = Math.sqrt(v1.reduce((acc, curr) => acc + curr * curr, 0));
  const lengthV2 = Math.sqrt(v2.reduce((acc, curr) => acc + curr * curr, 0));
  const similarity = dotProduct / (lengthV1 * lengthV2);
  return similarity;
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const handleInput = async (answer) => {
    console.log(answer);
    const response = await client.embeddings.create({
        model: 'text-embedding-v4',
        input: answer
    });
    const { embedding } = response.data[0];

    const results = posts.map(item => ({
        ...item,
        similarity: cosineSimilarity(item.embedding, embedding)
    }))
      .sort((a, b) => a.similarity - b.similarity)
      .reverse()
      .slice(0, 3)
      .map((item, index) => `${index + 1}. ${item.title}.${item.category}`)
      .join('\n');
    console.log(`\n搜索结果：\n${results}`);
    rl.close();
}

rl.question("\n请输入你要搜索的内容：", handleInput);
```

### 流程

```
启动时：
  读 posts-embedding.json 进内存 (L6-L8)
  定义 cosineSimilarity 函数 (L10-L22)
  创建 readline 交互接口 (L26-L29)
  定义 handleInput 回调 (L30-L51)
  rl.question 弹出提示等输入 (L52)

用户输入并回车后 → 触发 handleInput(answer):
  ① 把 answer 调 embedding API 转成向量 (L33-L36)
  ② 解构出 embedding (L37)
  ③ posts.map → 给每条 post 加 similarity 字段 (L40-L43)
  ④ .sort().reverse() → 按相似度从高到低排 (L44-L45)
  ⑤ .slice(0, 3) → 取前 3 条 (L46)
  ⑥ .map → 每条格式化成 "1. 标题.分类" 字符串 (L47)
  ⑦ .join('\n') → 拼成多行字符串 (L47)
  ⑧ console.log 打印 (L48)
  ⑨ rl.close() 释放资源 (L49)
```

### 关键代码：链式调用（L40-L47）

这是全文件最核心、最容易出 bug 的一段：

```js
const results = posts.map(item => ({
        ...item,
        similarity: cosineSimilarity(item.embedding, embedding)
}))
  .sort((a, b) => a.similarity - b.similarity)   // 升序
  .reverse()                                       // 翻成降序
  .slice(0, 3)                                     // 取前3
  .map((item, index) => `${index + 1}. ${item.title}.${item.category}`)
  .join('\n');                                     // 拼字符串
```

| 步骤 | 方法 | 输入 → 输出 |
|---|---|---|
| 1 | `map` | `[{title,category,embedding}, ...]` → `[{...原字段, similarity}, ...]` |
| 2 | `sort` | 数组 → 按相似度升序的数组 |
| 3 | `reverse` | 升序 → 降序 |
| 4 | `slice(0,3)` | 取前 3 条 |
| 5 | `map` | 对象 → 字符串 `"1. 标题.分类"` |
| 6 | `join('\n')` | 数组 → 一个多行字符串 |

> ⚠️ 链式调用**中间不能写分号**！分号 = 一句话结束。一旦某行写成 `.sort(...);` 后再 `.reverse()`，JS 会把 `.reverse()` 当成新语句开头，报 `SyntaxError: Unexpected token '.'`。

---

## 8. 关键数学：余弦相似度

```
                v1 · v2
cos(θ) = ───────────────────
           |v1| × |v2|
```

- **点积** `v1 · v2` = $\sum v_{1i} \times v_{2i}$
- **模长** $|v| = \sqrt{\sum v_i^2}$

值域 `[-1, 1]`：1 = 完全同方向（语义最像），0 = 无关，-1 = 反义。

### 举例：v1 = [3, 4]，v2 = [3, 4]

```
点积 = 3×3 + 4×4 = 25
|v1| = √(9+16) = 5
|v2| = √(9+16) = 5
相似度 = 25 / (5×5) = 1   ✅ 完全相同
```

### 为什么用余弦不用欧氏距离？

embedding 向量的"长度"通常没意义（取决于文本长短），"方向"才代表语义。比如"我喜欢猫"和"我非常喜欢猫"的 embedding 长度可能差很多，但**方向几乎一致**——余弦能识别，欧氏距离会被长度带偏。

---

## 9. 知识点合集（速查）

### 9.1 ES Module vs CommonJS

| 维度 | CommonJS (CJS) | ES Module (ESM) |
|---|---|---|
| 文件后缀 | `.js` / `.cjs` | `.mjs` 或 `package.json` 里 `"type":"module"` |
| 导入 | `const fs = require('fs')` | `import fs from 'fs'` |
| 导出 | `module.exports = ...` | `export ...` |
| 顶层 `await` | ❌ 不允许 | ✅ 允许 |
| `__dirname` | ✅ 内置 | ❌ 要用 `fileURLToPath(import.meta.url)` 手算 |

本项目 `.mjs` 后缀，所有文件用 ESM。

### 9.2 stdio（标准输入输出）

Node 里：`process.stdin` / `process.stdout` / `process.stderr`。

`readline` 创建的交互就是靠 stdio：
- `input: process.stdin` → 从键盘读
- `output: process.stdout` → 往屏幕写

> 同样的概念在 MCP filesystem server 里也用——"running on stdio" 就是父子进程间靠 stdin/stdout 管道传 JSON-RPC。

### 9.3 async / await

- `await` 只能在 `async` 函数里或 ESM 文件顶层用
- `await` 等一个 Promise 完成，拿到结果
- 比回调 / `.then()` 直观得多

### 9.4 解构 / 展开运算符

```js
// 对象解构
const { title, category } = post;          // 从 post 取出两个字段

// 展开运算符
const copy = { ...post };                    // 复制对象
const extended = { ...post, similarity: 0.8 }; // 复制 + 加字段
```

### 9.5 箭头函数

```js
const add = (a, b) => a + b;       // 一行简写，自动 return
const log = (x) => { console.log(x); };  // 多行用 {}，需要手动 return
```

### 9.6 模板字符串

```js
`Hello ${name}, you are ${age + 1} years old`
// ${} 里可以是任何 JS 表达式
```

### 9.7 数组方法

| 方法 | 作用 | 返回 |
|---|---|---|
| `map(fn)` | 每个元素经 fn 处理 | 新数组 |
| `filter(fn)` | 保留 fn 返回 true 的 | 新数组 |
| `reduce(fn, init)` | 归并成单个值 | 任意 |
| `sort(fn)` | 排序 | 原数组（注意！） |
| `reverse()` | 反转 | 原数组 |
| `slice(s, e)` | 切片 `[s, e)` | 新数组 |
| `join(sep)` | 用 sep 拼成字符串 | 字符串 |

> ⚠️ `sort` 和 `reverse` 会**修改原数组**，链式调用里要注意。

### 9.8 链式调用的本质

数组方法大多**返回数组**（或可继续点方法的对象），所以可以一个接一个：

```js
arr.map(...).filter(...).sort(...).join(...);
```

**铁律**：中间不能写分号，分号只在整条链末尾。

---

## 10. 踩坑清单（亲身经历）

| 坑 | 报错 | 根因 | 解决 |
|---|---|---|---|
| 文件名错 | `ENOENT: posts-with-embedding.json` | 代码里写 `posts-with-embedding`，实际文件叫 `posts-embedding` | 改对文件名 |
| 相对路径 | `ENOENT` 找不到文件 | `'./data/...'` 相对于 `process.cwd()`，cd 到别的目录运行就炸 | 用 `import.meta.url` 算绝对路径 |
| 链中加分号 | `SyntaxError: Unexpected token '.'` | `.sort(...);` 后 `.reverse()` 被当成新语句开头 | 链中间不写分号 |
| 缺环境变量 | `Missing API key` 或 401 | `.env` 没配 `DASHSCOPE_API_KEY` | 在项目根建 `.env`，加 `DASHSCOPE_API_KEY=sk-xxx` |
| `dotenv` 没调 | `process.env.XXX` 是 undefined | 忘了写 `dotenv.config()` | 在用环境变量的文件最顶上加 |
| 请求过快 | HTTP 429 Too Many Requests | 没加 `sleep` | 循环里 `await sleep(200)` |
| 文件没生成 | `semantic-search` 找不到 embedding 文件 | 没 先 跑 `create-embedding.mjs` | 先生成向量文件再跑搜索 |

---

## 11. 完整运行流程

### 第 1 次启动（首次部署）

```powershell
# 1. 进项目目录
cd C:\Users\xhj\Desktop\db_ai\xhj_ai\ai\rag\posts-demo

# 2. 装依赖
npm install

# 3. 配 API Key（项目根新建 .env）
#    DASHSCOPE_API_KEY=sk-你的阿里通义key
#    （阿里云控制台 → 模型服务灵积 → API-KEY 管理）

# 4. 测试 API 通不通（可选）
node index.mjs
#    能打印出一长串向量就说明通了

# 5. 生成向量文件（一次性）
node create-embedding.mjs
#    跑完会看到 "成功写入文件"，data/posts-embedding.json 出现

# 6. 跑语义搜索
node semantic-search.mjs
#    提示 "请输入你要搜索的内容："
#    输入：马铃薯怎么做
#    输出 Top3 相关的博客标题
```

### 第 2 次以后

只要 `posts-embedding.json` 还在，**直接**：

```powershell
node semantic-search.mjs
```

不用再跑 `create-embedding.mjs`——这就是把它单独拆出来持久化的原因。

---

## 12. 扩展方向（看完整套后可以试着改）

1. **Top3 改 Top10**：把 `.slice(0, 3)` 改成 `.slice(0, 10)`
2. **降序一步到位**：把 `.sort((a,b) => a.similarity - b.similarity).reverse()` 合并成 `.sort((a,b) => b.similarity - a.similarity)`
3. **补齐 RAG 的 A 和 G**：检索到 Top3 后，把它们拼到提示词里，调 `client.chat.completions.create()`，让模型基于这些资料回答用户问题
4. **改成 HTTP 接口**：用 Express 起一个 server，把 `rl.question` 换成 `app.post('/search', ...)`，做成 Web API
5. **接入向量数据库**：当 posts 多到几万条时，每次 `posts.map` 算相似度太慢，该用向量数据库（如 Milvus / Qdrant / pgvector）做近邻搜索

---

## 13. 一句话总览

```
RAG = 检索 + 增强 + 生成
本项目 = 只做了检索
检索的核心 = 把文本转成向量，再用余弦相似度比一比
向量化一次 = create-embedding.mjs 持久化
查询时   = semantic-search.mjs 把问题也转向量，链式调用算 Top3
配置统一 = app.service.mjs 封装 client，复用 + 防泄露
整个交互 = readline + stdio（stdin/stdout）
```

按这个顺序：**先看 app.service → 看 index 验证 → 看 create-embedding 生成向量 → 看 semantic-search 做搜索**，配合本笔记的「9. 知识点合集」速查，整个 demo 一遍就能看明白。
