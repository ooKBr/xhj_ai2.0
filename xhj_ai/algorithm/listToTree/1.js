// 扁平列表数据
// 扁平 数组的数据是一维的，每项不再是数组
// 管理后台 树状结构
// 地址三连弹、多级菜单等 常见复杂功能
// parentId 是树状的关键
// mysql 数据存储表结构是一致的
// select * from 取出来
// 列表转树
// 先拿到第一层，选中了后，再显示相应的第二层...
const flatList = [
    // 1,2,3,[4,[5,6]]
    {id: 1, name:'一级菜单A', parentId: 0},  // parentId 0 表示是一级菜单
    {id: 2, name:'一级菜单B', parentId: 0},  
    {id: 3, name:'二级菜单A-1', parentId: 1},
    {id: 4, name:'三级菜单A-1-1', parentId: 3}, 
    {id: 5, name:'二级菜单B-1', parentId: 2} 
]

function listToTree(list) {
    const map = new Map();  // es6 新增数据结构 HashMap
    const tree = [];
    list.forEach((item) => {
        map.set(item.id, {
            ...item,  // ...item 展开 item 所有属性
            children: []  // 给每个项item添加了一个 children空数组， 用于存储子项
        })
    });
    list.forEach(item => {
        const current = map.get(item.id); // 当前项
        const parent = map.get(item.parentId); // 当前项的父节点
        if (parent) {
            parent.children.push(current); // 组成了树
        } else {
            tree.push(current);
        }
    });
    return tree;
}

console.log(listToTree(flatList));
console.log(JSON.stringify(listToTree(flatList),null,2));
