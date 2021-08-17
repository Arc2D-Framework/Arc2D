
import 'ui.components.Splash';

@stylesheets(["/src/./theme.css"]);
namespace `ui.screens` (
    class SpaDemo2 extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.on("awake", e=>this.onActivityAwake(e));
            this.on("sleep", e=>this.onActivitySleep(e));

            location.hash = "#ui.views.Sample";
            this.on("click", e=>this.onExpand(e), false, ".mode");
            // console.log(this.root)
            // document.body.style.opacity=1;
        }

        onActivityAwake(e){
            var currentActive = this.querySelector(`.header-menu a[href="#${e.data.namespace}"]`);
            currentActive && currentActive.classList.add("is-active")
        }

        onActivitySleep(e){
            var lastActive = this.querySelector(`.header-menu .is-active[href="#${e.data.namespace}"]`);
            lastActive&&lastActive.classList.remove("is-active");
        }

        onExpand(e){
            let tcl = e.target.classList;//target
            let bcl = document.body.classList;//body
                bcl.toggle("expanded");
            
            if(bcl.contains("expanded")) {
                tcl.remove("fa-expand");
                tcl.add("fa-compress");
            } 
            else {
                tcl.remove("fa-compress");
                tcl.add("fa-expand");
            }
        }
    }
);
