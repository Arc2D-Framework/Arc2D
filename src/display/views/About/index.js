
import {wrist} from '/node_modules/od-watcher/wrist.js';


@tag("about-page");
namespace `display.views` (
	class About extends WebComponent {
		async onConnected(){
            await super.onConnected();

            this.addEventListener("click", this.unwatch, false, "#unwatch");
            this.w = this.watch("#input1", "value", this.output, true, wrist);
        }

        output =(e)=> {
            var output = this.querySelector("#output");
            output.innerHTML=e.val
        }

        unwatch =()=> {
            this.w.unwatch();
        }
	}
);