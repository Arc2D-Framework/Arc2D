

namespace `ui.meld` (
    class ToolBar extends WebComponent {
        static get is() {return "tool-bar"}

        async onConnected(){
            await super.onConnected();
            this.fire("connected")
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

        // assignSlots(temNode) {
        //     debugger
        //     if(!temNode) { return}
        //     if (!this.inShadow() && this.isComposable()) {
        //         var defaultSlot = temNode.querySelector("slot");
        //         if(defaultSlot){
        //             let nodes = Array.from(this.children);
        //             for(let n of nodes){
        //                 if(n instanceof HTMLTemplateElement) { continue}
        //                 var slotName = n.getAttribute('slot');
        //                 var ph = slotName==null?
        //                     temNode.querySelector(`slot:not([name])`):
        //                     temNode.querySelector(`slot[name="${slotName}"]`)||null;
        //                 if( ph && !ph.emptied){
        //                     (ph.innerHTML="");
        //                     (ph.emptied=true);
        //                 }
        //                 ph?(ph).appendChild(n):slotName?n.remove():null;
        //             }
        //         }
                
        //     }
        //     if(this.inShadow()){
        //         // this.root.innerHTML = "";
        //         this.root.appendChild(temNode);
        //     }
        //     else {
        //         // this.root.innerHTML = "";
		// 	    super.appendChild(temNode);
        //     }
        // }
        
        // appendChild(li, slotted){
        //     if(!this.inShadow()) {
        //         var defaultSlot = this.querySelector("slot")||this;
        //             defaultSlot && defaultSlot.appendChild(li)
        //     }
        //     else {
        //         return super.appendChild(li)
        //     }
        // }
        appendChild(n, slotted){
            if(!this.inShadow()) {
                var defaultSlot = this.querySelector("slot")||this;
                    defaultSlot && defaultSlot.appendChild(n)
            }
            else {
                return this.element && n!= this.element ? 
                    this.root.appendChild(n):
                    super.appendChild(n)
                // return super.appendChild(n)
            }
        }
    }
);