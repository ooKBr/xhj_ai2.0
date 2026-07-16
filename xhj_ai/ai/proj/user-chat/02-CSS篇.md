# CSS 布局之 Bootstrap 栅格系统

> 本文是 user-chat 全栈项目学习笔记系列第 2 篇，讲解 Bootstrap 栅格布局与响应式设计。

---

## 一、CSS 引入方式

### 1.1 外部引入（推荐）

```html
<head>
    <link href="https://cdn.bootcdn.net/ajax/libs/twitter-bootstrap/3.0.3/css/bootstrap.min.css" rel="stylesheet">
</head>
```

**为什么在头部引入？**
- HTML 和 CSS 尽早结合
- 更早让用户看到完整样式的页面
- 避免 FOUC（无样式内容闪烁）

### 1.2 CSS 框架

| 框架 | 特点 |
|---|---|
| **Twitter Bootstrap** | 最流行的响应式框架 |
| Tailwind CSS | 原子化 CSS |
| Bulma | 现代化纯 CSS 框架 |

---

## 二、栅格系统核心

### 2.1 12 列布局原理

Bootstrap 将页面宽度分为 **12 等份**，通过组合列数来控制布局。

```
┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐
│ 1  │ 2  │ 3  │ 4  │ 5  │ 6  │ 7  │ 8  │ 9  │ 10 │ 11 │ 12 │
└────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘
```

### 2.2 基本类名

| 类名 | 含义 |
|---|---|
| `container` | 容器：中间内容宽度固定，左右留白 |
| `row` | 行：一行内的列容器 |
| `col-*` | 列：占据指定列数 |

### 2.3 响应式断点

| 前缀 | 屏幕宽度 | 适用设备 |
|---|---|---|
| `col-xs-*` | < 768px | 手机 |
| `col-sm-*` | ≥ 768px | 平板 |
| `col-md-*` | ≥ 992px | 桌面 |
| `col-lg-*` | ≥ 1200px | 大桌面 |

---

## 三、布局实战

### 3.1 居中布局

```html
<div class="row col-md-6 col-md-offset-3">
    <!-- 内容居中显示 -->
</div>
```

**原理解析：**

```
12列布局：[偏移3列][内容6列][空白3列]
         ←───── 居中 ─────→

┌────────────────────────────────────┐
│  row (12列容器)                    │
│  ┌──────────────────────────────┐  │
│  │  col-md-offset-3 (偏移3列)   │  │
│  │      ┌──────────────────┐    │  │
│  │      │  col-md-6 (6列)  │    │  │
│  │      │   宽度50%，居中  │    │  │
│  │      └──────────────────┘    │  │
│  │      3 + 6 + 3 = 12 列       │  │
│  └──────────────────────────────┘  │
└────────────────────────────────────┘
```

### 3.2 常用布局组合

```html
<!-- 两列布局 -->
<div class="row">
    <div class="col-md-6">左</div>
    <div class="col-md-6">右</div>
</div>

<!-- 三列布局 -->
<div class="row">
    <div class="col-md-4">1</div>
    <div class="col-md-4">2</div>
    <div class="col-md-4">3</div>
</div>

<!-- 侧边栏 + 主内容 -->
<div class="row">
    <div class="col-md-3">侧边栏</div>
    <div class="col-md-9">主内容</div>
</div>
```

---

## 四、Bootstrap 表格样式

```html
<table class="table table-striped" id="user-table">
    <thead>
        <tr>
            <td>ID</td>
            <td>姓名</td>
            <td>年龄</td>
            <td>家乡</td>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>1</td>
            <td>习皓俊</td>
            <td>20</td>
            <td>吉安</td>
        </tr>
    </tbody>
</table>
```

| 类名 | 效果 |
|---|---|
| `table` | 基础表格样式 |
| `table-striped` | 斑马纹（隔行变色） |
| `table-bordered` | 带边框 |
| `table-hover` | 鼠标悬停高亮 |

---

## 五、Bootstrap 4+ 居中新写法

Bootstrap 4 改用 Flexbox，居中更简单：

```html
<!-- Bootstrap 3 写法 -->
<div class="row col-md-6 col-md-offset-3">内容</div>

<!-- Bootstrap 4+ 写法 -->
<div class="row justify-content-center">
    <div class="col-md-6">内容</div>
</div>
```

---

## 六、总结

| 知识点 | 核心要点 |
|---|---|
| 12 列布局 | 页面宽度分 12 等份，组合列数控制宽度 |
| container | 固定宽度容器，左右留白 |
| col-md-6 | 中等屏幕占 6 列（50%） |
| col-md-offset-3 | 偏移 3 列，用于居中 |
| 响应式 | 不同屏幕尺寸自动适配 |

---

> **上一篇：** [HTML 语义化与文档结构](./01-HTML篇.md)
> **下一篇：** [JavaScript DOM 编程与 ES6 实战](./03-JavaScript篇.md)
