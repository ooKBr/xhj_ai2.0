<template>
  <!-- 会做数据绑定{{ }} -->
  <div class="container">
    <!-- ===== 输入区域 ===== -->
    <div class="input-section">
      <label class="label">输入：</label>
      <!-- v-model  vue 数据双向绑定 -->
      <!-- 属性绑定 :value  绑定到input的value属性上 -->
      <input type="text" class="input" v-model="question" placeholder="请输入你的问题..." />
      <button class="btn" @click="update" :disabled="loading">
        <!-- 三元表达式：加载中显示"请求中..."，否则显示"提交" -->
        {{ loading ? '请求中...' : '提交' }}
      </button>
    </div>

    <!-- ===== 输出区域 ===== -->
    <div class="output">
      <div class="stream-toggle">
        <label class="label">流式输出</label>
        <input type="checkbox" v-model="stream" />
        <!-- v-if 条件渲染：勾选流式时显示提示标签 -->
        <span v-if="stream" class="stream-tag">✨ 已开启流式</span>
      </div>
      <!-- 内容展示区：class 绑定，流式模式下加边框动画效果 -->
      <div class="content-box" :class="{ 'streaming-mode': stream && loading }">
        {{ content }}
      </div>
    </div>
  </div>
</template>

<script setup>
// vue 前端第二框架  react 第一
// vue & react 都是具有 组件化思想(component)、 数据绑定(data binding)、 响应式(reactive) 等现代前端开发框架
// 组件化思想， 构成页面的最小单位不再是html标签，而是组件
// html标签式元素，太多了，不好作为一个工作的单元
// css 也一样，css rule
// js dom
// 将一堆html，css，js 组合在一起，形成一个可复用、好维护的特定业务工作单元  .vue
// 数据绑定思想 template 绑定数据 不需要dom 编程
// 以前的时候是  fetch 数据， dom innerHTML 渲染数据  
// ref 定义一个响应式数据 数据改变了，页面自动更新 reactive
import { ref } from 'vue'

// let count = ref(1);  // 响应式**数据**状态（不同的页面状态）
// 只需要和question打交道

// ========== 响应式变量定义区 ==========
// question：存储用户在输入框输入的问题
const question = ref('讲一个关于中国龙的故事');
// stream：是否开启流式输出模式，默认 false（不开启）
const stream = ref(false);
// content：存储 AI 返回的回答内容，用于页面展示
const content = ref('');
// loading：标记当前是否正在请求中（用于禁用按钮、显示加载状态）
const loading = ref(false);

// setTimeout(() => {
//   count.value = 2;
// },2000)

// 开发调试用：在浏览器控制台打印 API Key（确认环境变量读取成功）
console.log('API Key:', import.meta.env.VITE_DEEPSEEK_API_KEY)

/**
 * update 函数：点击"提交"按钮时执行的核心业务逻辑
 * 功能：调用 DeepSeek AI 接口，获取回答并展示
 * 支持两种模式：流式输出（打字机效果）/ 非流式输出（一次性返回）
 */
const update = async () => {
  // ========== Step 1：基础校验 ==========
  // console.log(question.value);
  // trim() 去掉首尾空格，防止用户只输入空格就提交
  if (!question.value.trim()) {
    alert('请输入问题后再提交哦~');
    return;
  }

  // ========== Step 2：请求前置准备 ==========
  // 标记开始请求（按钮变灰、显示"请求中..."）
  loading.value = true;
  // 先给用户一个即时反馈，让他知道请求在处理
  content.value = '🤔 思考中...';

  // ========== try/catch 错误捕获：防止网络失败导致页面崩溃 ==========
  // 任何异步操作都应该包 try/catch，否则出错后代码直接中断，用户不知道发生了什么
  try {
    // API 接口地址：DeepSeek 聊天补全接口
    const endpoint = 'https://api.deepseek.com/chat/completions';
    // 请求头配置
    const headers = {
      'Content-Type': 'application/json',
      // apikey 令牌的一种标记 Bearer 开始 token
      Authorization: `Bearer ${import.meta.env.VITE_DEEPSEEK_API_KEY}`
    }

    // ========== Step 3：发送 HTTP 请求 ==========
    // fetch 是浏览器原生 API，发送网络请求
    // await 等待请求返回结果（这期间 JS 不会阻塞，还能响应其他操作）
    const response = await fetch(endpoint, {
      method: 'POST',  // 相对GET， POST 加密 更安全 有请求体
      headers,
      // JSON.stringify 把 JS 对象转成 JSON 字符串（请求体必须是字符串）
      body: JSON.stringify({
        model: 'deepseek-v4-flash',  // 指定使用的 AI 模型
        messages: [
          {
            role: 'user',           // 消息角色：user=用户发送的消息
            content: question.value // 消息内容：用户输入的问题
          }
        ],
        stream: stream.value  // llm 接受参数，是否开启流式输出
      })
    });

    // ========== Step 3.5：HTTP 状态码校验 ==========
    // fetch 不会自动抛出 4xx/5xx 错误，需要手动检查 response.ok
    // response.ok 只有在状态码 200~299 时才是 true
    if (!response.ok) {
      // 比如 401（未授权，API Key错了）、429（请求太频繁）、500（服务器挂了）
      const errorText = await response.text();
      throw new Error(`请求失败：状态码 ${response.status}，${errorText}`);
    }

    // ========== Step 4：根据 stream 值走不同分支 ==========
    if (stream.value) {
      // ========== 【分支A】流式输出处理（打字机效果）==========
      // 先清空"思考中..."，准备逐字追加
      content.value = '';

      // response.body 是 ReadableStream（可读二进制流）
      // 数据像水管里的水，一批批流过来，不是一次性给完
      console.log('响应体类型：', response.body);

      // getReader()：从可读流中获取一个"读取器"
      // 读取器就像水龙头的开关，可以控制什么时候读下一批数据
      // ?. 可选链操作符：如果 body 是 null/undefined，不会报错
      const reader = response.body?.getReader();
      if (!reader) throw new Error('无法获取响应流读取器');

      // TextDecoder：二进制解码器
      // 从流里读出来的是 Uint8Array（字节数组，一堆数字），人类看不懂
      // 需要用 TextDecoder 把二进制解码成 UTF-8 文本字符串
      const decoder = new TextDecoder('utf-8');

      let buffer = '';   // ⭐缓冲区！极其重要：用于拼接不完整的数据块
      // 为什么需要 buffer？
      // 因为 TCP 分片传输，一次读取到的 chunk 可能不是完整的一行 SSE 数据
      // 比如：本该收到 "data: {完整JSON}"，但这次只收到 "data: {半截JSO"
      // 这时候就需要先存到 buffer，等下一批数据来了再拼起来，拼成完整一行再解析

      while (true) {
        // ========== Step 4A-1：读一批数据 ==========
        // reader.read() 是异步的，返回 { value, done }
        //   value: Uint8Array 字节数组（这一批的二进制数据）
        //   done:  boolean，true 表示流结束了（所有数据读完了）
        const { value, done } = await reader.read();

        // 如果 done=true，说明服务器已经把所有数据发完了，退出循环
        if (done) break;

        // ========== Step 4A-2：二进制 → 文本解码 ==========
        // decode(value)：把 Uint8Array 转成字符串
        // 注意：decode 内部会处理多字节字符（中文一个字占3字节）被截断的情况
        const chunk = decoder.decode(value, { stream: true });
        // { stream: true } 选项：告诉解码器这是流式处理，可能还有后续数据
        // 如果有半个中文字节暂时解不出来，先存在解码器内部，下次再解码

        // ========== Step 4A-3：把新收到的文本追加到缓冲区 ==========
        buffer += chunk;

        // ========== Step 4A-4：按行分割，逐行解析 SSE 格式 ==========
        // SSE（Server-Sent Events）协议每行以 \n 分隔
        // 数据格式：
        //   data: {"choices":[{"delta":{"content":"你"}}]}
        //   data: {"choices":[{"delta":{"content":"好"}}]}
        //   data: [DONE]  ← 表示全部结束

        // 按换行符把 buffer 切成数组
        // 注意：最后一行可能是不完整的（只收到半个数据块），所以保留在 buffer 中不处理
        const lines = buffer.split('\n');
        // pop() 取出最后一行（不完整的那行），放回 buffer
        // 如果最后一行是完整的，那 pop 出来的就是 ''，也没关系
        buffer = lines.pop() || '';

        // 遍历每一行完整的行
        for (const line of lines) {
          // ========== Step 4A-5：过滤空行和非 data 行 ==========
          // trim() 去掉前后空白字符
          const trimmedLine = line.trim();
          // 空行跳过（SSE 中事件之间用空行分隔）
          if (!trimmedLine) continue;
          // 必须以 "data:" 开头才是我们要的数据行
          if (!trimmedLine.startsWith('data:')) continue;

          // 提取 "data:" 后面的内容
          const dataStr = trimmedLine.slice(5).trim();

          // ========== Step 4A-6：判断是否结束标记 [DONE] ==========
          // SSE 协议约定最后一条消息是 "data: [DONE]"
          if (dataStr === '[DONE]') {
            // 流结束，跳出 while 循环（用 label 跳出外层循环）
            break;
          }

          // ========== Step 4A-7：JSON 解析 ==========
          // dataStr 是 JSON 字符串，需要转成 JS 对象才能取里面的 content
          try {
            const data = JSON.parse(dataStr);
            // 数据取值路径：data.choices[0].delta.content
            // 流式接口返回的不是 message，而是 delta（增量）
            // delta: { content: "xxx" } 表示这一批新增的一个字/词
            const delta = data.choices?.[0]?.delta?.content || '';
            // ========== Step 4A-8：增量追加到 content ==========
            // ⭐响应式数据追加：页面会自动更新显示
            // 追加一个字 → 页面多显示一个字 → 打字机效果
            content.value += delta;
          } catch (parseErr) {
            // 某一行 JSON 解析失败不影响整体，打个 log 继续下一行
            console.warn('JSON 解析失败，跳过该行：', trimmedLine, parseErr);
          }
        }
      }

      // 流处理完毕，释放读取器（好习惯，释放资源）
      reader.releaseLock();

    } else {
      // ========== 【分支B】非流式输出处理（一次性返回）==========
      // 没有勾选，非流式输出
      // 生成完了，直接一次返回结果
      // response.json()：把响应体二进制流自动解析成 JS 对象
      const data = await response.json();
      // 不再需要dom 编程，直接修改数据状态
      // 取值路径：data.choices[0].message.content
      // 非流式接口返回的是 message（完整消息对象）
      content.value = data.choices[0].message.content;
    }

  } catch (error) {
    // ========== Step 5：错误处理 ==========
    // 只要上面 try 块里任何一步出错，都会跳到这里
    console.error('请求出错啦：', error);
    // 给用户友好的错误提示，而不是页面一片空白或卡住
    content.value = `❌ 出错了：${error.message || '未知错误'}\n请检查网络连接或 API Key 是否正确。`;
  } finally {
    // ========== Step 6：收尾操作（无论成功失败都会执行）==========
    // finally 的作用：不管 try 里是正常走完还是 catch 了，这里一定会执行
    // 最适合做"收尾还原"工作，比如把 loading 改回 false
    // 如果不加 finally，出错后 loading 会一直是 true，按钮一直禁用
    loading.value = false;
  }
}
</script>

<style scoped>
/* scoped：样式只作用于当前组件，不会污染其他组件（Vue 官方推荐）*/

/* ===== 最外层容器：更大尺寸 + 基础视觉 ===== */
.container {
  max-width: 800px;           /* 最大宽度 800px，在大屏上不会太宽 */
  margin: 40px auto;          /* 上下 40px 外边距，左右 auto 居中 */
  padding: 24px;              /* 内边距：内容不贴边 */
  background-color: #ffffff;  /* 白色背景 */
  border-radius: 12px;        /* 圆角：美观 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08); /* 柔和阴影：立体层次感 */
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
  line-height: 1.6;           /* 行高：文字不挤在一起 */
}

/* ===== 输入区域：flex 布局，横向排列 ===== */
.input-section {
  display: flex;              /* 弹性布局 */
  gap: 12px;                  /* 子元素之间的间距 12px */
  align-items: center;        /* 垂直居中对齐 */
  margin-bottom: 24px;        /* 和下方输出区域保持距离 */
  flex-wrap: wrap;            /* 空间不够时自动换行（手机端友好） */
}

/* ===== 通用 label 样式 ===== */
.label {
  font-weight: 600;           /* 加粗 */
  color: #333;                /* 深灰色文字，比纯黑更柔和 */
  font-size: 14px;
  white-space: nowrap;        /* 不换行 */
}

/* ===== 输入框样式 ===== */
.input {
  flex: 1;                    /* 占据剩余空间（自适应宽度） */
  min-width: 200px;           /* 最小宽度 200px，防止太窄 */
  padding: 10px 14px;         /* 上下 10px，左右 14px 内边距 */
  border: 1px solid #d9d9d9;  /* 浅灰色边框 */
  border-radius: 6px;         /* 圆角 */
  font-size: 14px;
  outline: none;              /* 去掉浏览器默认的蓝色轮廓 */
  transition: border-color 0.2s; /* 边框颜色变化加过渡动画 */
}
/* 输入框获得焦点时的样式 */
.input:focus {
  border-color: #1677ff;      /* 变成蓝色边框，提示用户在编辑这个框 */
  box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1); /* 外围再加一层淡蓝光晕 */
}

/* ===== 提交按钮样式 ===== */
.btn {
  padding: 10px 24px;
  background-color: #1677ff;  /* 蓝色主色调 */
  color: white;               /* 白色文字 */
  border: none;               /* 去掉默认边框 */
  border-radius: 6px;         /* 圆角 */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;            /* 鼠标移上去变成小手 */
  transition: all 0.2s;       /* 所有属性变化加过渡动画 */
}
/* 鼠标悬停效果 */
.btn:hover:not(:disabled) {
  background-color: #4096ff;  /* 亮一点的蓝色 */
}
/* 按钮被禁用时（loading=true）的样式 */
.btn:disabled {
  background-color: #a0cfff;  /* 更淡的蓝色 */
  cursor: not-allowed;        /* 鼠标变成禁止符号 */
}

/* ===== 输出区域 ===== */
.output {
  border-top: 1px solid #f0f0f0;  /* 输入和输出区之间加一条分隔线 */
  padding-top: 20px;              /* 分隔线和内容之间的间距 */
}

/* ===== 流式开关行 ===== */
.stream-toggle {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

/* ===== 流式模式开启时的小标签 ===== */
.stream-tag {
  font-size: 12px;
  color: #52c41a;             /* 绿色文字 */
  background-color: #f6ffed;  /* 淡绿背景 */
  padding: 2px 8px;
  border-radius: 4px;
}

/* ===== 内容展示盒子 ===== */
.content-box {
  min-height: 150px;          /* 最小高度 150px，空的时候也有高度 */
  padding: 16px;
  background-color: #fafafa;  /* 淡灰背景，和输入区区分开 */
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  white-space: pre-wrap;      /* ⭐保留换行符和空格（AI回答会有换行） */
  word-break: break-word;     /* 长英文单词自动换行，不撑破盒子 */
  color: #333;
  font-size: 14px;
  transition: all 0.3s;
}

/* ===== 流式模式下的内容盒子：呼吸光效果 ===== */
/* :class 绑定 streaming-mode 后启用 */
.content-box.streaming-mode {
  border-color: #1677ff;      /* 蓝色边框 */
  background-color: #f0f7ff;  /* 淡蓝背景 */
  /* 呼吸光晕动画：柔和地亮灭交替 */
  animation: breathing 1.8s ease-in-out infinite;
}

/* ===== CSS 动画定义：呼吸效果 ===== */
@keyframes breathing {
  0%   { box-shadow: 0 0 0 0 rgba(22, 119, 255, 0.15); }
  50%  { box-shadow: 0 0 0 8px rgba(22, 119, 255, 0);   }
  100% { box-shadow: 0 0 0 0 rgba(22, 119, 255, 0);    }
}
</style>