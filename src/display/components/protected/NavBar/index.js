import! 'display.components.protected.ProtectedChildComponent';


namespace `display.components.protected` (
    class NavBar extends display.components.protected.ProtectedChildComponent {
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