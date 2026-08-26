// node 的内置模块 join 和resolve 区别
import path from 'path';

// join 路径拼接 简陋 不会验证路径正确性
console.log(path.join('a', 'b', 'c')); // a/b/c
console.log(path.resolve('a','b','c')); // C:\Users\xhj\Desktop\db_ai\xhj_ai\backend\path_fs\a\b\c
console.log('\n');
// 根目录， src/ 源代码目录， assets/ 静态资源目录 ，
console.log(path.join(process.cwd(),'/hello','world')); // C:\Users\xhj\Desktop\db_ai\xhj_ai\backend\path_fs\hello\world
console.log(path.resolve(process.cwd(),'/hello','world')); // C:\hello\world
console.log('\n');
console.log(path.join('/hello','world','world','./a','b')); // \hello\world\world\a\b
console.log(path.resolve('/hello','world','world','./a','b')); // C:\hello\world\world\a\b

console.log(path.resolve('/hello','world','world','../a','b')); // C:\hello\world\a\b