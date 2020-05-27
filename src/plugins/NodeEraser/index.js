
@cascade(false);
namespace `plugins` (
    class NodeEraser extends w3c.ui.WebComponent {
        static get WEIGHT(){return 10}
        
        async onConnected(){
            await super.onConnected();
            this.addEventListener("click", e => this.onHandleClick(e));
        }

        static async install(activity){
            await wait(3300);
            var tooltray = activity.getDetailsToolTray();
            var el = await new this;
            tooltray.appendChild(el)
        }

        onLoadInstanceStylesheet(){return false}

        onHandleClick(e){
            var doit = confirm("Permanently remove node from screen?");
            if(doit){
            // this.classList.toggle("active");
            // var isActive = this.classList.contains("active");
                this.dispatchEvent("nodeerase",{})
            }
        }

        template(){
            return `
                <template>
                    <div>
                        <i title="Remove Element From Screen" class="toolbar-icon fa fa-eraser"></i>
                        <div class="plugin-icon-label">Erase</div>
                    </div>
                </template>
            `
        }

        // cssStyle(){
        //     return `
        //         node-eraser.active i {
        //             border-right: 2px solid chartreuse !important;
        //         }
        //         node-eraser.active i {
        //             color: white !important;
        //         }
        //     `
        // }
    }
);





