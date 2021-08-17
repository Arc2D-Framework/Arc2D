import '@ui.components.protected.ChildComponent';

namespace `ui.components.protected` (
    class ProtectedChildComponent extends ui.components.protected.ChildComponent {
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



