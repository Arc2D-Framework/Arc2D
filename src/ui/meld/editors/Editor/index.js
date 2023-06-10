
namespace `ui.meld.editors` (
    class Editor extends WebComponent {
        async onConnected() {
            await super.onConnected();
            this.minimizeBtn = this.querySelector(".title .minimize-btn");
            this.minimizeBtn.addEventListener("click", e=> this.onToggleMinimize(e), false);
            this.on("dblclick", e=> this.onToggleMinimize(e), false, ".title");
            this.on("editorchange", e=> this.onEditorChanged(e), true)
            this.onToggleMinimize()
            this.onRenderData();
        }

        onRenderData() {
            
        }

        onEditorChanged(e) {
            console.log("CHANGED DETECTED", e.target)
        }

        setData(data) {
            this.data = data;
        }

        minimize() {
            this.classList.add("minimized")
        }

        maximize() {
            this.classList.remove("minimized")
        }

        onToggleMinimize(e){
            this.classList.toggle("minimized");
            // if(this.classList.contains("minimized")) {
            //     this.minimizeBtn.classList.remove("fa-angle-up");
            //     this.minimizeBtn.classList.add("fa-angle-down");
            // }
            // else {
            //     this.minimizeBtn.classList.remove("fa-angle-down");
            //     this.minimizeBtn.classList.add("fa-angle-up");
            // }
        }
    }
);