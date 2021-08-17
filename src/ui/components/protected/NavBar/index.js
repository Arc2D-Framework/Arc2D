import '@ui.components.protected.ProtectedChildComponent';


namespace `ui.components.protected` (
    class NavBar extends ui.components.protected.ProtectedChildComponent {
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