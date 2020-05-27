import 'core.ui.ProgressBarDialog';
import 'core.ui.NewScreenDialog';


@cascade(false);
namespace `plugins` (
    class ClonePage extends w3c.ui.WebComponent {
        static get WEIGHT(){return 20}

        async onConnected(){
            await super.onConnected();
            this.newScreenDialog = new core.ui.NewScreenDialog;
            this.newScreenDialog.hide();
            this.newScreenDialog.addEventListener("captureready", e=>this.onReadyToCapture(e))
            application.currentActivity.appendChild(this.newScreenDialog);

            this.addEventListener("click", e => this.onHandleClick(e));
            this.progressBar = new core.ui.ProgressBarDialog;
            this.progressBar.hide();
            application.appendChild(this.progressBar);
        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el);
        }

        onLoadInstanceStylesheet(){
            return false
        }

        onHandleClick(e){
            this.onShowNewScreenDialog();
        }


        onShowNewScreenDialog(){
            this.newScreenDialog.show();
        }

        onReadyToCapture(e){
            this.newScreenDialog.hide();
            this.onSavePageRequested(e);
        }

        async onSavePageRequested(e) {
            var save_data = e.data;
            global.save_data=save_data;
            e.preventDefault();
            e.stopPropagation();

            if (native_HAR_file_was_used) { 
                alert("saving from HAR") 
            }
            var har_copy = JSON.parse(JSON.stringify(har));
            har.log.entries = {};

            var fileName = e.data.srcfolder + "/" + e.data.namespace.replace(".","/","g") + "/" + e.data.filename
            this.progressBar.show();
            application.currentActivity.getWebView().getWebContents().savePage(fileName, 'HTMLComplete').then(async () => {
                fileName = fileName;
                var root = fileName.substr(0, fileName.lastIndexOf("/") + 1);
                var file = fileName.substr(fileName.lastIndexOf("/") + 1);
                var assets = file.replace(".html", "_files");
                var assetPath = root + assets;
                await HARDownloadManager.save(har_copy, assetPath, this.onDownloadProgress.bind(this));
                await AssetPipe.run(assetPath, fileName, har_copy);
                this.onDownloadCompleted(fileName,application.currentActivity.getWebView().getURL());
                ipcRenderer.send('savecomplete', "Im ready");
                native_HAR_file_was_used = false;
                har.log.entries = {};
            }).catch(e => console.error(e));
        }

        onDownloadProgress (amount) {
            this.progressBar.step(amount);
        }

        onDownloadCompleted (savedHtmlFilePath, associatedLiveUrl) {
            this.progressBar.step(0);
            wait(200);
            this.progressBar.hide();
            console.log('Save page successfully');

            core.data.LiveToCloneMapping.add(new core.data.LiveToCloneEntry({
                    clone : savedHtmlFilePath,
                    live : associatedLiveUrl
                })
            );
        }

        template(){
            return `
                <template>
                    <i id="save" title="Save" class="toolbar-icon fa fa-camera"></i>
                    <div class="plugin-icon-label">Capture</div>
                </template>
            `
        }
    }
);





