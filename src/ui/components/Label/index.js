
namespace `ui.components` (
 class Label extends WebComponent {
        constructor(){
            debugger;
            super()
        }
        async onConnected(){
            debugger;
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true)
        }

        onClick(e){
            this.classList.toggle("active")
            console.log(e.target)
        }

        inShadow(){
            return false
        }

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
 

