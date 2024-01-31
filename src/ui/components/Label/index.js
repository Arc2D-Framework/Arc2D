
namespace `ui.components` (
 class Label extends WebComponent {
       
        async onConnected(){
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true)
            console.log(this.root instanceof ShadowRoot)
        }

        async onClick(e){
            this.classList.toggle("active");
            await this.render()
        }

        hasOwnTemplate() {
            return true
        }

        // assignSlots(temNode) {
        //     if(!temNode) { return}
        //     if (!this.inShadow() && this.isComposable()) {
        //         var defaultSlot = temNode.querySelector("slot:not([name])");
        //         if(defaultSlot){
        //             let nodes = Array.from(this.children);
        //             for(let n of nodes){
        //                 if(n instanceof HTMLTemplateElement) { continue}
        //                 var slotName = n.getAttribute('slot');
        //                 var ph = !slotName?
        //                     defaultSlot : temNode.querySelector(`slot[name="${slotName}"]`)||defaultSlot;
        //                 if( ph && !ph.emptied){
        //                     (ph.innerHTML="");
        //                     (ph.emptied=true);
        //                 }
        //                 // ph ? (ph).appendChild(n) : slotName?n.remove():null;
        //                 ph&&ph.appendChild(n);
        //             }
        //         }
                
        //     }
        //     this.root.innerHTML = "";
		// 	this.root.appendChild(temNode);
            
        //     // if(this.inShadow()){
        //     //     // this.root.innerHTML = "";
        //     //     this.root.appendChild(temNode);
        //     // }
        //     // else {
        //     //     // this.root.innerHTML = "";
		// 	//     super.appendChild(temNode);
        //     // }
        // }

        // inShadow(){
        //     return true
        // }

        cssStyle(){return `
            :host span{
                color:red;
            }
            :host(.active) {
                color:red;
            }
        `}

        // template(){
        //     return `
        //         <template>
        //             <i><slot name="label">[label here]</slot></i>
        //         </template>
        //     `
        // }
    }
)
 

