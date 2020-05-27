
@cascade(false);
namespace `plugins` (
    class InterRect extends w3c.ui.WebComponent {
        static get WEIGHT(){return 30}

        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onHandleClick(e));
        }

        static async install(activity){
            await wait(3500);
            var tooltray = activity.getDetailsToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            this.classList.toggle("active");
            var isActive = this.classList.contains("active");
            this.dispatchEvent("nodepositioner",{active:isActive})
        }

        template(){
            return `
                <template>
                    <div>
                        <i title="Move and reposition on-screen nodes" class="toolbar-icon sticky fa fa-arrows"></i>
                        <div class="plugin-icon-label">Move</div>
                    </div>
                </template>
            `
        }

        cssStyle(){
            return `
                node-positioner.active i {
                    border-right: 2px solid chartreuse !important;
                }
                node-positioner.active i {
                    color: white !important;
                }
            `
        }
    }
);





