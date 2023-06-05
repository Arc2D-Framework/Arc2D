
namespace `ui.meld.editors` (
    class Editor extends WebComponent {
        async onConnected() {
            await super.onConnected();
            this.minimizeBtn = this.querySelector("nav > i");
            this.minimizeBtn.addEventListener("click", e=> this.onToggleMinimize(e), false);
        }

        onToggleMinimize(e){
            this.classList.toggle("minimized");
            if(this.classList.contains("minimized")) {
                this.minimizeBtn.classList.remove("fa-angle-up");
                this.minimizeBtn.classList.add("fa-angle-down");
            }
            else {
                this.minimizeBtn.classList.remove("fa-angle-down");
                this.minimizeBtn.classList.add("fa-angle-up");
            }
        }
    }
);