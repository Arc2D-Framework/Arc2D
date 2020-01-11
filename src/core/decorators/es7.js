function transpile(target, level){}

//helper
function relativeToAbsoluteFilePath(path, ns, appendRoot){
    ns = ns||this.namespace;
    ns = ns.replace(/\./gim,"/");
    if(path.indexOf("/./") >= 0){
        path = path.replace("./", ns+"/");
    } 
    path = /http:/.test(path)? path : path.replace("//","/");
    return path;
}

function stylesheets (target, paths){
    paths && paths.forEach(p => {
        var filepath = relativeToAbsoluteFilePath(p,target.prototype.namespace,false);
        target.prototype['@stylesheets'] = target.prototype['@stylesheets']||[];
        target.prototype['@stylesheets'].push(filepath)
    })
}
window.stylesheets = stylesheets;

function traits(target, __traits){
	var inheritTraits = function(klass, properties){
        properties = properties.reverse();
        properties.forEach(trait => {
            if (typeof trait == "object") {
                defineProps(klass, trait)
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
    }
    
	inheritTraits(target.prototype, __traits);
};
window.traits = traits;

function cascade(target,shouldCascade){
	target.prototype['@cascade'] = shouldCascade;
}
window.cascade = cascade;

function prop(target,key,val){
	target.prototype[key] = val;
}
window.prop = prop;



function tag(target, name){
    target.prototype["ns-tagname"]=name;
    try{window.customElements.define(name, target);}catch(e){}
    return;
}
window.tag = tag;


function field(target, type, key, val){
    target = (type=="static") ? 
        target:
        target.prototype;
    target[key] = val;
}
window.field = field;
