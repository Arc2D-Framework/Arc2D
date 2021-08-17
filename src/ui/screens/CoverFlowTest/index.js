import 'ui.components.Splash';
import 'ui.components.CoverFlow';
import 'ui.components.ToggleButton';

@stylesheets(['/src/./tiles.css']);
namespace `ui.screens` (
    class CoverFlowTest extends Application {
        async onConnected(){
            await super.onConnected();
            this.querySelector(".CoverFlow").style.display="block"
        }
    }
);
