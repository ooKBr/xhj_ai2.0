// 常量一开始就要赋值
// const item；  这样是错误的
const item = 1;
let a;  //undefined
const key = 'abc123';
let points = 5
points = 51;
// let 不止是值可以改变，类型也可以改变，但是不要这样干
points = "52"; // 不好的
let winner = false;
winner = '张三';
// const里面 如果是 复杂数据类型 对象
// 那么值可以改变，但是类型不能变
const person = {
    name:'习皓俊',
    age:18
}
person.age++; //值可以改变
console.log(person);
person = "111"; //Assignment to constant variable. 不能改变类型为字符串
