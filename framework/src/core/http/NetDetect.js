namespace("core.http.NetDetect", {
	MODES : {
        OFFLINE : "offline",
        ONLINE 	: "online",
        DETECT 	: "detect"
    },
    INTERVAL 	: Config.NetDetect.INTERVAL||3000,


    initialize : function(){
        var self=this;
        

        this.onLine = false;

		this.EventBus = core.EventBus;
        if (navigator.onLine) {
            this.onLine = true;
        } else {
            this.onLine = false;
        }
        
        if(!Config.NetDetect.ENABLED){
            return;
        }
        
        window.addEventListener('online', function(e) {
          self.onLine=true;
          self.EventBus.dispatchEvent("connection",true,true,{online:true});
        }, false);
        
        window.addEventListener('offline', function(e) {
          self.onLine=false;
          self.EventBus.dispatchEvent("connection",true,true,{online:false});
        }, false);

        this.mode = this.setMode(this.MODES.DETECT);
        this.onInitializeHeartbeat(this.INTERVAL);
    },

    setMode : function(m){
        var self=this;
        this.mode = m;
        return this.mode;
    },

    isConnected : function(){
        return this.onLine;
    },

    onInitializeHeartbeat : function(seconds){
        var self=this;
        this.heartbeatTimer = setInterval(function(){
            var xhr = new XMLHttpRequest;
            try{
                var heartbeat_url = (Config.Global.PRODUCTION == true) ? 
                    Config.NetDetect.HEARTBEAT_PROD_URI : 
                    Config.NetDetect.HEARTBEAT_DEBUG_URI;

                xhr.open("GET",heartbeat_url,false);
                xhr.addEventListener("readystatechange", function(){
                    self.onHeartBeatHttpResponseReceived(this)
                }, false);
                xhr.send();
            }
            catch(e){
                self.onOffline(xhr);
            }
        }, seconds)
    },

    onOffline : function(){
        this.onLine=false;
        this.EventBus.dispatchEvent("connection",  true, true, {online:this.onLine});
    },

    onOnline : function(r){
        this.onLine=true;
        this.EventBus.dispatchEvent("connection",  true, true, {online:this.onLine});
    },


    onHeartBeatHttpResponseReceived : function(xhr){
    	if(this.mode == this.MODES.DETECT){
	        if(xhr.readyState == XMLHttpRequest.DONE){
	            if(this.isFailure(xhr)){
	                this.onOffline(xhr);
	            }
	            else {
	                this.onOnline(xhr);
	            }
	        }
	    }
	    else if(this.mode == this.MODES.OFFLINE) {
	    	this.onOffline(xhr);
	    }
	    else if(this.mode == this.MODES.ONLINE) {
	    	this.onOnline(xhr);
	    }
	    else {
	    	console.error("Unable to detect internet connection in mode: " + this.mode)
	    }
    },

    isFailure : function(xhr){
        if(xhr.status == 0||xhr.status == 200){
            if(xhr.responseText.length <= 0){
                return true;
            }
            else {
                try {
                    var data = JSON.parse(xhr.responseText);
                    if(data && typeof data == "object"){
                        if(data.status == "200"){
                            return false;
                        }
                        else { return true }
                    }
                    else { return true }
                } catch(e){
                   return true;
                }
            }
        } else {
            return true
        }
    }
});

core.http.NetDetect = new core.http.NetDetect();