/*
  Monitors and keeps a track log of all activities/processes
  running.
*/
namespace("core.processes.ActivityProcessMonitor", {
  '@inherits' : core.processes.Activity,

  initialize : function(){
    this.parent(arguments);
    this.activities = [];
   // this.activities.push(this);
    this.currentUIActivity = null;
    // alert("activity monitor initialized");
  },

  start : function(){
    application.addEventListener("activitycreated", this.onActivitySpawned.bind(this), false);
    application.addEventListener("activityresumed", this.onActivityResumed.bind(this), false);
    this.setLogInterval();
    this.onCreate(arguments);
  },

  setLogInterval : function(){
    var self=this;
    setInterval(function(){
      console.log("list of activities:", self.activities);
      console.log("current ui activity:", self.currentUIActivity);
    },10000);
  },


  onActivityResumed : function(e){
    this.currentUIActivity = e.data.activity;
    console.log(this.currentUIActivity.namespace + " is current activity");
  },

  onActivitySpawned : function(e){
    // alert(e.data.activity.namespace)
    if(e.data.activity){
      // alert(this.activities.where("$.id == '" + e.data.activity.id + "'")[0])
      //alert(e.data.activity.id)
      if(!this.activities.where("$.id == '" + e.data.activity.id + "'")[0]){
        this.activities.push(e.data.activity);
        console.log(this.namespace + ": is tracking a new activity: " + e.data.activity.namespace);
      }
    }
  }
});








