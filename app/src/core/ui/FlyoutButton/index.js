
namespace `core.ui` (
    @tag("flyout-button");
    @stylesheets(["/src/./index.css"]);
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
                alert("button clicked")
                this.toggle();
            }
            else if(isListItem){
                alert("li clicked")
                //alert("You clicked: " + isListItem.innerHTML);
                this.hide();
            } 
            else {
                this.hide();
            }
        }

        onEnableShadow() {
            return false
        }

        hide(){
            this.classList.remove("open");
            this.removeAttribute("data-name");
        }

        toggle(){
            this.classList.toggle("open");
            this.setAttribute("data-name","test");
            this.dispatchEvent("toggled")
        }
    }
);