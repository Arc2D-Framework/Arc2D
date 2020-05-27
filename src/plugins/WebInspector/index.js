@cascade(false);
namespace `plugins` (
    class WebInspector extends w3c.ui.WebComponent {
        static get WEIGHT(){return 50}

        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onHandleClick(e));
        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            this.dispatchEvent("openwebinspector")
            // this.getWebView().getWebContents().toggleDevTools();
            // this.getWebView().getWebContents().toggleDevTools();
        }

        template(){
            return `
                <template>
                    <i id="inspector" title="Web Inspector" class="toolbar-icon fa fa-terminal"></i>
                    <div class="plugin-icon-label">Devtools</div>
                </template>
            `
        }
    }
);





