import 'src/core/http/ResourceLoader.js';

namespace("core.http.ModuleLoader", class extends core.http.ResourceLoader{

    constructor (){
        super()
        return this;
    }
    
    load(ns,filepath, cb){
        var head  = document.getElementsByTagName("head").item(0);
        var script = document.createElement("script");
        script.setAttribute("type", "module");
        script.setAttribute("charset", (Config.CHARSET || "utf-8"));
        script.src = filepath;
        head.appendChild(script);
        var data = {};
        cb?cb(script):null;
        // this.dispatchEvent("load", data, self)
    }
});