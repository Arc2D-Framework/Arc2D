import 'ui.components.MenuToggleButton';
import 'ui.components.RippleButton';
import 'ui.components.ParticleButton';
import 'ui.components.SideBar';
import 'ui.components.Accordion';
import 'ui.components.accordions.BasicAccordion';
import 'ui.components.Label';

import 'https://unpkg.com/intro.js/minified/intro.min.js';

@stylesheets(["https://unpkg.com/intro.js/minified/introjs.min.css"]);
namespace `ui.screens` (
    class ComponentsDemo extends Application {
        async onConnected(){
            await super.onConnected()
            var a = new ui.components.RippleButton();
            var b = new ui.components.RippleButton();
            var c = new ui.components.RippleButton();
            // debugger
                // c.assignSlot(`<span slot="label">Hello There</span>`.toNode());
            await this.append(a);
            await this.append(b);
            await this.append(c);

            await sleep(300) 
            introJs().setOptions({
                steps: [ 
                    {
                        element: a,
                        intro: "Click here to login!"
                    },
                    {
                        element: c,
                        intro: "Click here test!"
                    }
                ]
              }).start();
        }
    }
);
