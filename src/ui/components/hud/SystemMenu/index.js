import 'ui.screens.BaseApplication';
import 'ui.components.hud.InventoryMenu';

namespace `ui.components.hud` (
    class SystemMenu extends Component {
        static skin = "default";

        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
