Components are smaller parts:
    - switches
    - toggles
    - knobs, levers
    - partials
    - popups, modals, dialogs
    - navigation and menus

See:
https://www.arc2d.com/resources/doc.html#docs.topics.DefineComponent


Components are assembled unto screens and other components.
Each component has asset files:
    - index.html    - a <template>
    - index.css     - styling
    - index.js      - a Class


Components should have a Class name in the form:
UpperCase. Arc relys on this UpperCase convention
and builds a tag for use in HTML, example:

class UpperCase       -->    <upper-case></upper-case>
class ToggleButton    -->    <toggle-button></toggle-button>

But, it's not a requirement. Take for example:

@tag("splash-loader");
namespace `display.components` (
    class Splash extends w3c.ui.WebComponent {
        constructor() {
            super();
        }
    }
);

The class Splash is just a single word; The @tag() decorator allows a custom tag-name:


USAGE:
First import it from anywhere:
import 'display.components.Splash';

BY HTML:
<splash-loader></splash-loader>

BY CLASS:
var s = new display.components.Splash;
document.body.appendChild(s);```

BY DOM API:
var s = document.createElement("splash-loader");
document.body.appendChild(s);

