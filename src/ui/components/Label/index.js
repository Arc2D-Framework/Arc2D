
namespace `ui.components` (
 class Label extends WebComponent {
        async onConnected(){
            this.name="Jay";
            await super.onConnected();
            this.on("click", e=>this.onClick(e), true)
        }

        onClick(){
            this.classList.toggle("active")
        }
        // isComposable(){
        //     return true
        // }

        // onLoadInstanceStylesheet(){
        //     return false
        // }

        // inShadow(){
        //     return false
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
 

