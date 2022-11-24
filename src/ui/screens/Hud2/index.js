import 'ui.screens.BaseApplication';
import 'ui.components.hud.Menu';


namespace `ui.screens` (
    class Hud2 extends ui.screens.BaseApplication {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
