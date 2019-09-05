/*
  This process monitors the applications current
  documents <location.hash> state for changes. When it detects
  an activity namespace appended, it downloads, initializes
  and inserts the Activity into the body.

  This process enables a link to be shared with another
  person that has an activity embedded in the URL, so that
  screen state can be rehydrated on the other end.

  This process also allows a page to be refreshed and the
  screen state to always rehydrate.

  An Activity <core.ui.Activity> is a visual process unlike
  <core.processes.Activity>, a background process, although 
  they share a common concept. The UI activity is a WebComponent 
  and may be as small as a toggle switch or as big as a 
  screen of embedded smaller components.

*/
namespace("core.processes.URIActivityMonitor", {
    '@inherits' : core.processes.Activity,
 
    initialize : function(){
        this.parent(arguments);
        this.activities = [];
    },

    onResume : function(){
        // alert("URIActivityMonitor resumed");
        var e = application.dispatchEvent("activityresumed", true, true, {activity:this});
        if(!e.defaultPrevented) {
          console.log("activity has resumed");
          this._is_paused = false;
          parent.addEventListener("hashchange", this.onLocationHashChanged.bind(this), true);
          this.onLoad();
        }
    },

    onLoad : function onLoad(e) {
        var self=this;
        setTimeout(function(){
            self.doHashChangedEvent(e);
        }.bind(this),appconfig.foucdelay||200);
    },

    doHashChangedEvent : function(){
        var hash = parent.location.hash.substring(1);
        if(hash && hash.length > 0) {
            this.onLocationHashChanged({target:parent});
        }
    },

    onLocationHashChanged : function(e){
        if(this.isPaused()){return;}

        var self=this;
        var _location = e.target.location;
        //this.dispatchEvent("statechanged", false, false, {event:e})
        var obj = rison.decode(_location.hash.replace("#",""));
        if(obj && obj.activity){
            obj.namespace = obj.activity;
            if(NSRegistry[obj.namespace]){
                var activity = this.getActivity(obj.namespace)||new NSRegistry[obj.namespace];
                this.keep(activity);
                    activity.title = obj.title;
                    activity.start();
            } else {
                var c = new core.http.ClassLoader;
                    c.addEventListener("load", function(data){
                        var activity = self.getActivity(obj.namespace)||new NSRegistry[obj.namespace];
                        self.keep(activity);
                            activity.title = obj.title;
                            activity.start();
                    }, false);
                    c.load(obj.namespace);
                //console.error("Activity " + obj.namespace + " is not defined")
            }
        }
    },

    keep : function(activity){
        if(!this.getActivity(activity.namespace)){
            // alert("keeping: " + activity.namespace)
            this.activities.push(activity);
        }
    },

    getActivity:function(ns){
        return this.activities.where("$.namespace == '" + ns + "'")[0];
    }
});








