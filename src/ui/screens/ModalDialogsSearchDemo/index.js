import 'ui.components.Splash';
import 'ui.components.SearchDialog';


namespace `ui.screens` (
    class ModalDialogsSearchDemo extends Application {
        async onConnected() {
            await super.onConnected();
            this.on("click", e=> this.onOpenDialog(e), false, "#open-dialog-btn");
            // debugger;
            this.modal = this.querySelector("ui-components-search-dialog");
            // this.modal = new ui.components.SampleDialog;
            // this.modal.value = {
            //     firstname : "Jay"
            // }
        }

        async onOpenDialog(){
            var info = await this.modal.prompt();
            console.log(info);
        }
    }
);
