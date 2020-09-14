SCREENS
------------------------------------------------------------
Screens are individual Applications. Typically only 1 screen
in an SPA setup, but not limited.
Screens are asssembled with reusable Component parts like:
    - switches
    - toggles
    - knobs, levers
    - partials
    - popups, modals, dialogs
    - navigation and menus


SPA SETUP
------------------------------------------------------------
In an SPA setup (See: screens/SpaDemo), the screen is asssembled with
1 default View|Activity (see: views/). Add navigation to other views
using links with namespace to the view:

<a href=#display.views.Home">Home Page</a>
<a href=#display.views.About">About Us</a>
<a href=#display.views.Contact">Contact Us</a>


A screen that will utilize Views (An Activity) must have a <slot>
with name="view-port" and as the view-port where Views are shown/hidden.

<slot name="view-port">
    <home-page></home-page> <!--show a default view on load -->
</slot>


The default view must be imported from the screen that needs the view, see SpaDemo/index.js:
import 'display.views.Home';