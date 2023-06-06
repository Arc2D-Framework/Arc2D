
namespace `ui.meld.editors` (
    class Branches extends ui.meld.editors.Editor {
        static get is() {return "branches-editor"}
        
        async onConnected() {
            await super.onConnected();
            this.on("click", e=> this.onBranchSelected(e), false, ".branch")
        }

        onBranchSelected(e){
            this.last && this.last.classList.remove("active");
            this.last = e.matchedTarget;
            this.last.classList.add("active");
        }
    }
);