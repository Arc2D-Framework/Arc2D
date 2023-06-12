
namespace `ui.meld.editors` (
    class Editor extends WebComponent {

        constructor(museobject, museframe) {
            super();
            this.museobject = museobject;
            this.museframe  = museframe;
        }

        async onConnected() {
            await super.onConnected();
            this.minimizeBtn = this.querySelector(".title .minimize-btn");
            this.minimizeBtn.addEventListener("click", e=> this.onToggleMinimize(e), false);
            this.on("dblclick", e=> this.onToggleMinimize(e), false, ".title");
            this.on("editorchange", e=> this.onEditorChanged(e), true);
            this.on("click", e=> this.onSelected(e), false);
            this.onToggleMinimize();
            //this.onRenderData();
        }

        onSelected(e) {
            this.dispatchEvent("editorselected", {editor:this, namespace:this.namespace})
        }

        onRendered() {
            this.onBind()
        }

        onBind() {

        }

        // onRenderData() {
        //     //TODO: Editors must implement to render [this.museobject]
        // }

        onEditorChanged(e) {
            console.log("CHANGED DETECTED", e.target)
        }

        minimize() {
            this.classList.add("minimized")
        }

        maximize() {
            this.classList.remove("minimized")
        }

        onToggleMinimize(e){
            this.classList.toggle("minimized");
        }
    }
);