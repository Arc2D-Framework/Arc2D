function transpile(target, level){}

function stylesheets (target, paths){
	target.prototype['@stylesheets'] = paths
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
