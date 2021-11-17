# Description
This is a demo repository using the latest Arc2D (Engine):
```html
<script src="https://cdn.jsdelivr.net/gh/nashorn/od-cocoon@latest/framework.min.js" charset="utf-8"></script>
```


Arc is a W3C-compliant, ES6/7 Component Framework (not an api) used
for building enterprise grade applications, ui controls and 2D/3D simulations. It adheres to the 
W3C WebComponent Specification for crafting Autonomouse Reactive Components (Arc)
in pure, vanilla JavaScript, HTML5 and CSS3.

- [Website](https://www.arc2d.com)
- [Documentation](https://www.arc2d.com/resources)
- [Demos - Sandbox In Progress]()
    - [Hello World](https://www.arc2d.com/resources/?path=docs/topics/HelloWorldSimple)
 

# Why
Arc differs significantly at both language and architectural aspects when compared to other frameworks
such as Angular, VUE, React and so on:
- Ultra-thin Kernel
- The No-Compiler Paradigm
- The ThumbDrive Paradigm
- Class Driven Design
- Namespaces
- Inheritance
- Visual Inheritance
- Components (prefabs)
- World Simulation
- Composition & Nesting for Screen Assembly

# Ultra-thin Kernel
Weighing in at 12kb (compressed+unencrypted gzip or 20kb encrypted), The Arc kernel, "cocoon" offers enterprise class features out-the-box with zero npm modules and/or 3rd party apis. Blazing fast, ultra-light and a low memory footprint with no side effects on existing pages. No need to re-write or restructure existing HTML, the progressive upgrade aspects make introducing the kernel unto existing pages that were server-Side-Rendered (SSR) or built from scratch as simple as a script tag. Here's whats available at 12kb:
 - 2D/3D Physics World: 
    - For ThressJS, Physics+Collisions
    - Gaming, AI
    - Run Box2D, Matter, Bullet and Ammo
 - W3C Autonomous Components
    - Visual Component Inheritance
    - Shadow & Light DOM Componenets (toggle off/on on-demand)
    - Use Slots in Light & Shadow DOM (not possible natively)
    - CSS Context Scoping
    - CSS Transformations (use LESS)
    - Run Components at 60fps in Worlds
 - Multi Applications
 - Namespaces
 - Runtime ClassLoader (load classes on the fly at runtime)
 - Static imports, Dynamic Imports
 - Diagnostics / Unit Testing Engine
 - .importmaps (for short-name specifiers)
 - Asset Loader and Splash Screens
    - For Games
    - Heavy, media driven apps
 - Agnostic Data Storage
    - Swap between localStorage, sessionStorage, memory or mongo/couchdb*
    - *Write & swap new storage drivers
 - Collections and Pagination (Repository Design Pattern)
    - mongo queries
 - Swappable Template Engines (mustache, literals, nunjucks, handlebars)
 - 2-way Watchers (more efficient data binding)
 - SPA and MSPA Architecture (for mobile)
 - SEO Compliant / Crawlable & Scrapable SPAs (for web; no SSR required)
 - Zero Config Routing

 

# No Compilers, No Dependencies
The Arc Engine is installed into the ```HEAD``` of any existing webpage in one line:
```html
<script src="https://cdn.jsdelivr.net/gh/nashorn/od-cocoon@latest/framework.min.js" charset="utf-8"></script>
```
There are NO compilers, pre or post processing passes. No Webpack, Snowpack, Rollup or “Build” tasks. No Babel, Grunt, Browserify or 'Tree Shaking'. There are no 3rd party api's, npm's or plugins of any kind. You do not need a package.json unless required for other parts of your software, and zero cli tool requirements. So how does it work? 

Arc uses a 500byte blazing-fast kernel transpiler that has no effect on runtime performance and remains a trade-secret and a milestone in architecture. 


# Run From a ThumbDrive
From inception, Arc was designed to run from disk on the file:/// protocol without any server assistance.
Applications written on Arc can even boot from a Thumdrive -- on Android/iOS drives or any device-platform that grants permission to running js from the disk, such as the Safari browser, Cordova, Capacitor or Electron.

Developers from other communities would say they can do them same in their framework, but a close look at the Network tab shows an immense payload of JavaScript, spanning hundreds of thousands of LoC, megabytes worth of JavaScript, Babel apis, webpack and others to aide the effort -- if it was possible at all, being sometimes over burdening and over engineered to place one button on screen.

Think carefully, you are really unable to ship code to Android without first compiling a megalith bundle so 
that all import statements are scrubbed and stitched (as imports won't work on file:/// or Android),
add TypeScript into the mix and more compilers are necessary for little return and big hurdles, immense investments in time, cost and labor. Arc is living ES6, self interpretable and runs with or without server assistance, no assistance and ZERO compilation.

<!-- # A Meta Framework
Arc is a self-interpreted meta framework architecture that transpiles on-the-fly and just-in-time. Zero-config setup means it runs on default settings. No compilers or processors completely eliminate extra toolchains. Your ```src/``` directory remains purely native ES6, absolutely no TypeScript. The ```node_modules``` folder, almost empty. The Arc platform is 100% native EcmaScript and self-executing, self-interpreting all in the browser and console. -->

Being a meta-framework, Arc is able to run itself autonomously. Though it has no meaning and will not affect or do anything special to a webpage, it is able to run as an instance of itself. 2nd, being a meta-framework, developers will be able to craft new types of engines on top of arc (cocoon kernel). Think of ```cocoon``` as the Linux kernel of frameworks.


# Class Driven Design
Instead of 'higher-order' functional programming concepts, as used in React, Arc
relies on 3rd generation class driven concepts of the latest ES6/7 language, keeping the affordance of powerful features found in modern Java/C#. In Arc, native classes are used to define Autonomous Components based on the W3C specification for custom element definition:

```javascript
class ToggleButton extends Component {

}
```


# Namespace
- [Component Namespaces In Depth](https://www.arc2d.com/resources/?path=docs/topics/ComponentNamespaces)

1st, Arc runs in an isolated scope, there are no private/public variables that are leaked into the window except for a handful, such as the ```Component``` Class which is submissive, allowing any 3rd party domainating library to have it's way. 2nd, namespaces categorize classes from collision and serves as aliases to the public Class. There are no compilers used to allocate namespaces, they are live and direct and runnable from the browser console.

```javascript
namespace `org.ui`
    class ToggleButton extends Component {

    }
);

//accessible at
org.ui.ToggleButton
```

In the event that Arcs ```Component``` class cannot be used because a 3rd party api is clobbering the global scope, you are free to leverage Arc's namespace to Component, ```core.ui.WebComponent```:
```javascript
namespace `org.ui`
    class ToggleButton extends core.ui.WebComponent {

    }
);
```


## Usage:

```new``` Constructor Usage:
```javascript
var toggle = new org.ui.ToggleButton;
document.body.appendChild(toggle)
```

```createElement``` Usage:
```javascript
var toggle = document.createElement("org-ui-toggle-button");
document.body.appendChild(toggle)
```

Declarative ```HTML``` Usage:
```html
<body>
    <org-ui-toggle-button></org-ui-toggle-button>
</body>
```

## HTML TagNames:
Tag names are auto-generated by Arc based on the components unique ```namespace```. The Web Component spec is respected, having at minimum 2 words separated by dashes but takes it a step further by guranteeing unique tagNames.

For fine-grained control over tagNames, simply implement ```is()```:
```javascript
namespace `org.ui`
    class ToggleButton extends Component {
        get is() {
            return "toggle-button"
        }
    }
);

//accessible at
org.ui.ToggleButton
```

And usable in ```HTML``` as:
```html
<body>
    <toggle-button></toggle-button>
</body>
```


# Inheritance
Arc leverages inheritance for codifying the semantic gnome within a family of Classes having taxonomic, prototypal similarities. The argument of "inheritance vs. composition" is one based on a lack of experience and wisdom of key differences, or blissful ignorance. While inheritance preserves lineage and traits of common ancestry within a family, composition is the structural coupling of concrete instances through assembly of objects taken from across family trees. In either case, there is code sharing, but this is a side effect of design, not the core purpose of "inheritance vs. composition", of which both ideologies are intrinsically established and used in the Arc Engine platform.

```javascript
namespace `demos.ui`
    class Button extends Component {
        constructor(){
            super();
        }
    }
);
```

```javascript
import 'demos.ui.Button';

namespace `demos.ui`
    class ToggleButton extends demos.ui.Button {
        constructor(){
            super();
        }
    }
);
```


# Traits
Share common traits & charastics across Class hierarchies.
```javascript
class Observer {}

class FileWriter {}

namespace `core.utilities` (
    class Logger extends Object.with(Observer, FileWriter) {
        //has features from Observer + FileWriter
    }
)
```


# Visual Inheritance
When components inherit from other components in Arc, the subclassed component will be identical to it's ancestor in terms of traits, behavior and *visual appearance*, a guarded trade secret in the Arc Engine. In the example that follows, ```SwitchButton``` will be an exact blueprint of ```ToggleButton``` so that if an instance of each,
Switch and Toggle were placed on the page, you would not be able to distinguish a visual or behavioural difference.

Arc's internal encrypted Helix Engine preserves the visual appearance up to the parent class and all of the ancestors of the parent in the prototype chain so that every sub-class down the chain will reflect the visual aspects of every one of its ancestors. A truely unprecedented framework characteristic not found anywhere else, in any other api or framework on earth, we stake the claim as a competetive advantage. 

Pay notice, that css/styling, scoping or 'BEM' rules is not imported anywhere. See the docs for details.

```javascript
namespace `demos.ui`
    class ToggleButton extends Component {
        
    }
);
```

```javascript
import 'demos.ui.ToggleButton';

namespace `demos.ui`
    class SwitchButton extends demos.ui.ToggleButton {
        
    }
);
```


# Components
Components in Arc are pre fabricated (prefabs) packages, where every component is packaged into it's own portable namespaced folder. Each folder holds 3 core assets per component:
- index.js
- index.css
- index.html

React crosses the spearation of concerns boundary and intertwines these into 1 file and not only the mixing of the triad but a defilement, where HTML is no longer interpretable by the DOM without a JSX compiler, CSS is bound to state and no longer CSS without Reacts compiler, and Javascript having a mixture of all and not really JavaScript without build tools and a reinvented Virtual DOM.

Instead of a reinvented 'Virtual DOM', Arc is close-to-the-metal, handing off all work to the native DOM, leveraging the full potential of the Browsers render engine. Speed, Performance and Lite weight. Arc allows a hybrid approach though, where these native technologies in the triad (html, css) can be left separate or inlined into the Components Class for lightening fast load & render times, or even automated to be stitched into a single compressed runtime.

See:
- [Defining Components](https://www.arc2d.com/resources/?path=docs/topics/DefineComponent)
- [Using Components](https://www.arc2d.com/resources/?path=docs/topics/ComponentUsage)
- [Component LifeCycle](https://www.arc2d.com/resources/?path=docs/topics/ComponentLifecycle)



# World Simulation
Arc is natively an event-driven architecture, the event loop. User interaction (clicks, taps) triggers event handler callbacks. But there is also a World environment that steps at 60fps using in a "game loop" for time-sensitive fixed updates, relevant to AI, Physics, 2D and 3D simulations. Similar to Unity, Arc's input-update-render game loop is implemented using:
- ```onUpdate``` - running once per frame for input, state changes
- ```onFixedUpdate``` - running multiple times at a fixed delta per frame for collisions, ai
- ```onDraw``` - running once per frame for painting

```javascript
import '@domain.models.Clock';

namespace `ui.components` (
    class AnalogClock extends Component {
        constructor(){
            super();
            this.model = new domain.models.Clock; //a model of clock
        }

        onFixedUpdate (time) {}

        onUpdate(timestamp, delta){
            this.model.onUpdate();
        }

        onDraw(interpolation){
            this.hour.style.transform   = `rotate(${this.model.hour}deg)`;
            this.minute.style.transform = `rotate(${this.model.minutes}deg)`;
            this.second.style.transform = `rotate(${this.model.seconds}deg)`;
        }
    }
);



//The application (World)
import 'ui.components.AnalogClock';

namespace `ui.worlds` (
    class ClockApp extends World {
        async onConnected(){
            await super.onConnected();
            this.clock = this.querySelector("ui-components-analog-clock")
        }
        onUpdate =(timestamp, delta)=> {
            this.clock.onUpdate()
        }

        onFixedUpdate =(time)=> {
            this.clock.onFixedUpdate()
        }

        onDraw =(interpolation)=> {
            this.clock.onDraw()
        }
    }
);
```

```html

<!-- html shell page, "clock.html" -->
<!DOCTYPE html>
<html lang="en">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <title>Arc Engine : Analog Clock @60fps</title>
        <script src="https://cdn.jsdelivr.net/gh/nashorn/od-cocoon@latest/framework.min.js" charset="utf-8"></script>
    </head>

    <body namespace="ui.worlds.ClockApp">
        <ui-worlds-clock-app></ui-worlds-clock-app>
    </body>
</html>
```


## At 12kb