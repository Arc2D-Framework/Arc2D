

namespace `ui.meld` (
    class FramesBrowser extends WebComponent {
        async onConnected(){
            await super.onConnected();
            this.onMouseMove = this.onMouseMove.bind(this);
            this.on("click", e=>this.onClick(e), true, "#frames li");
            this.on("mousedown", e=> this.onMouseDown(e), false, ".drag-handle");
            this.on("mouseup", e=> this.onMouseUp(e), false)
            this.setDefault();
        }

        onMouseUp(){
            document.removeEventListener("mousemove", this.onMouseMove, false);
            this.dispatchEvent("resize-pane-end", {delta})
        }
        onMouseDown(e){
            this.xDelta = e.pageX;
            document.addEventListener("mousemove", this.onMouseMove, false)
        }

        onMouseMove(e) {
            var delta = e.pageX - this.xDelta;
            this.dispatchEvent("resize-pane", {delta})
        }

        setDefault(){
            var li = this.querySelector("#frames li");
                li.classList.add("active");
            this.last = li;
        }

        onClick(e){
            e.preventDefault();
            e.stopPropagation();
            this.last && this.last.classList.remove("active");
            this.last=e.matchedTarget;
            this.last.classList.add("active")
        }
    }
);