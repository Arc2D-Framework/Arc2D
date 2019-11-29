
namespace `w3c.ui` (
    class ProtectedComponent extends w3c.ui.WebComponent {
        constructor(el){
            super(el);
        }

        static define(proto, bool){
        	if(!bool){return}
            super.define(proto);      
        }
    }
);