
namespace `ui.components` (
 class Label extends WebComponent {
       
        async onConnected(){
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true)
            console.log(this.root instanceof ShadowRoot)
        }

        async onClick(e){
            this.classList.toggle("active")
            console.log(e.target)
            await this.render()
        }

        hasOwnTemplate() {
            return false
        }

        // assignSlots(temNode) {
        //     debugger
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

        // async render(data={}, t=this._template, outputEl) {
        //     debugger
		// 	if(this.isExistingDomNode(this.element)){
		// 		this.onTemplateRendered(temNode);
		// 		// this.dispatchEvent("connected",{target:this})
		// 		return
		// 	}
		// 	else if (t && typeof t=="string") {
		// 		var html = await this.evalTemplate(t, data);
		// 		var temNode = html.toNode();
		// 			if(!temNode?.content){
		// 				console.error(`${this.namespace} - invalid <template>`, {template:this._template, owner:this.parentNode});
		// 				return
		// 			}
		// 			temNode = temNode.content;
        //             this.assignSlots(temNode)
		// 		this.onTemplateRendered(temNode);
		// 	}
		// 	else if(t && typeof t == "function"){
		// 		await this.render(data,t.call(data))
		// 	}
		// }

        inShadow(){
            return true
        }

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
 

