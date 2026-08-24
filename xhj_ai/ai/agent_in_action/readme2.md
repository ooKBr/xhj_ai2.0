# Tool,让大模型自动干活

## demo
```
创建一个react+vite的todolist
```
要用到哪些tool？  /demo
编程任务 plainning 分三步
- 使用vite 创建项目 写入文件tool
- llm 编程能力比较强的模型 就能做的 写入文件tool
- 项目运行起来 调用cli 命令的Tool

## 手写一个简单版本的claude code Agent
llm + Tool(fs + cli)

## langchain
llm 开发框架 比openai(transformer,Generative) 还早诞生
- llm 有很多家 兼容各家大模型
@langchain/openai

## Message
SystemMessage 设置AI是谁，可以干什么，有什么能力，以及一些回答，行为规范等
HumanMessage 用户的消息
AIMessage AI的回复消息
ToolMessage 调用工具的结果返回 Tool id

原生 openai 返回工具调用 additional_kwargs -> tools -> 每个tool
langchain invoke 原样输出上面的，同时还会细心的准备tools 加到后面
llm 工程开发的便捷性，可读性 帮助

## AI 工程
- 工程目录 
    根目录 package.json node_modules
- src 开发代码目录 
    - promise 特性
    async 函数 就是promise 实例， return resolve 并且return的结果就是
