import '/node_modules/od-watcher/wrist.js';

namespace `docs.demos.templates` (
	class ViewViewBinding  extends w3c.ui.WebComponent  {
		async onConnected(){
            await super.onConnected();
            var input1 = this.querySelector("#input1");
            var input2 = this.querySelector("#input2");
            var type = this.getAttribute("bind-type")||"single";
            if(input1 && input2 && type == "single"){
                wrist.watch(input1, 'value', e => input2.value = e.val);
            }
            else if(input1 && input2 && type == "both"){
                wrist.watch(input1, 'value', e => input2.value = e.val);
                wrist.watch(input2, 'value', e => input1.value = e.val);
            }
            else {
                var user = {firstname:""};
                window.user = user;
                wrist.watch(user, 'firstname', e => input1.value = e.val);
                user.firstname = "Bill"
            }
        }
	}
)