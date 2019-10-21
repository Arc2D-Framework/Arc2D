(() => {
    var TemplateLiterals = {
        name : "TemplateLiterals",
        ext : ".es6",
        eval : function(tempStr, data, self){
            var parse = (tempStr, templateVars) => {
                return new Function("return `"+tempStr +"`;").call(templateVars);
            }
            return parse(tempStr, data)
            // return eval('`'+tempStr+'`');
        },
        isAvailable : function(){
            return true
        },

        install : function(){
            // console.log("TemplateLiterals template engine installed successfully.")
        }
    };

    window.customTemplateEngines.define("template/literals", TemplateLiterals);
})();

