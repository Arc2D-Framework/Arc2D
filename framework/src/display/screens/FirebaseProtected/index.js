
namespace `applications` (
	@cascade(true);
    class FirebaseProtected extends w3c.ui.Application {
        constructor(element){
            super(element);
            
        }

	    async onConnected() {
	        var firebaseConfig = {
                apiKey: "AIzaSyD3HTd7BH4DKkvOF2AitWyQsSWMSEPYT4Y",
                authDomain: "test-f6d84.firebaseapp.com",
                databaseURL: "https://test-f6d84.firebaseio.com",
                projectId: "test-f6d84",
                storageBucket: "test-f6d84.appspot.com",
                messagingSenderId: "507958760916",
                appId: "1:507958760916:web:0ba398f0785cf2f4017241"
              };
              firebase.initializeApp(firebaseConfig)
              
              
	        this.initApp();
            // await super.onConnected();
	    }

        initApp() {
            firebase.auth().onAuthStateChanged(
                user  => this.onAuthenticated(user||null), 
                error => console.log(error)
            );
        }

        onLoadInstanceStylesheet(){return false}


	    onAuthenticated(){
		
		}

		onLoggedOut(){}


		logout(){
			firebase.auth().signOut().
                then(_  => this.onLoggedOut()).
                catch(e => console.error(e));
		}
	}
);
