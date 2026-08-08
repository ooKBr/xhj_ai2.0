const queue = []; // 空队列
queue.push("习");
queue.push("吴");
queue.push("张");
queue.push("刘");
while(queue.length) {
    const top = queue[0];
    console.log(top,`取餐`);
    queue.shift();
} 
console.log(queue);