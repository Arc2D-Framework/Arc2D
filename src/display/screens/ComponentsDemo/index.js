import 'display.components.MenuToggleButton';
import 'display.components.RippleButton';
import 'display.components.ParticleButton';
import 'display.components.SideBar';
import 'display.components.Accordion';
import 'display.components.accordions.BasicAccordion';


namespace `display.screens` (
    class ComponentsDemo extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
