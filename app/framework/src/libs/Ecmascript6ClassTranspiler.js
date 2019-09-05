function Ecmascript6ClassTranspiler() { }
Ecmascript6ClassTranspiler.prototype.imports = window.imports;
Ecmascript6ClassTranspiler.prototype.transpile = function (src, doc) {
    var doTranspile = Config.ENABLE_TRANSPILER;
    if (doTranspile) {
        src = this.transpileToLevel(src);
        return src;
    } else {
        return src;
    }
}
Ecmascript6ClassTranspiler.prototype.transpileToLevel = function (src) {
    var nsReg = /(?:@{1}[^\s]*\({1}[^\;]*\){1};{1})?\n?namespace\([\'\"]{1}([^\'\"]*)/;
    var nsMatch = src.match(nsReg);
    nsMatch = nsMatch ? nsMatch[1] : "";
    src = this.transipleDecoratorFields(nsMatch, src);
    src = this.transipleClassFields(nsMatch, src);
    src = this.transipleImportsDestructuring(nsMatch, src);
    return src;
}
Ecmascript6ClassTranspiler.prototype.transipleDecoratorFields = function (ns,src) {
    //   var regex = /@([^\s]*)\({1}([^\;]*)\){1};{1}/gm; //<--works but not for @matchmedia
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
Ecmascript6ClassTranspiler.prototype.transipleImportsDestructuring = function (ns,src) {
    var regex = /import\s\{([^\}]*)\}\sfrom\s([^;]*)/gm;
    src = src.replace(regex, (full, destructured_var, src_path) => {
        destructured_var = destructured_var.replace(/\s+as\s+/gm, ":");
        return `const {${destructured_var}} = (()=> {\nimport ${src_path};\n})();`;
    });
    src = src.replace("export", "return");
    return src;
}
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
}
Ecmascript6ClassTranspiler.prototype.Build = async function (_code, cb) {
    _code = this.transpile(_code);
    var self = this;
    var finished = false;
    var reg = /^(?:\/\/\=\s*require|import\W|\#+include\W)\s*[\'\"]{1}([^\'\"]*)[\'\"]{1}\;/im;

    while (reg.test(_code)) {
        var s = "";
        var ns_or_path = _code.match(reg)[1];

        if (/\.js|\.mjs$/.test(ns_or_path)) {
            if (/\.mjs$/.test(ns_or_path)) {
                _code = `(()=>{ ${_code} })()`;
            }
            if (window.imported_classes[ns_or_path]) {
                s = /\.mjs$/.test(ns_or_path)
                    ? window.imported_classes[ns_or_path]
                    : ";";
            } else {
                s = await this.imports(ns_or_path);
            }
        } 

        /*else {
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
        }*/
        s = s ? this.transpile(s) : "";
        _code = _code.replace(reg, s);
    }
    cb(_code);
}
/*Ecmascript6ClassTranspiler.prototype.pathsToTry = function (_namespace) {
    var paths = [];
    if (/\.js$/.test(_namespace)) {
        paths.push(_namespace);
    } else {
        var src_path = "/"+ Config.SRC_PATH;
        var classname_path = src_path + _namespace.replace(/\./g, "/") + ".js";
        var filename_path =  src_path + _namespace.replace(/\./g, "/") + "/index.js";
        paths.push(filename_path);
        paths.push(classname_path);
    }
    return paths;
}*/
