
namespace `core.http` (
    class Router {
        constructor(app,hostWindow){
        	this.window = hostWindow;
        	this.application = app;

            var hashchangeCb = this.application.onHashChange?
                this.application.onHashChange.bind(this.application):
                this.onHashChange.bind(this);

            // if(this.application.onHashChange){
            //     this.window.addEventListener("hashchange", (e)=> hashchangeCb(e), false)
            // } else {
            //     this.window.addEventListener("hashchange", (e)=> hashchangeCb(e), false)
            // }
            this.window.addEventListener("hashchange", (e)=> hashchangeCb(e), false)
            // this.window.addEventListener("popstate", function(e){
            //     console.log("pop state:",e)
            // }, false);

            // this.window.addEventListener("hashchange", function(){
            //     alert("hash: " + window.location.hash)
            // }, false);

            if(this.window.location.hash.length > 0){
            	// this.application.onHashChange()
                hashchangeCb()
            }
        }

        onHashChange (e){
            // alert("WOW WOW: " + window.location.hash)
            var ns = this.window.location.hash.split("#")[1];
            if(!NSRegistry[ns]){
                var filename_path = (
                    Config.SRC_PATH         + 
                    ns.replace(/\./g, "/")  + 
                    "/"                     + 
                    Config.FILENAME
                  );
                var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
                var cl = new core.http.ClassLoader;
                cl.load(ns, Config.ROOTPATH + path, data => this.onActivityLoaded(ns,NSRegistry[ns]));
            } else {    
                this.onActivityLoaded(ns,NSRegistry[ns])
            }
        }


        onActivityLoaded(ns,_class){
            this.activities = this.activities||{};
            // console.log("loaded: ", _class)
            var c = this.activities[ns]||new _class;
            
            this.application.onDisplayActivity(c);
            this.activities[ns] = c;
            // var slot = this.querySelector('div[slot="screen"]');
            // slot.innerHTML="";
            // slot.appendChild(c);
            // this.activities[ns] = c;

        }
    }
);