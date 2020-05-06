import '/framework/src/core/http/Router.js';

namespace `applications`(
    class MyTest extends w3c.ui.Application {
        constructor(element) {
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.router = new core.http.Router(this,window);// <- onConnected, best place
        }

        onEnterActivity(c) {
            console.log("onEnterActivity", c);
            var slot = this.querySelector('#activitySlot');
            slot.appendChild(c);
            this.currentActivity = c;
            // this.onEnterActivityRestoreScroll(scrollToElement)
            this.dispatchEvent("onactivityshown", c);
        }

        onExitCurrentActivity(c) {
            // this.onExitActivitySaveScroll()
            console.log("onExitCurrentActivity", c);
            var slot = this.querySelector('#activitySlot');
            slot.innerHTML = "";
        }

        onResumeActivity(c) {
            console.log("onResumeActivity", c);
            this.dispatchEvent("topichanged", {});
        }

        onLoadingActivity(c) {
            // application.dispatchEvent("showsplash")
            console.log("onLoadingActivity", c);
            this.dispatchEvent("topichanged", {});
        }
    }
);
