// 早期的js没有class，所以约定大写为构造函数
function Greeting(name) {
    console.log(this);
    this.name = name;
}
Greeting.prototype.say = function() {
    console.log(`我叫${this.name},很高兴认识你`);
}
Greeting.prototype.work = function() {
    console.log(`我叫${this.name},我正在工作`);
}
const xhj = new Greeting('wxf');
console.log(xhj.name);
xhj.say();
xhj.work();