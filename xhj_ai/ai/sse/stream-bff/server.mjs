import * as dotenv from 'dotenv';
// node 里面最常用且简单的开发框架
// 启动一个http server
// vite 启动的http server是服务于前端的 5173
// 前端发送请求到BFF层 享受服务  web server 后端 伺服状态 3000
// 5173 前端 -> 3000 BFF 后端 -> deepseek
import express from 'express';
// 让我们的key 更安全
// 纯前端，右键看代码就能看到key 了，不安全
// fetch -> Buffer(apikey)
dotenv.config({
    path:['.env.local','.env'] 
});

const app = express();  // 实例化一个server app
const port = 3000;
// 路由
app.get('/', (req,res) => {
    // 不断地流式输出 
    res.send('Hello World!')  // 一次性发送
})

// 流式输出的bff层 让前端调用
app.get('/stream', async (req,res) => {
    res.json({
        message:'Hello World!'
    })
})

app.listen(3000,() => {
    console.log(`服务器在${port}端口启动了`)
})

// console.log(process.env.VITE_DEEPSEEK_API_KEY)
// llm 请求 bff 来
// 后端轻量的 就这一个文件 就是我们的服务器端
// / npm run dev  后端方式启动vite 服务
// node server.mjs 运行后端进程
console.log('我是一个在前端项目中藏着的BFF程序')
