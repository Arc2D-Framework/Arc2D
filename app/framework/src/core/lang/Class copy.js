import 'src/core/decorators/es7.js';

; (function(env) {
    env.NSRegistry = env.NSRegistry||{};
    
    env.namespace = function(ns, def){
        def=def||{};
        var k = (def && typeof def == "object") ?
            def : def.prototype;
            k.namespace = ns;
            k.classname = ns.match(/\.?([a-zA-Z0-9\_]*)$/)[1];
        var n = createNS(ns);
        env.NSRegistry[ns] = n[0][n[1]] = def ?
            createClass(def,ns) : {};
        return env.NSRegistry[ns];
    };
    
    var createNS = function(aNamespace){
        var scope       = env;
        var parts       = aNamespace.split(/\./g); 
        var classname   = parts.pop();
            
        for (var i = 0; i <= parts.length - 1; i++) {
            scope = scope[parts[i]]||(scope[parts[i]] = {});
        };
        return [scope,classname];
    };
    
    var createClass = function(properties, ns){
        if(typeof properties == "function"){
            properties.prototype.ancestor = properties.prototype.__proto__.constructor;
            return properties
        }
    };
})(window);