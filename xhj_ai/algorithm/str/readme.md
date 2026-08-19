# 面试中常考的字符串算法

## 反转字符串
- 字符串上没有提供reverse
- 数组上有reverse方法
  先split 成数组，再reverse 反转数组，再join 得到反转后的字符串。
let str = "abc"; // 简单数据类型
str.length  //能通过 '.' 来访问属性的不是只有对象(复杂数据类型)吗
JS 完全面向对象，几乎没有函数
let str2 = new String("abc");
字符串实例，对象 Object.prototype.toString.call(str2)
  返回[object String]
一切皆是对象，Object 的子类
Object.prototype.toString
把对象序列化（字符串化）
let o = {a:1, b:2}
o.toString()  // [object Object] ？
JSON.stringify()  对象序列化是它的活
正好，js 一切皆是对象， object 都是对象的原型
怎么去区分不同的对象子类型 o.toString() 把这个区分细化类型的活干了
"[object Object]" 
[1,2,3].toString()  // '1,2,3'  数组序列化

- call   js 函数可以借给别人用。

## 判断一个字符串是否是回文字符串
回文字符串是指正读和反读都一样的字符串，例如”yessey“

## 回文字符串的衍生问题

给定一个非空字符串s，最多删除一个字符，判断是否能成为回文字符串。


