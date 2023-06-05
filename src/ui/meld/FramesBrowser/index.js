

namespace `ui.meld` (
    class FramesBrowser extends WebComponent {
        async onConnected(){
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true, "li a");
            // this.setDefault();
        }

        // setDefault(){
        //     var a = this.querySelector("li a");
        //     a.classList.add("active");
        //     this.last = a;
        // }

        onClick(e){
            e.preventDefault();
            e.stopPropagation();
            this.last && this.last.classList.remove("active");
            this.last=e.target;
            e.target.classList.toggle("active")
        }

        isComposable(){return true}//to allow slots

    }
);