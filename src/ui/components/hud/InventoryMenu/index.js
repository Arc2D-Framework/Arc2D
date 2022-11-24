import 'ui.components.hud.TabbedPanel';

namespace `ui.components.hud` (
	class InventoryMenu extends ui.components.hud.TabbedPanel  {
        static skin = "default";

        async onConnected() {
            await super.onConnected();
        }
	}
)