import 'ui.components.sf.Dialog';

namespace `ui.screens` (
    class ShiningForce extends Application {
        async onConnected() {
            await super.onConnected();
            var dialog = this.querySelector("ui-components-sf-dialog");
            dialog.show()
        }
    }
);
