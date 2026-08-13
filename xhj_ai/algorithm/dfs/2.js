// 递归的升级版
function dfsPreOrderInter(root) {
    if(!root) return [];
    const stack = [root];
    const res = [];
    while(stack.length) {
    const node = stack.pop();
    res.push(node.val);
    // 先右后左 因为栈是后进先出 LIFO
    if (node.right) stack.push(node.right);
    if (node.left) stack.push(node.left);
    }
    return res;
}