
import '/src/domain/services/Meld.js';
import 'ui.components.SpaNav';
import 'ui.meld.FramesBrowser';
import 'ui.meld.editors.Editor';
import 'ui.meld.editors.Code';
import 'ui.meld.editors.Script';
import 'ui.meld.editors.RichText';
import 'ui.meld.editors.Branches';
import 'ui.meld.editors.Graphic';

namespace `ui.screens` (
    class Meld extends Application {
        constructor(element){
            super(element);
            location.hash = location.hash||Config.DEFAULT_VIEW;
        }
        
        async onConnected() {
            await super.onConnected();
            this.nav = this.querySelector("#nav");
            // this.addEventListener("resize-pane", e => this.onResizeNav(e), false)
            // this.addEventListener("resize-pane-end", e => this.onResizeNavEnd(e), false)
            // var draghandle = this.querySelector(".FramesBrowser >>> .drag-handle")
            // debugger
        }

        // onResizeNavEnd(){

        // }
        // onResizeNav(e) {
            // const compStyles = window.getComputedStyle(this.nav);
            // var w = parseInt(compStyles.getPropertyValue("min-width"));
        //     console.log("w",w)
        //     this.nav.style.minWidth = (e.detail.delta) + "px"
        // }

        inShadow(){return false}
    }
);
