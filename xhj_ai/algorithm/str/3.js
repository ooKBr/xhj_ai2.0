// api 解法
function isPalindrome(str) {
    const reversedStr = str.split('').reverse().join('');
    return reversedStr === str;
}
// 对称性 双指针
function ifPalindrome(str) {
    const len = str.length; // 栈内存的变量
    // 简单数据类型 栈内存
    // 对象在堆内存
    // js 底层 包装类
    for(let i = 0; i < len / 2 ; i++) {
        if (str[i] !== str[len-i-1]) {
            return false;
        }
    }
    return true;
}
