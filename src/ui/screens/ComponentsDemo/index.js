import 'ui.loaders.ProgressRing';
import 'ui.components.MenuToggleButton';
import 'ui.components.RippleButton';
import 'ui.components.ParticleButton';
import 'ui.components.SideBar';
import 'ui.components.Accordion';
import 'ui.components.accordions.BasicAccordion';
await require('/src/system/libs/sample_modules/a.mjs')

namespace `ui.screens` (
    class ComponentsDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
        }
    }
);
