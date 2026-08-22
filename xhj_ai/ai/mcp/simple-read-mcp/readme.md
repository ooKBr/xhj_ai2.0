# 手写文件处理mcp
- server fs 读取文件 
  - schema 声明 函数名字，参数传递一个地址
  返回 上下文 给llm
- server还要满足mcp 通信协议

## 开发
- pnpm i zod
数据验证 schema
- pnpm i @modelcontextprotocol/sdk 
协议中sdk 通信部分的实现
cc prompt -> llm -> 分析 -> 选中fs client -> stdioServerTransport -> stdin -> server -> 执行返回 -> stdout -> StdioServerTransport -> cc -> llm -> generate