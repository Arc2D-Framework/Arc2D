# Description
The Arc Engine is a W3C-compliant, ES6/7 Component Framework (not an api) used
for building enterprise grade applications and ui controls. It adheres to the 
WebComponent Specification for crafting Autonomouse Reactive Components (Arc)
in pure, vanilla JavaScript, HTML5 and CSS3.

- [Website](https://www.arc2d.com)
- [Documentation](https://www.arc2d.com/resources)
- [Demos - Sandbox In Progress]()
 

# Why
Arc differs significantly at both language and architectural aspects when compared to other frameworks
such as Angular, VUE, React and so on:
- No Compilers, Dependencies, Pre/Post Processing
- Class Driven Definitions
- Namespaces
- Inheritance For Semanantics
- Visual Inheritance
- Component Packages (prefabs)
- World Game Loop for 2/3D Simulation
- Composition & Nesting for Screen Assembly

## Class Driven Design
Instead of 'higher-order' functional programming concepts, as used in React, Arc
relies on 3rd generation class driven aspects of the latest ES6/7 language, keeping the affordance of powerful features found in modern Java/C++ and C#. In Arc, native classes are used to define Autonomous Reactive Components:

```javascript
class ToggleButton extends Component {

}
```


## Namespace
1st, Arc runs in an isolated scope, there are no private/public variables that are leaked into the window except for a handful, such as the ```Component``` Class which is submissive, allowing any 3rd party domainating library to have it's way. 2nd, namespaces categorize classes from collision and serves as aliases to the Class. There are no compilers used to allocate namespaces, they are live and direct and runnable from the browser console.

```javascript
namespace `org.ui`
    class ToggleButton extends Component {

    }
);
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
<org-ui-toggle-button></org-ui-toggle-button>
```


## Inheritance
Arc leverages inheritance for codifying the semantic gnome within a family of Classes having taxonomic, prototypal similarities. The argument of "inheritance vs. composition" is one based on a lack of experience and wisdom of key differences, or blissful ignorance. While inheritance preserves lineage and traits of the common ancestry within a family, composition is the act of producing new varities through assembly of objects taken from across family trees. In either case, there is code sharing, but this is a side effect of design, not the core argument of "inheritance vs. composition", of which both ideologies are intrinsically established and used in the Arc Engine platform.

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


## Traits
Share common traits & charastics across Class hierarchies.
```javascript
class Observer {

}

class IEventTarget {

}

namespace `core.utilities` (
    class Loggable extends Object.with(Observer, IEventTarget) {

    }
)
```