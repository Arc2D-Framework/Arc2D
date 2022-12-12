import 'ui.components.KnobSkinTest2';
import 'ui.components.Switch';


namespace `ui.screens` (
    class KnobDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.on("changed", e=> this.onStartTour(e), false, "#btn-toggle-a")
            this.on("changed", e=> this.onSwitchFlipped(e), false, "#btn-toggle-b")
        }

        onStartTour(e) {
            if(e.data.on){ window.tg.show(HELP.intro) }
        }

        async onSwitchFlipped(e){
            if(e.data.on){
                var d = `<div class="test" style="visibility:hidden;"><span>Hello</span></div>`.toNode()
                // d.innerHTML = "test";
                // d.classList.add("test");
                // await sleep(1000) 
                this.append(d);
                this.last=d;
                setTimeout(() => {
                    d.style.visibility = "visible"
                }, 900);
            }
            else {
                this.last && this.last.remove()
            }
        }
    }
);
