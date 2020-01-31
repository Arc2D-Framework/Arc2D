import '/src/applications/FirebaseProtected/index.js';


namespace `applications`(
	@stylesheets(["src/./index.css"]);
	class LoginApp extends applications.FirebaseProtected {
	    constructor(element){
	        super(element);
	    }

	    onConnected(){
	    	this.render();
	  //   	this.bind("#login-btn","click", e =>this.onLogin(e), false);
			// this.bind("#logout-btn","click", e =>this.onLogOut(e), false);

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


	    onAuthenticated(user){
			// this.initializeChildComponents()
			if(user){location.href="index.html"}
				else { this.onLogin()}
		}
	}
);
