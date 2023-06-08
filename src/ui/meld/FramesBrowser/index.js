

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

        onMouseUp(){
            document.removeEventListener("mousemove", this.onMouseMove, false);
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