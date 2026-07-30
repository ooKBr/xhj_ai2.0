function greeting() {
    console.log('hello world');
}

greeting.a = '1';
console.log(greeting.a);
greeting(); // 作为普通函数调用