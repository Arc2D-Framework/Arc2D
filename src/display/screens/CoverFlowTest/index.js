import 'display.components.Splash';
import 'display.components.CoverFlow';
import 'display.components.ToggleButton';

@stylesheets(['/src/./tiles.css']);
namespace `display.screens` (
    class CoverFlowTest extends Application {
        async onConnected(){
            await super.onConnected();
            this.querySelector("cover-flow").style.display="block"
        }
    }
);
