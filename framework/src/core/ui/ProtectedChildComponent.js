import '/src/core/ui/ChildComponent.js';

namespace `core.ui` (
    class ProtectedChildComponent extends core.ui.ChildComponent {
        onPreConnected(){
            application.onAuthStateChanged(user => {
              if (user) {
                this.onConnected(user);
                this.classList.add("authenticated")
              }
            })
        }
    }
);



