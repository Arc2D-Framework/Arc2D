import 'docs.components.ExplorerPanel';
import '/src/core/drivers/templating/Nunjucks/nunjucks-driver.js';

namespace `docs.components` (
    class ProjectExplorer extends docs.components.ExplorerPanel {
        static get WEIGHT(){return 1}
        
        constructor() {
            super();
        }

        async onConnected() {
            var ft = await (await fetch("src/docs/components/ProjectExplorer/data/filetree.json")).json();
            this.filetree =ft;
            await super.onConnected({item:ft});
            
            this.addEventListener("click", e=>this.onToggleExpand(e), false, "li[aria-expanded]")
            this.addEventListener("click", e=>this.onFileClicked(e), true, ".doc");
            this.addEventListener("click", e=> this.onRefresh(e), true, ".icons-try .fa-refresh");
            this.open()
        }

        async reset(){
            this.filetree = await (await fetch("src/docs/components/ProjectExplorer/data/filetree.json")).json();
        }

        getDir(namespace){
            var parts = namespace.split(".");
            var dir = this.filetree.children[1];
            for(var i=0; i<=parts.length-1; i++){
                dir = this.getFolder(parts[i],dir)
            }
            console.log(dir)
            // src.children.forEach(folder => {

            // })
            // return {
            //     "path": "",
            //     "name": name,
            //     "type": "directory",
            //     "size": 0,
            //     "children": []  
            // }
            return dir
        }

        mkDir(name){
            return {
                "path": "",
                "name": name,
                "type": "directory",
                "size": 0,
                "children": []  
            }
        }


        getFolder(name, dir){
            for(var i=0;i<=dir.children.length-1;i++){
                dir = dir.children[i];
                if(dir&&dir.name==name){
                    return dir;
                }
            }
        }

        mkFile(name){
            return {
                "path": "",
                "name": name,
                "type": "file",
                "size": 0,
                "extension" : name.split(".")[1]
            }
        }

        update(){
            this.render({item:this.filetree})
        }

        addChildDirectory(parent,child){
            parent.children.push(child);
            return child;
        }

        addFileToDirectory(parent,file){
            file = this.mkFile(file);
            parent.children.push(file);
            return file;
        }

        getSrcFolder(){
            return this.filetree.children[1];
        }

        // setPrototypeInstance() {
        //     this.setAttribute("namespace", this.namespace);
        //     this.prototype = this;
        // }

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


        // onTransformStyle(cssText){
        //     if(!this.inShadow()){
        //         return cssText.replace(/\:host\s+/gm, `.${this.classname} `)
        //     } else{
        //         return cssText;
        //     }
        // }
    }
);
