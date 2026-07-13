// js 不太严格
//单引号 双引号 分号 类型申明 不强求
// js 不需要怎么学习，直接用
//console.log('hello world');
// 常数 数组 弱语言类型
// [] 数组
//对象 object 拥有属性和方法的就是对象 
let users = [];
fetch('http://localhost:3000/users') // .then 即 等
    .then(data => data.json())  //json化
    .then(data => {
        console.log(data);
        users = data;
        const oBody = document.querySelector('.table tbody');
        let i = 1;
    for (let user of users){
    oBody.innerHTML += `
    <tr>
     /* 把变量写入到字符串中，需要使用 ${} 来包裹 */
        <td>${i}</td>
        <td>${user.name}</td>
        <td>${user.age}</td>
        <td>${user.hometown}</td>
    </tr>
    `
    i++;
    }
})
// dom 期待动态的填入  编程
// dom 节点对象
//oBody o 表示类型
// 挂载点


//console.log(oBody);
//计数循环 快，∵ 更符合cpu 计算规则
//缺点 可读性差了 
// for(let i = 0;i < users.length;i++){
//     let user = users[i];
//     console.log(user);
// }
// 来自 js 的es6 循环， 不需要计数
