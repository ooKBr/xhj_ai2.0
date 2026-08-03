// var 可以多次声明，后面的可以覆盖前面的
// var a= 1;
// var a= 1;

//打印出来a是function，
// 因为 函数声明的提升优先级高于变量声明，函数声明在编译阶段 最后处理 ，会覆盖同名的 var 声明
// console.log(a);
// var a= 1;
// function a() {
// }

// let 不可以重复声明变量
let a = 1;
function a() {
}