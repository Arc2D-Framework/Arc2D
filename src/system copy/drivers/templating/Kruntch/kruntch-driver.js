import "/src/system/drivers/templating/Kruntch/kruntch-api.js";

(() => {
    var KruntchDriver = {
        name : "Kruntch",
        ext : ".kruntch",
        parse : function(tempStr, data, self){
            var res = Kruntch.Apply(tempStr, data);
            return res;
        },
        install : function(){
            return (typeof Kruntch !== 'undefined' && Kruntch !== null)
        }
    };

    window.customTemplateEngines.define("template/x-kruntch-template", KruntchDriver);
})();

