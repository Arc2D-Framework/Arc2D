
import 'w3c.ui.WebComponent';

namespace `w3c.ui` (
	class Application extends w3c.ui.WebComponent {
	    constructor(el) {
	        super(el);
	        window.application = this;
	        //TODO: do we even need this? can cut down time during load.
	        this.head           = document.getElementsByTagName("head")[0];
	        this.configscript   = document.querySelector("script[id='config']")||
	                              document.querySelector("script");
	    }

	    //TODO: why do we have this override which just calls parent?
	    //It's not overriding anything then.(?) check bool=true.
	    static define(proto, bool=true){
            super.define(proto,bool);      
        }
	}
);
