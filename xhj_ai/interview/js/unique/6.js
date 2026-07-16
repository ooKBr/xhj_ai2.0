// Set 是什么？ 是 ES6 新增的数据结构
// HashMap O(1) 时间复杂度 Key 查值
// Set 是一个不重复的数据容器,故也可用于去重
function unique(arr) {
    if(!Array.isArray(arr)){
        console.log('type error')
        return [];
    }
    return [...new Set(arr)];
}