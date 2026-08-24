import { ChatOpenAI } from '@langchain/openai';
import 'dotenv/config';

const model = new ChatOpenAI({
    modelName:'deepseek-v4-flash',
    apiKey:process.env.DEEPSEEK_API_KEY,
    configuration: {
        baseURL:'https://api.deepseek.com/v1',
    }
});
// client.chat.completion.create
const reponse = 
  await model.invoke('台球比赛应该设置什么奖励？')
console.log(reponse.content);