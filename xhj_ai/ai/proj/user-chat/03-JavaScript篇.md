# JavaScript DOM 编程与 ES6 实战

> 本文是 user-chat 全栈项目学习笔记系列第 3 篇，讲解 DOM 编程、ES6 语法与异步请求。

---

## 一、DOM 编程

### 1.1 什么是 DOM？

- **DOM** = Document Object Model（文档对象模型）
- HTML 里是**标签**，JS 里是**对象**（映射关系）
- 通过 JS 可以操作 HTML 标签

### 1.2 DOM 树状结构

```
document (根对象)
└── documentElement (根节点 <html>)
    └── body (我们看到的页面)
        └── 各种标签节点...
```

> JS 前端已经准备好了 `document` 对象
> - `document` 是树状结构
> - `document.documentElement` 是根节点
> - `document.body` 是我们看到的页面

### 1.3 挂载点概念

**挂载点 = 数据注入的目标位置**

```javascript
// 1. 找到挂载点（DOM 节点）
const oBody = document.querySelector('.table tbody');

// 2. 往挂载点写入内容
oBody.innerHTML += `<tr>...</tr>`;
```

> 命名规范：`oBody` 中 `o` 表示 object（对象类型）

### 1.4 常用 DOM 操作

| 方法/属性 | 作用 |
|---|---|
| `document.querySelector()` | 用选择器查找标签 |
| `element.innerHTML` | 获取/修改元素内容 |
| 节点关系 | 可查看孩子节点、兄弟节点、挂载节点 |

### 1.5 DOM 编程流程

```
HTML 页面 → document 对象 → querySelector 查找 → innerHTML 修改
   ↑                                              ↓
   └──────── 动态更新页面 ←────────────────────────┘
```

---

## 二、ES6 语法

### 2.1 for...of 循环

```javascript
// ES6 循环，不需要计数
for (let user of users) {
    console.log(user.name);
}

// 对比传统 for 循环（计数循环）
// 优点：快，更符合 CPU 计算规则
// 缺点：可读性差
for (let i = 0; i < users.length; i++) {
    let user = users[i];
    console.log(user);
}
```

### 2.2 模板字符串

```javascript
// 用反引号 `` 包裹，${} 插入变量
oBody.innerHTML += `
    <tr>
        <td>${i}</td>
        <td>${user.name}</td>
        <td>${user.age}</td>
        <td>${user.hometown}</td>
    </tr>
`;
```

> 把变量写入到字符串中，需要使用 `${}` 来包裹

### 2.3 箭头函数

```javascript
// 传统写法
.then(function(data) {
    return data.json();
})

// 箭头函数简写
.then(data => data.json())
```

### 2.4 let 与 const

```javascript
let users = [];        // 变量：可重新赋值
const oBody = ...;     // 常量：不可重新赋值
```

---

## 三、异步请求

### 3.1 fetch 请求流程

```javascript
let users = [];
fetch('http://localhost:3000/users')  // 发起请求
    .then(data => data.json())         // 第一步：把响应转成 JSON
    .then(data => {                    // 第二步：处理数据
        console.log(data);
        users = data;
        const oBody = document.querySelector('.table tbody');
        let i = 1;
        for (let user of users) {
            oBody.innerHTML += `
                <tr>
                    <td>${i}</td>
                    <td>${user.name}</td>
                    <td>${user.age}</td>
                    <td>${user.hometown}</td>
                </tr>
            `;
            i++;
        }
    });
```

### 3.2 Promise 链式调用

```
fetch() → 返回 Promise
    ↓
.then(data => data.json()) → 解析 JSON，返回新 Promise
    ↓
.then(data => { ... }) → 处理最终数据
```

> `.then` 即"然后"，等上一步完成再执行

### 3.3 完整数据渲染流程

```javascript
// 1. 声明变量
let users = [];

// 2. 发起请求
fetch('http://localhost:3000/users')
    .then(data => data.json())
    .then(data => {
        // 3. 保存数据
        users = data;

        // 4. 找到挂载点
        const oBody = document.querySelector('.table tbody');

        // 5. 遍历数据，渲染到页面
        let i = 1;
        for (let user of users) {
            oBody.innerHTML += `
                <tr>
                    <td>${i}</td>
                    <td>${user.name}</td>
                    <td>${user.age}</td>
                    <td>${user.hometown}</td>
                </tr>
            `;
            i++;
        }
    });
```

---

## 四、JS 语言特性

### 4.1 弱类型语言

```javascript
// JS 不太严格
// 单引号 双引号 分号 类型申明 不强求
// JS 不需要怎么学习，直接用

console.log('hello world');

// 常数、数组、对象 - 弱语言类型
const num = 10;        // 数字
const str = 'hello';   // 字符串
const arr = [1, 2, 3]; // 数组
const obj = {          // 对象
    id: 1,
    name: 'xi haojun'
};
```

### 4.2 对象字面量

```javascript
// 对象 object：拥有属性和方法的就是对象
// 对象字面量：字面意思就能懂
const user = {
    id: 1,
    name: 'xi haojun',
    age: 20,
    hometown: '吉安'
};
```

---

## 五、总结

| 知识点 | 核心要点 |
|---|---|
| DOM | HTML 标签在 JS 中的对象映射 |
| 挂载点 | JS 往哪个 HTML 元素里写内容 |
| querySelector | 用 CSS 选择器查找 DOM 节点 |
| 模板字符串 | 反引号 + `${}` 插入变量 |
| for...of | ES6 循环，无需计数 |
| fetch | 发起 HTTP 请求 |
| Promise | 异步操作的结果承诺 |
| 箭头函数 | `=>` 简化函数写法 |

---

> **上一篇：** [CSS 布局之 Bootstrap 栅格系统](./02-CSS篇.md)
> **下一篇：** [前后端分离架构实践](./04-前端架构篇.md)
