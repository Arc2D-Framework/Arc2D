import 'src/core/decorators/es7.js';

; (function(env) {
    env.NSRegistry = env.NSRegistry||{};
    
    env.namespace = function(ns, def={}){
        var k = def.prototype||def;
            k.namespace = ns;
            k.classname = ns.match(/\.?([a-zA-Z0-9\_]*)$/)[1];
        env.NSRegistry[ns] = createNS(ns,createClass(def||{}));
        return env.NSRegistry[ns]
    };
    
    var createNS = function(aNamespace, def){
        var parts       = aNamespace.split(/\./g); 
        var classname   = parts.pop();
        var scope = parts.reduce((acc, next) => acc[next]?acc[next]:(acc[next]={}), env);
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