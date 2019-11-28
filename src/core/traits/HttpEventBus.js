namespace("core.traits.HttpEventBus", {
	subscribers : {},
	observers:[],
    supported : false,


	initialize : function(host){
        if(PubNub){
            this.supported = true;
            this.broadcaster = new PubNub({
                publishKey: 'pub-c-be3b1586-6c45-4616-bee8-a27de8663e8e',
                subscribeKey: 'sub-c-c6c913e4-3824-11e7-a58b-02ee2ddab7fe'
            });
        } else {
            this.supported = false;
        }
		this.host = host;
		this.host.httpbus = this;

	},

    subscribe : function(_channels){
        if(this.supported && _channels) {
            this.broadcaster.subscribe(_channels);
        }
    },
	
	addEventListener : function(eventName, cb){
        if(this.supported) {
            var listener = {};
                listener[eventName] = cb;
    		this.broadcaster.addListener(listener);
        }
	},
	
	dispatchEvent : function(channelName, data) {
        if(this.supported) {
            this.broadcaster.publish({
                message: data,
                channel: channelName
            });
        }
   },
   
   removeEventListener : function(eventName, callback){
        //TODO
    }
});