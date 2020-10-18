import! 'display.components.protected.ChildComponent';

namespace `display.components.protected` (
    class ProtectedChildComponent extends display.components.protected.ChildComponent {
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



