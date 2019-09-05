
namespace("core.traits.HtmlNotifications", {
	supported : false,
	enabled : false,


	initialize : function(host){
		var self = this;

        if ("Notification" in window) {
            this.supported = true;
        }
		this.host = host;
		this.host.notifications = this;
		if(this.host.isNotificationsEnabled()){
			Notification.requestPermission(function (permission) {
				if (permission === "granted") {
					self.enabled = true;
                	// var notification = new Notification("A Todo was assigned to you");
              	}
			})
		}
	},

	show : function(msg){
		if(this.supported && this.enabled) {
			new Notification(msg);
		}
	}
});