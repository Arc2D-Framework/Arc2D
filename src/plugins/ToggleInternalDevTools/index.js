@cascade(false);
namespace `plugins` (
    class ToggleInternalDevTools extends w3c.ui.WebComponent {
        static get WEIGHT(){return 40}

        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onToggleInternalDevToolsPanel(e));
        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onToggleInternalDevToolsPanel(e){
          remote.getCurrentWindow().toggleDevTools();
        }

        template(){
            return `
                <template>
                    <i id="toggle-internal-inspector" title="IDE Inspector" class="toolbar-icon fa fa-code"></i>
                    <div class="plugin-icon-label">Console</div>
                </template>
            `
        }
    }
);





