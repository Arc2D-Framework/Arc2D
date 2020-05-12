import 'core.ui.NotificationsToggleSwitch';

namespace `applications` (
    class NotificationsApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.addEventListener("toggleclick", (e) => this.toggleContent(e),false);
        }

        toggleContent(e){
            console.log(e)
        }
    }
);
