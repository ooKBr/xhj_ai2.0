function unique(arr) {
    if(!Array.isArray(arr)){
        console.log('type error')
        return [];
    }
    // filter 方法 过滤数组中的元素
    // 结果是过滤后的数组
    return arr.filter(function(item,index){
        // 当 item 第一次出现时，当前遍历的元素下标才会和indexOf返回的下标相等
        // 所以当 item 第一次出现时，indexOf返回 true，保留 item，否则返回 false，过滤掉 item
        return arr.indexOf(item) === index;
        // boolean方法  true 保留，false 过滤掉
        return arr.indexOf(item) === index;
    })
    // return Array.prototype.filter.call(arr, function(item,index){
    //     console.log(item,index);
    //     // boolean方法  true 保留，false 过滤掉
    //     return arr.indexOf(item) === index;
    // })
}
console.log(unique([1,2,3,2,5]));