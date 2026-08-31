# 全栈项目部署全流程
- 运维工程师
加分项
- vercel 云端部署
  - 比较固定
    nextjs + supabase 项目
    jsva，go，python 部署自由度
  - 国内支持
  腾讯云

## 使命
- 理解部署的全流程
- nginx+node 用**宝塔**面板搭建生产环境
- 前后端分离项目
  - 前端  react + ts 产出？
    组件，
    npm run dev 开发阶段
    npm run build  dist/ 静态资源文件
  - 后端  node
    /api 接口  json 

## 部署全流程
- 得花钱买服务器
- 买域名？ 备案 10-20天
- 配置HTTPS 更安全的http SSL
- nginx
- 反向代理
  前后端 /api 通信？
  前端调用api存在一个跨域问题
  ：5173  /api/todos  vite 配置 mocks 拦截/api todos
  前端发送请求，vite 基础设施 拦截？
  ：5173 /api/todos  nginx？拦截前端的请求 nginx 反向代理 server 3001  也就不存在跨域问题了
- 服务器端安全问题

## 购买服务器
轻量云服务， linux
全量linux 部署，命令行成本有点高，难度
宝塔（BT Panel），是一套服务器管理面板
可视化的， 点击操作，完成服务器部署
给服务器装了一个“控制台/操作系统的后台”
得到了一个公网IP

## 宝塔的优势
/www/wwwroot  服务器的www目录
服务器内置了宝塔服务 ：8888 
- 可视化
- 自由度高
  想怎么部署就怎么部署

## 用户访问网站到底发生了什么？
1. Brower -> DNS(Domain Name System) 先找到服务器  Server IP   DNS解析是在打开一个网站后进行 IP地址查询
   DNS 返回 服务器公网IP 
   先查地址，再去敲门
   DNS 查询会缓存在本地
   - brower
   - 上网设备系统
   - 局域网
   - 城域网
   - 根服务器 .com .cn
- 安全组 防火墙
  看门人，放不放行
  - ip 限流，恶意ip，
  - 尽量的少开放端口
  80 http 默认端口
  443 https 默认端口
  3306 mysql 可选择的访问端口
  只开放给一些IP dev，production

  安全组
    位置：云厂商网络层（比如腾讯云）
    作用？控制这台云服务器哪些端口被外网访问
    类比：小区大门保安 不让进
  防火墙
    位置：服务器操作系统内部

3. Nginx 真正的入口（分流）
- 静态资源
  react + ts 打包的
  route，static route，返回静态资源
- 动态资源
  route 走服务器路由
Nginx 是一个高性能的Web服务器
三件事：接收请求，返回静态文件，或者把请求转发给后端（反向代理解决跨域问题）。
http://175.27.132.28/ index.html
  http://175.27.132.28//api/todos 
  之前是vite mock
  跨域 5173：80 -> 3001
  nginx 配置 \api -> 反向代理
  http://175.27.132.28:3001/todos
  json -> nginx 返回前端调用
  node -> mysql mvc

## 服务器准备
- 网站 -> node 项目
  Node.js版本管理器 nvm 同时容纳多个node版本，指针，当前是哪个版本
  node 版本需求不一样，项目以来不同的node 版本
- html项目 装 nginx
- 安装MySQL
  - 建立 dev/production 两个库
  - 开发和线上互相不影响
  time_capsule_dev  密码：R47n5jNHKkBrL64y
  time_capsule_production  密码：C3eZA3bKeApwB6Pw

  22 端口 服务器远程加密通信端口
  21 端口 http协议

## 项目在本地跑起来
### 前端
- 瀑布流（小红书） 经典复杂的前端用户体验，无限滚动（滚动到底部）
### 后端
- .env.example  复制然后修改为 .env
- npm run dev
  线上的dev 数据库
  数据库连接失败 
- ts 是大型项目标配
- ts -> js -> 热更新运行 ts-node-dev
  npm run dev 本地开发阶段使用的
- npm run build  ts -> js  
  打包 dist/ 目录  上线需要的静态资源文件
- npm run start 正式启动 
  node dist/app.js