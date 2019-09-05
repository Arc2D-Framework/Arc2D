/**
 * The UrlHashState constructor runs during parent app initialize().
 * It is triggered before the app is unloaded or when app is first loaded.
 * It detects any hash/fragments in the url and will auto-launch the
 * matching app with params.
 *
 * @example
 * A url like this, when pasted into the address bar and executed will trigger the UrlHashState
 * trait to spawn up a new instance of the app, apps/SearchResults and pass inthe keyword
 * params into the app.
 */

UrlHashState = {
    initialize : function(){
      var self=this;
       this.parent();
       //this.addEventListener('showdashboard', this.onReturnToDashboardHash.bind(this), false);
       this.addEventListener("appopened", this.onApplicationOpened2.bind(this), false);
       this.initializeURLHashing();
       window.onbeforeunload = function () {
           /*if(self.isLoggedIn) {
               return "Exit? If you leave now, any unsaved data will be lost."
           }
           else{
                
           }*/
       }
    },
    
    onApplicationOpened2 : function(e){
        window.location.hash = rison.encode(e.data);   
    },
    
    initializeURLHashing : function(){
        var self=this;
        var defaultHashPath = rison.encode({appref:app.constants.DEFAULT_HOME_APP});
        this.addEventListener("statechanged", function(){
            var currentHash = window.location.hash||"";
                currentHash = currentHash.replace("#","");
            var appinfo;

            if(currentHash.indexOf("?")==0){
              var json = self.QueryStringToJSON(currentHash.substr(1));
              var encodedVal = rison.encode(json);
              currentHash = encodedVal;
            }
            
            try {
              appinfo = rison.decode(decodeURIComponent(currentHash));
            } catch(e){
              if(!appinfo || !appinfo.appref){
                window.location.hash=defaultHashPath;
              }
            }

            if(appinfo && appinfo.appref && appinfo.appref.length>0){
              var ns = appinfo.appref.replace("/",".");
              var _app = self.currentRunningApplication;
              if(!_app || _app.namespace != ns){
                  self.dispatchEvent("openapp",true,true,appinfo)
              }
              else if(_app && _app.namespace == ns){
                    _app.onResume({data:appinfo})
                  //self.dispatchEvent("openapp",true,true,appinfo)
              }
            }
        }, false);

        // var h = window.location.hash;
        // if(!h||(h && h.length <=0)){
        //     window.location.hash = defaultHashPath;
        // }
    },


    QueryStringToJSON : function(qs) {
      qs = qs || location.search.slice(1);

      var pairs = qs.split('&');
      var result = {};
      pairs.forEach(function(pair) {
          var pair = pair.split('=');
          var key = pair[0];
          var value = decodeURIComponent(pair[1] || '');

            if( result[key] ) {
                if( Object.prototype.toString.call( result[key] ) === '[object Array]' ) {
                    result[key].push( value );
                } else {
                    result[key] = [ result[key], value ];
                }
            } else {
                result[key] = value;
            }
        });

        return JSON.parse(JSON.stringify(result));
    },
    
    
    onReturnToDashboardHash : function(e){
        var defaultHashPath = rison.encode({appref:app.constants.DEFAULT_HOME_APP});
        window.location.hash = defaultHashPath;
    } 
};
