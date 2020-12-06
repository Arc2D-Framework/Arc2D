import 'src/system/http/ResourceLoader.js';

namespace `system.http` (
    class ModuleLoader extends system.http.ResourceLoader{
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
            cb?cb(script):null;
        }
    }
);