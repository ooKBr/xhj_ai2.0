var height = 200;
// 局部作用域 gloal scope
function setWidth() {
    // 局部作用域 局部作用于变量
    var width = 100;
    console.log(width, height);
}

setWidth();
// console.log(width);



var age = 100;
if (age > 12) {
    // 块级作用域
    // es6 const 申明一个常量 不可改变
   var dog = age * 7;
    console.log(dog);
    dog++;
}
console.log(dog);
