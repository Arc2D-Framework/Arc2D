import '/src/applications/FirebaseProtected/index.js';
import '/src/core/ui/TestProtected/index.js';

namespace `applications`(
	class LoginApp extends applications.FirebaseProtected {
	    constructor(element){
	        super(element);
	    }


	    onAuthenticated(){
			// this.initializeChildComponents()
			location.href="index.html"
		}
	}
);
