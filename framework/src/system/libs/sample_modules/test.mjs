import {test} from '/src/system/libs/sample_modules/test2.mjs';


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
return {myExport,hello,f,age};