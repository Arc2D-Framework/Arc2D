
@cascade(false);
namespace `plugins` (
    class NodeInspector extends w3c.ui.WebComponent {
        static get WEIGHT(){return 20}

        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onHandleClick(e));
        }

        static async install(activity){
            await wait(3000);
            var tooltray = activity.getDetailsToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            this.classList.toggle("active");
            var isActive = this.classList.contains("active");
            this.dispatchEvent("nodeinspect", {active:isActive})
        }

        template(){
            return `
                <template>
                    <div>
                    <i id="node_inspector" title="Select Nodes on Screen" class="toolbar-icon sticky fa fa-mouse-pointer"></i>
                    <div class="plugin-icon-label">Select</div>
                    </div>
                </template>
            `
        }

        cssStyle(){
            return `
                node-inspector.active i {
                    border-right: 2px solid chartreuse !important;
                }
                node-inspector.active i {
                    color: white !important;
                }
            `
        }
    }
);





