# SSE Server Sent Event 服务器发送事件
## BFF 层
Backend For Frontend 为前端服务的后端

Backend 纯后端Server 
java/go/node MVC 开发
Model View Controller 后端的设计模式
CRUD 接口请求 restful
稳定性、并发、安全...

JS 前端，后端 等都可以做，有很多需求，比如接口改一下等等
大前端工程师 自己写一些常见的node 服务，来达成自身的需求，

前端（vue、react） 后端（Java） 中间有个BFF（Node）

## 流式输出里面
前端业务非常复杂，二进制流对象，解码，解析data： 以及各种情况
抽象一下，放到大前端BFF层，node 里面，让前端简洁 同时降低难度

前端 fetch  ->  node(BFF)  ->  llm 服务器  

vite 创建的vue 项目，里面有package.json 文件，也有node_modules 文件夹
vite 工程化，是node 后端服务，方便的用于BFF 开发一下。

## node 框架开发
- 安装并引入后端开发框架（express）
- 实例化一个app，并监听3000端口
- 定义路由

vue 前端可以通过fetch 访问 bff 路由

## 跨域问题
- 只要域名、端口、协议（http/https） 有一个不同，
  那么在发起fetch 等请求的时候，就会触发跨域，本质是浏览器提供的同源策略保护机制
- vite.config.js 解决方案
  - 请求地址，改成/api/stream
  /api 标志 请求后端api接口
  不跨域了，但是显示502了
    - /stream 前端不会提供这个路由的
    bff后端提供了
      所有前端请求，vite 都会拦截
      vite 工程，proxy 配置，帮助我们代理一下请求，并转发出去，转到 :3000/stream
      在 ：5173/api/stream（不跨域 但是502）-> vite proxy /api  -> :3000/stream
