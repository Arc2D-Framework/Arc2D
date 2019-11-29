namespace("core.traits.EventBus", {
	subscribers : {},
	observers:[],

	initialize : function(host){
		this.host = host;
		this.host.bus = this;
	},
	
	addEventListener : function(eventName, cb){
		if(!this.subscribers[eventName]){
			this.subscribers[eventName] = [];
		}
		this.subscribers[eventName].push({name:eventName, callback:cb});
	},
	
	dispatchEvent : function(eventName, bubbles, cancelable, data, scope) {
        scope = (scope||this.host||this||window);
        var ns = scope.namespace||"";
        	ns = ns.length > 0 ? (ns + "::"):ns;
        var observers = this.subscribers[ns+eventName]||[];
        for(var i=0; i<=observers.length-1; i++){
        	var observer = observers[i];
        	observer.callback.call(scope, data); 
        } 
   },
   
   removeEventListener : function(eventName, callback){
        var observers = this.subscribers[eventName]||[];
        for(var i=0; i<=observers.length-1; i++){
        	var observer = observers[i];
        	if(observer.name == eventName && observer.callback == callback) {
        		observers.splice(i,1);
        	}
        }
    }
});