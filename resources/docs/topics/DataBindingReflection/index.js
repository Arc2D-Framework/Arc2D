import 'docs.demos.templates.ViewViewBinding';
import 'docs.demos.ui.ToggleButton';

namespace `docs.topics` (
	class DataBindingReflection  extends docs.topics.Topic  {
		async onConnected(){
            await super.onConnected();
            this.show_state = this.querySelector("#show_state");
            this.watch("#my-toggle", "value", e=> this.onShow(e), true, WristWatch)
        }

        onShow(e){
            this.show_state.innerHTML = e.val==1 ? "On" : "Off"
        }
	}
)