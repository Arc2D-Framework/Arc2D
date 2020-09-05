import '/src/core/http/Router.js';

namespace `w3c.ui` (
    @cascade(false);
	class RoutableApplication extends w3c.ui.Application {
        async onConnected(data){
            await super.onConnected(data);
            this.router = this.onEnableRouting()?new core.http.Router(this,window):null;
        }

        onEnableRouting(){ return true }

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
            var slot = this._activitySlot||this.querySelector('slot[name="content"]')||this.querySelector('div[name="content"]');
            if(!slot) {
                console.warn(`${this.namespace}#onFindActivitySlot() - unable to find a <slot|div name='content'></slot|div> for loading views. Using <body> as fallback.`)
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
            // application.dispatchEvent("showsplash")
            console.log("onLoadingActivity", c);
        }
	}
);
