import 'ui.screens.BaseApplication';
import 'ui.components.hud.SystemMenu';
import 'ui.components.hud.InventoryMenu';

namespace `ui.screens` (
    class Hud extends ui.screens.BaseApplication {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
