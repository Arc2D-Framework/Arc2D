
namespace `w3c.ui` (
	class UnknownApplication extends w3c.ui.Application {
	    constructor(el) {
	        super(el);
	        this.element=el;
	        this.initializeUnknownChildComponents();
	    }

	    initializeUnknownChildComponents(){
	    	var el = this.element;
            var self=this;
            var nodes = Array.from(el.querySelectorAll("*"));
                nodes = nodes.filter(n => n.localName.indexOf("-")>=0);

                nodes.forEach(n => {
                    if(n && n.nodeType == 1) { 
                        var tag = n.tagName.toLowerCase();
                        debugger;
                        var c = window.registered_tags[tag];
                        if(!c) {
                        	var className = tag
                        		.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); })
								.replace(/^\w/, function (chr) {return chr.toUpperCase() });

                        	var filename_path = (
					          Config.SRC_PATH + "core/ui/" + className  + "/" + Config.FILENAME
					        );
					        var path = filename_path.replace("*", Config.USE_COMPRESSED_BUILD ? "min.":"");
					        var cloader = new core.http.ClassLoader;
						        cloader.load("", Config.ROOTPATH + path, data => {});
                        }
                        else {c && c.define(c.prototype,true);}
                    }
                })
	    }
	}
);
