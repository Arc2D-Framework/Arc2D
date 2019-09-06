
@tag("application-view");
namespace("applications.Login", class extends w3c.ui.Application {
    constructor(element){
        super(element);
        window.auth0 = null;
        this.configureClient();

        window.requireAuth = this.requireAuth;
        // const isAuthenticated = (async ()=> await window.auth0.isAuthenticated())();
    }



    async requireAuth (fn, targetUrl) {
	  debugger;
	  const isAuthenticated = await this.auth0.isAuthenticated();

	  if (isAuthenticated) {
	    return fn();
	  }

	  return this.login(targetUrl);
	}

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
})
