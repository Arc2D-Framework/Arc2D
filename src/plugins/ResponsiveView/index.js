
@cascade(false);
namespace `plugins` (
    class ResponsiveView extends w3c.ui.WebComponent {
        static get WEIGHT(){return 120}

        async onConnected(){
            await super.onConnected();
            this.addEventListener("change", e => this.onHandleClick(e));
            ipcRenderer.on('cachecleared', (event, arg) => this.onHandleResponse());

        }

        static async install(activity){
            var tooltray = activity.getToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            ipcRenderer.send('clearcache', "Im ready");
            
            var val = e.target.value;
            var icon = this.querySelector("#user-agent-icon");
            if(val == "desktop"){
              remote.getGlobal("USER_AGENTS").selected = remote.getGlobal("USER_AGENTS").desktop;
              icon.classList.remove("fa-mobile");
              icon.classList.add("fa-desktop");
              application.currentActivity.classList.remove("mobile")
            } 
            else if(val =="mobile"){
              remote.getGlobal("USER_AGENTS").selected = remote.getGlobal("USER_AGENTS").mobile;
              icon.classList.add("fa-mobile");
              icon.classList.remove("fa-desktop");
              application.currentActivity.classList.add("mobile");
            }
            
            // setTimeout(_ => document.querySelector("#go").click(),300);
        }

        onHandleResponse(){
            setTimeout(_ => document.querySelector("#go").click(),300);
        }

        template(){
            return `
                <template>
                    <i style="position: relative;">
                      <select id="user-agent-selector" style="opacity: 0;
                        position: absolute;
                        top: 0;
                        width: 100%;
                        height: 100%;">
                        <option value="desktop" selected="true">Desktop View</option>
                        <option value="mobile">Mobile View</option>
                      </select>
                      <i id="user-agent-icon" title="Set Viewport" class="toolbar-icon fa fa-desktop"></i>
                    </i>
                </template>
            `
        }
    }
);





