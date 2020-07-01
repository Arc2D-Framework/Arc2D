import 'node_modules/od-import-polyfill/import.js';
await require('/src/core/drivers/templating/Nunjucks/nunjucks-driver.js');
import 'core.ui.NotificationsToggleSwitch';
//mport 'core.ui.Test2';

namespace `applications` (
    class NotificationsApp extends w3c.ui.Application {
        constructor(element){
            super(element);
        }

        getTemplateEngine() {
            return window.customTemplateEngines.getEngineByMimeType("template/nunjucks")
        }

        async onConnected() {
            await super.onConnected({items: ["News Feeds", "Likes and Comments", "Live Stream", "Upcoming Events", "Friend Requests", "Nearby Friends", "Birthdays", "Account Sign-In"]});
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
                });
            }
        }
    }
);