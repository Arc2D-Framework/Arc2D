import '/framework/node_modules/od-watcher/wrist.js';

namespace `docs.demos.templates` (
	class ViewViewBinding  extends w3c.ui.WebComponent  {
		onConnected(){
            super.onConnected();
            var input1 = this.querySelector("#input1");
            var input2 = this.querySelector("#input2");
            var type = this.getAttribute("bind-type")||"single";
            if(input1 && input2 && type == "single"){
                wrist.watch(input1, 'value', (prop, prev, curr) => input2.value = curr);
            }
            else if(input1 && input2 && type == "both"){
                wrist.watch(input1, 'value', (prop, prev, curr) => input2.value = curr);
                wrist.watch(input2, 'value', (prop, prev, curr) => input1.value = curr);
            }
            else {
                var user = {firstname:""};
                window.user = user;
                wrist.watch(user, 'firstname', (prop, old, val) => input1.value = val);
                user.firstname = "Bill"
            }
        }
	}
)