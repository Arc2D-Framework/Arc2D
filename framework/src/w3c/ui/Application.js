import 'src/w3c/ui/WebComponent.js';

namespace `w3c.ui` (
	class Application extends w3c.ui.WebComponent {
	    constructor(el) {
	        super(el);
	        window.application = this;
	    }
	}
);
window.Application = window.Application||w3c.ui.Application;
