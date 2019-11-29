
import 'w3c.ui.WebComponent';

namespace `w3c.ui` (
	class Application extends w3c.ui.WebComponent {
	    constructor(element) {
	        super(element);
	        window.application = this;
	        this.head           = document.getElementsByTagName("head")[0];
	        this.configscript   = document.querySelector("script[id='config']")||
	                              document.querySelector("script");
	    }


	    static define(proto, bool=true){
            super.define(proto,bool);      
        }

	}
);
