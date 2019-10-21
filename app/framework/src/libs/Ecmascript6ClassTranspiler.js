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
    var nsReg = /namespace\s?`([^\s`]*)/;
    var clsReg = /class\s+([^\s]*)\s+[\{|extends]/;

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

Ecmascript6ClassTranspiler.prototype.transipleImportsDestructuring = function (src) {
    var regex = /import\s\{([^\}]*)\}\sfrom\s([^;]*)/gm;
    src = src.replace(regex, (full, destructured_var, src_path) => {
        destructured_var = destructured_var.replace(/\s+as\s+/gm, ":");
        return `var {${destructured_var}} = (()=> {\nimport ${src_path};\n})();`;
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
// Ecmascript6ClassTranspiler.prototype.Build = async function (_code, cb) {
//     _code = this.transpile(_code);
//     var self = this;
//     var finished = false;
//     var reg = /^(?:\/\/\=\s*require|import\W|\#+include\W)\s*[\'\"]{1}([^\'\"]*)[\'\"]{1}\;/im;

//     while (reg.test(_code)) {
//         var s = "";
//         var ns_or_path = _code.match(reg)[1];

//         if (/\.js|\.mjs$/.test(ns_or_path)) {
//             if (/\.mjs$/.test(ns_or_path)) {
//                 _code = `(()=>{ ${_code} })()`;
//             }
//             if (window.imported_classes[ns_or_path]) {
//                 s = /\.mjs$/.test(ns_or_path)
//                     ? window.imported_classes[ns_or_path]
//                     : ";";
//             } else {
//                 s = await this.imports(ns_or_path);
//             }
//         } 
//         s = s ? this.transpile(s) : "";
//         _code = _code.replace(reg, s);
//     }
//     cb(_code);
// }

