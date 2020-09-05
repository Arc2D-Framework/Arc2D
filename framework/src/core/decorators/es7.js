function relativeToAbsoluteFilePath(path, ns, appendRoot){
    ns = ns||this.namespace;
    ns = ns.replace(/\./gim,"/");
    if(path.indexOf("/./") >= 0){
        path = path.replace("./", ns+"/");
    } 
    path = /http:/.test(path)? path : path.replace("//","/");
    return path;
}

window.stylesheets = function stylesheets (target, paths){
    target.prototype['@stylesheets'] = [];
    paths && paths.forEach(p => {
        var filepath = relativeToAbsoluteFilePath(p,target.prototype.namespace,false);
        target.prototype['@stylesheets'].unshift(filepath)
    });
}

function traits(target, __traits){
    var inheritTraits = function(klass, properties){
        properties = properties.reverse();
        properties.forEach(trait => {
            if (typeof trait == "object") {
                defineProps(klass, trait)
            }
            else if (typeof trait == "function") {
                reflect(target.prototype, trait.prototype);
            }
        });
    };
    
    var defineProps = function(proto, trait){
        for (var prop in trait) {
            if(!proto[prop]){
                Object.defineProperty(proto,prop,{
                    value : trait[prop],
                    writable:true
                })
            }
        }
    };

    ;function reflect(target, source) {
        for (let key of Reflect.ownKeys(source)) {
            if(!/constructor|namespace|ancestor|classname|prototype|name/.test(key)){
                let desc = Object.getOwnPropertyDescriptor(source, key);
                Object.defineProperty(target, key, desc);
            }
        }
    };
    inheritTraits(target.prototype, __traits);
};
window.traits = traits;

window.cascade = function cascade(target,shouldCascade){
	target.prototype['@cascade'] = shouldCascade;
}

window.prop = function prop(target,key,val){
	target.prototype[key] = val;
}

window.tag = function tag(target, name){
    target.prototype["ns-tagname"]=name;
    try{window.customElements.define(name, target);}catch(e){}
    return;
}

window.field = function field(target, type, key, val){
    target = (type=="static") ? target : target.prototype;
    target[key] = val;
};