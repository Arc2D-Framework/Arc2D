
namespace `applications` (
    class ProtectedApplication extends w3c.ui.Application {
        constructor(element){
            super(element);
            this.AUTH0_CLIENT_ID='zzT01V0gz3C7B3wsJLnJ4Mr1HNX7IePi'; 
			this.AUTH0_DOMAIN='jsmith.auth0.com';
			this.AUTH0_CALLBACK_URL=location.href;
        }

        inShadow(){
            return false
        }

        logout(){
        	localStorage.setItem("accessToken","")
        	this.lock.logout({
              returnTo: 'http://localhost:3000'
            });
        }

        login(){
        	self.lock.show();
        }

        onConnected() {
        	var self=this;

            var options = {
			  auth: {
			   params: {
			    param1: "value1",
			    scope: "openid profile email"
			   },
			   rememberLastLogin:true,
			   autoParseHash: true,
			   redirect: true,
			   redirectUrl: "http://localhost:3000/index.html",
			   responseType: "token",
			   sso: true
			  }
			};

            this.lock = new Auth0Lock(this.AUTH0_CLIENT_ID, this.AUTH0_DOMAIN, options);
		  	window.lock = this.lock;

		  	try{
	  			self.lock.getUserInfo(localStorage.getItem("accessToken"), (error, profile) => {
				  if (!error) {
				    console.log(profile.nickname);
				    self.lock.hide();
				    application.dispatchEvent("loggedin",profile)
				  } else {
				  	// alert("asd")
				  	// self.lock.show();
				  	// application.dispatchEvent("loggedout")
				  }
				});

			} catch(e){
				// application.dispatchEvent("loggedout")
				console.log(e)
				// self.lock.show();
				
			}


			//fires on first login instance
		  	this.lock.on("authenticated", function(authResult) {
		  		// alert("asdadadadasd")
		  		if(authResult){
		  			
		  			// setSession(authResult);
				    self.lock.getProfile(authResult.accessToken, function(error, profile) {
				        if (error) {
				            alert("Unable to authenticate!");
				            return;
				        }
				        localStorage.setItem("accessToken", authResult.accessToken);
    					localStorage.setItem("profile", JSON.stringify(profile));
				        // Display user information
				        self.show_profile_info(profile);
				        application.dispatchEvent("loggedin",profile)
				        // enable api button
				        // $('.btn-api').removeAttr("disabled").text("Press me, I'm authenticated!");
				    });
				} else {
					alert("no authResult")
				}
			 });

		  	this.lock.on('authorization_error', function (err) {
			    console.log(err);
			    alert('Error: ' + err.error + '. Check the console for further details.');
			    // displayButtons();
			});
		  	
        }

        show_profile_info(profile){
        	console.log("profile",profile)
        }

        onRequestLogin(e){
        	e.preventDefault();
    		this.lock.show();
        }
    }
);
