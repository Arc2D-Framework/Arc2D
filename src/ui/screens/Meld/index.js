
import 'ui.components.Splash';
import 'ui.components.SpaNav';
import 'ui.meld.FramesBrowser';
import 'ui.meld.editors.Editor';
import 'ui.meld.editors.Code';
import 'ui.meld.editors.RichText';
import 'ui.meld.editors.Branches';

namespace `ui.screens` (
    class Meld extends Application {
        constructor(element){
            super(element);
            location.hash = location.hash||Config.DEFAULT_VIEW;
        }
        
        async onConnected() {
            await super.onConnected();
        }

        inShadow(){return false}
    }
);
