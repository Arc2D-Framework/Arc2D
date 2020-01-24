import '/framework/node_modules/od-watcher/wrist.js';

namespace `docs.demos.templates` (
	class ViewViewBinding  extends w3c.ui.WebComponent  {
		onConnected(){
            super.onConnected();
            var input1 = this.querySelector("#input1");
            var input2 = this.querySelector("#input2");
            wrist.watch(input1, 'value', (prop, prev, curr) => input2.value = curr);
            
            var input3 = this.querySelector("#input3");
            var input4 = this.querySelector("#input4");
            wrist.watch(input3, 'value', (prop, prev, curr) => input4.value = curr);
            wrist.watch(input4, 'value', (prop, prev, curr) => input3.value = curr);

            var user = {name:""};
            window.user = user;
            var input5 = this.querySelector("#input5");
            wrist.watch(user, 'name', (prop, old, val) => input5.value = val);
            user.name = "xyz"
        }
	}
)