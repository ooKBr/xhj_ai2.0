// promise es6 用于异步任务控制的最佳机制
const p = new Promise((resolve,reject)=>{  // 许诺言
    console.log('许诺言');
    // 放置耗时性任务的
    setTimeout(() => {
        // resolve和reject 是 Promise 给的一个函数
      // resolve(666);  // 表示耗时性的异步任务，完成了
       reject("网络错误");  // 表示耗时性的异步任务，没有履约
    },2000)
}); 
console.log(p.__proto__);
p
  .then((data) => {  // resolve 了走then
    console.log(data);
    console.log('end');
  })
  .catch((err) => {  // reject 了走catch  
    console.log(err);
    console.log('失败了');
  })
  .finally(() => {  // 无论成功失败，都会执行
    console.log('finally');
  })