import "/src/system/drivers/templating/Nunjucks/nunjucks.js";

(() => {
    var NunjucksDriver = {
        name : "Nunjucks",
        ext : ".nunj",
        parse : function(tempStr, data, self){
            var res = nunjucks.renderString(tempStr, data);
            return res;
        },
        install : function(){
            nunjucks.configure({ autoescape: true });
        }
    };

    window.customTemplateEngines.define("template/nunjucks", NunjucksDriver);
})();

