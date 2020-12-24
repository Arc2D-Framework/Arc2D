;var wait = ms => new Promise((r, j)=>setTimeout(r, ms));
window.wait=wait;



function reflect(target, source) {
    for (let key of Reflect.ownKeys(source)) {
        if(!/constructor|namespace|ancestor|classname|prototype|name/.test(key)){
            let desc = Object.getOwnPropertyDescriptor(source, key);
            Object.defineProperty(target, key, desc);
        }
    }
};

Function.prototype.with = function(...mixin) {
    class c extends this{};
    for(let m of mixin){
        if(typeof m =="object") {
            reflect(c.prototype, m);
        } else{
            reflect(c.prototype, m.prototype);
        }
    }
    return c
};


/*

//---------------------native class-based traits-----------------
class TraitX {
    foo(){
        alert("foo X")
    }
}

class TraitZ {
    zee(){
        alert("zee")
    }
}

//---------------------classes that mix in traits-----------------

class Y {
    constructor(){
        alert("cctor of Y")
    }
    bar(){
        alert("bar")
    }
}

class T extends Y.with(TraitX,TraitZ) {
    constructor(){
        super();
        this.foo()
    }

    foo(){
        alert("foo T");
        super.foo();//from TraitX
        this.bar()//from Y
        this.zee()////from TraitZ
    }    
}
*/