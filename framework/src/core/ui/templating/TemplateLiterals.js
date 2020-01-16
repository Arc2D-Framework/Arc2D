(() => {
    var TemplateLiterals = {
        name : "TemplateLiterals",
        ext : ".es6",
        eval : function(tempStr, data, self){
            var parse = (tempStr, templateVars) => {
                return new Function("return `"+tempStr +"`;").call(templateVars);
            }
            return parse(tempStr, data)
        },
        isAvailable : function(){
            return true
        },

        install : function(){}
    };

    window.customTemplateEngines.define("template/literals", TemplateLiterals);
})();

