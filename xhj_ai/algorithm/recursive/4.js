const flatten = (arr) => {
    let result = [];
    arr.forEach((item,i,arr) => {
        if (Array.isArray(item)) {
            result = result.concat(flatten(item));  // concat 合并数组 例如 [1,2].concat([3,4]) -> [1,2,3,4]
        } else {
            result.push(item);
        }       
    })
    return result;
}

const arr = [1,2,[3,4,[5,6]]];
console.log(flatten(arr));