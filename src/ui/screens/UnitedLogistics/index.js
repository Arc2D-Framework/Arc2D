import 'ui.components.EmployeeSetupForm';

namespace `ui.screens` (
    class UnitedLogistics extends Application {
        

        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.subscribe("connected", e=>this.onMessage(e));
            // this.label = this.querySelector("ui-components-label");

            // var d = `<h1>HELLO WORLD</h1>`.toNode();
            // debugger
            // this.label.appendChild(d)
        }

        onMessage(e){
            console.log("Message received",e);
        }
    }
);
