import 'src/core/ui/WebComponent.js';

namespace `core.ui` (
	class Application extends core.ui.WebComponent {
	    constructor(el) {
	        super(el);
	        window.application = this;
	    }

        async onConnected(data){
            await super.onConnected(data);
            if(this.onEnableRouting()){
                this.router = new system.http.Router(this,window);
            }
        }

        async onEnableRouting(){ 
            this._view_slot=this.querySelector('slot[name="view-port"]')||this.querySelector('div[name="view-port"]');
            return this._view_slot;
        }

        onExitActivitySaveScroll(){
            if(this.currentActivity){
                this.currentActivity._scrollpos = this.currentActivity.parentNode.scrollTop;
            }
        }

        onEnterActivityRestoreScroll(scrollToElement=null){
            if(this.currentActivity){
                if(scrollToElement){
                    wait(100).then(_=> {
                        var el = this.currentActivity.querySelector("#"+scrollToElement);
                        if (el) {
                            el.scrollIntoView({
                                behavior : "smooth",
                                block : "start"
                            });
                        }

                    })
                } else {
                    this.currentActivity.parentNode.scrollTop = this.currentActivity._scrollpos||0;
                }
            }
        }

        onEnterActivity(c,scrollToElement){
            console.log("onEnterActivity", c);
            var slot = this.onFindActivitySlot();
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
            var slot = this.onFindActivitySlot();
                slot.innerHTML="";
        }

        onResumeActivity(c){
            console.log("onResumeActivity", c);
        }

        onLoadingActivity(c){
            console.log("onLoadingActivity", c);
        }
	}
);
window.Application = window.Application||core.ui.Application;
namespace `w3c.ui` (core.ui.Application);
