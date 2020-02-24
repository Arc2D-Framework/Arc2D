
namespace `core.ui.protected` (
    class UserLoginBar extends core.ui.ProtectedChildComponent {
        constructor(){
            super();
            this.bind("#logout", "click", e => application.logout(e), false)
            // this.bind("#login", "click", e => this.onRequestLogin(e), false)
        }

        onConnected(user){//protected components get user session when connected to DOM
            this.render(user)//renders template
        }

        onRequestLogin(){
            application.login()
        }
    }
);