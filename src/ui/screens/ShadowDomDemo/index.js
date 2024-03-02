import 'ui.components.Label';
import 'ui.components.MessageBarExtendedChild';

namespace `ui.screens` (
    class ShadowDomDemo extends Application {
        
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            var div = document.querySelector("div#test1");
            var messageBar = new ui.components.MessageBar(div);
            // this.subscribe("connected", e=>this.onMessage(e));
            
        }

        onMessage(e){
            console.log("Message received",e);
        }
    }
);
