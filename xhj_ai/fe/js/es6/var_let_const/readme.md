# es6

JavaScript 蹭了一波java 的热度，是一门弱类型动态语言，早期设计用来给网页添加交互（幻灯片），和 DOM 编程。
JS 是以Escript 为语言标准的语言
ES6 是JS 的新版本，早期是ES5 
2015年， 企业级大型项目开发发展
JS 是一个KPI项目，一周就开发出来
## 申明变量并赋值
- var es5 现在已经不用了
- let es6+  代替var

## 作用域 scope 
### 作用域的嵌套
- 全局作用域 
- 函数局部作用域
    - 局部作用域
- 块级作用域 {  }
变量属于作用域，
变量声明，JS是弱类型的，类型由值决定
- 查找变量的规则
    - 先在当前作用域查找
        找到了，ok
    - 如果没有找到，向外层作用域查找，从内到外从当前往上 冒泡查找
    - 当在全局作用域都没有找到，停下来 报错。
- 函数/代码块运行后，垃圾回收了
    - 内存角度 变量的申明
    在内存中申请了一块区域
    销毁函数 回收内存
    变量的生命周期


- Assignment to constant variable  常量不能改变
- ReferenceError: XXX is not defined  变量未定义
- ReferenceError: Cannot access 'XXX' before initialization 不能访问这个变量在初始化之前

## var let const 
早期的js 使用var 申明变量，没有常量，只能用代码规范约束
eg. var PI = 3.1415926
    var CHATMODEL = 'deepseek-chat'
    var 不支持块级作用域
js 设计的时候比较赶工，浏览器的副产品，js 没有经过深思熟虑的，有一些瑕疵
es6  let 负责变量， const 负责常量
  支持块级作用域
  变量的类型由值决定

## for + setTimeout
var 不支持块级作用域，只有一个 i  // 见 2.js
同步的i为10，setTimeout 打印的都是10
let 支持块级作用域，嵌套着n个局部作用域

const 申明时就要赋值，let 声明和赋值可以分开
const variale
简单数据类型不可以改变值
复杂数据类型值可以改变，类型不可以改变

## 变量的提升 hoisting
- 代码先有编译阶段
    准备执行上下文
    全局执行上下文
    编译阶段会把全局作用域里的变量提升到最前面，即变量提升
- 再有执行阶段
- 但是这是不好的东西
    和代码顺序，直觉不符合
    应避免变量提升
- 怎么解决 
    用let 代替var，let 不支持变量提升