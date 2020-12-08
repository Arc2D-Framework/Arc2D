import '/src/core/ui/ChildComponent.js';

namespace `core.ui` (
    class ProtectedChildComponent extends core.ui.ChildComponent {
        async onConnected(){
            application.onAuthStateChanged(async user => {
              if (user) {
                await super.onConnected(user);
                this.classList.add("authenticated")
              }
            })
        }

        onLoadInstanceStylesheet(){return false}
    }
);



