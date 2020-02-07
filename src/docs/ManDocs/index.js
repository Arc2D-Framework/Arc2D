import '/framework/src/core/http/Router.js'
import 'docs.topics.LoaderActivity';
import 'docs.components.TocMenu';
import 'docs.components.LanguageSelector';
import 'docs.topics.DocHome';

namespace `docs` (
    @stylesheets(["/src/./index.css"]);
    class ManDocs extends w3c.ui.Application {
        constructor(element){
            super(element);
            this.addEventListener("lang-selected", e => this.onLanguageChange(e));
        }

        onLanguageChange(e){
            this.current_language = e.data;
        }
    

        onConnected() {
            super.onConnected();
            this.router = new core.http.Router(this,window);// <-- onConnected, best place
        }

        onEnterActivity(c,scrollTo){
            console.log("onEnterActivity", c);
            var slot = this.querySelector('.content');
	            // slot.innerHTML="";
	            slot.appendChild(c);
            if(scrollTo){
                setTimeout(_=>{
                    var el = c.querySelector("#"+scrollTo);
                    el && el.scrollIntoView({behavior:"smooth",block:"start"})
                },100)
            }
            this.dispatchEvent("onactivityshown",c)
        }

        onExitCurrentActivity(c){
            console.log("onExitCurrentActivity", c);
            var slot = this.querySelector('.content');
                slot.innerHTML="";
        }

        onResumeActivity(c){
            console.log("onResumeActivity", c);
            this.dispatchEvent("topichanged",{});
        }

        onLoadingActivity(c){
            // application.dispatchEvent("showsplash")
            console.log("onLoadingActivity", c);
            this.dispatchEvent("topichanged",{});
        }
    }
);
