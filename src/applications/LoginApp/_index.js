
namespace `applications`(
	class LoginApp extends w3c.ui.Application {
	    constructor(element){
	        super(element);
	        window.auth0 = null;
	        this.start();
	        // window.requireAuth = this.requireAuth;
	        

	        
	        // const isAuthenticated = (async ()=> await window.auth0.isAuthenticated())();
	    }

	    updateUI(){
	    	alert("updateUI() called")
	    }

	    async start(){
	    	debugger;
	    	await this.configureClient();
	    	const isAuthenticated = await window.auth0.isAuthenticated();

	    	if (isAuthenticated) {
	    		debugger;
			    console.log("> User is authenticated");
			    // window.history.replaceState({}, document.title, window.location.pathname);
			    this.updateUI();
			}

			console.log("> User not authenticated");
			debugger;
			const query = window.location.search;
			const shouldParseResult = query.includes("code=") && query.includes("state=");

			if (shouldParseResult) {
				console.log("> Parsing redirect");
				try {
				  const result = await window.auth0.handleRedirectCallback();

				  // if (result.appState && result.appState.targetUrl) {
				  //   showContentFromUrl(result.appState.targetUrl);
				  // }

				  console.log("Logged in!");
				} catch (err) {
				  console.log("Error parsing redirect:", err);
				}

				// window.history.replaceState({}, document.title, "/");
			}
			this.updateUI();
	    }



	 //    async requireAuth (fn, targetUrl) {
		//   debugger;
		//   const isAuthenticated = await window.auth0.isAuthenticated();

		//   if (isAuthenticated) {
		//     return fn();
		//   }

		//   return this.login(targetUrl);
		// }

	    fetchAuthConfig () {return fetch("/auth_config.json")}

	    async configureClient() {
		  const response = await this.fetchAuthConfig();
		  const config = await response.json();

		  window.auth0 = await createAuth0Client({
		    domain: config.domain,
		    client_id: config.clientId
		  });
		}

	    async login(targetUrl) {
		  debugger;
		  try {
		    console.log("Logging in", targetUrl);

		    const options = {
		      redirect_uri: window.location.origin
		    };

		    if (targetUrl) {
		      options.appState = { targetUrl };
		    }

		    await window.auth0.loginWithRedirect(options);
		  } catch (err) {
		    console.error("Log in failed", err);
		  }
		}

		onLogin(){
			this.login(window.location.origin)
		}

	    template(){
	        return null
	    }

	    onEnableShadow(){
	        return false
	    }

	    onConnected() {
	        this.render();
	        this.bind("#login-btn", "click", (e)=> this.onLogin(), false)
	    }
	}
)
