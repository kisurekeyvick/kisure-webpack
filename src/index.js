let func = require('./a.js');

console.log(func);
require('./index.css');
require('./index.less');
// require('./index.scss');

@decorateFuncA
class A {
    constructor(name) {
        this.name = name;
    }
}

let a = new A('kisure');
console.log(a.name);

function decorateFuncA(classItem) {
    console.log('classItem', classItem);
}