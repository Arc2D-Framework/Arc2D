await require('/src/system/drivers/templating/Nunjucks/nunjucks-driver.js');
import 'display.components.NotificationsToggleSwitch';

namespace `display.screens` (
    class NotificationsApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }

        async onConnected() {
            await super.onConnected({
                items: [
                    "News Feeds", 
                    "Likes and Comments", 
                    "Live Stream", 
                    "Upcoming Events", 
                    "Friend Requests", 
                    "Nearby Friends", 
                    "Birthdays", 
                    "Account Sign-In"
                ]
            });

            this.on("toggleit", (e) => this.toggleContent(e), false, "#main-toggle");
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
                });
            }
        }
    }
); 