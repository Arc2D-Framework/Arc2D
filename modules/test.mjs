import {test} from '/modules/test2.mjs';


function myExport() {
    alert("myExport executed :)");
    test();
};

function hello() {
    alert("hello world from hello()")
};

const f = () => {
    alert("f called")
}

var age = 21;
export {myExport,hello,f,age};