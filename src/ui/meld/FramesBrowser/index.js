

namespace `ui.meld` (
    class FramesBrowser extends WebComponent {
        async onConnected(){
            await super.onConnected();
            this.onMouseMove = this.onMouseMove.bind(this);
            this.on("click", e=>this.onClick(e), true, "#frames li");
            this.on("mousedown", e=> this.onMouseDown(e), false, ".drag-handle");
            this.on("mouseup", e=> this.onMouseUp(e), false)
            this.nav = document.querySelector("#nav");
            this.setDefault();
        }

        // onResizeNav(e) {
        //     const compStyles = window.getComputedStyle(this.nav);
        //     var w = parseInt(compStyles.getPropertyValue("min-width"));
        //     console.log("w",w)
        //     this.nav.style.minWidth = (e.detail.delta) + "px"
        // }

        onMouseUp(){
            document.removeEventListener("mousemove", this.onMouseMove, false);
            // this.dispatchEvent("resize-pane-end", {delta})
        }
        onMouseDown(e){
            const compStyles = window.getComputedStyle(this.nav);
            var w = parseInt(compStyles.getPropertyValue("min-width"),10);

            this.startWidth = w;
            this.startX = e.pageX;
            document.addEventListener("mousemove", this.onMouseMove, false)
        }

        onMouseMove(e) {
            var deltaX = e.pageX - this.startX;
            var width = this.startWidth + deltaX;
            this.nav.style.minWidth = `${width}px`
            // this.dispatchEvent("resize-pane", {delta})
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

        inShadow(){
            return true
        }
    }
);