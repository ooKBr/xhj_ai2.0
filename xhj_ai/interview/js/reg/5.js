let template = `我是{{name}},年龄{{age}},性别{{sex}}`;
let person = {
    name:'wxf',
    age:17,
    sex:'女'
}
function render(template,data) {
    const reg = /\{\{(\w+)\}\}/
    if(reg.test(template)) {
        const name = reg.exec(template)[1];
        template = template.replace(reg,data[name])
    }
    return template;
}
console.log(render(template,person));