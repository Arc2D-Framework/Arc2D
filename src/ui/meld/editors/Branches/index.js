
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

            this.item = e.matchedTarget;
            // console.log(e.matchedTarget)
        }

        onDragEnd(e) {
        }

        onDragOver(e) {
            e.preventDefault();
            if(e.matchedTarget == this.item) {
                return
            }
            else {
                this.lastEntered && this.lastEntered.classList.remove("dragenter");
                this.lastEntered = e.matchedTarget;
                this.lastEntered.classList.add("dragenter");
            }
        }

        onDragEnter(e) {
            e.preventDefault();
            if(e.target == this.item) {
                return
            }
            e.target.classList.add("dragenter");
        }

        onDragLeave(e) {
            console.log("leaving", e.matchedTarget)
            e.matchedTarget.classList.remove("dragenter");
        }

        onDrop(e) {
            if(e.matchedTarget.draggable && e.matchedTarget != this.item){
                let items = Array.from(this.querySelectorAll(".branch"));
                let current = this.item;
                let currentpos = 0, droppedpos = 0;
                for (let it=0; it<items.length; it++) {
                    if (current == items[it]) { currentpos = it; }
                    if (e.matchedTarget == items[it]) { droppedpos = it; }
                }
                if (currentpos < droppedpos) {
                    e.matchedTarget.parentNode.insertBefore(this.item, e.matchedTarget.nextSibling);
                } else {
                    e.matchedTarget.parentNode.insertBefore(this.item, e.matchedTarget);
                }

                e.matchedTarget.classList.remove("dragenter");
            }
        }

        inShadow() {
            return true
        }
    }
);