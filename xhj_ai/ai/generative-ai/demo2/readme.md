# prompt 在NLP 中的应用
自然语言处理（Natural Language Processing）是指计算机能够理解和生成人类语言的技术。

## 情感推断与信息提取

## 图片生成
- 从text generation 到 image generation
  多模态
- openai sdk 换成了fetch 请求
  - 本质都是向llm 远程服务器发送http 请求
  - url 地址
  - 配置请求对象
    - method POST 请求 比GET 更安全
    - headers 请求头指定apiKey
      Authorization 权限
    - body 请求体
      messages
      多张图片和文字指令