import 'dotenv/config';
import "cheerio";
// 从url 加载文档
import { 
    CheerioWebBaseLoader
} from "@langchain/community/document_loaders/web/cheerio";
// 访问网址 并提取文档内容 
// cheerio 可以传递css 选择器 来提取文档内容 缩小范围
const cheerioLoader = new CheerioWebBaseLoader(
    'https://juejin.cn/post/7680709250218410011',
    {
        selector:'.main-area p'  // p 标签里面的内容一般就是文章段落
    }
)
const documents = await cheerioLoader.load();
console.log(documents);