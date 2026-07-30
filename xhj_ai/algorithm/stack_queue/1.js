// 函数表达式 匿名函数直接给变量赋值，变量名就是类名
// 类 MyQueue
// 早期的js 没有类
// JS 是基于原型的面向对象
// 不需要class 也可以完成面向对象
//  用 函数 + prototype 更优秀
// 什么是类？ 类是一个抽象的 一套属性 + 方法的模板

const MyQueue = function()  {
    // 构造函数，属性
    console.log('实例化', this)
    // this.x = 1;
    this.stack1 = [];
    this.stack2 = [];
}
MyQueue.prototype.push = function() {
    console.log('push方法');
}
// new 运算符 this指向我们的实例对象 queue
const queue = new MyQueue();
console.log(queue,queue.push());
