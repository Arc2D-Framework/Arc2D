import 'display.components.Splash';
import 'display.components.SampleDialog';
import _ from 'lodash';
import {WristWatch as LL} from '/src/system/libs/sample_modules/a.mjs';
import {samplex as N} from 'module-a';

namespace `display.screens` (
    class ModalDialogs extends Application {
        constructor(element){
            super(element);
            console.log("samplex",N)
        }

        async onConnected() {
            await super.onConnected();
            this.on("click", e=>this.onGetAddress(e), false, "#address-button");
            this.modal = new display.components.SampleDialog;
        }

        async onGetAddress(){
            var result = await this.modal.prompt();
            // alert("dialog results: " + result)
        }
    }
);
