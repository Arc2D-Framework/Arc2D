import 'core.ui.ExplorerPanel';
import! 'core.data.Simulation';
import 'core.ui.EditWiringDialog';

namespace `plugins` (
    class WiringExplorer extends core.ui.ExplorerPanel {
        static get WEIGHT(){return 20}

        constructor() {
            super();
            this.activity = application.currentActivity;
            application.addEventListener("previewhtml", e => this.onHtmlPreview(e));
        }

        async onConnected() {
            await super.onConnected();
            this.installShortcut();
            this.newWiringDialog = new core.ui.EditWiringDialog;
            this.newWiringDialog.addEventListener("EditWiringDialog:add", e => this.onAddWiring(e), false)
            this.newWiringDialog.hide();
            this.activity.getDetailsEditorPane().appendChild(this.newWiringDialog);
            this.addEventListener("click", e=> this.onRefresh(e), true, ".icons-try .fa-refresh");
            this.addEventListener("click", e=> this.onToggleWiringAsGlobal(e), false, "li .share-level");
            this.addEventListener("click", e=> this.onWireLabelClicked(e), false, "li .label");
        }

        onWireLabelClicked(e){
            var wire_id = e.target.parentNode.getAttribute("data-id");
            console.log("wire_id: ", wire_id)
            this.dispatchEvent("simulateclick",{wire_id})
        }

        onToggleWiringAsGlobal(e){
            var el = e.target;
            var li = el.parentNode;
            if(el.classList.contains("global")){
                el.classList.remove("global");
                el.classList.add("local");
                // el.innerHTML = "local"
            } else if(el.classList.contains("local")){
                el.classList.remove("local");
                el.classList.add("global");
                // el.innerHTML = "global"
            }
            var wireid = li.getAttribute("data-id");
            var isglobal = el.classList.contains("global");
            if(isglobal){
                this.moveWiringToGlobal(wireid, isglobal)
            } else {
                this.moveWiringToLocal(wireid, isglobal)
            }
        }

        async moveWiringToGlobal(wireid, isglobal){
            debugger;
            var wiring = await core.data.Simulation.removeWireById(wireid); 
            if(wiring){
                debugger;
                wiring.global = isglobal;
                await core.data.Simulation.commit();
                await core.data.GlobalSimulation.add(new core.data.Wiring(wiring));
                await core.data.GlobalSimulation.commit();
                this.doRender();
            }else{
                alert("Unable to find wiring");
                console.error("Unable to find wiring by id:", wireid);
            }
        }

        async moveWiringToLocal(wireid, isglobal){
            var wiring = await core.data.GlobalSimulation.removeWireById(wireid); 
            if(wiring){
                debugger;
                wiring.global = false;
                await core.data.GlobalSimulation.commit();
                await core.data.Simulation.add(new core.data.Wiring(wiring));
                await core.data.Simulation.commit();
                this.doRender();
            }else{
                alert("Unable to find wiring");
                console.error("Unable to find wiring by id:", wireid);
            }
        }



        onAddWiringRequested(e){
            e.preventDefault();
            e.stopPropagation();
            this.newWiringDialog.show();
        }

        onAddWiring(e){
            this.newWiringDialog.hide();
            core.data.Simulation.add(new core.data.Wiring(e.data));
            this.doRender();
        }


        installShortcut(){
            this.tray_icon = `
                <div>
                    <i id="cache" title="Wire-up Triggers" class="toolbar-icon fa fa-plug"></i>
                    <div class="plugin-icon-label">Wire</div>
                </div>
                `.toDomElement();
            var tray = this.activity.getDetailsToolTray();
            tray.appendChild(this.tray_icon);
            this.tray_icon.addEventListener("click", e=> this.onAddWiringRequested(e));
        }

        static async install(activity){
            var pane = activity.getDetailsPane();
            var el = await new this;
            pane.appendChild(el);
        }


        async onHtmlPreview(){
            var project = application.getProject()[0];
            var screenPath = project.currentScreenPath;
            var somPath  = screenPath.replace(".html",".som.json");
            core.data.Simulation.load(somPath);
            this.doRender();
            this.open();
        }

        async doRender(){
            var globaldata = await core.data.GlobalSimulation.findObjectModel("wiring");
            var data = await core.data.Simulation.findObjectModel("wiring");
            var all_wires = [globaldata.items,data.items]
            await this.render({items:all_wires.flat()});
        }


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
