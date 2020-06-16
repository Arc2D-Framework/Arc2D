
namespace `core.ui.protected` (
    class UserLoginBar extends core.ui.ProtectedChildComponent {
        constructor(){
            super();
            this.addEventListener("click", e => application.logout(e), false, "#logout");
            // this.bind("#login", "click", e => this.onRequestLogin(e), false)
        }

        async onConnected(user){//protected components get user session when connected to DOM
            await this.render(user)//renders template
            console.log("USER", user);
        }

        onRequestLogin(){
            application.login()
        }
    }
);