// // 主程序文件
// // 多个默认的输出a,b... 模块向外输出 { 对象 key.value}
// // 解构赋值语法
// import client, { a, b } from './client.mjs'
// console.log(client);
// // let {name,age} = {"name":"詹姆斯","age":20}
// // console.log(name,age);
// let obj = {"name":"姚明","city":"北京"};
// // let name = obj.name;
// // let city = obj.city;
// // es6 让js 大型项目企业级开发语言
// // 解构赋值语法 可以一次性从对象中提取多个属性，从对象中提取属性值 成为变量，代码优雅简洁，而且性能更好
// let {name,city} = obj;
// // console.log(name,city);
// // name 和 obj.name 性能差异
// // 数组的解构， 按顺序解构， ... 在解构中是"剩下的都给我打包成数组" rest 运算符 余下的全部解构 
// let [coach,...players] = ['范甘迪','姚明','麦迪','穆托姆博','弗朗西斯'];
// // console.log(coach,players);
// let [hCoach,...hrPlayers] = ['杰克逊','科比','费舍尔','加索尔'];
// let allPlays = [...players,...hrPlayers];  // spread 运算符 展开运算符
// console.log(allPlays);
// 入口文件 简洁
import { getCompletion } from "./completion.mjs"

async function main() {
    const prompt = '请用一句话解释什么是模块化编程';
    const response = await getCompletion(prompt);
    console.log(response);
}
main();
