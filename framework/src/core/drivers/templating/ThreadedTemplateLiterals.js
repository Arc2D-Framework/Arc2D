import '/src/core/lang/Thread.js';

alert("asd")
;(() => {
    var ThreadedTemplateLiterals = {
        name : "ThreadedTemplateLiterals",
        ext : "",
        parse : async function(tempStr, data, self){
            return new Promise(async (resolve, reject)=> {                
                var thread = new core.lang.Thread(async function(e){
                    var parse = new Function("return `"+e.data.template +"`;");
                        postMessage(parse.call(self));
                });
                thread.onmessage = function (event) {
                    resolve(event.data)
                };
                thread.postMessage({template:tempStr, dataobj:data});
            });
        },
        install : function(){}
    };
    

    window.customTemplateEngines.define("template/threadedliterals", ThreadedTemplateLiterals);
})();

