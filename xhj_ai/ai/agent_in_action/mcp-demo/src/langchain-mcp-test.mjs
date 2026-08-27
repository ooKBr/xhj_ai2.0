import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 显式指定 .env 路径，确保无论从哪个目录启动都能正确加载
dotenv.config({ path: join(__dirname, '../.env') });

// 同步设置 OPENAI_API_KEY，避免 @langchain/openai 走默认校验时报错
if (process.env.DEEPSEEK_API_KEY) {
    process.env.OPENAI_API_KEY = process.env.DEEPSEEK_API_KEY;
}

// agent 配置 mcp client？ 可以配置多个mcp server的client
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import chalk from 'chalk';
import { HumanMessage,
         SystemMessage,
         ToolMessage
 } from '@langchain/core/messages';

const model = new ChatOpenAI({
    modelName:'deepseek-v4-flash',
    apiKey:process.env.DEEPSEEK_API_KEY,
    temperature:0, // 严谨性 0-1 0 最严谨 1 最随机  因为这里要调用工具
    configuration: {
        baseURL:'https://api.deepseek.com/v1',
    }
});

const mcpClient = new MultiServerMCPClient({
  mcpServers: {
    'my-mcp-server': {
      command: 'node',
      args: ['C:/Users/xhj/Desktop/db_ai/xhj_ai/ai/agent_in_action/mcp-demo/src/my-mcp-server.mjs']
    }
  }
});

 // 获取工具
 const tools = await mcpClient.getTools();
 const res = await mcpClient.listResources();
 let resourceContent = '';
 for(const [serverName,resources] of Object.entries(res)) {
   for (const resource of resources) {
    const content = await mcpClient.readResource(
        serverName,resource.uri
    )
    resourceContent += content[0].text;
   }
 }
 console.log(resourceContent,'---------------');

 const modelWithTools = model.bindTools(tools);

 async function runAgentWithTools(query,maxIterations=30) {
    const messages = [
        new SystemMessage(resourceContent),
        new HumanMessage(query)
    ];
    for (let i = 0; i < maxIterations; i++) {
        console.log(chalk.bgGreen(`正在等待AI思考，第${i+1}轮...`));
        const response = await modelWithTools.invoke(messages);
        messages.push(response);

        if(!response.tool_calls || response.tool_calls.length === 0) {
            console.log(`\n AI 最终回复： \n ${response.content}`);
            return response.content;
        }
        console.log(chalk.bgBlue(`检测到 ${response.tool_calls.length} 个工具调用`));
        console.log(chalk.bgBlue(`工具调用：
            ${response.tool_calls.map(t => t.name).join(', ')}`))

        for (const toolCall of response.tool_calls) {
            // find方法 只返回匹配的那一项，如果找到了，后面不会执行
            // Promise.all 只要一个失败了，整体就会失败，不会等剩下结果，不过已经发起的异步任务会继续执行
                const foundTool = tools.find(t =>
                    t.name === toolCall.name);
                    if(foundTool) {
                        const toolResult = await foundTool.invoke(toolCall.args);
                        // 返回的是纯文本，tool 的返回是由上下文的相关性
                        // 一定得带上tool_call_id
                        messages.push(new ToolMessage({
                            content: toolResult,
                            tool_call_id: toolCall.id
                        }));
                    }
            }
    }
    // 循环次数（轮数） 达到30次，仍无法回复问题，返回最后一轮
    return messages[messages.length-1].content;
 }

//  await runAgentWithTools('查询用户002的信息');
 await runAgentWithTools('MCP Server的使用指南是什么？');
// 关闭所有 MCP 子进程与通信通道，释放进程资源
//  关闭和MCP Server 的通信通道
// my-mcp-server.mjs 被启动了，不会自动关闭，需要手动关闭进程
// 释放相关资源，避免脚本一直挂着不退出
// 执行  node langchain-mcp-test.mjs  时，启动进程
//   启动一个子进程 child-process client
    //  子进程连接 my-mcp-server.mjs
    //  主进程通过stdio 和他们通话 
    //  close() 把这个连接和子进程一起关掉
 await mcpClient.close();