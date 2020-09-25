import 'display.components.Splash';
import 'display.views.Home';

namespace `display.screens` (
    class SpaDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
