function transpile(target, level){}

function stylesheets (target, paths){
	target.prototype['@stylesheets'] = paths
}

function css (target, paths){
	target.prototype['@stylesheets'] = paths
}

function html (target, path){
	target.prototype['@template-uri'] = path
}

function traits(target, __traits){
    // Object.assign(target.prototype,args);
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
}

function cascade(target,shouldCascade){
	target.prototype['@cascade'] = shouldCascade;
}

function prop(target,key,val){
	target.prototype[key] = val;
}

function loggable(target, params){
	
}

function tag(target, name){
    window.customElements.define(name, target);
    return;
    /*if(name !=='application-view'){
        customElements.whenDefined("application-view").then(_=>{
            window.customElements.define(name, target)
        })
    } else {
        window.customElements.define(name, target)
    }*/
}

function field(target, type, key, val){
    target = (type=="static") ? 
        target:
        target.prototype;
    target[key] = val;
}


function matchmedia(target, queryStr, templatePath){
    console.log("matchmedia target", target)
    var mql = window.matchMedia(queryStr);
        mql.addListener(()=>{
            if(mql.matches){
                target.prototype.onMediaQueryChanged(mql, templatePath);
                // target.prototype.onGetTemplatePath = () => templatePath;
            }
        });
        if(mql.matches){
            target.prototype.onMediaQueryChanged(mql,templatePath);
        }
    
};