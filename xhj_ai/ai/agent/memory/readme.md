 # Memory 管理

 Agent = LLM + Harness(tool+RAG+memory+...)
给模型拓展Tool，不只是回答问题，还可以干活。
RAG，基于query 获取向量数据库相关的知识放入prompt。
都依赖于**Memory**。

大模型是无状态的，基于上次的问答继续问，回答。
之前已经通过chatMessages 数组？ 做了简单的Memory 管理。

- 持久化 
- 上下文窗口大小 一般不要超过200k
- /compact 总结 最近，  /clear

Agent 执行流程 ReAct， messages 数组 -> Memory

上下文大小、开销、持久化
Memory 三种思路  截断(slice(-4)) 、总结、检索
临时记忆 截断最新的几条messages，总结未截断的messages
长期记忆 检索向量数据库

用InMemoryChatMessageHistory 来管理message，放到内存里。
用addMessage 添加HumanMessage，AIMessage，ToolMessage，
调用大模型，返回（AIMessage）直接添加到history。
getMessage() 获取所有message 每个message 对象
HumanMessage/AIMessage/ToolMessage，实例 type content 等属性

## 长时记忆
- 文件
- 向量数据库