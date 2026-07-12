// js 不太严格
//单引号 双引号 分号 类型申明 不强求
// js 不需要怎么学习，直接用
//console.log('hello world');
// 常数 数组 弱语言类型
// [] 数组
//对象 object 拥有属性和方法的就是对象 
const users = [
{
    id:1,
    name:'xi haojun',
    age:20,
    hometown:'吉安',
}, // 对象字面量，字面意思就能懂
{
    id:2,
    name:'li si',
    age:19,
    hometown:'北京',
},
{
    id:3,
    name:'wangwu',
    age:20,
    hometown:'上海',
   }
];

// dom 期待动态的填入  编程
const oBody = document.querySelector('.table tbody');

// 将 users 数组数据动态渲染到表格
function renderUsers() {
    let html = '';
    users.forEach(user => {
        html += `
            <tr>
                <td>${user.id}</td>
                <td>${user.name}</td>
                <td>${user.age}</td>
                <td>${user.hometown}</td>
            </tr>
        `;
    });
    oBody.innerHTML = html;
}

renderUsers();
