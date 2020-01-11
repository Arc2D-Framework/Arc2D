
namespace `applications` (
	@cascade(true);
    class FirebaseProtected extends w3c.ui.Application {
        constructor(element){
            super(element);
            
        }

	    onConnected() {
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
              
              
	        this.initApp()
	    }


	    onAuthenticated(){
		
		}

		onLoggedOut(){
			alert("Logged Out: Implement onLoggedOut() at app level to do something")
		}


		logout(){
			firebase.auth().signOut().then(_=> {
			  this.onLoggedOut()
			}).catch(e => console.error(e));
		}


	    initApp() {
	        firebase.auth().onAuthStateChanged(user => {
	          if (user) {
	          	this.onAuthenticated(user);
	          } else {
	            this.onAuthenticated(null)
	          }
	        }, function(error) {
	          console.log(error);
	        });
	    }
	}
);
