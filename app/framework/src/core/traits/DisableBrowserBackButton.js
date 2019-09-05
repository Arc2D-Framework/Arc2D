/**
 * The DisableBrowserBackButton constructor runs during parent app initialize()
 * @example
 * var app = new apps.SearchResults;  // <-- all traits are initialized here as well
 * @return {core.ui.WebApplication}
 */
 DisableBrowserBackButton = {
    initialize : function(){
        this.parent();
        this.initializeURLHashing();
        window.onbeforeunload = function () {
           return "Exit? If you leave now, any unsaved data will be lost."
        }
    },
    
    initializeURLHashing : function(){
        var self=this;
        var defaultHashPath = app.constants.DEFAULT_HOME_APP;
        var h = window.location.hash;
        if(!h||(h && h.length <=0)){
            window.location.hash = "!";
            window.location.hash = defaultHashPath;
        }
        this.addEventListener("statechanged", function(){
            var currentHash = window.location.hash;
            if(!currentHash||(currentHash && currentHash.length <=0)){
                window.location.hash=defaultHashPath;
            }
        }, false);
    }
};