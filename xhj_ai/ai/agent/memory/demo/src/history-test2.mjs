import 'dotenv/config';
import { ChatOpenAI } from '@langchain/openai';
import {
//   // InMemoryChatMessageHistory  // 短期内存记忆
  FileSystemChatMessageHistory  // 文件记忆  
} from '@langchain/community/stores/message/file_system';
import {
  HumanMessage, 
  SystemMessage,
  AIMessage
} from '@langchain/core/messages';
import path from 'node:path'; // fs path 模块

const model = new ChatOpenAI({
  modelName:process.env.MODEL_NAME,
  apiKey: process.env.OPENAI_API_KEY,
  temperature: 0,
  configuration: {
    baseURL: process.env.OPENAI_BASE_URL,
  }
}) 

async function fileHistoryDemo() {
  // Promise 类上的静态方法， pending -> rejected
  // return Promise.reject("失败了");
  // return Promise.resolve("成功了");
  console.log(process.cwd());
  InMemory 当前的Agent
  file 最近几次聊的
  milvus 
  const filePath = path.join(process.cwd(), "chat_history.json");
  const sessionId = "user_sessiion_001";
}
// Promise<T>
fileHistoryDemo()
  // .then(console.log)
  .catch(console.error)
  // .finally(() => {
  //   console.log("finally");
  // });