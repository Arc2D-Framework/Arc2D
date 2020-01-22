
namespace `core.ui.templating` (
    class CustomTemplateEngines {
        constructor(){
            this.engines = {}
            this.defaultMimetype = Config.DEFAULT_TEMPLATE_ENGINE_MIMETYPE||"template/literals";
        }

        define(mimeType, engine){
            if(!this.engines[mimeType]){
                this.engines[mimeType] = engine;
                engine.install();
            }
        }

        getEngineByMimeType(mime){
            return this.engines[mime];
        }

        get default (){
            return this.engines[this.defaultMimetype];
        }

        set default (mimeType){
            this.defaultMimetype = mimeType;
        }
    }
);

window.customTemplateEngines = new core.ui.templating.CustomTemplateEngines;