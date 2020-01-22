import "/framework/src/core/drivers/templating/Nunjucks/nunjucks.js";

(() => {
    var NunjucksDriver = {
        name : "Nunjucks",
        ext : ".nunj",
        eval : function(tempStr, data, self){
            debugger;
            var res = nunjucks.renderString(tempStr, data);
            return res;
        },
        isAvailable : function(){
            return true
        },

        install : function(){
            nunjucks.configure({ autoescape: true });
        }
    };

    window.customTemplateEngines.define("template/nunjucks", NunjucksDriver);
})();

