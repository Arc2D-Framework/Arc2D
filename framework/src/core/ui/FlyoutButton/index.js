
namespace `core.ui` (
    class FlyoutButton extends w3c.ui.WebComponent {
        constructor(){
            super();
        }

        onConnected (){
            document.addEventListener("click", this.onClick.bind(this), false);
            this.render({});
        }

        onClick(e){
            var isListItem = this.querySelector("li",e);
            var isButton   = this.querySelector("button",e);

            if(isButton){
                this.toggle();
            }
            else if(isListItem){
                this.hide();
            } 
            else {
                this.hide();
            }

        }

        hide(){
            this.classList.remove("open");
            this.removeAttribute("data-name");
            this.style.backgroundColor = "transparent";
            this.dispatchEvent("toggled")
        }

        toggle(){
            this.classList.toggle("open");
            this.setAttribute("data-name","test");
            this.dispatchEvent("toggled");
            this.style.backgroundColor = "green";
        }
    }
);