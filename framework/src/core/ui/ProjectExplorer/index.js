import 'core.ui.ExplorerPanel';
import '/src/core/drivers/templating/Nunjucks/nunjucks-driver.js';

namespace `core.ui` (
    class ProjectExplorer extends core.ui.ExplorerPanel {
        static get WEIGHT(){return 1}
        
        constructor() {
            super();
        }

        async onConnected() {
            var ft = await (await fetch("../../../src/core/ui/ProjectExplorer/data/filetree.json")).json()
            await super.onConnected({item:ft});
            
            this.addEventListener("click", e=>this.onToggleExpand(e), false, "li[aria-expanded]")
            this.addEventListener("click", e=>this.onFileClicked(e), true, ".doc");
            this.addEventListener("click", e=> this.onRefresh(e), true, ".icons-try .fa-refresh");
            // this.open()
        }

        setPrototypeInstance() {
            this.setAttribute("namespace", this.namespace);
            this.prototype = this;
        }

        static async install(activity){
            var pane = activity.getPrimaryPane();
            var el = await new this;
            pane.appendChild(el)
        }

        async onRefresh(e){
            e.preventDefault();
            e.stopPropagation();
            var refreshBtn = this.querySelector('.fa-refresh');
                refreshBtn.classList.add("fa-spin");
            await wait(500);
            var filetree = this.ft.build();
            await this.render({item:filetree});
                refreshBtn.classList.add("fa-spin");
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }

        onFileClicked(e){
            e.stopPropagation();
            e.preventDefault();
            var path = e.target.getAttribute("path");
            var ext = e.target.getAttribute("ext");
            if(ext && ext == ".html"){
                this.dispatchEvent("previewhtml", {path,ext})
            }
        }


        onToggleExpand(e){
            var li = e.target;
            li.classList.toggle("expanded");
        }


        onTransformStyle(cssText){
            if(!this.inShadow()){
                return cssText.replace(/\:host\s+/gm, `.${this.classname} `)
            } else{
                return cssText;
            }
        }
    }
);
