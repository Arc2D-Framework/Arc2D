/*
  This process intercepts click events on screen,
  prevents the default redirection of links and
  tries to find a suitable offline mapping for
  it in routes.js 
*/

namespace("core.processes.HrefInterceptor", {
  '@inherits' : core.processes.Activity,

 
  start : function(){
  	this.parent(arguments);
    document.body.addEventListener("click", this.onLinkClicked.bind(this), false);
  },


  onLinkClicked : function(e){
  	// alert(e)
        e.preventDefault();
        var aTag = core.ui.HtmlComponent.prototype.getRealTargetFromEvent(e, "a", "body");
        if(aTag) {
            var mapped_uri = core.utilities.URIHelpers.map(aTag.href);
            if(mapped_uri){
                var href = core.utilities.URIHelpers.eval(mapped_uri);
                if(href) { 
                    var qstring = aTag.href.split("?")[1];
                        qstring = qstring||"";
                    var url = href + ("?" + qstring);
                    this.track(url);
                    setTimeout(function() {
                        location.href = url;
                    },300)
                }
                else {

                }
            }
        }
    },

    track : function(data) {
        if(typeof data == "string"){
            var urlparts = data.split("/")
            // u[u.length-2]
            application.track({
                "Type": "event", 
                "Action": "click", 
                "Category": urlparts[urlparts.length-2], 
                "Label": data
            })
        }
        else if(typeof data == "object"){
            application.track(data)
        }
    }
});








