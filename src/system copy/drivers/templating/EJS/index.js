import '/src/system/drivers/templating/EJS/driver.js';

(() => {
    var EJSDriver = {
        name : "EJS",
        ext : ".ejs",
        parse : function(tempStr, data, self){
            return ejs.render(tempStr, data);
        },
        install : function(){
            
        }
    };

    window.customTemplateEngines.define("template/ejs", EJSDriver);
})();

