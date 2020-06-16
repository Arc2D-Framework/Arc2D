namespace `docs.topics` (
	class PlopGenerator  extends docs.topics.Topic  {
		applyHighlighting(){
        	super.applyHighlighting();
            var code = Array.from(this.querySelectorAll(".inline.javascript.lang"));
            code.forEach(block => hljs.highlightBlock(block))
        }
	}
)