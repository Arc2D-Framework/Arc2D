@cascade(false);
namespace `plugins` (
    class ClearCache extends w3c.ui.WebComponent {
        static get WEIGHT(){return 100}

        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onHandleClick(e));
            ipcRenderer.on('cachecleared', (event, arg) => this.onHandleResponse());
        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            var doit = confirm("Clear Cache?");
            if(!doit){return}
            ipcRenderer.send('clearcache', "Im ready");
        }

        onHandleResponse(){
            console.log("Cache Cleared");
            alert("Cache was cleared")
        }

        template(){
            return `
                <template>
                    <i id="cache" title="Clear Cache &amp; Storage" class="toolbar-icon fa fa-trash"></i>
                    <div class="plugin-icon-label">Cache</div>
                </template>
            `
        }
    }
);





