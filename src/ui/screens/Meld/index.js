
import 'ui.components.Splash';
import 'ui.components.SpaNav';
import 'ui.meld.FramesBrowser';
import 'ui.meld.editors.Editor';
import 'ui.meld.editors.Code';
import 'ui.meld.editors.RichText';
import 'ui.meld.editors.Branches';

namespace `ui.screens` (
    class Meld extends Application {
        constructor(element){
            super(element);
            location.hash = location.hash||Config.DEFAULT_VIEW;
        }
        
        async onConnected() {
            await super.onConnected();
            this.nav = this.querySelector("#nav");
            this.addEventListener("resize-pane", e => this.onResizeNav(e), false)
            this.addEventListener("resize-pane-end", e => this.onResizeNavEnd(e), false)
        }

        onResizeNavEnd(){
            
        }
        onResizeNav(e) {
            // console.log("resize delta", e.detail.delta);
            
            const compStyles = window.getComputedStyle(this.nav);
            var w = parseInt(compStyles.getPropertyValue("min-width"));
            console.log("w",w)
            // this.nav.style.width = w+e.detail.delta + "px";
            this.nav.style.minWidth = (e.detail.delta) + "px"
        }

        inShadow(){return false}
    }
);
