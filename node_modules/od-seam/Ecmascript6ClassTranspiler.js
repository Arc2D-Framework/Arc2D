const fs = require('fs');
var fs_path = require('path');

var window = {};
window.imported_classes={};


var Prefabber = {
    read : function(jspath){
        var basepath = jspath.split(".js")[0];
        var html = basepath + ".html";
        var css = basepath + ".css";
        var js = basepath + ".js";
        var prefab = basepath + ".prefab.js";
        var ns = basepath.replace(/\/?src\//,"").replace(/\/index/,"").replace(/\//g,".");


        // if(fs.existsSync(prefab)){
        if(BUILDCONFIG.Prefabs.Components.includes(ns)){
            html = fs.readFileSync(html, "utf8") + "\n";
            css = fs.readFileSync(css, "utf8") + "\n";
            js = fs.readFileSync(js, "utf8") + "\n";
            var shell = `
                \n${js}\n
                ${ns}.prototype.template = function(){
                    return \`${html}\`
                };\n
                ${ns}.prototype.cssStyle = function(){
                    return \`${css}\`
                };\n
                ${ns}.prototype.onLoadInstanceStylesheet = function(){ return false }\n`;
            fs.writeFileSync(prefab, shell);
            return shell;
        } else {
            return fs.readFileSync(jspath, "utf8");
        }
    }
}

function Ecmascript6ClassTranspiler() {}
Ecmascript6ClassTranspiler.prototype.imports = async function (x, opts, isError) {
    // opts = opts || { cache: Config.IMPORTS_CACHE_POLICY || "no-store" };
    return new Promise(async (resolve, reject) => {
        var path = x;
        path = path.replace(/^\/+/, Config.ROOTPATH);
        var error = "Unable to load: " + path;

        if (window.imported_classes[x]) {
            console.warn("redundant imports to : " + x + " detected");
            resolve(window.imported_classes[x]);
            return;
        }

        try {
            var fileContent;
            if(BUILDCONFIG.Prefabs && BUILDCONFIG.Prefabs.Enabled){
                fileContent=Prefabber.read(path)
            }
            else {
                fileContent = fs.readFileSync(path, "utf8");
            }

            if(fileContent){
                window.imported_classes[x] = fileContent;
                resolve(fileContent);
            }
        } catch (e) {
            console.log(`fetching ${path}`,e.message)
        }
    });
};



Ecmascript6ClassTranspiler.prototype.transpile = function (src) {
    if(!src || src&&src.length<=0){return ""}
    var doTranspile = Config.ENABLE_TRANSPILER;
    if (doTranspile) {
        src = this.transpileToLevel(src);
        return src;
    } else {
        return src;
    }
};


/*Ecmascript6ClassTranspiler.prototype.transpileToLevel = function (src) {
    var nsReg = /(?:@{1}[^\s]*\({1}[^\;]*\){1};{1})?\n?namespace\([\'\"]{1}([^\'\"]*)/;
    var nsMatch = src.match(nsReg);
    nsMatch = nsMatch ? nsMatch[1] : "";
    src = this.transipleDecoratorFields(nsMatch, src);
    src = this.transipleClassFields(nsMatch, src);
    src = this.transipleImportsDestructuring(nsMatch, src);
    return src;
};*/

Ecmascript6ClassTranspiler.prototype.transpileToLevel = function (src) {
    var nsReg = /namespace\s?`([^\s`]*)/;
    var clsReg = /class\s+([^\s]*)[\s\n\t]?[\{|extends]/;

    var nsMatch = src.match(nsReg);
    var classMatch = src.match(clsReg);
    if(!nsMatch && !classMatch){
        return this.transipleImportsDestructuring(src);
    }
    else {
        nsMatch = nsMatch ? nsMatch[1] : "";
        classMatch = classMatch?classMatch[1]:"";
        nsMatch = nsMatch + "." + classMatch;
        src = this.transipleDecoratorFields(nsMatch, src);
        src = this.transipleClassFields(nsMatch, src);
        src = this.transipleImportsDestructuring(src);
        return src;
    }
}


/*Ecmascript6ClassTranspiler.prototype.transipleDecoratorFields = function (ns,src) {
    var regex = /@([^\W]*)\({1}([^\;]*)\){1};{1}/gm; //Feb 7 2019 - to support @matchmedia queries having ('s)
    var props = [];
    if (ns) {
        src = src.replace(regex, (full, method, args) => {
            props.push(`${method}(${ns}, ${args});`);
            return "";
        });
        var fullsrc = src + "\n" + props.join("\n");
    } else {
        src = src.replace(regex, (full, method, args) => {
            return "";
        });
        fullsrc = src;
    }
    return fullsrc;
};
*/
Ecmascript6ClassTranspiler.prototype.transipleDecoratorFields = function (ns,src) {
    var regex = /@([^\W]*)\({1}([^\;]*)\){1};{1}/gm; //Feb 7 2019 - to support @matchmedia queries having ('s)
    var props = [];
    if (ns) {
        src = src.replace(regex, (full, method, args) => {
            props.push(`${method}(${ns}, ${args});`);
            return "";
        });
        var fullsrc = src + "\n" + props.join("\n");
    } else {
        src = src.replace(regex, (full, method, args) => {
            return "";
        });
        fullsrc = src;
    }
    return fullsrc;
}






/*Ecmascript6ClassTranspiler.prototype.transipleImportsDestructuring = function (ns,src) {
    var regex = /import\s\{([^\}]*)\}\sfrom\s([^;]*)/gm;
    src = src.replace(regex, (full, destructured_var, src_path) => {
        destructured_var = destructured_var.replace(/\s+as\s+/gm, ":");
        return `const {${destructured_var}} = (()=> {\nimport ${src_path};\n})();`;
    });
    src = src.replace("export ", "return ");
    return src;
};*/
Ecmascript6ClassTranspiler.prototype.transipleImportsDestructuring = function (src) {
    var regex = /import\s\{([^\}]*)\}\sfrom\s([^;]*)/gm;
    src = src.replace(regex, (full, destructured_var, src_path) => {
        destructured_var = destructured_var.replace(/\s+as\s+/gm, ":");
        return `var {${destructured_var}} = (()=> {\nimport ${src_path};\n})();`;
    });
    src = src.replace("export", "return");
    return src;
}

/*Ecmascript6ClassTranspiler.prototype.transipleClassFields = function (ns, src) {
    var regex = new RegExp(
        /(\@static|@public|\@private)\s+([^\s]*)\s+\=([^\;]*)\;/gm
    );
    var props = [];

    if (ns) {
        src = src.replace(regex, (full, type, name, val) => {
            type = type.replace("@", "");
            props.push(`field(${ns}, "${type}", "${name}", ${val});`);
            return "";
        });
        var fullsrc = src + "\n" + props.join("\n");
    } else {
        src = src.replace(regex, (full, type, name, val) => {
            return "";
        });
        fullsrc = src;
    }
    return fullsrc;
};*/
Ecmascript6ClassTranspiler.prototype.transipleClassFields = function (ns, src) {
    var regex = new RegExp(
        /(\@static|@public|\@private)\s+([^\s]*)\s+\=([^\;]*)\;/gm
    );
    var props = [];

    if (ns) {
        src = src.replace(regex, (full, type, name, val) => {
            type = type.replace("@", "");
            props.push(`field(${ns}, "${type}", "${name}", ${val});`);
            return "";
        });
        var fullsrc = src + "\n" + props.join("\n");
    } else {
        src = src.replace(regex, (full, type, name, val) => {
            return "";
        });
        fullsrc = src;
    }
    return fullsrc;
};





// Ecmascript6ClassTranspiler.prototype.transpile = function(src, doc){
//     var transpileSettings = /@transpile\([\'\"]*([a-zA-Z0-9]*)[\'\"]*\)/;
//     var transpileLevel = src.match(transpileSettings);
//     if(transpileLevel && transpileLevel[1]) {
//       src = this.transpileToLevel(transpileLevel[1],src);
//       return src;
//     }
//     else {return src;}
// };

/*Ecmascript6ClassTranspiler.prototype.Build = async function (_code, cb) {
    _code = this.transpile(_code)||"";
    var self = this;
    var finished = false;
    var reg = /^import\s*['"]{1}([^'"]*)['"]{1}\;/im;
    while (reg.test(_code)) {
        var s = "";
        var ns_or_path = _code.match(reg)[1];

        if (/\.js|\.mjs$/.test(ns_or_path)) {
            if (window.imported_classes[ns_or_path]) {
                s = /\.mjs$/.test(ns_or_path)
                    ? window.imported_classes[ns_or_path]
                    : ";";
            } else {
                s = await this.imports(ns_or_path);
            }
        } else {
            var paths_to_try = this.pathsToTry(ns_or_path);
            if (
                window.imported_classes[paths_to_try[0]] ||
                window.imported_classes[paths_to_try[1]]
            ) {
                s = ";";
            } else {
                s =
                    (await this.imports(paths_to_try[0], false)) ||
                    (await this.imports(paths_to_try[1], false));
            }
            if (!s) {
                console.error(
                    "Attempted to import a namespace or file by trying 2 locations and failed. Verify your imports. Locations tried: ",
                    paths_to_try
                );
            }
        }
        s = s &&s.length>0 ? this.transpile(s) : "\n";
        _code = _code.replace(reg, s);
    }
    cb(_code);
};*/
Ecmascript6ClassTranspiler.prototype.Build = async function (src, cb) {
    src = this.transpile(src);
    var reg = /^import\!?\s+[\'\"]{1}([^\'\"]*)[\'\"]{1}\;?/m;

    if(reg.test(src)){
        while (reg.test(src)) {
            var match = src.match(reg);
            var ns = match[1];
            src = src.replace(reg, this.transpile(
                (window.imported_classes[ns] ? ";" : await this.doImports(match))||""
            ))
        } 
    }
    
    src=src.replace("await import","import")
    cb(`(async ()=>{ ${src} })()`);
}

Ecmascript6ClassTranspiler.prototype.doImports = async function(match){
    var paths = this.pathsToTry(match);
    for(let path of paths){
        return await this.imports(path);
    }
}

Ecmascript6ClassTranspiler.prototype.pathsToTry = function(match){
    var ns = match[1];
    if(/\.m?js$/.test(ns)){
        return [ns]
    }
    ns=ns.replace(/\./gm,"/");
    var root = "src/";//Config.SRC_PATH;
    var paths   = [];
    match[0].includes("!") ? 
    paths.push(root+ns + ".js"):null;
    paths.push(root+ns + "/index.js")
    paths.push(root+ns + "/index.min.js");
    return paths;
}

/*Ecmascript6ClassTranspiler.prototype.pathsToTry = function (_namespace) {
    var paths = [];
    if (/\.js$/.test(_namespace)) {
        paths.push(_namespace);
    } else {
        var classname_path = "src/" + _namespace.replace(/\./g, "/") + ".js";
        var filename_path =
            "src/" + _namespace.replace(/\./g, "/") + "/index.js";
        paths.push(filename_path);
        paths.push(classname_path);
    }
    return paths;
};*/



module.exports = Ecmascript6ClassTranspiler;