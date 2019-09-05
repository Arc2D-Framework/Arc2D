


namespace("applications.LoginOauth2", class extends core.Application {
    constructor(model,element){
        super(model,element);
        // Session.Interceptor.disable();
        this.webAuth = new auth0.WebAuth({
            domain: 'jsmith.auth0.com',
            clientID: 'zzT01V0gz3C7B3wsJLnJ4Mr1HNX7IePi',
            responseType: 'token id_token',
            scope: 'openid profile',
            redirectUri: location.href
        });

        this.loginBtn = this.querySelector('#btn-login');
        this.logoutBtn = this.querySelector('#btn-logout');
        this.loginStatus = this.querySelector('#status');
        this.loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.webAuth.authorize();
        });
        this.logoutBtn.addEventListener('click', (e) => this.logout(e), false);
        this.handleAuthentication()
    }

    onResetSession (){
      core.data.StorageManager.clean(true);
      this.session.set("user", null);
      localStorage.clear();
      Cookies.remove('sessionId');
      // Cookies.remove('deviceid');
    }


    setSession(authResult) {
        // Set the time that the access token will expire at
        var expiresAt = JSON.stringify(
          authResult.expiresIn * 1000 + new Date().getTime()
        );
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
    } 


    handleAuthentication() {
        this.webAuth.parseHash((err, authResult) =>{
          if (authResult && authResult.accessToken && authResult.idToken) {
            window.location.hash = '';
            this.setSession(authResult);
            // loginBtn.style.display = 'none';
            // homeView.style.display = 'inline-block';
          } else if (err) {
            // homeView.style.display = 'inline-block';
            console.log(err);
            alert(
              'Error: ' + err.error + '. Check the console for further details.'
            );
          }
          this.displayButtons();
        });
      }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }

    displayButtons() {
        if (this.isAuthenticated()) {
            this.loginBtn.style.display = 'none';
            this.logoutBtn.style.display = 'inline-block';
            this.loginStatus.innerHTML = 'You are logged in!';
            this.getProfile();
        } else {
            this.loginBtn.style.display = 'inline-block';
            this.logoutBtn.style.display = 'none';
            this.loginStatus.innerHTML =
            'You are not logged in! Please log in to continue.';
            this.webAuth.authorize();
        }
      }

    logout() {
        // Remove tokens and expiry time from localStorage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        this.session.set("user", null);
        this.session.set("currentLanguage", null);
        this.displayButtons();
    }



    getProfile() {
        var userProfile;
        if (!userProfile) {
          var accessToken = localStorage.getItem('access_token');
      
          if (!accessToken) {
            console.log('Access Token must exist to fetch profile');
          }
      
          this.webAuth.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
              userProfile = profile;
              this.session.set("user", userProfile);
              this.session.set("currentLanguage", userProfile.locale);
              setTimeout(()=> location.href = "http://localhost:3000",10);
              this.displayProfile(userProfile);
            }
          });
        } else {
            this.displayProfile(userProfile);
            setTimeout(()=> location.href = "http://localhost:3000",10);
        }
      }

      displayProfile(userProfile){
        console.log("userProfile:",JSON.stringify(userProfile, null, 2));
        this.loginStatus.innerHTML = "Welcome back: " + userProfile.nickname;
        this.loginStatus.style.backgroundImage = "url(" + userProfile.picture + ")"
      }
})