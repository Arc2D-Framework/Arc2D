// import 'display.components.Splash';
import '../../../../resources/js/jquery.3.1.1.min.js';
import 'display.views.Home';

namespace `display.screens` (
    class SpaDemo extends Application {
        constructor(element){
            super(element);
        }

        async onConnected() {
            await super.onConnected();
            this.mainListDiv = this.querySelector("#mainListDiv");
            this.on("click", e => this.toggleMenu(e),false,".navTrigger");
            this.initLinks();
            this.shrinkNavBar();
        }

        initLinks(){
            const navLinks = this.querySelectorAll(".navlinks li a");
                navLinks.forEach(link =>{
                    link.addEventListener("click", _ => this.toggleMenu(),false);
                })
        }

        toggleMenu(){
            this.classList.toggle("active");
            this.mainListDiv.classList.toggle("show_list");
            $("#mainListDiv").fadeIn();
        }

        shrinkNavBar(){ $(window).scroll(function() { $(document).scrollTop() > 50 ? $('.nav').addClass('affix') : $('.nav').removeClass('affix'); }); }
    }
);
