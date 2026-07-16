# 数组去重
## 手写代码、业务场景题
[1,2,3,2,5]

## 注释
- 有利于协作
代码的开发者和使用者可能不是一个人
也可能自己会忘记
注释是代码的一部分
注释会提高代码的可读性
一个函数写一个功能
- 封装 复杂功能
- 健壮性 先校验参数 eg.下面的判断是否是数组
## 形式
- 完成功能的函数

## 数组API
- Array.isArray() 判断是否是数组  // Array 大写开头，是内置构造函数
- arr.indexOf(item) 返回item第一次在数组中出现的下标，如果没有则返回-1，通常item是要查找的元素  // arr 是数组变量名，item 也是变量名
- arr.push(item) 向数组的末尾添加一个或多个元素，并返回新的长度
- filter 过滤 （arr, function(item,index){     //filter 方法 返回一个 新数组 ，包含所有返回 true 的元素
    return 条件;  // true item就留下，false item就离开
} ）   
- sort()  排序 

## 时间复杂度和空间复杂度
O(n^2)  两重循环、 filter、 indexOf
O(nlogn) 先排序再相邻
O(n) 用空间换时间 对象字面量|HashMap
