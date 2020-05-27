import 'core.ui.ExplorerPanel';
import! 'core.data.Simulation';
import! 'core.data.GlobalSimulation';
import 'core.ui.EditTriggerDialog';

namespace `plugins` (
    class TriggerExplorer extends core.ui.ExplorerPanel {
        static get WEIGHT(){return 10}
        
        constructor() {
            super();
            application.addEventListener("previewhtml", e => this.onHtmlPreview(e))
        }

        async onConnected() {
            await super.onConnected();
            

            this.activity = application.currentActivity;
            this.newScreenDialog = new core.ui.EditTriggerDialog;
            this.newScreenDialog.addEventListener("EditTriggerDialog:addtrigger", e => this.onAddTrigger(e), false)
            this.newScreenDialog.hide();
            this.activity.appendChild(this.newScreenDialog);

            this.activity.addEventListener("editor:setastrigger", e=>this.onShowTriggerDialog(e), false);
            this.addEventListener("click", e=> this.onRefresh(e), true, ".icons-try .fa-refresh");
            this.addEventListener("click", e=> this.onTriggerClicked(e), false, "li");
            this.addEventListener("click", e=> this.onToggleTriggerAsGlobal(e), false, "li .share-level");
        }

        async onTriggerClicked(e){
            debugger;
            var li = e.target;
            var rec_id = li.getAttribute("data-id");
            // var trigger = await core.data.Simulation.findTriggerById(trigger_id)||await core.data.GlobalSimulation.findTriggerById(trigger_id); 
            //     trigger = trigger||{};
            this.activity.getWebView().send('highlighttrigger', trigger);
        }

        onToggleTriggerAsGlobal(e){
            var el = e.target;
            var li = el.parentNode;
            if(el.classList.contains("global")){
                el.classList.remove("global");
                el.classList.add("local");
                el.innerHTML = "local"
            } else if(el.classList.contains("local")){
                el.classList.remove("local");
                el.classList.add("global");
                el.innerHTML = "global"
            }
            var triggerid = li.getAttribute("data-id");
            var isglobal = el.classList.contains("global");
            if(isglobal){
                this.moveTriggerToGlobal(triggerid, isglobal)
            } else {
                this.moveTriggerToLocal(triggerid, isglobal)
            }
        }

        async moveTriggerToGlobal(triggerid, isglobal){
            var trigger = await core.data.Simulation.removeTriggerById(triggerid); 
            if(trigger){
                debugger;
                trigger.global = isglobal;
                await core.data.Simulation.commit();
                await core.data.GlobalSimulation.add(new core.data.Trigger(trigger));
                await core.data.GlobalSimulation.commit();
                this.doRender();
                await wait(300);
                this.dispatchEvent("plugins:TriggerExplorer:changed");
            }else{
                alert("Unable to find trigger");
                console.error("Unable to find trigger by id:", triggerid);
            }
        }

        async moveTriggerToLocal(triggerid, isglobal){
            var trigger = await core.data.GlobalSimulation.removeTriggerById(triggerid); 
            if(trigger){
                debugger;
                trigger.global = false;
                await core.data.GlobalSimulation.commit();
                await core.data.Simulation.add(new core.data.Trigger(trigger));
                await core.data.Simulation.commit();
                this.doRender();
                await wait(300);
                this.dispatchEvent("plugins:TriggerExplorer:changed");
            }else{
                alert("Unable to find trigger");
                console.error("Unable to find trigger by id:", triggerid);
            }
        }

        static async install(activity){
            var pane = activity.getDetailsPane();
            var el = await new this;
            pane.appendChild(el);
        }

        onShowTriggerDialog(e){
            this.newScreenDialog.show();
            this.newScreenDialog.fill(e.data)
        }


        async onHtmlPreview(){
            var project = application.getProject()[0];
            var screenPath = project.currentScreenPath;
            var somPath  = screenPath.replace(".html",".som.json");
            core.data.Simulation.load(somPath);
            this.doRender();
        }

        async doRender(){
            var globaldata = await core.data.GlobalSimulation.findObjectModel("triggers");
            var data = await core.data.Simulation.findObjectModel("triggers");
            var triggers = [globaldata.items,data.items]
            this.render({items:triggers.flat()})
        }

        onAddTrigger(e){
            console.log(e.data);
            core.data.Simulation.add(new core.data.Trigger(e.data));
            this.doRender();
            this.newScreenDialog.hide();
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
