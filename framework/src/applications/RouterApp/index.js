import '/framework/src/core/http/Router.js'
import '/src/activities/LoaderActivity/index.js';
import '/src/activities/ContactActivity/index.js';

namespace `applications` (
    @stylesheets(["/src/./index.css"]);
    class RouterApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }
        
        onConnected() {
            this.render();
            this.router = new core.http.Router(this,window);// <-- onConnected, best place
        }

        onDisplayActivity(c){
            var slot = this.querySelector('slot[name="main"]');
            slot.innerHTML="";
            slot.appendChild(c);
        }

        onExitCurrentActivity(c){
            console.log("activity unloading", c)
        }

        onResumeActivity(c){
            console.log("resuming activity from memory unloading", c)
        }

        onLoadingActivity(c){
            application.dispatchEvent("showsplash")
            console.log("new activity loading first time assets", c)
        }
    }
);
