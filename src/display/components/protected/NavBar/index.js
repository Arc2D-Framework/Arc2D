
namespace `display.components.protected` (
    class NavBar extends core.ui.ProtectedChildComponent {
        constructor(){
            super();
            this.addEventListener("click", e => application.logout(e), false, "#logout");
            // this.bind("#login", "click", e => this.onRequestLogin(e), false)
        }

        async onConnected(){
            await super.onConnected();
        }

        onLoadInstanceStylesheet(){return true}

        onRequestLogin(){
            application.login()
        }
    }
);