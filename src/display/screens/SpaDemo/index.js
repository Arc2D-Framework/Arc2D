

import 'display.components.Splash';
import 'display.views.Home'; //start with default <home-page> in <slot>

namespace `display.screens` (
    class SpaDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.mainListDiv = this.querySelector("#mainListDiv");
            this.on("click", this.onToggleMenu, false, "nav");
        }

        //toggle if any part of <nav> is clicked
        onToggleMenu = e=> {
            this.classList.toggle("active");
            this.mainListDiv.classList.toggle("show_list");
            this.mainListDiv.style.display="block"
        }
    }
);
