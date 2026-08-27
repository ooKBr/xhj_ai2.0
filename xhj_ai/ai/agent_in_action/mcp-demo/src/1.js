const obj = {
    'bytedance':['AI全栈开发','Agent 工程师'],
    'tecent':['后端开发','Agent 工程师'],
    '163':['前端开发']
}
// 返回的是二维数组
for(let [key,value] of Object.entries(obj)) {
    console.log(key,value);
}