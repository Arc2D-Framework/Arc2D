import 'display.components.Splash';
import 'display.components.SampleDialog';
import 'display.components.SampleDialog2';
import 'display.components.SampleDialog3';


namespace `display.screens` (
    class ModalDialogsDemo extends Application {
        async onConnected() {
            await super.onConnected();
            this.on("click", e=> this.onOpenDialog(e), false, "#open-dialog-btn");
            this.modal = this.querySelector("sample-dialog");
            this.on("connected", e=> console.log("app detected", e));
            this.modal.on("connected", e=> console.log("1st", e));
            
            // this.modal.on("connected", e=> console.log("2nd",e))
            //this.modal = new display.components.SampleDialog;
        }

        async onOpenDialog(){
            var info = await this.modal.prompt();
            console.log(info)
        }
    }
);
