# 存储
- mysql 关系型数据库
- 浏览器缓存 打开之前打开过的页面 很快
- 本地存储 文件 json csv excel ...
- 云盘
- redis 缓存
  key-value 第一次走mysql 读取文章列表，每次没有必要实时的去mysql里查，mysql 性能有瓶颈（相对于代码），把结果放到redis 里，以后走redis.
- llm 大型的embedding存储 数据智能

## 前端八股
- form 表单用于收集用户的收入，点击submit按钮，向action 地址提交，
  一般不用这种默认提交，因为体验不好，它会刷新页面
  一般是fetch/ajax，由js 来提交

## this
函数运行时指定（不是申明时候），由他的调用方式决定
this 指向函数的调用者
- 作为普通函数被调用 this 指向全局window  也没有必要，所以启用严格模式
var 申明的变量，会挂载到window 上， 污染了window 对象
解决：用let 就不会污染window 对象

- 作为对象的方法调用 this 指向调用对象
  对象的方法，引用式赋值给变量

- 作为构造函数调用 this 指向实例对象
  new 关键字，创建实例对象，调用构造函数，返回实例对象

- 作为事件处理函数
  this 指向事件触发元素

- 手动指定this 指向
  call apply 都可以手动指定this
  区别是call 是一个个传参数， apply 是传数组对象
  bind 手动指定this，返回一个新的函数
- 箭头函数 没有this 指向
  因为箭头函数 简化的函数，内部没有this