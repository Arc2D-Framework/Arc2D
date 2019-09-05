
import 'src/core/controllers/AccountDataController.js';
import 'node_modules/od-cookies/cookie.js';
import 'src/core/ui/UserLoginDropdown/index.js';

namespace("applications.Login",
{
    '@inherits' : core.Application,
    '@cascade'  : true,
    '@stylesheets' : [ "src/./index.css"],
    '@traits':[
        // UrlHashState,
        core.traits.InitializeApplicationData
    ],
    '@imports' : [
        "src/core/ui/UserLoginDropdown/index.js",
        "src/core/ui/LanguageChooser.js"
    ],

    initialize : function () {
        this.onResetSession();
        this.dataController = new core.controllers.AccountDataController;
        this.addEventListener("onlogin", this.onLoginSuccessfull.bind(this), false);
        
        
        var adminLogin      = this.querySelector("#adminLogin");
        if(adminLogin){
            adminLogin.addEventListener("click", this.onAdminOptionSelected.bind(this), false);
        }
        
        this.configureLanguageSelector();
        this.configureLoginButton();
        this.configureRoleSelector();
        this.configureResetButton();
    },

    isLanguageSupported : function(){
        return true;
    },

    getLanguageChooserElement : function(){
        return this.querySelector("#langChooser");
    },

    getSelectedEmployee : function(useAdmin){
        var employee;

        
        if(useAdmin){
            employee = this.dataController.getUserByRole(Constants.ADMIN);
        }
        else if(this.accountsDropdown) {
            this.username   = this.querySelector("select#username_select");
            this.password = this.querySelector("input[type='password']");

            var password = this.password ?
                this.password.value:"";
            employee = this.dataController.getUserByAccount(
                this.username.value, password
            );
        } else {
            employee = this.dataController.getUserByRole(Config.DEFAULT_ROLE);
        }
        return employee;
    },

    getSelectedLanguage : function(){
        if(this.langChooser) {
            var lang = this.langChooser.value.replace("-","_");
            var currentLanguage = Constants.Languages[lang.toUpperCase()];
            return currentLanguage;
        } else {
            return Config.DEFAULT_LANG;
        }
    },

    getUserNameElement : function(){
        return this.querySelector("input[name='USER']");
    },

    getAppTitleElement : function(){
        return document.getElementById("portal.login.welcome");
    },

    getLoginButtonElement : function(){
        return this.querySelector("#logInButton");
    },

    configureRoleSelector : function(){
        this.accountsDropdown = new core.ui.UserLoginDropdown;
        var userInput = this.getUserNameElement();
        if(userInput) {
            userInput.parentNode.replaceChild(this.accountsDropdown.element, userInput);
        }
    },

    configureResetButton : function(){
        var  resetDemo      = document.getElementById("portal.login.resetHere"); 
        if(resetDemo) {
            resetDemo.addEventListener("click", this.onResetDemo.bind(this), false);
        }
    },

    configureLoginButton : function(){
        this.loginButton    = this.getLoginButtonElement();//this.querySelector("#logInButton");
        if(this.loginButton) {
            this.loginButton.addEventListener("click", this.onLogin.bind(this), false);
        }
    },

    configureLanguageSelector : function(){
        if(this.isLanguageSupported()) {
            this.langChooser = this.getLanguageChooserElement();
        }
    },

    onResetSession : function(){
        core.data.StorageManager.clean(true);
        this.session.set("user", null);
        localStorage.clear();
        Cookies.remove('sessionId');
        // Cookies.remove('deviceid');
    },


    // onTrackAnalyticsEvent : function(e){
    //     var trackingData = e.data;
    //     var o = Session.Analytics.Tracker.log(trackingData);
    //     if(o){
    //         console.warn("tracking data logged", o);
    //     }
    // },

    onLoginSuccessfull : function(e){
        var user = this.session.get("user");
        var account = new core.vo.Account(user);
        account.touch();
        window.postMessage({
            type:"redirect",
            url: Config.Applications.MAIN
        }, "*");
    },

    onLogin : function(e){
        e.preventDefault();
        var employee = this.getSelectedEmployee(this._admin_selected);
      
        if(employee) {
            var currentLanguage = this.getSelectedLanguage();
            this.session.set("currentLanguage", currentLanguage);
            this.session.set("user", employee);
            Session.user =  employee;
            Session.State.currentLanguage =  currentLanguage;
            this.dispatchEvent("onlogin",true,true, {});
        }
        else {
            console.info("No employee account found")
        }
    },
    
    onResetDemo : function(){
    	window.postMessage({
            type:"resetdemo"
        }, "*");
    },
    
    onAdminOptionSelected : function(e){
    	this._admin_selected = true;
        this.onLogin(e);
    },

    onRender : function(){
        var self=this;
        var titleEl = this.getAppTitleElement();
        if(titleEl) {
            titleEl.innerHTML = (Config.Application && Config.Application.NAME) ?
                Config.Application.NAME : 
                titleEl.innerHTML;
        }

        (function d(){
            self.element.style.opacity = 1;
        }).delay(200)
    },

    innerHTML:
    '<div>test</div>'
});
