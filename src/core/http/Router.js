
namespace `core.http` (
    class Router {
        constructor(app,hostWindow){
        	this.window = hostWindow;
        	this.application = app;

            var hashchangeCb = this.application.onHashChange?
                this.application.onHashChange.bind(this.application):
                this.onHashChange.bind(this);

            this.window.addEventListener("hashchange", (e)=> hashchangeCb(e), false)
            if(this.window.location.hash.length > 0){
                hashchangeCb()
            }
        }

        onHashChange (e){
            var ns = this.window.location.hash.split("#")[1];
            var scrollTo = ns.split("/");
            ns=scrollTo[0];
            scrollTo = scrollTo[1];

            if(!NSRegistry[ns]){
                this.application.onLoadingActivity &&
                this.application.onLoadingActivity(ns);

                var filename_path = (
                    Config.SRC_PATH         + 
                    ns.replace(/\./g, "/")  + 
                    "/"                     + 
                    Config.FILENAME
                  );
                var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
                var cl = new core.http.ClassLoader;
                cl.load(ns, Config.ROOTPATH + path, data => this.onActivityLoaded(ns,NSRegistry[ns],scrollTo));
            } else {    
                this.application.onResumeActivity && 
                this.application.onResumeActivity(NSRegistry[ns],scrollTo);
                this.onActivityLoaded(ns,NSRegistry[ns],scrollTo)
            }
        }


        onActivityLoaded(ns,_class,scrollTo){
            this.activities = this.activities||{};
            var c = this.activities[ns]||new _class;
            if(this.current_activity){
                this.application.onExitCurrentActivity && 
                this.application.onExitCurrentActivity(this.current_activity)
            }
            this.application.onDisplayActivity(c,scrollTo);
            this.activities[ns] = c;
            this.current_activity=c;
        }
    }
);