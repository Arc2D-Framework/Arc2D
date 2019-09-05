

namespace("core.processes.Activity", {

  initialize : function(){
    this.parent(arguments);
    this.id=Math.uuid(8);
    this._is_paused = true;
  },

  start : function(){
    this.onCreate(arguments);
  },

  stop : function(){
    this.onStop();
  },
  
  onCreate : function(){
    var e = application.dispatchEvent("activitycreated", true, true, {activity:this});
    if(!e.defaultPrevented) {
      console.log("activity created"); 
      this.onStart(); 
    }
  },
 
  onStart : function(){
    var e = application.dispatchEvent("activitystarted", true, true, {activity:this});
    if(!e.defaultPrevented) {
      console.log("activity has started");
    }
  },
  
  onResume : function(){
    var e = application.dispatchEvent("activityresumed", true, true, {activity:this});
    if(!e.defaultPrevented) {
      console.log("activity has resumed");
      this._is_paused = false;
    }
  },

  onPause : function(){
    var e = application.dispatchEvent("activitypaused", true, true, {activity:this});
    if(!e.defaultPrevented) { 
      console.log("activity is paused..."); 
      this._is_paused = true;
    }
  },

  isPaused : function(){
    return this._is_paused == true;
  },

  onStop : function(){
    // alert("on onStop");
    console.log("activity is stopped...");
  }
});








