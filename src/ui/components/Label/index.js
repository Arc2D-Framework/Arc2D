
namespace `ui.components` (
 class Label extends WebComponent {
       
        async onConnected(){
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true)
        }

        onClick(e){
            this.classList.toggle("active")
            console.log(e.target)
        }

        hasOwnTemplate() {
            return false
        }

        // inShadow(){
        //     return true
        // }

        // cssStyle(){return `
        //     :host span{
        //         color:red;
        //     }
        //     :host(.active) {
        //         border:3px solid red;
        //     }
        // `}

        // template(){
        //     return `
        //         <template>
        //             <i><slot name="label">[label here]</slot></i>
        //         </template>
        //     `
        // }
    }
)
 

