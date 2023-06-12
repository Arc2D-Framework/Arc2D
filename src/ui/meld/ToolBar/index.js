

namespace `ui.meld` (
    class ToolBar extends WebComponent {
        static get is() {return "tool-bar"}

        async onConnected(){
            await super.onConnected();
        }

        onObjectSelected(e) {
            e.preventDefault();
            e.stopPropagation();
            this.lastObject && this.lastObject.classList.remove("active");
            this.lastObject=e.matchedTarget;
            this.lastObject.classList.add("active");
            this.dispatchEvent("objectselected", {namespace:this.lastObject.dataset.namespace})
        }

        disableAllObjects() {
            var items = this.querySelectorAll("ul#objects li");
            items.forEach(item => item.classList.add("disabled"))
        }

        inShadow(){
            return false
        }
    }
);