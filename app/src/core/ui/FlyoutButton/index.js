@stylesheets(["/src/./index.css"]);
@tag("flyout-button");
namespace("core.ui.FlyoutButton", class extends w3c.ui.WebComponent {
    constructor(){
        super();
    }

    onConnected (){
        document.addEventListener("click", this.onClick.bind(this), false);
        this.render({});
    }

    onClick(e){
        var isListItem = this.getRealTargetFromEvent(e,"li",".flyout");
        var isButton   = this.getRealTargetFromEvent(e,"button",".FlyoutButton");

        if(isButton){
            this.toggle();
        }
        else if(isListItem){
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
        this.setAttribute("data-name","Jay");
        this.dispatchEvent("toggled")
    }
});