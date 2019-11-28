
namespace `core.ui` (
    @stylesheets(["/src/./index.css"]);
    class AuthoAvatar extends w3c.ui.WebComponent {
        constructor(){
            super();
            application.addEventListener("loggedin", e=> this.onLoggedIn(e),false)
            application.addEventListener("loggedout", e=> this.onLoggedOut(),false);
            this.bind("#logout", "click", e => this.onRequestLogout(e), false)
            this.bind("#login", "click", e => this.onRequestLogin(e), false)
        }

        onRequestLogin(){
            application.login()
        }

        onConnected (){
            this.render({});
        }

        onRequestLogout(){
            application.logout()
        }

        

        onEnableShadow() {
            return false
        }

        onLoggedIn(e){
            this.classList.add("loggedin")
            console.log("logged in",e);
            this.querySelector("#avatar-user").innerHTML = `Welcome back, ${e.data.nickname}`;
            this.querySelector("#avatar-img").src = e.data.picture
        }

        onLoggedOut(){
            this.classList.add("loggedout")
            alert("logged out")
        }
    }
);