import 'core.ui.NotificationsToggleSwitch';

namespace `applications` (
    class NotificationsApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            // this.on("click", (e) => this.onfireEvt(e),false,"#main-toggle");
            this.on("toggleclick", (e) => this.toggleContent(e),false);
            this.mainToggle = this.querySelector("#main-toggle");
            this.bottomContent = this.querySelector("#bottom-content");
            this.allToggleSwitches = Array.from(this.querySelectorAll("notifications-toggle-switch"));
            this.allToggleSwitches.shift();

        }

        // onfireEvt(e){
        //     this.dispatchEvent("toggleclick",{bubbles:true,cancelable: true,toggleState:true});
        // }

        toggleContent(e){
            debugger;
            this.bottomContent.classList.toggle("show");
            if(this.mainToggle.classList.contains("active") && e.data.toggleState){
                this.allToggleSwitches.forEach(node => node.onClick())
            }
            // console.log(e.data.toggleState);
        }
    }
);
