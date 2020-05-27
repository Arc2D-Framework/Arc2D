import 'core.ui.ExplorerPanel';
import! 'core.data.Simulation';


namespace `plugins` (
    class ComponentLibraryExplorer extends core.ui.ExplorerPanel {
        static get WEIGHT(){return 3}

        constructor() {
            super();
            this.activity = application.currentActivity;
            // application.addEventListener("previewhtml", e => this.onHtmlPreview(e))
        }

        async onConnected() {
            var project = application.getProject();
            console.log("project",project[0])
            this.ft = new core.data.FileTree(project[0].devpath+"/"+project[0].projectfolder + "/src/core/ui");
            var filetree = this.ft.build();
                filetree.expanded=true;
            console.log("filetree",filetree);
            await super.onConnected({item:filetree});
            
            this.addEventListener("click", e=>this.onToggleExpand(e), false, "li[aria-expanded]")
            this.addEventListener("click", e=>this.onFileClicked(e), true, ".doc");
            this.addEventListener("mousedown", e=> this.onRefresh(e), false, ".fa-refresh");

            // await super.onConnected();
            // this.installShortcut();

            // this.newWiringDialog = new core.ui.EditWiringDialog;
            // this.newWiringDialog.addEventListener("EditWiringDialog:add", e => this.onAddWiring(e), false)
            // this.newWiringDialog.hide();
            // this.activity.appendChild(this.newWiringDialog);

            // this.addEventListener("click", e=> this.onRefresh(e), true, ".icons-try .fa-refresh");
        }

        onAddRecordingRequested(e){
            e.preventDefault();
            e.stopPropagation();
            alert("TODO")
            // this.newWiringDialog.show();
        }

        // onAddWiring(e){
        //     alert("onAddWiring");
        //     this.newWiringDialog.hide();
        //     console.log(e.data);
        //     core.data.Simulation.add(new core.data.Wiring(e.data));
        //     // this.newScreenDialog.hide();
        //     this.doRender();
        // }

        // async onTriggerClicked(e){
        //     var li = e.target;

        //     var trigger = await core.data.Simulation.findTriggerById(li.getAttribute("data-id")); 
        //         trigger = trigger||{};
        //     this.activity.getWebView().send('highlighttrigger', trigger);
        // }
        installShortcut(){
            this.tray_icon = `<i id="" title="Components on Screen" class="toolbar-icon fa fa-cube"></i>`.toDomElement();
            var tray = this.activity.getDetailsToolTray();
            tray.appendChild(this.tray_icon);
            this.tray_icon.addEventListener("click", e=> this.onAddRecordingRequested(e));
        }

        static async install(activity){
            var pane = activity.getPrimaryPane();
            var el = await new this;
            pane.appendChild(el)
        }

        // onShowTriggerDialog(e){
        //     this.newScreenDialog.show();
        //     this.newScreenDialog.fill(e.data)
        // }


        // async onHtmlPreview(){
        //     // var project = application.getProject()[0];
        //     // var screenPath = project.currentScreenPath;
        //     // var somPath  = screenPath.replace(".html",".som.json");
        //     // // debugger;
        //     // core.data.Simulation.load(somPath);
        //     // this.doRender();
        // }

        // async doRender(){
        //     debugger;
        //     var data = await core.data.Simulation.findObjectModel("wiring");
        //     this.render({items:data.items})
        // }

        // // onAddWiring(e){
        // //     alert("onAddWiring");
        // //     console.log(e.data);
        // //     // core.data.Simulation.add(new core.data.Wiring(e.data));
        // //     this.newScreenDialog.hide();
        // //     this.doRender();
        // // }

        // async onRefresh(e){
        //     e.preventDefault();
        //     e.stopPropagation();

        //     var refreshBtn = this.querySelector('.fa-refresh');
        //         refreshBtn.classList.add("fa-spin");
        //     await wait(500);
        //     this.doRender();
        //     refreshBtn.classList.add("fa-spin");
        // }
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

        async onRefresh(){
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
    }
);
