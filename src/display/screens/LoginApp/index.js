


namespace `display.screens`(
	class LoginApp extends Application {
	    constructor(element){
	        super(element);
	    }

	    async onConnected() {
            await wait(100);
            await this.render();
            firebase.initializeApp(Config.FIREBASE)
            firebase.auth().onAuthStateChanged(
                this.onAuthenticated, 
                this.onAuthenticationError
            );
        }

	    onLogOut(){
	    	firebase.auth().signOut().then(function() {
			  alert("signed out");
			  location.reload()
			}).catch(function(e) {
			  alert(e.message)
			});
	    }

	    onLogin(){
	    	var uiConfig = {
		        signInSuccessUrl: 'index.html',
		        signInOptions: [
		          // Leave the lines as is for the providers you want to offer your users.
		          firebase.auth.GoogleAuthProvider.PROVIDER_ID,
		          firebase.auth.FacebookAuthProvider.PROVIDER_ID,
		          firebase.auth.TwitterAuthProvider.PROVIDER_ID,
		          firebase.auth.GithubAuthProvider.PROVIDER_ID,
		          firebase.auth.EmailAuthProvider.PROVIDER_ID,
		          firebase.auth.PhoneAuthProvider.PROVIDER_ID,
		          firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
		        ],
		        // tosUrl and privacyPolicyUrl accept either url string or a callback
		        // function.
		        // Terms of service url/callback.
		        tosUrl: '<your-tos-url>',
		        // Privacy policy url/callback.
		        privacyPolicyUrl: function() {
		          window.location.assign('<your-privacy-policy-url>');
		        }
		      };

		      // Initialize the FirebaseUI Widget using Firebase.
		      var ui = new firebaseui.auth.AuthUI(firebase.auth());
		      
		      // The start method will wait until the DOM is loaded.
		      ui.start('#firebaseui-auth-container', uiConfig);
	    }


	    onAuthenticated=(user)=>{
			// this.initializeChildComponents()
			if(user){location.href="oauth-demo.html"}
			else { this.onLogin()}
		}

		onAuthenticationError=(error)=>{
            console.log("oauth error", error)
        }
	}
);
