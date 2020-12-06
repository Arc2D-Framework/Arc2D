namespace `system.http` (
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
            var nspath = ns.replace(/\./g, "/");

            if(!NSRegistry[ns]){
                this.application.onLoadingActivity &&
                this.application.onLoadingActivity(ns);
                var filename_path = `${Config.SRC_PATH}${nspath}/${Config.FILENAME}`;
                //TODO: add logic for debug path, see bootloader how it uses .src.js and .min.js
                var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
                var cl = new system.http.ClassLoader;
                cl.load(ns, Config.ROOTPATH + path, data => this.onActivityLoaded(ns,NSRegistry[ns],scrollTo));
            } else {    
                this.application.onResumeActivity && 
                this.application.onResumeActivity(NSRegistry[ns],scrollTo);
                this.onActivityLoaded(ns,NSRegistry[ns],scrollTo)
            }
        }

        destroy(activityInstance){
            this.activities = this.activities||{};
            delete this.activities[activityInstance.namespace];
        }

        onActivityLoaded(ns,_class,scrollTo){
            this.activities = this.activities||{};
            var c = this.activities[ns]||new _class;
            this.application.onExitCurrentActivity && 
            this.application.onExitCurrentActivity(this.current_activity)
            
            this.application.onEnterActivity && 
            this.application.onEnterActivity(c,scrollTo);

            this.activities[ns] = c;
            this.current_activity=c;
        }
    }
);