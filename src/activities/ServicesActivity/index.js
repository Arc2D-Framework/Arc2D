

namespace `activities` (
    @stylesheets(["/src/./index.css"]);
    class ServicesActivity extends w3c.ui.WebComponent {
        constructor() {
            super();
            this.src = "/src/./index.html";
        }

        onConnected() {
            this.render();
            // this.addEventListener("click", (e)=> this.onClick(e), false)
        }

        onClick (e){
            alert(e)
        }

        onEnableShadow() {
            return false;
        }
    }
);
