# Document 切割

- 知识库 放的知识
  知识的来源很多，一个word文档，一个pdf文件，一个bilibili视频，一个url，一个挺靠谱的twitter
  不能直接创建Document对象
  这些知识怎么处理一下？
  各种格式的文件 -> 向量化前的Documents？ loader
  Document？ langchain 提供的标准格式的文档， pageContent，metadata
    pageContent 是文档的内容，metadata 是文档的元数据，比如标题，作者，发布时间等

## loader
知识库 -> 向量数据库
各种知识文件，不同格式的文件通过后缀来区别，不同的文件也有不同的loader。
loader 输入是文件，输出是Documents
两件事要做
1. 选择相应的loader  180多种
2. 分块  一个文件太大，要检索的是一定大小具有一定语义的chunk
处理模块来自社区 @langchain/community 主要由社区维护，我们都可以写loader
langchain @langchain/core 官方维护的