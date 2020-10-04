import 'display.components.Splash';
import 'display.components.protected.NavBar';

namespace `display.screens` (
    class OAuthDemo extends Application { 
        constructor(element){
            super(element);
        }

        async onConnected() {
            await wait(100);
            firebase.initializeApp(Config.FIREBASE)
            firebase.auth().onAuthStateChanged(
                this.onAuthenticated, 
                this.onAuthenticationError
            );
        }


        onAuthStateChanged(cb){
            firebase.auth().onAuthStateChanged(user => {
              if (user) { cb(user) } else { cb(null) }
            })
        }
        

        onLoggedOut(){ alert("Goodbye") }

        logout(){
            firebase.auth().signOut().then(e => this.onLoggedOut()).catch(e => console.error(e));
        }
        
        
        onAuthenticated= async (user)=>{
            if(!user){
                location.href = "login.html"
            } else {
                this.user=user;
                await this.render();
            }
        }

        onAuthenticationError=(error)=>{
            console.log("oauth error", error)
        }
    }
);
