import { OpenAI } from 'openai';  
import { config } from 'dotenv';
config();

const client = new OpenAI({
    apiKey: process.env.DEEPSEEK_API_KEY,
    baseURL:process.env.DEEPSEEK_BASE_URL,
})
// 异步任务
// Promise 实例
// 对话历史
const chatHistory = [
    { role:'system', content:'你是一个严谨的助手' }
];
async function testStateless() {
    console.log('第一次请求，告诉模型一个信息');
    // 为了让llm 懂我们，每次带上history 
    chatHistory.push({
        role:'user',
        content:'请记住，我的名字叫007'
    })
    const response = await client.chat.completions.create({
        model:'deepseek-v4-flash',
        messages: chatHistory       // ✅ 必须是复数 messages！单数 message OpenAI SDK 会静默忽略，然后接口报 400 missing field messages
    });
    chatHistory.push({
        role:'assistant',
        content: response.choices[0].message.content
    })
    console.log('模型回复：',
        response.choices[0].message.content);
        console.log('第二次请求，直接问我是谁'); 
        chatHistory.push({
            role:'user',
            content:'请问我的名字是什么？' 
        })
        const response2 = await client.chat.completions.create({
            model:'deepseek-v4-flash',
            messages: chatHistory
        });
        chatHistory.push({
            role:'assistant',
            content: response2.choices[0].message.content
        })
         console.log('模型回复：', 
            response2.choices[0].message.content);
         console.log(chatHistory);
}

// console.log(testStateless())
testStateless()
  .catch(err => {  // test函数 如果调用reject，这里会执行
    console.log(err);
  })