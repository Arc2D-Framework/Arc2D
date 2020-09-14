import 'docs.demos.sprites.GoblinEnemy';


namespace `docs.topics` (
    class ComponentUsage extends docs.topics.Topic {
        applyHighlighting(){
        	super.applyHighlighting();
            var code = Array.from(this.querySelectorAll(".inline.javascript.lang"));
            code.forEach(block => hljs.highlightBlock(block))
        }
    }
);
