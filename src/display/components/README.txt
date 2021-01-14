Examples of Components are small parts like:
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
UpperCase. Arc replaces the Upper cased letters
with dashes "-", to build a w3c HTML5 tag representation 
in the form:
class UpperCase       -->    <upper-case></upper-case>
class ToggleButton    -->    <toggle-button></toggle-button>

The Splash is just a single word though; the 
@tag() decorator allows a custom tagName:

@tag("splash-loader");
namespace `display.components` (
    class Splash extends w3c.ui.WebComponent {
        constructor() {
            super();
        }
    }
);

USAGE:
First import it from anywhere:
```import 'display.components.Splash'```;

BY HTML:
<splash-loader></splash-loader>

BY CLASS:
```var s = new display.components.Splash;
document.body.appendChild(s);```

BY DOM API:
```var s = document.createElement("splash-loader");
document.body.appendChild(s);```

