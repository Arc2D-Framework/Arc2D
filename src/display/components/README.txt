Examples of Components are small parts like:
    - switches
    - toggles
    - knobs, levers
    - partials
    - popups, modals, dialogs
    - navigation and menus


Components may be assembled and embedded into views or screens.
Components typically have 3 asset files:
    - index.html    - the <template>
    - index.css     - styling
    - index.js      - the javascript class
    - images/       - optional


Some Components, like "Splash" embedd assets (above)
inline, within the Javascript, for faster loading.

Others, like Planet.js are not WebComponents and might
generate its rendering using Canvas api where no
html, css is necessary. Or may not render. It might serve
as an abstract component that you only inherit
from and implement rendering yourself.


Components should have a Class name in the form:
UpperCase. Arc replaces the Upper cased letters
with dashes "-", to build a w3c HTML tag representation 
in the form:
<upper-case></upper-case>. 
The Splash component breaks the convention, so the 
@tag(), a decorator, is used to manually customize it 
with a valid tag-name, having dashes (required). Ex:

namespace `display.components` (
    @tag("splash-loader");
    class Splash extends w3c.ui.WebComponent {
        constructor() {
            super();
        }
    }
)

Which is then used in the HTML on a screen:
see: MoviesApp

