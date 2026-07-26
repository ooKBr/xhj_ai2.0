showName();
function showName() {
    console.log(1)
}
// 函数是一等对象，会变量提升，并且优先于其他变量
var showName = function() {
    console.log(2)
}

