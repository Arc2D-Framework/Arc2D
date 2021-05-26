import 'display.loaders.ProgressRing';
import 'display.components.MenuToggleButton';
import 'display.components.RippleButton';
import 'display.components.ParticleButton';
import 'display.components.SideBar';
import 'display.components.Accordion';
import 'display.components.accordions.BasicAccordion';
import * as global from 'display.components';


namespace `display.screens` (
    class ComponentsDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
