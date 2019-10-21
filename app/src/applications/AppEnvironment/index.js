import '/node_modules/od-cookies/cookie.js';
import '/node_modules/od-interceptor/index.js';
import '/node_modules/od-storagemanager/storagemanager.js';


namespace `applications` (
    class AppEnvironment extends w3c.ui.Application{
        constructor(){
            super();
            // window.application  = this;
            // this.head           = document.getElementsByTagName("head")[0];
            // this.configscript   = document.querySelector("script[id='config']")||
            //                       document.querySelector("script");

            // window.addEventListener("popstate", function(){
            //     console.log("back:",window.location.hash)
            // }, false);

            // window.addEventListener("hashchange", function(){
            //     alert("hash: " + window.location.hash)
            // }, false);
            
            // core.data.StorageManager.initialize(Config.StorageManager.STORE_KEY);
            // Session.StorageManager = core.data.StorageManager;

            // this.session = new core.controllers.StorageController;

            // Session.user = {};//this.session.get("user");
            // Session.State.currentLanguage = {};//this.session.get("currentLanguage");
            // Cookies.remove('sessionId');


            // this.mainFrame = this.getMainFrame();
            // this.mainFrame.addEventListener("load", this.onMainFrameLoaded.bind(this), false);

            // // debugger;

            // var url = window.getParameterByName("apppath"); 
            //     url = (url)?url:Config.Applications.MAIN;
                
            // var showLogin = (typeof Config.ENABLE_LOGIN == "boolean") ?
            //     Config.ENABLE_LOGIN:true;
            // var showSplash = (typeof Config.ENABLE_SPLASH == "boolean") ?
            //     Config.ENABLE_SPLASH:true;
            // var persistSession = (typeof Config.PERSIST_SESSION == "boolean") ?
            //     Config.PERSIST_SESSION:true;

            
            // if(showLogin) {
            //     if(!this.isUserSessionValid() || !persistSession){
            //         if(showSplash) {
            //             //redirects to login
            //             this.loadPage(Config.Applications.SPLASH);
            //         } else {
            //             this.loadPage(Config.Applications.LOGIN);
            //         }
            //     } else {
            //         this.loadPage(url)
            //     }
            // } else {

            //     // this.setDefaultSession(); //bypass login step
            //     this.loadPage(url);
            // }
        }

        onEnableShadow(){
            return false
        }

        onConnected() {
            this.render();
            Session.user = {};//this.session.get("user");
            Session.State.currentLanguage = {};//this.session.get("currentLanguage");
            Cookies.remove('sessionId');


            this.mainFrame = this.getMainFrame();
            this.mainFrame.addEventListener("load", this.onMainFrameLoaded.bind(this), false);

            // debugger;

            var url = window.getParameterByName("apppath"); 
                url = (url)?url:Config.Applications.MAIN;
                
            var showLogin = (typeof Config.ENABLE_LOGIN == "boolean") ?
                Config.ENABLE_LOGIN:true;
            var showSplash = (typeof Config.ENABLE_SPLASH == "boolean") ?
                Config.ENABLE_SPLASH:true;
            var persistSession = (typeof Config.PERSIST_SESSION == "boolean") ?
                Config.PERSIST_SESSION:true;

            
            if(showLogin) {
                if(!this.isUserSessionValid() || !persistSession){
                    if(showSplash) {
                        //redirects to login
                        this.loadPage(Config.Applications.SPLASH);
                    } else {
                        this.loadPage(Config.Applications.LOGIN);
                    }
                } else {
                    this.loadPage(url)
                }
            } else {

                // this.setDefaultSession(); //bypass login step
                this.loadPage(url);
            }
        }

        setDefaultSession (){
            var a = new core.controllers.AccountDataController;//TODO: replace AccountDataController with new Accounts collection
            var user = a.getUserByRole(Config.DEFAULT_ROLE);
            Session.user = user;
            Session.State.currentLanguage = Config.DEFAULT_LANG;//Constants.Languages.EN_US;
            if(Config.PERSIST_SESSION){
                this.session.set("currentLanguage", Session.State.currentLanguage);
                this.session.set("user", Session.user);
            }
        }

        isUserSessionValid(){
            return true;
        }

        onMainFrameLoaded (e){
            var self=this;
            var win = self.getMainFrame().contentWindow;
            // console.log("win",win)
            // Session.Application = win;
            // Session.Interceptor.setTargetWindow(win);
            // Session.Interceptor.interceptClicks();
            console.log("Loaded Application: " + win.location.href)
            win.addEventListener("message", self.onPostMessageReceived.bind(self), false);

            window.addEventListener("popstate", function(){
                console.log("back:",window.location.hash)
            }, false);

            window.addEventListener("hashchange", function(){
                alert("hash: " + window.location.hash)
            }, false);
        }

        onPostMessageReceived(){

        }

        getMainFrame(){
            if(Config.ALLOW_RUN_FROM_DISK) {
                return this.querySelector("#mainFrame");
            } else {
                return window;
            }
        }

        loadPage  (page){
            var self = this;
            page = this.evalUrl(page);
            if(Config.ALLOW_RUN_FROM_DISK) {
                document.getElementById("mainFrame").src = page; 
            } else {
                location.href = page;
            }
        }

        evalUrl (page){
            page = page.replace(/\{([a-zA-Z0-9\.\_\-]+)\}/gim, function(){
                return eval(arguments[1]);
            });
            return page;
        }
    }
);

