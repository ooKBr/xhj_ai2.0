# user chat

## AI 全栈开发
- 前后端模块化分离
  - 前端在 fe目录下
      opc 前端
  - 后端在 backend目录下
      opc 后端

### 前端
    三件套
      - html 负责结构 标签
      - css  负责样式 头部引入（更快下载 html和css尽早结合，更早让用户看到）
          css库  twitter 框架
      - js   负责行为
          通过script标签引入 common.js

## 模块化 module 拆分
- 设计思想
    代码，功能都放在一个文件，少数文件或目录  -> 不好维护，不好扩展，不好优化
    ∴ 每个文件夹需要有他的职责划分，每个文件只做一件事（一个文件一个类）

## html 结构
- box 盒子的概念
  - 先写盒子，再写内容
## css 业务
- container
    中间内容宽度固定，左右留白
    PC 时代不同尺寸设备的布局
- row 一行
- col 列
行列布局

## html
- 语义化标签 
div 用来做盒子 不能一直用div

/**/

## html 文档
- 都是文本类型
    text/plain 纯文本
    text/html html标签 使用 http 超文本传输协议 用browser解析的document
    <!DOCTYPE html>    // ! 用于标记这是html的最新版本 即 html5，区别 html4

- dom 编程
    DOM 是 js 里的Document Node
    html里面是标签，js里面是对象（映射关系） 通过js 可以操作html标签
   document.querySelector()
   document 对象 用选择器查找标签
   从html 页面来到了js内存中
   .innerHTML 动态修改DOM 的内容

### 大厂特别注重底层
      从html 语义化标签
      js DOM 编程
      模块化 动态插入html
      js 前端 准备好了document 对象，
      document 是树状结构, document.documentElement 是根节点
      document.body 是我们看到的页面
      document.querySelector 进行travel查找 树
      可以查看节点，也可以知道孩子节点，兄弟节点，还可以挂载节点

## 后端准备
js 可以前端，后端，AI
 npm 即 node package management
- npm init -y 
    会增加一个 package.json  **后端**项目描述文件
- npm i json-server
    把对象字面量 作为http server 来提供服务