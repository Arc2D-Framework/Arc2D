await require('/src/system/drivers/templating/Nunjucks/nunjucks-driver.js');
import 'display.components.NotificationsToggleSwitch';
import '../../../-appconfig.js';

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

        initApp(){
            setTimeout(() => {
                if(Config.MOBILEVIEW == true){
                    this.removeNotificationClasses();
                    this.hideEmailNode();
                    this.mobileDemoStyles();
                }
            }, 3000);
        }

        mobileDemoStyles(){
            this.container.classList.add("mobile");
        }

        hideEmailNode(){
            this.emailNode.style.display = "none";
        }

        removeNotificationClasses(){
            this.notificationsNode.classList.remove("pt-5", "mt-4");
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