import 'dotenv/config';
import "cheerio";
// 从url 加载文档
import { 
    // loader 按url 加载
    CheerioWebBaseLoader
} from "@langchain/community/document_loaders/web/cheerio";
import {
    // recursive 递归
    RecursiveCharacterTextSplitter
}from '@langchain/textsplitters'
// 访问网址 并提取文档内容 
// cheerio 可以传递css 选择器 来提取文档内容 缩小范围
// 爬取指定内容 + Document标准
const cheerioLoader = new CheerioWebBaseLoader(
    'https://juejin.cn/post/7680709250218410011',
    {
        selector:'.main-area p'  // p 标签里面的内容一般就是文章段落
    }
)
// 大的document 分成小的document，更加精细的去处理语义
// 按段落划分？ 段落太长？太短？语义分段  
// 目的是语义精确匹配，重点
// 按句子来分 。！适合  ，不适合
// chunk 大小 比如 400 字符
const documents = await cheerioLoader.load();
// console.log(documents);
// 切片
// 语义排第一位
// 如果按大小来切割，chunkSize 就够了
// 为了语义完整，不一定是400 字符
// 递归 尝试不同的分隔符，找到最优的分隔符，使每个chunk 都有语义，且接近chunkSize
// 还是有不完美的地方（如最后剩下的不足400 字符），会直接硬切，所以用 chunkOverlap 来补救 重叠切割
const textSplitter = new RecursiveCharacterTextSplitter({  //recursive 递归  先用句号尝试，再用感叹号和问号，看哪个更加接近400 字符
    chunkSize: 400,  // 每个chunk 大小  何为chunk？ 一个document 切片，每个切片就是一个chunk
    separators:["。","！","？",],
    chunkOverlap: 100
})

const splitDocuments =
    await textSplitter.splitDocuments(documents);

console.log(splitDocuments);
