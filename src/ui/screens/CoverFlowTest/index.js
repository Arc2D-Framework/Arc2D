import 'ui.components.Splash';
import 'ui.components.CoverFlow';
import 'ui.components.ToggleButton';

@stylesheets(['./tiles.css', "./test2.css"]);
namespace `ui.screens` (
    class CoverFlowTest extends Application {
        async onConnected(){
            await super.onConnected();
            this.querySelector(".CoverFlow").style.display="block"
        }
    }
);
