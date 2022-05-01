import 'ui.components.MenuToggleButton';
import 'ui.components.RippleButton';
import 'ui.components.ParticleButton';
import 'ui.components.SideBar';
import 'ui.components.Accordion';
import 'ui.components.accordions.BasicAccordion';
import 'ui.components.Label';

namespace `ui.screens` (
    class ComponentsDemo extends Application {
        async onConnected(){
            await super.onConnected()
            var c = new ui.components.RippleButton();
            debugger
                c.assignSlot(`<span slot="label">Hello There</span>`.toNode());
            await this.append(c);
        }
    }
);
