
namespace `docs.components` (
    class ExplorerPanel extends w3c.ui.WebComponent {
        constructor() {
            super();
        }

        async onConnected(data) {
            await super.onConnected(data);
            this.addEventListener("click", e=>this.onTitleBarClicked(e), false, ".title");
            this.collapse();
        }

        onTitleBarClicked(e){
            this.classList.toggle("collapsed")
        }

        collapse(){
            this.classList.toggle("collapsed")
        }
        open(){
            this.classList.remove("collapsed")
        }
    }
);
