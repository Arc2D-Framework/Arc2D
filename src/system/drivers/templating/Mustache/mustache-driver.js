import {mustache} from "/src/system/drivers/templating/Mustache/mustache.js";

(() => {
    var MustacheDriver = {
        name : "MustacheDriver",
        ext : ".mus",
        eval : function(tempStr, data, self){
            debugger;
            var res = mustache.render(tempStr, data);
            return res;
        },
        isAvailable : function(){
            return true
        },

        install : function(){}
    };

    window.customTemplateEngines.define("template/mustache", MustacheDriver);
})();

