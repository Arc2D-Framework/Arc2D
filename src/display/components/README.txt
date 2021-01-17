Components are smaller parts:
    - switches
    - toggles
    - knobs, levers
    - partials
    - popups, modals, dialogs
    - navigation and menus

See Docs:
https://www.arc2d.com/resources/doc.html#docs.topics.DefineComponent


Example Definition:
-------------------

namespace `display.components` (
    class ToggleButton extends WebComponent {
        async onConnected(){
            console.log("my toggle")
        }
    }
);


USAGE:
-------------------
First import it from anywhere:
import 'display.components.Splash';

BY HTML:
<splash-loader></splash-loader>

BY CLASS:
var s = new display.components.Splash;
document.body.appendChild(s);

BY DOM API:
var s = document.createElement("splash-loader");
document.body.appendChild(s);







