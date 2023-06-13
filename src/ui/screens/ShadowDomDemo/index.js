import 'ui.components.Label';
import 'ui.components.MessageBar';

namespace `ui.screens` (
    class ShadowDomDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.label = this.querySelector("ui-components-label");

            var d = `<h1>HELLO WORLD</h1>`.toNode();
            debugger
            this.label.appendChild(d)
        }
    }
);
