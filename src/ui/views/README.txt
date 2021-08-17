
VIEWS IN SPA SETUP
------------------------------------------------------------
In an SPA setup (See: screens/SpaDemo), the screen is asssembled with
1 default View (see: views/). Add navigation to other views
using links with namespace to the view:

<a href=#ui.views.Home">Home Page</a>
<a href=#ui.views.About">About Us</a>
<a href=#ui.views.Contact">Contact Us</a>


Views are regular, but larger WebComponents that
are screen-sized. Different Views are navigated to,
using links above, without refreshing the Screen.


DEMO:
--------------------------------------------------------
See webpage, "spa-demo.html" at project root. It's namespace is
a screen located at folder: "src/display/screens/SpaDemo"

SpaDemo is a screen with this template:
    <template>
        <div>
            <nav>
                <a href="#ui.views.Home">Home Page</a>
                <a href="#ui.views.Contact">Contact Page</a>
                <a href="#ui.views.About">About Page</a>
            </nav>
            <slot name="view-port">
                <home-page></home-page>
            </slot>
        </div>
    </template>


Uses a <slot name="view-port"> for default view port where
other views are loaded into.


View port has a starting default view, <home-page>:
    <slot name="view-port">
        <home-page></home-page>
    </slot>


Uses normal #hash links to load new views, where the #hash
is the namespace to any component:
    <a href="#ui.views.Contact">Contact Page</a>


<home-page> view is imported in SpaDemo screen class:
    
    import 'ui.components.Splash';
    import 'ui.views.Home';

    namespace `ui.screens` (
        class SpaDemo extends Application {
            constructor(element){
                super(element);
            }

            async onConnected() {
                await super.onConnected();
            }
        }
    );

