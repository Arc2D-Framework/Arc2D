namespace `system.http` (
    class QueryRouter {
        constructor(app,hostWindow){
            this.activities = {};
            this.preloaded={};
        	this.window = hostWindow;
        	this.application = app;
            window.history.replaceState({}, null, "");
            this.replaceHashes();
            window.addEventListener('popstate', e=>this.onPopState(e), false);
            this.load();
        }

        async load(){
            if(location.search){
                // const hrefUrl = e.target.getAttribute('href');
                var qs = new URLSearchParams(location.search);
                var path = qs.get("path");
                var hash = location.hash||"";
                    hash = hash.replace("#","");
                var ns   = path.split("#")[0].replace(/\//g,".");
                if(!ns){return}
                window.history.pushState({ns}, document.title, location.href);

             


                if(!NSRegistry[ns]){
                    this.application.onLoadingActivity(ns);
                    await new system.http.ClassLoader().import(ns)
                }
                this.onActivityLoaded(ns,NSRegistry[ns],hash);
            }
        }

        async replaceHashes(el){
            await wait(1000);
            el=el||document;
            var links = el.querySelectorAll("a[href]");
            links.forEach(link => {
                var href = link.getAttribute("href");
                if(/^\#/.test(href)){
                    var urlparts = href.split("?");
                    href = urlparts[0];
                    var q = urlparts[1];
                    var qs = new URLSearchParams("?"+q);
                    // var query = urlparts[1]?`&${urlparts[1]}`:"";
                    var hash = qs.get("anchor")?`#${qs.get("anchor")}`:""; //urlparts[1]?`#${urlparts[1]}`:"";
                    href = href.replace("#","");
                    href = href.replace(/\./g,"/");
                    link.setAttribute("href",location.pathname+"?path="+href+hash);
                    link.addEventListener("click", e=> this.onClick(e), true);
                }
            })
        }

        async onClick(e){
            e.preventDefault();
            const hrefUrl = e.target.getAttribute('href');
            var urlparts = hrefUrl.split("?");
            var qs   = new URLSearchParams("?"+urlparts[1]);
            var path = qs.get("path");
            var hash = path.split("#")[1]||"";
            var ns   = path.split("#")[0].replace(/\//g,".");
            if(!ns){return}
            window.history.pushState({ns}, document.title, hrefUrl);
            if(!NSRegistry[ns]){
                this.application.onLoadingActivity(ns);
                await new system.http.ClassLoader().import(ns)
            }
            this.onActivityLoaded(ns,NSRegistry[ns],hash);
        }

        async onPopState(e){
            console.log(e);
            if(e.state && e.state.ns){
                var ns = e.state.ns;
                var qs = new URLSearchParams("?"+location.href.split("?")[1]);
                var path = qs.get("path");
                var hash = path.split("#")[1]||"";
                if(!NSRegistry[ns]){
                    this.application.onLoadingActivity(ns);
                    await new system.http.ClassLoader().import(ns)
                }
                this.onActivityLoaded(ns,NSRegistry[ns],hash);
            }
        }

        preload(){
            var c = new system.http.ClassLoader;
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(e =>{
                    var preloadables = this.application.onRequestPreloadable();
                        preloadables.forEach(async ns=>{
                            ns = ns.replace(/\//g,".");
                            ns = ns.replace(/\#/g,"");
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

        // async onHashChange (e){
        //     var ns = this.window.location.hash.split("#")[1];
        //     if(!ns){return}
        //     var scrollTo = ns.split("/");
        //     ns=scrollTo[0];
        //     scrollTo = scrollTo[1];

        //     if(!NSRegistry[ns]){
        //         this.application.onLoadingActivity(ns);
        //         await new system.http.ClassLoader().import(ns)
        //     }
        //     this.onActivityLoaded(ns,NSRegistry[ns],scrollTo);
        // }

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
            this.application.onEnterActivity(c,scrollTo,this);
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