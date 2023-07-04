namespace `system.http` (
    class Router {
        constructor(app,hostWindow){
            this.activities = {};
            this.preloaded={};
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

        preload(){
            var c = new system.http.ClassLoader;
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(e =>{
                    var preloadables = this.application.onRequestPreloadable();
                        preloadables.forEach(async ns=>{
                            ns = ns.split("#")[1];
                            ns = ns.split("/")[0];
                            if(NSRegistry[ns]){return}
                            if(!this.preloaded[ns]) {
                                try{
                                    var script = await c.import(ns);
                                    if(script){
                                        var cls = NSRegistry[ns];
                                        cls&&cls.preload();
                                        this.preloaded[ns]=cls;
                                        // console.log("preloaded",ns)
                                    }
                                }catch(e){console.warn("Unable to preload: ", ns)}
                            }
                        })
                },{timeout: 1000})
            }
        }

        async onHashChange (e){
            var ns = this.window.location.hash.split("#")[1];
            if(!ns){return}
            var scrollTo = ns.split("?anchor=");
            ns=scrollTo[0];
            scrollTo = scrollTo[1];

            if(!NSRegistry[ns]){
                this.application.onLoadingActivity(ns);
                await new system.http.ClassLoader().import(ns)
            }
            this.onActivityLoaded(ns,NSRegistry[ns],scrollTo);
        }

        async onActivityLoaded(ns,_class,scrollTo){
            await wait(100);
            var a = this.application.onFindActivitySlot().querySelector(`*[namespace='${ns}']`);
            if(a){
                this.application.onEnterActivity(a,scrollTo);
                this.activities[ns]  =a;
                this.current_activity=a;
                return;
            }
            var c = this.activities[ns]||new _class;
            this.current_activity && this.application.onExitCurrentActivity(this.current_activity)
            this.application.onEnterActivity(c,scrollTo);
            this.activities[ns] = c;
            this.current_activity=c;
            this.preload();
        }

        destroy(activityInstance){
            this.activities = this.activities||{};
            delete this.activities[activityInstance.namespace];
        }
    }
);