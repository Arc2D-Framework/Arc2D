
namespace `plugins.editors` (
    class RedirectEditor extends w3c.ui.WebComponent {
        constructor() {
            super();
            var project = application.getProject();
            this.ft = new core.data.FileTree(project[0].devpath+"/"+project[0].projectfolder + "/src/applications/");
            
            
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }

        async onConnected() {
            await super.onConnected(this.ft.build());
            console.log("this.ft.build()",this.ft.build())
            this.screen_namespace_select = this.querySelector("#screen_namespace");
        }

        getValue(){
            var src = `
                location.href = "../../../src/applications/${this.screen_namespace_select.value}/index.html";
            `;
            return src;
        }

        
        static async install(activity){
            var pane = activity.getDetailsPane();
            var el = await new this;
            pane.appendChild(el);
        }
    }
);
