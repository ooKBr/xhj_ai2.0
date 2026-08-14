# 3D

- canvas 
html5 新增标签， js api绘制，

## css 3d
css 数属性去触发3d 绘制，不止3d，还会带来GPU加速
那怕是2d的页面，有时我们也会手动3d 化
### 布局 layout
- 外层盒子 布局
- 内层 展示

### 水平垂直居中
- 父容器
    body 100% 100vh（css3新单位）
    100 份 （等比例）
    移动端适配
    vh view-height 视窗高度 
    vw view-width 视窗宽度
- 子元素

## 行内/块级
- html元素有两类 行内 块级
div，ul 等块级
span 等 行内
- 块级 block 盒子
    - 可以设置宽高
    - 独占一行
- 行内 inline
    - 不可以设置宽高
    - 也不会把兄弟挤下去
- display 属性
    flex 在这个盒子所在的区域开启弹性格式上下文
    inline-block 行内块级
       - 不会把兄弟挤下去
       - 又可以设置宽高 
    浏览器默认行为块级/行内 -> display手动切换inline/block -> 格式化上下文(flex/inline-block/grid)
      inline-block 默认有个天坑，默认空格符 会占据一定的大小 \n \r ，假设有两个inline-block 元素，他们的宽度都是50%，那么他们就会并排显示，而不是占满一行显示
    
## 定位
position: relative;   相对定位
position: absolute;   绝对定位 
