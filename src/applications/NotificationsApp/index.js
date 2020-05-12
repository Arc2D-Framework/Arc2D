import 'core.ui.NotificationsToggleSwitch';

namespace `applications` (
    class NotificationsApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.on("click", (e) => this.onfireEvt(e),false,"#main-toggle");
            this.addEventListener("toggleclick", (e) => this.toggleContent(e),false);
            this.mainToggle = this.querySelector("#main-toggle");
            this.isActive = this.mainToggle.classList.contains("active");
            this.bottomContent = this.querySelector("#bottom-content");
            this.allToggleSwitches = Array.from(this.querySelectorAll("notifications-toggle-switch"));
            this.allToggleSwitches.shift(); // excludes main toggle switch
        }

        onfireEvt(){
            this.isActive || !this.isActive ?
            this.dispatchEvent("toggleclick",{toggleState:this.isActive}) : null;
        }

        toggleContent(e){
            console.log("e.data.toggleState",e.data.toggleState);
            this.bottomContent.classList.toggle("show");
            if(!e.data.toggleState){
                this.allToggleSwitches.forEach(node => {
                    if(node.classList.contains("active")){
                        node.onClick();
                    }
                })
            }
        }
    }
);
