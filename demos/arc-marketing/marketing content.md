# Arc Marketing Content

## Goal
- Market Arc to developers, AI crawlers, and LLMs as a serious standards-first web application framework.
- Show that Arc is native HTML, native CSS, and native JavaScript end to end.
- Show that Arc is LLM-ready because the runtime model is explicit, browser-native, readable, and scaffold-friendly.
- Avoid fake trust markers like testimonials or vendor logos until they are real.
- Replace social proof with architectural proof, code proof, benchmark proof, and AI-compatibility proof.

## Core Positioning
Arc is a standards-first web application framework built on native HTML, CSS, and JavaScript.

Supporting positioning lines:
- The browser is the runtime, not just the target.
- Build web apps with native HTML, CSS, and JavaScript.
- Native by design. Progressive by delivery. Fractal by architecture. Readable by humans and agents.
- Arc does not simulate the web platform. It uses it.

## The 3 Pillars

### 1. Native by Design
Arc keeps the browser's runtime model intact instead of layering on a virtual rendering system or a mandatory compile step.

Supporting ideas:
- Native HTML5
- Native CSS
- Native JavaScript
- Native DOM
- Native imports
- No virtual DOM
- No mandatory transpilation pipeline
- Support for autonomous custom elements
- Support for customized built-in elements
- Declarative shadow DOM support
- HTML-first authoring
- Pluggable template engine
- Browser-native stylesheet loading

### 2. One Model From Component to Application
A component and an application are part of the same architectural family. The same model can also extend into world/simulation-style experiences.

Supporting ideas:
- Fractal component-to-application architecture
- Application as a larger component
- Routing inside the same component worldview
- Component-level lazy activation
- Progressive feature delivery
- World extends Application
- Update, fixed-update, and draw lifecycle support for world-driven apps

### 3. Behavior and Skin, Inherited Together
Arc components can inherit both logic and visual identity through their ancestor chain. Styling becomes structural rather than naming-convention based.

Supporting ideas:
- Behavioral inheritance
- Deterministic skin inheritance through ancestry
- Typed component families
- Visual identity as part of inheritance
- No BEM-style naming dependency
- No utility-class sprawl requirement
- No duplicated CSS across obvious family variants
- Styling as architecture, not just naming

## Significant Architectural Strengths
Primary 13-feature list discussed for marketing, docs, and comparison material:

1. Native HTML, CSS, and JavaScript runtime
	Arc runs on the browser's real platform primitives instead of translating the app into a framework-specific runtime model.
2. No virtual DOM or mandatory compile pipeline
	Arc avoids an extra rendering abstraction and does not force a transpile-heavy workflow just to build normal applications.
3. Support for autonomous custom elements
	Arc can work with standards-based custom elements directly, which strengthens its native-web story.
4. Support for customized built-in elements
	Arc supports extending real built-in HTML elements, not only inventing entirely separate component tags.
5. Fractal component-to-application architecture
	A small component and a full application follow the same architectural family, which reduces conceptual switching as projects grow.
6. World/simulation model extending the application lifecycle
	Arc can extend past normal app screens into world-style experiences with update, fixed-update, and draw lifecycles.
7. Behavioral inheritance
	Components can inherit real behavior through ancestry, which makes component families more structural and less repetitive.
8. Deterministic skin/style inheritance through ancestry
	Visual identity can inherit with the component family itself, so styling follows structure rather than naming rituals.
9. Typed component families
	Arc encourages component families with explicit lineage, which helps both humans and tools reason about variants and responsibilities.
10. Progressive delivery through native imports and just-in-time CSS
	Arc can load capability progressively instead of front-loading the entire application upfront.
11. Declarative shadow DOM plus flexible template loading
	Arc supports modern browser-native composition patterns while keeping templating options open.
12. Pluggable template engine
	Arc is not locked to a single sacred rendering syntax, which keeps the system adaptable.
13. Component-level lazy connection and activation
	Arc can defer component work until it is actually needed, which supports more progressive application behavior.

Recommended shorter 11-feature version for tighter pages:
1. Native HTML, CSS, and JavaScript runtime
2. No virtual DOM or mandatory compile pipeline
3. Autonomous and customized built-in element support
4. Fractal component-to-application architecture
5. World lifecycle model extending the application lifecycle
6. Behavioral inheritance
7. Deterministic skin/style inheritance
8. Typed component families
9. Progressive delivery through native imports
10. Declarative shadow DOM and flexible template loading
11. Component-level lazy activation

Good feature -> consequence -> benefit framing:
- Native runtime -> less abstraction -> easier to reason about, easier for agents to follow
- Fractal architecture -> one model from component to app -> lower conceptual overhead
- Behavior plus skin inheritance -> fewer naming conventions -> stronger structural design systems
- Progressive delivery -> less up-front payload -> better control over application loading strategy
- Pluggable templates -> less framework lock-in -> more longevity and adaptability

Additional robust features worth mentioning in docs or technical sections:
- Shadow-aware selector traversal across nested shadow roots
- Replayable global event subscription model
- Route and activity lifecycle continuity
- Constructable stylesheet support with graceful fallback

## What Makes Arc LLM-Ready
- Native HTML, CSS, and JavaScript are easier for agents to reason about than framework-specific render layers.
- No JSX transform requirements.
- No TypeScript compile requirement.
- No virtual DOM abstraction layer to mentally reconstruct.
- Predictable component anatomy.
- Readable file structure.
- Templates, styles, and behavior are explicit.
- Components, screens, applications, and worlds all follow the same architectural logic.
- Prompt-to-app scaffolding can stay close to what the browser actually runs.

Good framing:
- Built for developers. Readable by agents. Native to the browser.
- Arc is easier for agents to reason about because its runtime model stays explicit and browser-native.
- Arc keeps components legible to both developers and tooling.

## Progressive Delivery / Native Import Story
Arc loads application capability progressively through native imports.

Good framing:
- Arc loads code progressively through native imports, so users do not have to pay for the entire app upfront.
- Components and styles can arrive when they are needed, not only in a large initial payload.
- Arc favors progressive delivery over monolithic front-loading.
- Arc treats the web app as progressively delivered capability, not a monolithic download.

Balanced caution:
- Good for reducing initial payload and preserving explicit dependency boundaries.
- Needs discipline around request waterfalls, deep dependency chains, and first-interaction latency.
- Should be framed as a strength with tradeoffs, not magic.

## Coding Style / Code-Behind Identity
- Class-oriented and explicit.
- Code-behind friendly while staying native underneath.
- Clear separation of markup, style, and behavior.
- Object-oriented without hiding the platform.
- Familiar component classes, native browser runtime.

Good phrasing:
- Arc offers a class-oriented, code-behind-friendly model while keeping HTML, CSS, and the DOM fully native.
- Its component model feels structured and explicit, but the runtime remains the browser itself.

## Visual Inheritance Messaging
Use careful but strong phrasing:
- Arc makes visual inheritance part of the component inheritance model itself.
- Arc components can inherit logic and visual identity together.
- Styling follows ancestry, not naming tricks.
- Typed component families with deterministic skin inheritance.
- Behavior and visual identity inherit together.
- Styling becomes part of the type system rather than a naming convention.

Avoid overclaiming:
- Do not say no other framework has this.
- Do say it is unusual, rare, or first-class among modern web frameworks.

## Landing Page Design Direction
Use a hybrid of:
- ShortStack for landing-page pacing, section rhythm, CTA hierarchy
- GitHub for technical credibility, discipline, restraint, and code-native visual cues

Design qualities:
- Technical, architectural, and browser-native
- Confident but not boastful
- More editorial and systems-oriented than generic SaaS
- Strong typography and spacing
- Code panels, diagrams, and structured cards
- Restrained palette with one strong accent and one warm accent
- Premium but not flashy

Visual tone:
- As structured as GitHub
- As paced as ShortStack
- More architectural than both

## Landing Page Structure
1. Nav
2. Hero
3. Proof strip
4. Three pillars
5. Fractal architecture diagram
6. Why Arc / supporting capabilities
7. Code at three scales
8. LLM-ready section
9. Benchmark comparison section
10. Starter apps / examples
11. Principle strip
12. Final CTA
13. Footer

## Section Concepts

### Hero
- Build web apps with native HTML, CSS, and JavaScript.
- Standards-first framework. No virtual DOM. No mandatory build step.
- Show a live code panel and rendered result side by side.

### Proof Strip
- Native HTML5
- Native CSS
- Native JavaScript
- No Virtual DOM
- No Build Required

### Three Pillars
- Native by Design
- One Model From Component to Application
- Behavior and Skin, Inherited Together

### LLM-Ready Section
Replace testimonials with proof:
- Why LLMs work well with Arc
- Prompt to app examples
- Machine-readable and scaffold-friendly structure
- Humans and agents can reason about the same files

### Benchmark Section
Use reproducible, scoped benchmarks only.
Suggested metrics:
- Initial payload
- First render
- 100 component mounts
- 100 row update
- Modal open/close interaction
- Time to first working scaffold

Benchmark section rules:
- Same feature
- Same browser
- Same hardware
- Same data size
- Same measurement method
- Link to benchmark source
- Avoid broad claims like fastest overall

### Starter App Section
Potential starter cards:
- Todo App
- CRUD App
- Dashboard
- Router Demo
- Design System Demo
- Modal/Form Demo
- PWA Starter

### Principle Strip
Replace testimonial area with a thesis:
- Arc keeps the browser as the runtime, not just the target.
- Works with the browser. Works with developers. Works with agents.

## Tone and Voice
Desired tone:
- Confident
- Specific
- Measured
- Senior-engineer voice
- More clarity than hype

Rules:
- Prefer concrete claims over absolute claims
- Use feature -> consequence -> benefit
- Say can when outcomes depend on implementation
- Emphasize tradeoffs honestly
- Let the architecture carry the strength

Preferred phrasing patterns:
- Arc is designed to...
- Arc keeps...
- Arc allows...
- Arc avoids...
- With Arc...

Avoid:
- revolutionary
- world's first
- the only
- destroys React
- future of web development

## Strong Copy Fragments
- Arc is a standards-first web application framework built on native HTML, CSS, and JavaScript.
- The browser is the runtime, not just the target.
- Arc does not simulate the web platform. It uses it.
- Native by design. Progressive by delivery. Fractal by architecture. Readable by humans and agents.
- Arc keeps the web stack native from authoring to runtime.
- Arc components can inherit both behavior and skin through their ancestor chain.
- Arc loads application capability progressively through native imports.
- Arc uses a pluggable template engine instead of hard-wiring the framework to a single rendering syntax.

## References and Inspiration
- ShortStack for page pacing and commercial section rhythm
- GitHub for tone, layout discipline, and technical trust

Do not copy their content model. Borrow only design traits.

## Build Notes
- Start with a real demo page under /demos.
- Keep the page runnable in the browser with Arc's normal bootstrapping pattern.
- Prefer code proof, architecture proof, and benchmark proof over social proof.
- Repeat the 3 pillar names consistently across the landing page, docs, README, and comparison pages.

## Immediate Next Steps
1. Build the landing page shell.
2. Turn the 3 pillars into first-class hero support sections.
3. Add a visual fractal diagram.
4. Add a code-and-render split hero panel.
5. Draft the LLM-ready and benchmark sections.
6. Add starter app cards.
7. Later, connect benchmark data and prompt-to-app examples.
