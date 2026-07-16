// O(n) 只遍历一次
// 用空间换时间
function unique(arr) {
    if(!Array.isArray(arr)){
        console.log('type error')
        return [];
    }
    let res = [];
    // 早期js 就是用来做点时间交互的，没有HashMap
    // HashMap 数据结构
    let obj = {};  // 对象字面量
    for(let i = 0; i < arr.length; i++) {
        // get 读操作 动态看待
        // 把 arr[i] 当前项 作为key 变量
        // obj[varible] 变量作为key
        // .name 常量
        if(!obj[arr[i]]) {
            res.push(arr[i]);
            obj[arr[i]] = 1;
            } else {
                obj[arr[i]]++;
            }
        }
        return res;
    }
