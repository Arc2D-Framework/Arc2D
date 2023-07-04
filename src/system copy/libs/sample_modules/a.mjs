import {sample as samplex} from './test2.mjs';
import {WristWatch} from '/src/system/drivers/watchers/wrist_watch.js';


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
export {WristWatch,myExport,hello,f,age,samplex};