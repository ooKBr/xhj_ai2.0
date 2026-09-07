<script setup>
// setup 语法糖 来自vue3 composition 组合式 api
import { ref } from 'vue'  // ref 响应式数据

// composition api 可以把相关逻辑组织在一起 vue2不可以 选项式API
const question = ref('讲一个中国龙的故事');
const content = ref('');
const stream = ref(true);

const update = async () => {
  if (!question.value) {
    return;
  }
  content.value = '思考中...';  // 页面状态 开始llm 接口调用

  const endpoint = 'https://api.deepseek.com/chat/completions'; 
  const headers = { 
    'Content-Type': 'application/json', 
  Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}` 
  };

  const response = await fetch(endpoint, {
    method:'POST',
    headers,
    body:JSON.stringify({
      model:'deepseek-v4-flash',
      messages:[{
        role:'user',
        content:question.value
      }],
      stream:stream.value  
    })
  });

  if(stream.value) {
    content.value = '';
    // 大文件上传 慢慢流向 权限+形式 js原生提供了 ReadableStream 对象
    // llm 服务器 ReadableStream对象 数据流？
    // stream 对象 水流 服务器端流向浏览器
    // response.body 服务器端响应体 二进制流
    console.log(response.body);
    // 水管子，嘬一口，getReader() 返回 读取器对象
    // await 等token 流来为止
    const reader = response.body?.getReader();
    console.log(reader);
    // 二进制编码
    const decoder = new TextDecoder();  // 二进制流服务的
    let done = false;  // 开关变量   data:[DONE]
    let buffer = '';  // 截断做准备 上一次JSON.parse() 失败的 不完整json completion

    while(!done) {
      // 嘬一口， 嘬到了resolve， 没嘬到，继续等
      // value 的最后一个data:[DONE],告诉后面已经没有数据了，可以不用嘬了
      const { value,done: doneReading } = await reader?.read();  // reader对象 兼容性，老浏览器不一定支持
      done = doneReading;  // 设置开关变量
      // 除了把本轮的value 要处理之外，之前也可能会有东西要一起处理 所以要加 buffer
      // chunk 一小块 json 格式
      // delta 偏移量  一小块一小块 的增量
      // 解析 json 字符串 choices[0].message.content
      // json 断开的可能 动态 buffer 不一定有值
      // 如果有，说明上一个chunk 最后一行，是不完整的json，buffer用来记录上一次还没有处理完的json
      const chunkValue = buffer + decoder.decode(value);
      // console.log(chunkValue);
      buffer = '';  // 上一次的已经拼到这一次来了，buffer 的任务完成了，所以要重新清空buffer
      // json 字符串 多行数据
      // 一次发送一行，也可能发送多行 取决于llm 计算速度和任务量
      // 每次由 data: 开始 又有数据来了
      const lines = chunkValue.split('\n')
      // 为了严谨性，比如可能插入的时候不止一个\n ，加一个只有碰到data: 才处理的限制
        .filter((line) => line.startsWith('data:'))

        for (const line of lines) {
          // data:
          const incoming = line.slice(6);  // 切掉申明头data： 共六个（因为还有一个空格）
          if (incoming === '[DONE]') {  // [DONE] 表示流完成 说明后面没有数据了
             // 表示结束的两种情况，一种是在next Token 的时候就设置了done:true
             // 一种是单独的发送一条data:[DONE] 文本流
             done = true;
             break;
          }
          // incoming content 是json 字符串
          try {
            const data = JSON.parse(incoming);
            const delta = data.choices[0].delta.content;
            if(data && delta) {
              content.value += delta;
            }
          } catch (err) {
            // data:  一定要加  没有 } 结束，证明是把中间截断了，
            // 把他存到buffer里面并且前面加上data: ，就变成一个合格的能被解析的json字符串
            buffer = `data: ${incoming}`
          }

        }
    }

  } else {
    const data = await response.json();
    // 只需要修改数据状态，响应式会自动更新页面
    content.value = data.choices[0].message.content;
  }

}


// const count = ref(0);  // 变量-> 数据(数据绑定)-> 数据状态(响应式)-> 页面状态(反映在页面上)
// RefImpl响应式对象，值是count.value
// count.value 改变的时候，页面上绑定了count的地方会局部热更新
// console.log(count,count.value);
</script>
<template>
  <div class="container">
    <div>
      <label>输入：</label><input class="input" v-model="question" />
      <button @click="update">提交</button>
    </div>
    <div class="output">
      <div><label>Streaming</label><input type="checkbox" v-model="stream"/></div>
      <div>{{ content }}</div>
    </div>
  </div>
</template>
<style>
.container { 
  /* 文档流 是页面布局的基础
  从上到下，从左到右， 流式布局
  每个盒子在文档流有自己的位置和大小
  盒模型
  开启新的格式化上下文  */
  display: flex;  /* 弹性布局 */
  flex-direction:column;
  align-items:start;
  justify-content:start;
  height: 100vh;
  font-size: 0.85rem; /* 移动端适配，等比例 html标签等比例 */
}
.input {
  width: 200px;
}
.output {
  margin-top: 10px;
  min-height: 300px;
  width: 100%;
  text-align: left;
}
button{
  padding:0 10px;
  margin-left:6px;
}
</style>