function unique(arr) {
    if(!Array.isArray(arr)){
        console.log('type error')
        return [];
    }
    // 排序 O(nlogn)
    arr = arr.sort();
    let res =[arr[0]];
    for(let i = 1; i<arr.length; i++) {
        //相邻元素不相同，则保留
        if(arr[i] !== arr[i-1]) {
            res.push(arr[i]);
        }
    }
}