import 'src/core/decorators/es7.js';

; (function(env) {
    env.NSRegistry = env.NSRegistry||{};
    
    env.namespace = function(ns){
        ns = ns[0];
        return function(...defs){
            defs.forEach(def => {
                def=def||{};
                var nsparts=ns.match(/\.([A-Z]+[a-zA-Z0-9\_]*)\b$/);
                var k = def.prototype||def;
                    k.classname = nsparts?nsparts[1]:def.name;
                    var fns = ns+"."+k.classname;
                    k.namespace = fns;
                env.NSRegistry[fns] = createNS(fns,createClass(def||{}));
                return env.NSRegistry[fns]
            })
        }
    }
    
    var createNS = function(aNamespace, def){
        var parts       = aNamespace.split(/\./g); 
        var classname   = parts.pop();
        var scope = parts.reduce((acc, next) => acc[next] ? 
            acc[next] : (acc[next]={}), env);
        scope[classname] = def;
        return scope[classname];
    };

    var createClass = function(func){
        try {
            var proto  = func.prototype;
                proto.ancestor = proto.__proto__.constructor;
                try{  func.define(proto) }catch(e){};
                return func;
        } catch(e){ return func }
        return func
    };
})(window);