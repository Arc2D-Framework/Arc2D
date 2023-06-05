

namespace `ui.meld` (
    class FramesBrowser extends WebComponent {
        async onConnected(){
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true, "#frames li");
            this.setDefault();
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