import 'ui.components.Splash';
import 'ui.components.SampleDialog';


namespace `ui.screens` (
    class ModalDialogsDemo extends Application {
        async onConnected() {
            await super.onConnected();
            this.on("click", e=> this.onOpenDialog(e), false, "#open-dialog-btn");
            // this.modal = this.querySelectorAll("ui-components-sample-dialog-2")[2];
            this.modal = new ui.components.SampleDialog;
            this.on("connected", e=> console.log("app detected", e));
            this.modal.on("connected", e=> console.log("1st", e));
            
            // this.modal.on("connected", e=> console.log("2nd",e))
            //this.modal = new ui.components.SampleDialog;
        }

        async onOpenDialog(){
            var info = await this.modal.prompt();
            console.log(info)
        }
    }
);
