import 'docs.demos.DatePicker';

namespace `docs.topics` (
	class DecoratingNodes  extends docs.topics.Topic  {
		onConnected(){
            super.onConnected()
            this.bind("#decorate", "click", e => this.onDecorate(e))
        }

        onDecorate(e){
            var div = this.querySelector("#some-existing-module");
            var datepicker = new docs.demos.DatePicker(div);
            var button = this.querySelector("#decorate");
            button.remove()
        }
	}
)