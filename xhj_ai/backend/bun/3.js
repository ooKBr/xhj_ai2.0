// 如何封装一个sleep函数？ 2000ms 后执行

function sleep(t) {
    //es6 提供的 解决异步问题的api 许下诺言
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, t);
    })
}

async function main() {
    console.log('--start--');
    // await 后面接受一个promise对象，等待promise对象执行完成，才会继续执行
    await sleep(2000); // 异步任务同步化
    console.log('--end--');
}
main();