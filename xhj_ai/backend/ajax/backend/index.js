// node 内置的http 模块
// 早期的js，特别是前端没有模块化系统
// function  scr
// node 一定要上模块化方案 require + MediaSourceHandle.exports
// esm 是升级版 import + export default
// require node 早期的模块化系统 commonjs
const http = require('http');
  // req 用户对象
  // res 响应对象
// 伺服状态
http.createServer((req, res) => {
    // 用户服务函数
    const todos = [{
        id:"1",
        title:"过四六级",
        completed:false
    },{
        id:"2",
        title:"回家",
        completed:false
    }]

    // req 用户对象
    if(req.url === '/') {
        res.end("hello world");
    }
    if (req.url === '/todos') {
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Content-Type',
             'application/json;charset=utf-8');
        // 二进制文本
        res.end(JSON.stringify(todos));
    }
}).listen(3000, () => {
    console.log(`server is running on 3000 port`);
})
