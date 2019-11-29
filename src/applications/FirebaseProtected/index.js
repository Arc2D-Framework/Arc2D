
namespace `applications` (
	@cascade(true);
    class FirebaseProtected extends w3c.ui.Application {
        constructor(element){
            super(element);
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
        }

        onEnableShadow(){
	        return false
	    }

	    onConnected() {
	        this.render();
	        this.initApp()
	        // this.bind("#login-btn", "click", (e)=> this.onLogin(), false)
	        
			  // Initialize Firebase
			  // setTimeout(_=>window.firebase.initializeApp(firebaseConfig),2000)

			  this.bind("#login-btn","click", e =>this.onLogin(e), false);
			  this.bind("#logout-btn","click", e =>this.onLogOut(e), false);
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


	    onAuthenticated(){
		
		}


	    initApp() {
	    	var self=this;
	        firebase.auth().onAuthStateChanged(function(user) {
	          if (user) {
	          	self.onAuthenticated(user);
	            // User is signed in.
	            var displayName = user.displayName;
	            var email = user.email;
	            var emailVerified = user.emailVerified;
	            var photoURL = user.photoURL;
	            var uid = user.uid;
	            var phoneNumber = user.phoneNumber;
	            var providerData = user.providerData;
	            user.getIdToken().then(function(accessToken) {
	              document.getElementById('sign-in-status').textContent = 'Signed in';
	              document.getElementById('sign-in').textContent = 'Sign out';
	              document.getElementById('account-details').textContent = JSON.stringify({
	                displayName: displayName,
	                email: email,
	                emailVerified: emailVerified,
	                phoneNumber: phoneNumber,
	                photoURL: photoURL,
	                uid: uid,
	                accessToken: accessToken,
	                providerData: providerData
	              }, null, '  ');
	            });
	          } else {
	          	
	            // User is signed out.
	            // document.getElementById('sign-in-status').textContent = 'Signed out';
	            // document.getElementById('sign-in').textContent = 'Sign in';
	            // document.getElementById('account-details').textContent = 'null';
	            self.onLogin()
	          }
	        }, function(error) {
	          console.log(error);
	        });
	    };
	}
);
