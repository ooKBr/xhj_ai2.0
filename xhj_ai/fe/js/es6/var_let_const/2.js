// 全局作用域
{
    // 代码块
    // 在这里面申明的变量，属于当前块级作用域
    const name = '张三';
    console.log(name);
}
// console.log(name);
for(var i = 0; i < 10; i++){
    // 同步代码 尽快执行完
    console.log(i);
    // 异步代码 1秒后执行 这时候i已经变成了10，因为var不支持块级作用域，所以下面this number后面输出的i会在最后输出十个10
    // 如果想下面的this number后面输出的i是零到九，那么需要将for循环里面的var改成 let，每次循环都是一个块级作用域
    setTimeout(function(){
        console.log(`This number is ${i}`);
    },1000)

}
