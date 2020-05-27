
@cascade(false);
namespace `plugins` (
    class AppConfig extends w3c.ui.WebComponent {
        static get WEIGHT(){return 60}

        async onConnected(){
            await super.onConnected();
            // this.newScreenDialog = new core.ui.NewScreenDialog;
            // this.newScreenDialog.hide();
            // this.newScreenDialog.addEventListener("captureready", e=>this.onReadyToCapture(e))
            // application.currentActivity.appendChild(this.newScreenDialog);

            this.addEventListener("click", e => this.onHandleClick(e));
            // this.progressBar = new core.ui.ProgressBarDialog;
            // this.progressBar.hide();
            // application.appendChild(this.progressBar);

        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            // this.onShowNewScreenDialog();
            // this.onSavePageRequested(e);
        }


        onShowNewScreenDialog(){
            // var newScreenDialog = new core.ui.NewScreenDialog;
            // this.newScreenDialog.show();
        }

        onReadyToCapture(e){
            // alert("dialog success ")
            console.log(e.data);
            // this.newScreenDialog.hide();
            // this.onSavePageRequested(e);
        }

        onDownloadProgress (amount) {
            // this.progressBar.step(amount)
            // console.log("progress",amount);//ex: 0.5322580645161291
        }

        // onDownloadCompleted (s) {
        //     // this.progressBar.step(0);
        //     // wait(1000);
        //     // this.progressBar.hide();
        //     // console.log('Save page successfully');
        // }

        template(){
            return `
                <template>
                    <i id="" title="App Config" class="toolbar-icon fa fa-cog"></i>
                    <div class="plugin-icon-label">Config</div>
                </template>
            `
        }
    }
);





