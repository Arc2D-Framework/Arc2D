import 'core.ui.ExplorerPanel';
import! 'core.data.Simulation';


namespace `plugins` (
    class ComponentInstancesExplorer extends core.ui.ExplorerPanel {
        static get WEIGHT(){return 50}

        constructor() {
            super();
            this.activity = application.currentActivity;
            application.addEventListener("previewhtml", e => this.onHtmlPreview(e))
        }

        async onConnected() {
            await super.onConnected();
            this.installShortcut();

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
            this.tray_icon = `
                <div>
                    <i id="" title="Components on Screen" class="toolbar-icon fa fa-cube"></i>
                    <div class="plugin-icon-label">Instances</div>
                </div>
            `.toDomElement();
            var tray = this.activity.getDetailsToolTray();
            tray.appendChild(this.tray_icon);
            this.tray_icon.addEventListener("click", e=> this.onAddRecordingRequested(e));
        }

        static async install(activity){
            var pane = activity.getDetailsPane();
            var el = await new this;
            pane.appendChild(el);
        }

        // onShowTriggerDialog(e){
        //     this.newScreenDialog.show();
        //     this.newScreenDialog.fill(e.data)
        // }


        async onHtmlPreview(){
            // var project = application.getProject()[0];
            // var screenPath = project.currentScreenPath;
            // var somPath  = screenPath.replace(".html",".som.json");
            // // debugger;
            // core.data.Simulation.load(somPath);
            // this.doRender();
        }

        async doRender(){
            debugger;
            var data = await core.data.Simulation.findObjectModel("wiring");
            this.render({items:data.items})
        }

        // onAddWiring(e){
        //     alert("onAddWiring");
        //     console.log(e.data);
        //     // core.data.Simulation.add(new core.data.Wiring(e.data));
        //     this.newScreenDialog.hide();
        //     this.doRender();
        // }

        async onRefresh(e){
            e.preventDefault();
            e.stopPropagation();

            var refreshBtn = this.querySelector('.fa-refresh');
                refreshBtn.classList.add("fa-spin");
            await wait(500);
            this.doRender();
            refreshBtn.classList.add("fa-spin");
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }
    }
);
