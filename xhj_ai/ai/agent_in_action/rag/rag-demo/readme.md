# RAG 
Retrval Agument Generation
Retrival 检索器 
 知识库-> 先embedding 基于向量数据库-> 检索器（embedding+行速度 + prompt embedding）

## langchain RAG  业务能力
开箱即用的llm 开发框架
- @langchain/openai  ChatOpenAI Embedding
- @langchain/core/document
  document 是embedding 的最小单元
  知识库 由文件（文本、声音、图片、视频等）构成
  某个段落的文字 有我们要找的语义
  {
    pageContent: '要单独embedding的文本',  // 做相似度匹配的
    meta: {  // 元数据 不做embedding的
        ...
        link: 'https://www.baidu.com',
        author:...
    }
  }
  documents...  简单就放内存  复杂，放向量数据库
- @langchain/classic llm 开发以来 langchain 的经典常用模块
  MemoryVectorStore 内存向量存储

 检索器 = (知识库-> 文档-> documents-> embedding-> memoryVectorStore)
 invoke()

AI 发展太迅猛 langchain 版本更新太快，需要看文档 