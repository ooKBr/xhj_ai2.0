// null和undefined好像都表示空，或者没有，那他们怎么区分？
// null
//primitive 原始 内存空间固定，
// 拷贝式赋值
let a = null;
let b = a;  // 拷贝，复印机
b = 2;
let obj1 = {name:"xhj"}
let obj2 = obj1; // 引用式赋值
obj2.company = "字节跳动";
console.log(obj1,obj2); //obj1 obj2 都指向了 obj1 这个对象
console.log(a);
console.log(a,b);



let obj = {
    name: "Alice",
    address: null
}
console.log(obj.address); // null
console.log(obj.age); // undefined

let largeObject = {
    data: new Array(10000000).fill("hgh")
}
// 手动回收内存
largeObject = null;