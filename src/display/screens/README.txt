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
1 default View (see: views/). Add navigation to other views
using links with namespace to view:

<a href=#display.views.Home">Home Page</a>
<a href=#display.views.About">About Us</a>
<a href=#display.views.Contact">Contact Us</a>


A screen that will utilize Views must have a <slot>
with name="content" and adefault View to show:

<slot name="content">
    <home-page></home-page>
</slot>


The default view must be imported, see SpaDemo/index.js:
import 'display.views.Home';