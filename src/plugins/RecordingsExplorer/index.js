import 'core.ui.ExplorerPanel';
import! 'core.data.Recording';
import 'core.ui.EditRecordingDialog';
import '/src/libs/countup.js';

namespace `plugins` (
    class RecordingsExplorer extends core.ui.ExplorerPanel {
        static get WEIGHT(){return 90}

        constructor() {
            super();
            this.activity = application.currentActivity;
            application.addEventListener("previewhtml", e => this.onHtmlPreview(e));
            application.addEventListener("editor:recordingdone", e=> this.onRecordingDone(e));
        }

        async onConnected() {
            await super.onConnected();
            this.installShortcut();
            this.installDialog();
            this.addEventListener("click", e=> this.onRefresh(e), true, ".icons-try .fa-refresh");
            this.addEventListener("click", e=> this.onRecordingClicked(e), false, "li");
            this.recording_notification = application.currentActivity.querySelector("#recording_notification");
        }

        async displayRecordingNotification(status){
            var label = this.recording_notification.querySelector("span");
            var mut_count = this.recording_notification.querySelector("#mutation_count");

            this.recording_notification.style.display = "block";
            if(status==0){
                label.innerHTML = "Observing..."
            }
            else if(status==1){
                var len=this.lastUnsavedRecording.mutations.length;
                label.innerHTML = "Recording...";
                var demo = new CountUp(mut_count, this.lastUnsavedRecording.mutations.length);
                demo.start();
                var recIcon = this.recording_notification.querySelector("i");
                recIcon.style["animation-duration"]= ".15s";
                await wait(3500);
                label.innerHTML = "saved " + len + " mutations";
                mut_count.innerHTML="";
                recIcon.style["animation-duration"]= "10s";
                await wait(3500);
                this.recording_notification.style.display = "none";
                recIcon.style["animation-duration"]= "1s";
                mut_count.innerHTML="";
                label.innerHTML="";
            }
        }

        hideRecordingNotification(){
            this.recording_notification.style.display = "none";
        }

        installDialog(){
            this.recDialog = new core.ui.EditRecordingDialog;
            this.recDialog.addEventListener("EditRecordingDialog:success", e=> this.onDialogSuccess(e))
            this.recDialog.hide();
            application.appendChild(this.recDialog);

        }

        async onRecordingClicked(e){
            var li = e.target;
            var rec_id = li.getAttribute("data-id");
            this.activity.getWebView().send('playrec', rec_id);
        }

        async onRecordingDone(e){
            var recording = {
                mutations : e.data.mutations
            };
            if(e.data.mutations.length<=0){
                this.onRecordingCanceled();
                return;
            }
            this.lastUnsavedRecording = recording;
            this.recDialog.show();
        }

        onRecordingCanceled(){
            this.recDialog.hide();
            this.lastUnsavedRecording=null;
            this.hideRecordingNotification();
        }

        async onDialogSuccess(e){
            this.lastUnsavedRecording.name = e.data.name;
            this.lastUnsavedRecording.recid = e.data.id;
            console.log("this.lastUnsavedRecording",this.lastUnsavedRecording);
            await core.data.GlobalSimulation.add(new core.data.Recording(this.lastUnsavedRecording));
            await wait(100);
            this.recDialog.hide();
            this.displayRecordingNotification(1);
        }

        onStartRecordingRequested(e){
            e.preventDefault();
            e.stopPropagation();
            this.lastUnsavedRecording=null;
            var icon = this.tray_icon.querySelector(".toolbar-icon")
                icon.classList.toggle("active");
            var isActive = icon.classList.contains("active");
            if(isActive){
                this.dispatchEvent("startrecording",{active:isActive});
                this.displayRecordingNotification(0);
            }
            else if(!isActive){
                this.dispatchEvent("endrecording",{active:isActive});
            }
            
        }

        installShortcut(){
            this.tray_icon = `
                <div>
                    <i id="" title="New Recording" class="toolbar-icon sticky fa fa-video-camera"></i>
                    <div class="plugin-icon-label">Record</div>
                </div>
                `.toDomElement();
            var tray = this.activity.getDetailsToolTray();
                tray.appendChild(this.tray_icon);
            this.tray_icon.addEventListener("click", e=> this.onStartRecordingRequested(e));
        }

        static async install(activity){
            var pane = activity.getDetailsPane();
            var el = await new this;
            pane.appendChild(el);
        }

        async onHtmlPreview(){
            this.doRender();
        }

        async doRender(){
            var data = await core.data.GlobalSimulation.findObjectModel("recordings");
            this.render({items:data.items})
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
