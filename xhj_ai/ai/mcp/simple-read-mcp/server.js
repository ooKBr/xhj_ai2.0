// ======================================================================
// simple-read-mcp（新版写法）
// ======================================================================
// 这一版和旧版（Server + setRequestHandler + 手写 JSON Schema）功能 100% 一样，
// 都是"跑一个 stdio 模式的 MCP Server，提供 read_file 工具读取本地文件"。
//
// 旧 → 新 对照：
//   import { Server }                            → import { McpServer }
//   new Server({name, version}, {capabilities})  → new McpServer({name, version})
//   server.setRequestHandler(ListToolsRequestSchema, ...) +
//   server.setRequestHandler(CallToolRequestSchema, ...)         → server.tool(name, desc, schema, handler)
//   手写 JSON Schema 对象                                           → zod schema 自动转 JSON Schema
// ======================================================================

// ----------------------- 1. import 模块 -----------------------

// McpServer：SDK 1.x 提供的「高级封装」类。
// 它是底层 Server 类外面包了一层语法糖，专门帮你省去"手动注册 tools/list + tools/call
// 两个 handler + 手动拼 JSON Schema"的重复代码。
// 路径：@modelcontextprotocol/sdk/server/mcp.js
// ⚠️ 注意：旧版 Server 在 server/index.js，新版 McpServer 在 server/mcp.js —— 两个不同的文件。
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

// 传输层 stdio —— 新旧写法一样，类名也是同一个 StdioServerTransport。
// 因为 stdio 是"怎么跟 client 传输消息"这件事，跟上层用 Server 还是 McpServer 没关系。
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// zod：一个 Schema 校验库（类似 Yup、Joi，但 TS 类型推导最好）。
// 它的作用：让我们"声明一次字段类型"，就能同时得到
//   ① 运行时参数校验（Agent 传的参数不合规直接拒绝）
//   ② 自动生成 JSON Schema（返回给 tools/list 用）
//   ③ TS 类型（写 handler 时参数自动有类型提示）
// 这是新版写法"不用手动写 JSON Schema"的核心支撑。
import { z } from "zod";

// 文件系统 Promise 版（fs/promises 可以用 await 读文件）。旧版是 node:fs/promises，
// 新版省略了 node: 前缀也可以，Node 两者都认。
import fs from 'fs/promises';


// ----------------------- 2. 实例化 McpServer -----------------------

// ✨ 新版：只传 name + version，不用手写 capabilities。
// 为什么？因为 McpServer 内部会根据你后面注册的 tool/resource/prompt，
// 自动推导你有哪些能力声明（比如你调了 server.tool 注册工具，
// 它会自动在 initialize 响应里声明 capabilities.tools={}）。
//
// 旧版对比（你之前手写的，啰嗦在哪）：
//   const server = new Server(
//     { name: 'simple-read-mcp', version: '1.0.0' },
//     { capabilities: { tools: {} } }     // ← 还要你手动写，拼错(tool)直接GG
//   );
const server = new McpServer({
  name: 'simple-read-mcp',
  version: '1.0.0'
});


// ----------------------- 3. 注册工具 read_file -----------------------

// McpServer.tool(toolName, toolDescription, zodSchema, handler)
// 一个方法完成了旧版"2 次 setRequestHandler + 手写 JSON Schema + switch(name)"
// 总共 60+ 行代码才能做完的事。
//
// 旧版拆成三件事要你自己写：
//   ① setRequestHandler(ListToolsRequestSchema)  → 返回工具清单 + JSON Schema
//   ② setRequestHandler(CallToolRequestSchema)   → switch(name) 分发 + 手动解析参数
//   ③ 手写 {type:'object', properties:{...}, required:[...]}  JSON Schema
//
// 新版 server.tool 帮你做的：
//   ✔ 自动注册 tools/list 处理器（内部 setRequestHandler(ListToolsRequestSchema)）
//   ✔ 把 zod schema → 自动转 JSON Schema → 放进 tools/list 返回值
//   ✔ 自动注册 tools/call 处理器（内部 setRequestHandler(CallToolRequestSchema)）
//   ✔ 自动用 zod 校验客户端传来的 arguments → 不合规直接抛错（省得你自己 if (!args.path) throw）
//   ✔ 把参数解构好传给 handler：async ({ path }) => {}，你直接就能用 path 变量
server.tool(
  // 参数 1：工具名（Agent 调 tools/call 时 name 字段传的就是这个）
  "read_file",

  // 参数 2：工具的一句话描述，Agent 推理时会看这句话来决定要不要用这个工具
  "读取指定路径的本地文件内容",

  // 参数 3：zod 定义的参数 schema
  //  等价旧版手写：
  //   {
  //     type: "object",
  //     properties: { path: { type: "string", description: "..." } },
  //     required: ["path"]   // ← zod 写了 z.string() 默认就是必填，不用单独写 required
  //   }
  {
    // z.string()   → 声明 path 是字符串类型（MCP SDK 内部会据此转成 JSON Schema type:string）
    // .describe(...) → 等价 JSON Schema 里的 description 字段，Agent 推理时会看到
    path: z.string().describe("文件的绝对或相对路径")
  },

  // 参数 4：工具的真实执行函数（旧版叫 handler，写在 setRequestHandler(CallToolRequestSchema, ...) 里）
  // 🔑 新版直接解构出 { path }，不用自己写 const { name, arguments: args } = request.params
  // 🔑 McpServer 已经帮你做了 zod 校验，所以这里拿到的 path 一定是字符串，非空
  async ({ path }) => {
    try {
      // 读文件：utf-8 读取，直接拿文件内容字符串
      const content = await fs.readFile(path, 'utf-8');

      // 返回格式跟旧版完全一样（MCP 协议规定的格式，新旧通用）
      // content 数组，每项是 { type: 'text'|'image'|..., ... }
      return {
        content: [{ type: "text", text: content }]
      };
    } catch (err) {
      // 出错时的返回格式也跟旧版一样：isError=true + content 描述错误
      // （MCP 协议规定，工具出错也要返回 content，不能只 throw）
      return {
        isError: true,
        content: [{ type: "text", text: `读取文件失败：${err.message}` }]
      };
    }
  }
);


// ----------------------- 4. 启动入口（用 stdio 连上） -----------------------

async function main() {
  // 实例化 stdio 传输层。和旧版完全一样。
  const transport = new StdioServerTransport();
  // McpServer.connect → 内部调的就是 Server.connect，所以效果完全一致
  await server.connect(transport);

  // 💡 打印到 stderr 而不是 stdout，非常关键！
  // 为什么不写 console.log？因为 stdout 是 MCP 协议"专用通道"，
  // 所有 JSON-RPC 消息都走 stdout。你在 stdout 打印非协议内容，
  // Client（Claude Code / Trae）会以为是一条 JSON-RPC，解析失败 → 连不上。
  // 所以"调试打印 / 启动日志"必须写 stderr（console.error 就是默认打 stderr 的）。
  // 旧版代码漏了这句，你永远不知道 server 到底有没有启动；新版加了就很友好。
  console.error("MCP read_file 服务已启动（stdio模式）");
}

// main() 是 async，返回 Promise。如果里面 throw（比如 node_modules 没装、
// 读不到某个文件、transport 创建失败），我们在末尾 .catch() 兜底打印错误，
// 而不是让 Node 报 UnhandledPromiseRejection 并退出 1。
// 旧版是 main(); 没写 catch，新版这里更好。
main().catch(console.error);
