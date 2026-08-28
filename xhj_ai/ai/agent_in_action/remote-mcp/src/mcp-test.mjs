import 'dotenv/config';
import { MultiServerMCPClient } from '@langchain/mcp-adapters';
import { ChatOpenAI } from '@langchain/openai';
import chalk from 'chalk';
import {
    HumanMessage,
    SystemMessage,
    ToolMessage
} from '@langchain/core/messages';

const model = new ChatOpenAI({
  modelName:'deepseek-v4-pro',
  apiKey: process.env.DEEPSEEK_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: 'https://api.deepseek.com/v1',
  },
});

const mcpClient = new MultiServerMCPClient({
    mcpServers: {
        'amap-maps-streamableHTTP': {
            "url": "https://mcp.amap.com/mcp?key=cdf8c1a321c56916efd2544a05b7805d"
        },
        'my-mcp-server': {
            command: "node",
            args: [
                "C:/Users/xhj/Desktop/db_ai/xhj_ai/ai/agent_in_action/mcp-demo/src/my-mcp-server.mjs"
            ]
        },
        'filesystem': {
            command: 'npx',
            args: [
                '-y',
                '@modelcontextprotocol/server-filesystem',
                // 允许访问的文件夹，可以配置多个，用空格隔开
                'C:/Users/xhj/Desktop/db_ai/xhj_ai/ai/agent_in_action/remote-mcp'
            ]
        },
        // Chrome‑DevTools MCP，默认连接本地打开的Chrome（开启远程调试：chrome --remote-debugging-port=9222）
        'chrome-devtools': {
            command: 'npx',
            args: [
                '-y',
                'chrome-devtools-mcp@latest',
            ]
        }
    }
})

const tools = await mcpClient.getTools();
console.log(tools);
const modelWithTools = model.bindTools(tools);

async function runAgentWithTools(query,maxIterations=30) {
    const messages = [
        new HumanMessage(query)
    ];

    for(let i = 0;i<maxIterations;i++) {
        console.log(chalk.bgGreen(`第${i+1}轮迭代`));
        const response = await modelWithTools.invoke(messages);
        messages.push(response);

        if(!response.tool_calls || response.tool_calls.length === 0) {
            console.log(chalk.green(`AI 回答：${response.content}`));
            return response.content;
        }

        console.log(chalk.bgGreen(`工具调用：
            ${response.tool_calls.map(t => t.name).join(',')}
            `));

            for(const toolCall of response.tool_calls) {
               const foundTool = tools.find(t => t.name === toolCall.name);
               if(foundTool) {
                let contentStr;
                try {
                    const toolResult = await foundTool.invoke(toolCall.args);
                    if(typeof toolResult === 'string') {
                        contentStr = toolResult;
                    } else if(toolResult && toolResult.result){
                        contentStr = toolResult.text;
                    }
                } catch (err) {
                    console.log(chalk.red(`工具 ${toolCall.name} 调用失败：${err.message}`));
                    contentStr = `工具调用失败：${err.message}，请稍后重试或减少并发调用数量。`;
                }
                messages.push(new ToolMessage({
                    content:contentStr,
                    tool_call_id:toolCall.id,
                 }));

               }
            }
    }

    // 最后一个消息是AI的回复
    // 改进
    return messages[messages.length-1].content;
}   

await runAgentWithTools(`北京南站附近的酒店，最近的 3 个酒店，
    拿到酒店图片，打开浏览器，展示每个酒店的图片，每个 tab 一个 url 展示，
    并且在把那个页面标题改为酒店名`);
// await runAgentWithTools(`北京南站附近的2个酒店，以及去的路线，路线规划生成文档保存到 当前目录 的一个 md 文件`);
await client.close();
