import 'src/libs/Ecmascript6ClassTranspiler.js';
import 'src/core/http/ResourceLoader.js';

namespace `core.http` ( 
    class ClassLoader extends core.http.ResourceLoader {

        constructor (){
            super();
            this.es6Transpiler = new Ecmascript6ClassTranspiler();
            window.run=this.run.bind(this);//TODO:check dynamic transpilation
            return this;
        }

        run(src,cb){
            this.build(src, output => {
                var head   = document.getElementsByTagName("head").item(0);
                var script = document.createElement("script");
                script.setAttribute("type", "text/javascript");
                script.setAttribute("charset", (Config.CHARSET || "utf-8"));
                script.text = output;
                head.appendChild(script);
                cb(script);
            });
        }

        async load (_namespace,filepath, cb) {
            var self=this;
            var self = this;
            var src;
            var cfFailure = function(src, xhr){
                cb?cb(xhr):null;
            }

            var src;
            if(filepath) {
                src = await window.imports(filepath)
            }
            src?this.run(src,cb):cfFailure(src,"no xhr");   
        }



        async build(src, cb) {
            src = this.es6Transpiler.transpile(src);
            var reg = /^import\!?\s+[\'\"]{1}([^\'\"]*)[\'\"]{1}\;?/m;

            while (reg.test(src)) {
                var match = src.match(reg);
                var ns_or_path = match[1];
                var s = (window.imported_classes[ns_or_path] ?
                        ";" : await this.imports(match))||""; //window.imports(ns_or_path))||"";
                s = s ? this.es6Transpiler.transpile(s) : "";
                src = src.replace(reg, s);
            }
            src = `(()=>{ ${src} })()`;
            cb(src);
        }

        async imports(match){
            var paths_to_try = this.pathsToTry(match);
            for(let path of paths_to_try){
                var code = await window.imports(path);
                if(code){
                    return code;
                } 
            }
        }

        pathsToTry(match){
            var ns = match[1];
            if(/\.m?js$/.test(ns)){
                return [ns]
            }
            var srcpath = Config.SRC_PATH;
            var paths   = [];
            match[0].includes("!") ? 
                paths.push(srcpath+ns.replace(/\./gm,"/") + ".js"):null;
            paths.push(srcpath+ns.replace(/\./gm,"/") + "/index.js")
            paths.push(srcpath+ns.replace(/\./gm,"/") + "/index.min.js");
            return paths;
        }
    }
);