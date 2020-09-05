import '/src/core/ui/ChildComponent.js';

namespace `core.ui` (
    class ProtectedChildComponent extends core.ui.ChildComponent {
        async onConnected(){
            application.onAuthStateChanged(user => {
              if (user) {
                super.onConnected(user);
                this.classList.add("authenticated")
              }
            })
        }

        onLoadInstanceStylesheet(){return false}
    }
);



