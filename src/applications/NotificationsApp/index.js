import 'core.ui.NotificationsToggleSwitch';

namespace `applications` (
    class NotificationsApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.addEventListener("toggleit", (e) => this.toggleContent(e), false, "#main-toggle");
            this.bottomContent = this.querySelector("#bottom-content");
            this.allToggleSwitches = Array.from(this.querySelectorAll("notifications-toggle-switch"));
        }

        toggleContent(e){
            e = e.src;
            this.bottomContent.classList.toggle("show");
            if(!e.data.toggleState){
                this.allToggleSwitches.forEach(node => {
                    if(node.classList.contains("active")){
                        node.onReset();
                    }
                })
            }
        }
    }
);
