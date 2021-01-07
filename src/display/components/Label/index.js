@tag("label-output");
namespace `display.components` (
    class Label extends WebComponent {
        async onConnected(){
            await super.onConnected();
        }

        isComposable(){
            return true
        }

        onLoadInstanceStylesheet(){
            return false
        }

        inShadow(){
            return true
        }

        // template(){
        //     return `
        //         <template>
        //             <i style="color:red;"><slot name="title"></slot></i>
        //         </template>
        //     `
        // }
    }
);
