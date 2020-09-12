import '/src/docs/topics/Topic.js';
// import 'docs.demos.sprites.VikingHero';
import '/src/docs/demos/sprites/GoblinEnemy/index.js';
// import 'docs.demos.ui.ToggleButton';

namespace `docs.topics` (
    class ComponentUsage extends docs.topics.Topic {
        applyHighlighting(){
        	super.applyHighlighting();
            var code = Array.from(this.querySelectorAll(".inline.javascript.lang"));
            code.forEach(block => hljs.highlightBlock(block))
        }
    }
);
