// http 请求llm 接口
// bun 代替 npm 做包管理器
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// console.log(process.env.DEEPSEEK_BASE_URL,"-------");
async function chat() {
    // llm 可能会出错，异常
    // 如timeout network 请求超时，llm 忙 apikey 余额不足
    try {
        // 为什么使用POST 请求而不是GET 请求
        // GET 请求有上限
        // apiKey GET传输不安全 明文传输
        // 图片等上传 post 有请求体
        // 请求行 由 url，method，http version 组成
        // 请求头 Authorization apiKey
        // GET 请求只有请求行和请求头
        // 请求体 body 
        // fetch http 请求api
        // axios http 请求的框架，封装了 fetch，企业级别的。
        const res = await axios.post(  // 请求行
            `${process.env.DEEPSEEK_BASE_URL}`,
            // 请求体
            {
                model:'deepseek-v4-flash',
                messages:[{
                    role:'user',
                    content:'你好,介绍一下Bun'
                }]
            },
            // 请求头
            {
                headers: {
                    'Content-Type':"application/json",
                    Authorization:`Bearer ${process.env.DEEPSEEK_API_KEY}`
                }
            }
        )
        // axios 默认会在响应前面带上data
        console.log(res.data.choices[0].message.content);
    }catch(err) {
        console.log(err.message);
    }
}
 chat();