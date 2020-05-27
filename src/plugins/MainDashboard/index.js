@cascade(false);
namespace `plugins` (
    class MainDashboard extends w3c.ui.WebComponent {
        static get WEIGHT(){return 10}

        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onHandleClick(e));
        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onHandleClick(e){
          location.href="#views.WelcomeHome"
        }

        onLoadInstanceStylesheet(){return false}

        template(){
            return `
                <template>
                    <i id="home" title="Home" class="toolbar-icon fa fa-home" disabled="true"></i>
                    <div class="plugin-icon-label">Home</div>
                </template>
            `
        }
    }
);





