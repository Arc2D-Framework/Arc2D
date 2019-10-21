import 'src/libs/Ecmascript6ClassTranspiler.js';
import 'src/core/http/ResourceLoader.js';

namespace `core.http` ( 
    class ClassLoader extends core.http.ResourceLoader {

        constructor (){
            super();
            this.es6Transpiler = new Ecmascript6ClassTranspiler();
            return this;
        }

        async load (_namespace,filepath, cb) {
            var self=this;
            var self = this;
            var src;
            var cbSuccess = function(src){
                self.build(src, output => {
                    var head   = document.getElementsByTagName("head").item(0);
                    var script = document.createElement("script");
                    script.setAttribute("type", "text/javascript");
                    script.setAttribute("charset", (Config.CHARSET || "utf-8"));
                    script.text = output;
                    head.appendChild(script);
                    if(NSRegistry[_namespace]) {
                        var data = {Class: NSRegistry[_namespace], source: output, path: filepath};
                        cb?cb(data):null;
                    } else {
                        console.error("core.http.ClassLoader#cbSuccess() - Problem while checking loaded namespace: ", [_namespace,filepath,output])
                    }
                });
            };

            var cfFailure = function(src, xhr){
                cb?cb(xhr):null;
            }

            var src;
            if(filepath) {
                src = await window.imports(filepath)
            }
            // else {
            //     var paths_to_try = es6Transpiler.pathsToTry(_namespace);
            //     src = await es6Transpiler.imports(paths_to_try[0],false)||
            //           await es6Transpiler.imports(paths_to_try[1],false);
            // }

            src?cbSuccess(src):cfFailure(src,"no xhr");   
        }



        async build(src, cb) {
            src = this.es6Transpiler.transpile(src);
            var reg = /^import\s+[\'\"]{1}([^\'\"]*)[\'\"]{1}\;?/m;

            while (reg.test(src)) {
                var ns_or_path = src.match(reg)[1];
                var s = (window.imported_classes[ns_or_path] ?
                        ";" : await window.imports(ns_or_path))||"";
                s = s ? this.es6Transpiler.transpile(s) : "";
                src = src.replace(reg, s);
            }
            src = `(()=>{ ${src} })()`;
            cb(src);
        }
    }
);