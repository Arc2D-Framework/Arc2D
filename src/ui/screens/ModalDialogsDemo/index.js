import 'ui.components.Splash';
import 'ui.components.RegistrationDialog';


namespace `ui.screens` (
    class ModalDialogsDemo extends Application {
        async onConnected() {
            await super.onConnected();
            this.on("click", e=> this.onOpenDialog(e), false, "#open-dialog-btn");
            this.modal = this.querySelector("ui-components-registration-dialog");
            // this.modal = new ui.components.SampleDialog;
            this.modal.value = {
                firstname : "Jay"
            }
        }

        async onOpenDialog(){
            var info = await this.modal.prompt();
            console.log(info);
        }
    }
);
