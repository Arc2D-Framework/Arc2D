

import 'display.components.Splash';
import 'display.views.Home'; //start with default <home-page> in <slot>

namespace `display.screens` (
    class SpaDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.mainListDiv = this.querySelector("#mainListDiv");
            this.on("click", this.onToggleMenu, false, "nav");
        }

        //toggle if any part of <nav> is clicked
        onToggleMenu = e=> {
            this.classList.toggle("active");
            this.mainListDiv.classList.toggle("show_list");
            this.mainListDiv.style.display="block"
        }

        onEnterActivity(c,scrollToElement){
            console.log("onEnterActivity", c);
            var slot = this.onFindActivitySlot();
                slot.innerHTML="";
                slot.appendChild(c);
            this.currentActivity = c;
            this.onEnterActivityRestoreScroll(scrollToElement)
            this.dispatchEvent("onactivityshown",c);
        }

        onFindActivitySlot(){
            var slot = this._activitySlot||this._view_slot;
            if(!slot) {
                slot=document.body;
                console.warn(`${this.namespace}#onFindActivitySlot() - unable to find a <slot|div name='view-port'></slot|div> for loading views. Using <body> as fallback.`)
            }
            this._activitySlot = slot;
            return slot||this
        }

        onExitCurrentActivity(c){
            this.onExitActivitySaveScroll()
            console.log("onExitCurrentActivity", c);
            this.lastActivity=c;
            // var slot = this.onFindActivitySlot();
            //     slot.innerHTML="";
        }

        onResumeActivity(c){
            console.log("onResumeActivity", c);
        }

        onLoadingActivity(c){
            console.log("onLoadingActivity", c);
        }
    }
);
