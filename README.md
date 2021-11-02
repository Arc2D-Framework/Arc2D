# Description
The Arc Engine is a W3C-compliant, ES6/7 Component Framework (not an api) used
for building enterprise grade applications and ui controls. It adheres to the 
WebComponent Specification for crafting Autonomouse Reactive Components (Arc)
in pure, vanilla JavaScript, HTML5 and CSS3.


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
1st, Arc runs in an isolated scope, there are no private/public variables that are leaked into the window except for a handful, like ```Component``` which is submissive, allowing any 3rd party domainating library to have it's way. 2nd, namespaces categorize classes from collision and serves as aliases to the Class. There are no compilers used to allocate namespaces, they are live and direct and runnable from the browser console.

```javascript
namespace `org.ui`
    class ToggleButton extends Component {

    }
);
```

In the event that Arcs ```Component``` class cannot be used because a 3rd party api is clobbering the global scope, you are free to leverage Arc's namespace to ```Component```:
```javascript
namespace `org.ui`
    class ToggleButton extends core.ui.Component {

    }
);
```
\
\
*There are several ways to use an Autonomous component*

Constructor Usage:
```javascript
var toggle = new org.ui.ToggleButton;
```
createElement Usage:
```javascript
var toggle = document.createElement("org-ui-toggle-button");
```
Declarative HTML Usage:
```html
<org-ui-toggle-button></org-ui-toggle-button>
```


Readme Still In Progress....Check back soon