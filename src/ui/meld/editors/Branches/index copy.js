
namespace `ui.meld.editors` (
    class Branches extends ui.meld.editors.Editor {
        static get is() {return "branches-editor"}
        
        async onConnected() {
            await super.onConnected();
            this.on("mousedown", e=> this.onBranchSelected(e), false, ".branch");

            this.on("dragstart", e=> this.onDragStart(e),   true, ".branch");
            this.on("dragend",   e=> this.onDragEnd(e),     true, ".branch");
            this.on("dragover",  e=> this.onDragOver(e),    true, ".branch");
            this.on("dragenter", e=> this.onDragEnter(e),   true, ".branch");
            this.on("dragleave", e=> this.onDragLeave(e),   true, ".branch");
            this.on("drop",      e=> this.onDrop(e),        true, ".branch");
        }

        onBranchSelected(e){
            this.last && this.last.classList.remove("active");
            this.last = e.matchedTarget;
            this.last.classList.add("active");
        }

        async onDragStart(e) {

            this.item = e.target;
            console.log(e.matchedTarget)
        }

        onDragEnd(e) {
        }

        onDragOver(e) {
            e.preventDefault();
        }

        onDragEnter(e) {
            e.preventDefault();
            if(e.target == this.item) {
                return
            }
            e.target.classList.add("dragenter");
        }

        onDragLeave(e) {
            e.target.classList.remove("dragenter");
        }

        onDrop(e) {
            debugger
            if(e.target.draggable && e.target != this.item){
                let items = Array.from(this.querySelectorAll(".branch"));
                let current = this.item;
                let currentpos = 0, droppedpos = 0;
                for (let it=0; it<items.length; it++) {
                    if (current == items[it]) { currentpos = it; }
                    if (e.target == items[it]) { droppedpos = it; }
                }
                if (currentpos < droppedpos) {
                    e.target.parentNode.insertBefore(this.item, e.target.nextSibling);
                } else {
                    e.target.parentNode.insertBefore(this.item, e.target);
                }

                e.target.classList.remove("dragenter");
            }
        }

        inShadow() {
            return true
        }
    }
);