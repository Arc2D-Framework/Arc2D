
namespace("applications.SplashScreen",
{
    '@inherits' : core.Application,
    '@cascade'  : true,
    '@stylesheets' : [ "src/./index.css"],
    // '@imports' : [
    //     "src/com/Dog.js"
    // ],

    initialize : function(){
        this.parent(arguments);
    },

    onRender : function(){
        
        var self=this;
        setTimeout(function(){
            alert("onRender called")
            self.querySelector("#splash-container").style.opacity = 0;
            var destLogin = Config.Applications.LOGINCONFIG?Config.Applications.LOGINCONFIG:Config.Applications.LOGIN;
            setTimeout(function(){
                location.href = Config.ROOTPATH + destLogin;
            }, 900)
        }, 900);
    }   
});

