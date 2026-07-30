// 通过本地代理服务器调用 DeepSeek API，避免浏览器 CORS 限制
const API_PROXY = 'http://127.0.0.1:3000/api/chat';

const payload = {
  model: 'deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: '你好,Deepseek' }
  ]
};

try {
  const response = await fetch(API_PROXY, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `HTTP ${response.status}`);
  }

  const data = await response.json();
  console.log('DeepSeek 响应:', data);
  document.getElementById('replay').innerHTML =
    data.choices[0].message.content;
} catch (err) {
  document.getElementById('replay').innerHTML =
    '<p style="color:red;">请求失败: ' + err.message + '</p>';
  console.error('请求出错:', err);
}
