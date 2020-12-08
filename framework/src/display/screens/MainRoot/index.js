import 'core.ui.NavBar';

namespace `applications`(
    class MainRoot extends w3c.ui.RoutableApplication {

        async onConnected() {
            await super.onConnected();
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
