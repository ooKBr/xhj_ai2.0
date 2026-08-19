const str = 'abc';
// str.__proto__ 可以查看字符串的原型对象，里面能查看能调用的方法，可见字符串里面没有reverse 方法，reverse是数组的方法
// console.log(str.reverse());
// console.log([1,2,3].reverse());
const res = str.split('').reverse().join(''); // split('') 以空字符串为分隔符，将字符串切开，每个字符作为数组元素转换为数组
console.log(res);