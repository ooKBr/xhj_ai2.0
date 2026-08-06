function add(a:number,b:number) {
    return a + b;  // + 法， 字符串拼接
}
// js 足够简单
// 但是在大型项目中，这很可能会出现一些类型错误
let a = 1;
let b ="2";
// add(a,parseInt(b)); // api转换
// add(a,+b); // 隐式类型转换
console.log(add(a,Number(b))); // 强制类型转换